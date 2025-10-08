import { z } from 'zod';
import { processToDailySummaryObject } from './utils';

const CoordinateSchema = z.object({
	latitude: z
		.number({ error: 'Latitude must be a number.' })
		.min(-90, { message: 'Latitude must be -90 or greater.' })
		.max(90, { message: 'Latitude must be 90 or less.' }),
	longitude: z
		.number({ error: 'Longitude must be a number.' })
		.min(-180, { message: 'Longitude must be -180 or greater.' })
		.max(180, { message: 'Longitude must be 180 or less.' }),
});

export async function POST(request: Request) {
	//retrieving request body
	let body;

	try {
		body = await request.json();
	} catch {
		return new Response(
			JSON.stringify({ message: 'Invalid JSON format in request body.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } },
		);
	}

	// validating passed properties
	const validationResult = CoordinateSchema.safeParse(body);

	if (!validationResult.success) {
		const errorDetails = validationResult.error.issues
			.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
			.join('; ');

		return new Response(
			JSON.stringify({
				message: 'Validation failed: ' + errorDetails,
			}),
			{ status: 400, headers: { 'Content-Type': 'application/json' } },
		);
	}

	const { latitude, longitude } = validationResult.data;

	// retrieving the api key from env file
	const apiKey = process.env.WEATHER_API_KEY;

	if (!apiKey)
		return new Response(
			JSON.stringify({
				message:
					'The server has ran into an issue. Cannot retrieve authorization credentials for weather forecast.',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

	// retrieving weather forecast data using the "Call 5 day / 3 hour forecast data" api endpoint
	// documentation of the endpoint: https://openweathermap.org/forecast5
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast
			?lat=${latitude}
			&lon=${longitude}
			&units=metric
			&appid=${apiKey}`,
		);

		if (!response.ok) {
			console.error(`External API error: ${response.statusText}`);
			return new Response(
				JSON.stringify({
					message: 'Failed to retrieve forecast data from external service.',
				}),
				{ status: 502, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const forecastData = await response.json();
		let dailySummary: DailyForecastOutput;

		//processing the raw api response into daily forecast summary
		try {
			dailySummary = processToDailySummaryObject(forecastData);
		} catch (e) {
			console.error('Internal data processing failed:', e);
			return new Response(
				JSON.stringify({
					message: 'Internal server error: Failed to transform data structure.',
				}),
				{ status: 500, headers: { 'Content-Type': 'application/json' } },
			);
		}

		//returning the OK response
		return new Response(JSON.stringify(dailySummary), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('API call or network failed:', error);
		return new Response(
			JSON.stringify({
				message:
					'The server has ran into an issue when retrieving forecast data. Try again later.',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} finally {
		console.log('Weather forecast api call completed.');
	}
}

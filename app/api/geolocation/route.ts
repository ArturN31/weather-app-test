import { z } from 'zod';
import { prepGeolocationApiUrl } from './utils';

const GeolocationSchema = z.object({
	queryLocation: z.string().trim().min(1, { message: 'Location query cannot be empty.' }),
	queryToggle: z
		.string()
		.transform((s) => s.toLowerCase())
		.pipe(
			z.union([z.literal('postcode'), z.literal('city')], {
				error: () => ({ message: "queryToggle must be 'city' or 'postcode'." }),
			}),
		),
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

	//validating passed properties
	const validationResult = GeolocationSchema.safeParse(body);

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

	const { queryLocation, queryToggle } = validationResult.data;

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

	// retrieving geolocation data using two endpoints from "Direct geocoding"
	// documentation of the endpoint: https://openweathermap.org/api/geocoding-api
	try {
		const query = prepGeolocationApiUrl(queryToggle, queryLocation, apiKey);
		const response = await fetch(query);

		if (!response.ok) {
			console.error(`External API error: ${response.statusText}`);
			return new Response(
				JSON.stringify({
					message: 'Failed to retrieve geolocation data from external service.',
				}),
				{ status: 502, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const rawGeolocationData: {
			lat: number;
			lon: number;
		} = await response.json();

		let safeGeolocationData: { lat: number; lon: number }[];

		if (Array.isArray(rawGeolocationData)) {
			safeGeolocationData = rawGeolocationData;
		} else if (rawGeolocationData && typeof rawGeolocationData === 'object') {
			safeGeolocationData = [rawGeolocationData];
		} else {
			safeGeolocationData = [];
		}

		if (safeGeolocationData.length === 0) {
			console.error('External API returned no results after standardization.');
			return new Response(
				JSON.stringify({
					message: 'Could not identify appropriate location.',
				}),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const returnObject: Coordinates = {
			latitude: safeGeolocationData[0].lat,
			longitude: safeGeolocationData[0].lon,
		};

		return new Response(JSON.stringify(returnObject), {
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
					'The server has ran into an issue when retrieving geolocation data. Try again later.',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} finally {
		console.log('Geolocation api call completed.');
	}
}

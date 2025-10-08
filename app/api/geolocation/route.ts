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

		const geolocationData = await response.json();

		return new Response(JSON.stringify(geolocationData), {
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

import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface Location {
	name: string;
}

export async function GET() {
	const filePath = path.join(process.cwd(), 'data', 'uk_locations.csv');

	try {
		// verifying file path
		if (!fs.existsSync(filePath))
			return new Response(JSON.stringify({ message: 'CSV file not found.' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});

		const locations: Location[] = [];

		// setup the file stream and parser
		const stream = fs.createReadStream(filePath).pipe(
			csv({
				// configuration adjusted for the uk_locations format "location", "location2", ...
				headers: false,
				separator: ',',
				quote: '"',
			}),
		);

		// procesing each row passed from the parser
		for await (const row of stream) {
			// extracting location names from rows
			Object.values(row).forEach((locationName: unknown) => {
				if (typeof locationName === 'string' && locationName.trim())
					locations.push({ name: locationName.trim() });
			});
		}

		return new Response(JSON.stringify(locations), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error reading CSV:', error);
		return new Response(JSON.stringify({ message: 'Failed to process location data.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

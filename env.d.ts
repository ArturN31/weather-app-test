// represents a single 3-hour forecast entry from the API 'list' array
interface ForecastItem {
	main: {
		temp: number;
		temp_min: number;
		temp_max: number;
		humidity: number;
	};
	weather: Array<{
		description: string;
		main: string;
		icon: string;
	}>;
	wind: {
		speed: number;
	};
	dt_txt: string; // Time of data forecasted, ISO, UTC
}

interface DailyForecastOutput {
	location: {
		coord: Coordinates;
		country: string;
		name: string;
	};
	forecasts: {
		[date: string]: {
			humidity: number;
			windSpeed: number;
			minTemp: number;
			maxTemp: number;
			avgTemp: number;
			condition: string;
			description: string;
			iconURL: string;
		};
	};
	message: string;
}

interface Forecast {
	humidity: number;
	windSpeed: number;
	minTemp: number;
	maxTemp: number;
	avgTemp: number;
	condition: string;
	description: string;
	iconURL: string;
}

interface CoordinatesOutput {
	latitude: number;
	longitude: number;
	message: string;
}

interface Coordinates {
	latitude: number | null;
	longitude: number | null;
}

interface StoredLocation {
	location: string;
	toggle: 'city' | 'postcode';
	coords: Coordinates;
}

interface SearchResult {
	location: string;
	coords: Coordinates;
}

interface RetrievalStatus {
	isPending: boolean;
	message: string;
}

interface Location {
	name: string;
}

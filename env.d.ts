interface DailyForecastOutput {
	location: City;
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

interface CoordinatesOutput {
	latitude: number;
	longitude: number;
	message: string;
}

interface Coordinates {
	latitude: number | null;
	longitude: number | null;
}

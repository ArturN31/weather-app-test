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
}

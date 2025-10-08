interface DailyForecastOutput {
	location: City;
	forecasts: {
		[date: string]: {
			minTemp: number;
			maxTemp: number;
			avgTemp: number;
			condition: string;
			description: string;
		};
	};
}

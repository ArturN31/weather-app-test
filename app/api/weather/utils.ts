// raw structure of the OpenWeatherMap 5-day forecast response
interface RawForecastResponse {
	list: ForecastItem[];
	city: {
		name: string;
		country: string;
	};
}

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

// represents the final forecast summary for a single calendar day
interface DailyForecastSummary {
	date: string;
	humidity: number;
	wind_speed: number;
	avg_temp: number;
	min_temp: number;
	max_temp: number;
	condition: string;
	description: string;
	icon: string;
	hourly_data: ForecastItem[];
}

// groups entries by calendar day
const groupForecastByDay = (forecastList: ForecastItem[]): DailyForecastSummary[] => {
	const dailyMap = new Map<string, DailyForecastSummary>();

	//group forecast list items by date
	forecastList.forEach((item) => {
		// extracting current item's data
		const date = item.dt_txt.substring(0, 10);
		const condition = item.weather[0].main;
		const description = item.weather[0].description;
		const icon = item.weather[0].icon;
		const minTemp = item.main.temp_min;
		const maxTemp = item.main.temp_max;
		const humidity = item.main.humidity;
		const windSpeed = item.wind.speed;

		let dailySummary = dailyMap.get(date);

		// initialise the daily summary if this is the first item for the date
		if (!dailySummary) {
			dailySummary = {
				date: date,
				humidity: humidity,
				wind_speed: windSpeed,
				min_temp: minTemp,
				max_temp: maxTemp,
				avg_temp: 0,
				condition: condition,
				description: description,
				icon: icon,
				hourly_data: [],
			};
			dailyMap.set(date, dailySummary);
		}

		// update the overall daily min/max by comparing the current item's
		// 3-hour min/max against the running daily total
		dailySummary.min_temp = Math.min(dailySummary.min_temp, minTemp);
		dailySummary.max_temp = Math.max(dailySummary.max_temp, maxTemp);

		// add the current 3-hour item to the hourly list for later condition counting
		dailySummary.hourly_data.push(item);
	});

	const summariesWithHourlyData = Array.from(dailyMap.values());

	return finaliseDailySummaries(summariesWithHourlyData);
};

// finalises the daily summaries by calculating the dominant weather conditions (main and detailed) and the average temperature for the day.
function finaliseDailySummaries(
	summaries: DailyForecastSummary[],
): DailyForecastSummary[] {
	return summaries.map((summary) => {
		// maps used to store the frequency count of weather conditions and description
		const conditionCounts = new Map<string, number>();
		const descriptionCounts = new Map<string, number>();
		let temperatureSum = 0; //accumulator for avg temp

		// incrementing the frequency counts and adding to avg temp accumulator
		summary.hourly_data.forEach((item) => {
			const condition = item.weather[0].main;
			const description = item.weather[0].description;

			conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
			descriptionCounts.set(description, (descriptionCounts.get(description) || 0) + 1);

			temperatureSum += item.main.temp;
		});

		// calculating average daily temp
		const itemCount = summary.hourly_data.length;
		const avgTemp = itemCount > 0 ? temperatureSum / itemCount : 0;

		// retrieving the dominant forecast condition and description
		const mainCondition = findDominant(conditionCounts, summary.condition);
		const dominantDescription = findDominant(descriptionCounts, summary.description);

		return {
			...summary,
			condition: mainCondition,
			description: dominantDescription,
			avg_temp: avgTemp,
		};
	});
}

// used to determine the dominant weather condition for the day
const findDominant = (counts: Map<string, number>, defaultKey: string): string => {
	let maxCount = 0;
	let dominant = defaultKey;

	counts.forEach((count, key) => {
		if (count > maxCount) {
			maxCount = count;
			dominant = key;
		}
	});

	return dominant;
};

// transforms the raw API response into the final date-keyed output object
export function processToDailySummaryObject(
	rawResponse: RawForecastResponse,
): DailyForecastOutput {
	const dailySummaries = groupForecastByDay(rawResponse.list);
	const forecasts: DailyForecastOutput['forecasts'] = {};

	dailySummaries.forEach((day) => {
		forecasts[day.date] = {
			humidity: day.humidity,
			windSpeed: day.wind_speed,
			minTemp: day.min_temp,
			maxTemp: day.max_temp,
			avgTemp: day.avg_temp,
			condition: day.condition,
			description: day.description,
			iconURL: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
		};
	});

	return {
		location: rawResponse.city,
		forecasts: forecasts,
	};
}

import { Humidity } from '../Conditions/Humidity';
import { WindSpeed } from '../Conditions/WindSpeed';
import { DominantCondition } from '../Conditions/DominantCondition';
import { Temperature } from '../Conditions/Temperature';

// get the day label (e.g., "Tomorrow", "Mon", "Tue")
const getForecastDayLabel = (index: number) => {
	if (index === 0) return 'Today';

	const date = new Date();
	date.setDate(date.getDate() + index);
	return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const ForecastCard = ({
	today,
	index,
	locationName,
}: {
	today: Forecast;
	index: number;
	locationName: string;
}) => {
	const dayLabel = getForecastDayLabel(index);
	const { avgTemp, maxTemp, minTemp, iconURL, description, humidity, windSpeed } = today;

	return (
		<section
			id={`forecast-card-${index}`}
			className='w-full p-4 rounded-xl shadow-lg bg-gray-800 text-white border border-black'
			role='article'
			aria-labelledby={`forecast-heading-${locationName}-${index}`}>
			{/* temperature */}
			<div className='flex md:grid text-center items-center justify-between md:justify-center mb-3'>
				<h2
					className='text-xl font-bold'
					id={`forecast-heading-${locationName}-${index}`}>
					{dayLabel}
				</h2>
				<div className='flex items-center gap-2'>
					<Temperature
						avgTemp={avgTemp}
						maxTemp={maxTemp}
						minTemp={minTemp}
					/>
				</div>
			</div>

			{/* conditions */}
			<div
				id={`forecast-card-conditions-${index}`}
				className='grid grid-cols-2 md:grid-cols-1 gap-4 pt-4 border-t border-gray-300'>
				<div className='flex flex-col items-start md:items-center justify-center mt-[-15px]'>
					<DominantCondition
						iconURL={iconURL}
						description={description}
					/>
				</div>

				<div className='flex flex-col space-y-2 justify-center items-end md:items-center'>
					<Humidity humidity={humidity} />
					<WindSpeed windSpeed={windSpeed} />
				</div>
			</div>
		</section>
	);
};

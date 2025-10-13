import { Humidity } from './Conditions/Humidity';
import { WindSpeed } from './Conditions/WindSpeed';
import { DominantCondition } from './Conditions/DominantCondition';
import { Temperature } from './Conditions/Temperature';

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
			className='rounded-xl border border-[#bdbcbc] text-black shadow-lg overflow-hidden w-fit'
			role='article'
			aria-labelledby={`forecast-heading-${locationName}-${index}`}>
			{/* temperature section */}
			<div className='grid justify-items-center gap-1 px-4 pt-4 pb-2 bg-neutral-100'>
				<h2
					className='text-xl font-bold text-gray-800'
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

			{/* conditions section */}
			<div className='grid gap-4 px-4 py-4 bg-neutral-200'>
				<div className='flex items-center justify-center gap-2'>
					<DominantCondition
						iconURL={iconURL}
						description={description}
					/>
				</div>

				<div
					className='flex justify-between border-t border-gray-400 pt-3 px-5'
					role='complementary'
					aria-label={`Additional conditions for ${dayLabel}`}>
					<Humidity humidity={humidity} />
					<WindSpeed windSpeed={windSpeed} />
				</div>
			</div>
		</section>
	);
};

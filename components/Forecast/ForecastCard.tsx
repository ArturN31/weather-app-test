import Image from 'next/image';
import { Humidity } from './Conditions/Humidity';
import { WindSpeed } from './Conditions/WindSpeed';
import { MaxTemp } from './Conditions/MaxTemp';
import { MinTemp } from './Conditions/MinTemp';

// get the day label (e.g., "Tomorrow", "Mon", "Tue")
const getForecastDayLabel = (index: number) => {
	if (index === -1) return 'Today';
	if (index === 0) return 'Tomorrow';

	const date = new Date();
	date.setDate(date.getDate() + index);
	return date.toLocaleDateString('en-US', { weekday: 'short' });
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
	const cardTitle = `${dayLabel} in ${locationName}`;

	return (
		<section
			className='rounded-xl border border-[#bdbcbc] text-black shadow-[2px_2px_8px_-2px_black]'
			role='article'
			aria-labelledby={`forecast-heading-${locationName}-${index}`}>
			<div className='flex gap-10 rounded-xl p-8 justify-center'>
				<div aria-labelledby={`forecast-heading-${locationName}-${index}`}>
					<h2
						className='text-2xl sm:text-3xl font-light mb-4'
						id={`forecast-heading-${locationName}-${index}`}>
						{cardTitle}
					</h2>

					<div className='flex items-center w-full md:w-auto mb-6 md:mb-0 '>
						<Image
							src={today.iconURL || '/placeholder.png'}
							alt={today.description}
							aria-hidden='true'
							width={100}
							height={100}
							className='w-16 h-16 sm:w-20 sm:h-20 mr-4 sm:mr-6 flex-shrink-0'
						/>
						<div>
							<div className='flex justify-center items-center gap-2 mb-3'>
								<p
									className='text-6xl sm:text-7xl font-bold'
									aria-label={`Average temperature: ${Math.round(
										today.avgTemp,
									)} degrees`}>
									{Math.round(today.avgTemp)}°
								</p>

								<div>
									<MaxTemp maxTemp={today.maxTemp} />
									<MinTemp minTemp={today.minTemp} />
								</div>
							</div>
							<p className='text-xl sm:text-2xl mt-1 capitalize'>{today.description}</p>
						</div>
					</div>
				</div>

				<div
					className='flex flex-col justify-between'
					role='complementary'
					aria-label={`Additional conditions for ${dayLabel}`}>
					<Humidity humidity={today.humidity} />
					<WindSpeed windSpeed={today.windSpeed} />
				</div>
			</div>
		</section>
	);
};

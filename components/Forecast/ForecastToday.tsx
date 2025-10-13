import { DominantCondition } from './Conditions/DominantCondition';
import { Humidity } from './Conditions/Humidity';
import { Temperature } from './Conditions/Temperature';
import { WindSpeed } from './Conditions/WindSpeed';

export const ForecastToday = ({ today }: { today: Forecast }) => {
	return (
		<section
			className='rounded-2xl min-w-fit text-white shadow-[0px_2px_6px_-2px_black] overflow-hidden'
			role='article'
			aria-labelledby='forecast-heading-today'>
			{/* title and main condition */}
			<div className='bg-brand-green px-8 py-2 flex flex-col items-center border-b border-[#007a64]/50'>
				<h2
					className='text-3xl sm:text-4xl font-black mb-2 tracking-wide'
					id='forecast-heading-today'>
					TODAY
				</h2>
				<p className='text-xl font-medium text-[#ddd7c0] capitalize'>
					{today.description}
				</p>
			</div>

			{/* temperature and Icon */}
			<div className='grid grid-cols-2 gap-4 px-8 items-center justify-items-center bg-[#00705e]'>
				<div className='flex flex-col items-center pb-4'>
					<DominantCondition
						iconURL={today.iconURL}
						description={today.description}
					/>
				</div>

				<div className='text-center'>
					<Temperature
						avgTemp={today.avgTemp}
						maxTemp={today.maxTemp}
						minTemp={today.minTemp}
					/>
				</div>
			</div>

			{/* conditions */}
			<div
				className='bg-[#00332a] p-6 flex justify-around items-center border-t border-[#007a64]'
				role='complementary'
				aria-label='Additional conditions for today'>
				<Humidity humidity={today.humidity} />
				<WindSpeed windSpeed={today.windSpeed} />
			</div>
		</section>
	);
};

import React from 'react';
import { ForecastCard } from './ForecastCard';
import { TemperatureChart } from '../TemperatureChart';

export const ForecastOutlook = ({
	dailyForecasts,
	locationName,
}: {
	dailyForecasts: Forecast[];
	locationName: string;
}) => {
	const sectionLabel = `Five-day forecast outlook for ${locationName}`;
	const numCards = dailyForecasts.length;

	return (
		<>
			<section
				role='region'
				aria-label={sectionLabel}
				className='grid gap-4'>
				<h3
					id='outlook-header'
					className='bg-[#004d40] rounded-xl p-6 shadow-[0px_2px_6px_-2px_black] text-2xl lg:text-3xl font-bold text-white border-b border-[#006652]'>
					5-Day Outlook
				</h3>

				<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 justify-items-center'>
					{dailyForecasts.map((day, index) => (
						<li
							key={index}
							className={`w-full ${
								numCards % 5 === 1 && index === numCards - 1
									? 'lg:col-span-full xl:col-span-4 2xl:col-span-5 flex justify-center'
									: ''
							}`}>
							<ForecastCard
								today={day}
								index={index + 1}
								locationName={locationName}
							/>
						</li>
					))}
				</ul>
			</section>

			<TemperatureChart dailyData={dailyForecasts} />
		</>
	);
};

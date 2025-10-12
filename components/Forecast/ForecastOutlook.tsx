import React from 'react';
import { ForecastCard } from './ForecastCard';

export const ForecastOutlook = ({
	dailyForecasts,
	locationName,
}: {
	dailyForecasts: Forecast[];
	locationName: string;
}) => {
	const sectionLabel = `Five-day forecast outlook for ${locationName}`;

	return (
		<section
			role='region'
			aria-label={sectionLabel}>
			<h3 className='text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-400 mb-6 border-b border-gray-700 pb-2'>
				5-Day Outlook
			</h3>

			<ul className='grid xl:flex xl:flex-wrap xl:justify-center gap-4'>
				{dailyForecasts.map((day, index) => (
					<li
						className='w-full xl:w-[450px]'
						key={index}
						aria-label={`Forecast for day ${index + 2}`}>
						<ForecastCard
							today={day}
							index={index + 1}
							locationName={locationName}
						/>
					</li>
				))}
			</ul>
		</section>
	);
};

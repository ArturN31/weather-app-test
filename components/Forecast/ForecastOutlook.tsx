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
			<h3
				id='outlook-header'
				className='bg-[#004d40] rounded-xl p-6 shadow-[0px_2px_6px_-2px_black] text-2xl lg:text-3xl font-bold text-white mb-6 border-b border-[#006652]'>
				5-Day Outlook
			</h3>

			<ul className='flex flex-wrap gap-5 justify-center'>
				{dailyForecasts.map((day, index) => (
					<li key={index}>
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

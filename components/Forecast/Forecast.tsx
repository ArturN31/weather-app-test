import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { ForecastLayout } from './ForecastLayout';
import { ForecastStatus } from './Status/ForecastStatus';
import { ForecastOutlook } from './ForecastOutlook';
import { ForecastToday } from './ForecastToday';
import React from 'react';

export const Forecast = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
	const {
		searchResult,
		forecastData,
		forecastRetrievalMessage,
		forecastRetrievalPending,
	} = useGeolocationSearch();

	const locationNameFromData = forecastData?.location.name;
	const locationNameFromSearch = searchResult.location;
	const locationName = locationNameFromData
		? locationNameFromData
		: locationNameFromSearch || 'Unknown Location';

	const dailyForecasts = forecastData ? Object.values(forecastData.forecasts) : [];
	const hasSearched = !!locationNameFromSearch;

	const currentSearchLocationName = locationNameFromSearch || 'Unknown Location';

	let content;

	// PENDING/ERROR STATE
	if (forecastRetrievalMessage || forecastRetrievalPending) {
		const headerLocationName = forecastRetrievalPending
			? currentSearchLocationName
			: locationName;

		content = (
			<ForecastStatus
				isPending={forecastRetrievalPending}
				message={forecastRetrievalMessage}
				hasSearched={hasSearched}
			/>
		);

		return (
			<main
				className='grid mx-auto'
				role='region'
				aria-label={`Weather forecast status for ${headerLocationName}`}>
				<ForecastLayout
					locationName={currentSearchLocationName}
					isSidebarOpen={isSidebarOpen}>
					{content}
				</ForecastLayout>
			</main>
		);
	}

	// NO DATA STATE
	if (!forecastData || dailyForecasts.length === 0) {
		const initialLocationName = hasSearched ? locationNameFromSearch : '';

		content = (
			<ForecastStatus
				isPending={false}
				message={
					forecastData ? `No forecast available for ${locationNameFromSearch}.` : ''
				}
				hasSearched={hasSearched}
			/>
		);

		return (
			<main className='grid mx-auto'>
				<ForecastLayout
					locationName={initialLocationName}
					isSidebarOpen={isSidebarOpen}>
					{content}
				</ForecastLayout>
			</main>
		);
	}

	// DATA AVAILABLE STATE
	const today = dailyForecasts[0];
	const outlook = dailyForecasts.slice(1);

	content = (
		<div className='mt-4 space-y-4'>
			<h1
				className='sr-only'
				id='main-forecast-heading'>
				Weather Forecast for {locationName}
			</h1>

			<ForecastToday today={today} />

			{outlook.length > 0 && (
				<ForecastOutlook
					dailyForecasts={outlook}
					locationName={locationName}
				/>
			)}
		</div>
	);

	return (
		<main
			className='grid mx-auto'
			aria-labelledby={'main-forecast-heading'}>
			<ForecastLayout
				locationName={locationName}
				isSidebarOpen={isSidebarOpen}>
				{content}
			</ForecastLayout>
		</main>
	);
};

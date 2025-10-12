import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { ForecastLayout } from './ForecastLayout';
import { ForecastStatus } from './Status/ForecastStatus';
import { ForecastCard } from './ForecastCard';
import { ForecastOutlook } from './ForecastOutlook';

export const Forecast = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
	const {
		searchResult,
		forecastData,
		forecastRetrievalMessage,
		forecastRetrievalPending,
	} = useGeolocationSearch();

	const locationName = forecastData
		? forecastData.location.name
		: searchResult.location || 'Unknown Location';

	const dailyForecasts = forecastData ? Object.values(forecastData.forecasts) : [];
	const hasSearched = !!searchResult.location;

	let content;

	// PENDING/ERROR STATE
	if (forecastRetrievalMessage || forecastRetrievalPending) {
		content = (
			<ForecastStatus
				isPending={forecastRetrievalPending}
				message={forecastRetrievalMessage}
				hasSearched={hasSearched}
			/>
		);
	}
	// NO DATA STATE
	else if (!forecastData || dailyForecasts.length === 0) {
		content = (
			<ForecastStatus
				isPending={false}
				message={forecastData ? `No forecast available for ${locationName}.` : ''}
				hasSearched={hasSearched}
			/>
		);
	}
	// DATA AVAILABLE STATE
	else {
		const today = dailyForecasts[0];
		const outlook = dailyForecasts.slice(1);

		content = (
			<div className='mt-8 space-y-10'>
				<h1
					className='sr-only'
					id='main-forecast-heading'>
					Weather Forecast for {locationName}
				</h1>

				<ForecastCard
					today={today}
					index={-1}
					locationName={locationName}
				/>

				{outlook.length > 0 && (
					<ForecastOutlook
						dailyForecasts={outlook}
						locationName={locationName}
					/>
				)}
			</div>
		);
	}

	return (
		<main
			className='grid mx-auto'
			aria-labelledby={forecastData ? 'main-forecast-heading' : undefined}>
			<ForecastLayout
				locationName={!forecastData && !hasSearched ? '' : locationName}
				isSidebarOpen={isSidebarOpen}>
				{content}
			</ForecastLayout>
		</main>
	);
};

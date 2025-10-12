import { LoadingSpinner } from './LoadingSpinner';
import { StatusContainer } from './StatusContainer';

export const ForecastStatus = ({
	isPending,
	message,
	hasSearched,
}: {
	isPending: boolean;
	message: string;
	hasSearched: boolean;
}) => {
	// PENDING/LOADING STATE
	if (isPending) {
		return (
			<StatusContainer>
				<LoadingSpinner />
				<p className='mt-4 text-lg text-gray-500'>
					{message || 'Fetching weather forecast...'}
				</p>
			</StatusContainer>
		);
	}

	// ERROR STATE
	if (message) {
		return (
			<div
				className='p-4 mt-8 bg-red-800/50 border border-red-500 text-red-300 rounded text-center shadow-lg'
				role='alert'
				aria-live='assertive'>
				<p className='font-bold text-xl mb-2'>Error retrieving forecast:</p>
				<p className='text-base'>{message}</p>
			</div>
		);
	}

	// INITIAL/DEFAULT STATE
	if (!hasSearched) {
		return (
			<StatusContainer>
				<p className='text-xl sm:text-2xl text-gray-500'>
					Enter a city or postcode in the search bar to retrieve the forecast.
				</p>
			</StatusContainer>
		);
	}

	return null;
};

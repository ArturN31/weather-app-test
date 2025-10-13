import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { useId } from 'react';

export const SearchbarInput = () => {
	const {
		searchbarLocation,
		searchbarLocationType,
		geolocationRetrievalPending,
		handleSearchbarLocation,
	} = useGeolocationSearch();

	const inputId = useId();

	const currentPlaceholder = `Enter ${
		searchbarLocationType === 'city' ? 'City Name' : 'Postcode'
	}...`;

	return (
		<div>
			<label
				htmlFor={inputId}
				className='sr-only'>
				Search for weather by {searchbarLocationType}
			</label>
			<input
				id={inputId}
				type='search'
				value={searchbarLocation}
				onChange={(input) => handleSearchbarLocation(input.target.value)}
				placeholder={currentPlaceholder}
				disabled={geolocationRetrievalPending}
				aria-required='true'
				className='border w-full border-gray-600 bg-black/40 text-gray-200 placeholder:text-gray-500 px-3 py-2 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'
			/>
		</div>
	);
};

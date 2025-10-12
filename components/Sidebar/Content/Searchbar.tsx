import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { useId } from 'react';

export const Searchbar = () => {
	const {
		searchbarLocation,
		searchbarLocationType,
		geolocationRetrievalPending,
		handleSearchbarLocation,
		handleSearchbarLocationType,
	} = useGeolocationSearch();

	const handleClick = async (toggle: 'city' | 'postcode') => {
		await handleSearchbarLocation('');
		await handleSearchbarLocationType(toggle);
	};

	const inputId = useId();

	const currentPlaceholder = `Enter ${
		searchbarLocationType === 'city' ? 'City Name' : 'Postcode'
	}...`;

	return (
		<div
			className='grid gap-3'
			role='search'>
			{' '}
			<label
				htmlFor={inputId}
				className='sr-only'>
				Search for weather by {searchbarLocationType}
			</label>
			<input
				id={inputId}
				type={searchbarLocationType === 'city' ? 'text' : 'search'}
				value={searchbarLocation}
				onChange={(input) => handleSearchbarLocation(input.target.value)}
				placeholder={currentPlaceholder}
				aria-placeholder={currentPlaceholder}
				aria-describedby='search-type-toggle'
				disabled={geolocationRetrievalPending}
				className='border border-gray-600 bg-black/40 text-gray-200 placeholder:text-gray-500 px-3 py-2 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'
			/>
			<div
				className='flex justify-center p-1 bg-black/20 rounded-full border border-gray-700'
				role='radiogroup'
				aria-label='Select search type'
				id='search-type-toggle'>
				<button
					onClick={() => {
						handleClick('city');
					}}
					role='radio'
					aria-checked={searchbarLocationType === 'city'}
					aria-current={searchbarLocationType === 'city' ? 'true' : 'false'}
					className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
						searchbarLocationType === 'city'
							? 'bg-gray-100 text-[#004d40] shadow-md'
							: 'text-gray-400 hover:text-gray-200'
					}`}>
					City
				</button>
				<button
					onClick={() => {
						handleClick('postcode');
					}}
					role='radio'
					aria-checked={searchbarLocationType === 'postcode'}
					aria-current={searchbarLocationType === 'postcode' ? 'true' : 'false'}
					className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
						searchbarLocationType === 'postcode'
							? 'bg-gray-100 text-[#004d40] shadow-md'
							: 'text-gray-400 hover:text-gray-200'
					}`}>
					Postcode
				</button>
			</div>
		</div>
	);
};

import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

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

	return (
		<div className='grid gap-3'>
			<input
				type='text'
				value={searchbarLocation}
				onChange={(input) => handleSearchbarLocation(input.target.value)}
				placeholder={`Enter ${
					searchbarLocationType === 'city' ? 'City Name' : 'Postcode'
				}...`}
				disabled={geolocationRetrievalPending}
				className='border border-gray-600 bg-black/40 text-gray-200 placeholder:text-gray-500 px-3 py-2 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'
			/>
			<div className='flex justify-center p-1 bg-black/20 rounded-full border border-gray-700'>
				<button
					onClick={() => {
						handleClick('city');
					}}
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

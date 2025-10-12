import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const RecentLocationBtn = ({ location }: { location: StoredLocation }) => {
	const { handleSearchResult } = useGeolocationSearch();

	const handleLocationClick = (location: StoredLocation) =>
		handleSearchResult(location.location, location.coords);

	return (
		<button
			onClick={() => handleLocationClick(location)}
			tabIndex={0}
			aria-label={`Search for ${location.location} weather forecast`}
			className='flex-grow cursor-pointer px-4 py-1.5 font-semibold hover:bg-gray-500 transition w-fit border border-r-0 border-gray-500 bg-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-inset'>
			<span className='truncate text-basefont-semibold'>{location.location}</span>
		</button>
	);
};

import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const MyLocationBtn = () => {
	const { handleSearchResult, handleGeolocationStatus } = useGeolocationSearch();

	const handleClick = () => {
		navigator.geolocation.getCurrentPosition(success, error);
	};

	const success = (position: GeolocationPosition) => {
		const coords = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		};

		handleSearchResult('', coords);
		handleGeolocationStatus(false, '');
	};

	const error = (e: GeolocationPositionError) =>
		handleGeolocationStatus(false, `Sorry, no position available. ${e.message}`);

	return (
		<button
			onClick={handleClick}
			className='border-2 border-gray-400 px-2 py-2 w-full bg-[#6B0504] hover:bg-[#970b09] 
                    transition text-gray-200 font-semibold rounded-full shadow-lg hover:cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#6B0504]'
			aria-label='Search for weather using my current location'>
			<span className='flex items-center justify-center gap-2'>Use My Location</span>
		</button>
	);
};

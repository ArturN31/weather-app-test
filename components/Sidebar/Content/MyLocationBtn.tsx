import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { useState } from 'react';

export const MyLocationBtn = () => {
	const [notification, setNotification] = useState('');

	const { handleLocationCoordinates, handleSearchbarLocation } = useGeolocationSearch();

	const handleClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			setNotification('Geolocation is not supported by this browser.');
		}
	};

	const success = (position: GeolocationPosition) => {
		const coords = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		};

		handleLocationCoordinates(coords);
		handleSearchbarLocation('');
		setNotification('');
	};

	const error = (e: GeolocationPositionError) =>
		setNotification(`Sorry, no position available. Error code: ${e.code}`);

	return (
		<div>
			<button
				onClick={handleClick}
				className='border-2 border-gray-400 px-2 py-2 w-full bg-[#6B0504] hover:bg-[#970b09] transition text-gray-200 font-semibold rounded-full shadow-lg hover:cursor-pointer'>
				Use My Location
			</button>
			{notification && <p>{notification}</p>}
		</div>
	);
};

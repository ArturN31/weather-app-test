import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { useState, useId } from 'react';

export const MyLocationBtn = () => {
	const [notification, setNotification] = useState('');

	const { handleSearchResult } = useGeolocationSearch();

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

		handleSearchResult('', coords);
		setNotification('');
	};

	const error = (e: GeolocationPositionError) =>
		setNotification(`Sorry, no position available. Error code: ${e.code}`);

	const notificationId = useId();

	return (
		<div>
			<button
				onClick={handleClick}
				className='border-2 border-gray-400 px-2 py-2 w-full bg-[#6B0504] hover:bg-[#970b09] 
                    transition text-gray-200 font-semibold rounded-full shadow-lg hover:cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#6B0504]'
				aria-label='Search for weather using my current location'>
				<span className='flex items-center justify-center gap-2'>Use My Location</span>
			</button>
			{notification && (
				<p
					id={notificationId}
					className='text-sm text-red-400 mt-2'
					role='alert'
					aria-live='assertive'>
					{notification}
				</p>
			)}
		</div>
	);
};

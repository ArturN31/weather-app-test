'use client';

import { Forecast } from '@/components/Forecast/Forecast';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export default function Home() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const { searchLocationCoordinates } = useGeolocationSearch();

	//handling forecast retrieval
	useEffect(() => {
		const { latitude, longitude } = searchLocationCoordinates;

		if (typeof latitude !== 'number' || typeof longitude !== 'number') {
			return;
		}

		//TODO: add localStorage for the searches and output them
		//TODO: retrieve the forecast using coordinates
		console.log('Final coordinates ready for forecast:', searchLocationCoordinates);
	}, [searchLocationCoordinates]);

	return (
		<div className='flex min-h-screen font-sans'>
			<Sidebar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			<Forecast isSidebarOpen={isSidebarOpen} />
		</div>
	);
}

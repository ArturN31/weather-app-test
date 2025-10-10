import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { useEffect } from 'react';

export const Forecast = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
	const { searchResult } = useGeolocationSearch();

	useEffect(() => {
		//TODO: retrieve the forecast using coordinates
		console.log('Final coordinates ready for forecast:', searchResult);
	}, [searchResult]);

	return (
		<main
			className={`flex-1 p-10 pl-[130px] pr-[130px] transition-all duration-500 ease-in-out ${
				isSidebarOpen ? 'md:ml-[400px] md:pl-10 md:pr-10' : 'ml-0 mr-0'
			}`}>
			<h1 className={`text-4xl font-bold text-gray-400 border-b border-gray-500 pb-2`}>
				Weather Display Area
			</h1>
		</main>
	);
};

import React, { useState, useEffect } from 'react';
import { Searchbar } from './Content/Searchbar';
import { MyLocationBtn } from './Content/MyLocationBtn';
import { Recents } from './Content/Recents';
import { CloseSidebarBtn } from './CloseSidebarBtn';
import { OpenSidebarBtn } from './OpenSidebarBtn';

export const Sidebar = ({
	isSidebarOpen,
	toggleSidebar,
}: {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}) => {
	const [showOpenButton, setShowOpenButton] = useState(!isSidebarOpen);
	const [searchType, setSearchType] = useState<'city' | 'postcode'>('city');

	useEffect(() => {
		let timeoutId: string | number | NodeJS.Timeout | undefined;

		if (isSidebarOpen) {
			setShowOpenButton(false);
		} else {
			timeoutId = setTimeout(() => {
				setShowOpenButton(true);
			}, 500);
		}

		return () => clearTimeout(timeoutId);
	}, [isSidebarOpen]);

	return (
		<>
			{showOpenButton && <OpenSidebarBtn toggleSidebar={toggleSidebar} />}

			<aside
				className={`fixed top-0 left-0 h-screen w-full sm:w-[400px] p-10 z-10 bg-[#004d40] text-gray-100 shadow-2xl shadow-[#004d40]/90 border-r border-gray-500 transition-transform duration-500 ease-in-out ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'
				}`}>
				<div className='w-full max-w-sm mx-auto grid gap-5'>
					<CloseSidebarBtn toggleSidebar={toggleSidebar} />

					<h2 className='text-center text-3xl font-serif text-gray-300 tracking-wider border-b border-gray-500 pb-3'>
						Weather Forecast
					</h2>

					<div className='grid gap-3 py-10'>
						<Searchbar
							searchType={searchType}
							setSearchType={setSearchType}
						/>

						<p className='text-center text-sm'>or</p>

						<MyLocationBtn />
					</div>

					<Recents />
				</div>
			</aside>
		</>
	);
};

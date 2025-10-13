import React, { useState, useEffect } from 'react';
import { Searchbar } from './Content/Searchbar/Searchbar';
import { MyLocationBtn } from './Content/MyLocationBtn';
import { Recents } from './Content/Recents/Recents';
import { CloseSidebarBtn } from './CloseSidebarBtn';
import { OpenSidebarBtn } from './OpenSidebarBtn';
import { SearchbarStatus } from './Content/Searchbar/SearchbarStatus';

export const Sidebar = ({
	isSidebarOpen,
	toggleSidebar,
}: {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}) => {
	const [showOpenButton, setShowOpenButton] = useState(!isSidebarOpen);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

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
				id='weather-sidebar'
				role='region'
				aria-label='Search and Recent Locations'
				aria-hidden={!isSidebarOpen}
				tabIndex={isSidebarOpen ? 0 : -1}
				className={`fixed top-0 left-0 h-screen w-full sm:w-[400px] p-10 z-50 bg-brand-green shadow-2xl shadow-black/90 border-r border-[#006652] transition-transform duration-500 ease-in-out ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'
				}`}>
				<div className='w-full max-w-sm mx-auto grid gap-10'>
					<CloseSidebarBtn toggleSidebar={toggleSidebar} />

					<h2 className='text-center text-3xl font-serif text-gray-300 tracking-wider border-b border-gray-500 pb-3'>
						Weather Forecast
					</h2>

					<div className='grid gap-3'>
						<SearchbarStatus />

						<Searchbar />
						<p
							className='text-center text-sm text-gray-100'
							aria-hidden='true'>
							or
						</p>
						<MyLocationBtn />
					</div>

					<Recents />
				</div>
			</aside>
		</>
	);
};

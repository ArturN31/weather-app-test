'use client';

import { Forecast } from '@/components/Forecast/Forecast';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useState } from 'react';

export default function Home() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

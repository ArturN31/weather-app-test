'use client';

import { Forecast } from '@/components/Forecast/Forecast';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

export default function Home() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className='min-h-screen'>
			<Sidebar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			<div className='absolute top-5 right-5'>
				<ThemeToggle />
			</div>

			<Forecast isSidebarOpen={isSidebarOpen} />
		</div>
	);
}

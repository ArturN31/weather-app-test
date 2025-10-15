import { ReactElement } from 'react';

export const ForecastLayout = ({
	children,
	locationName,
	isSidebarOpen,
}: {
	children: ReactElement;
	locationName: string;
	isSidebarOpen: boolean;
}) => {
	const headerTitle =
		locationName && locationName !== 'Unknown Location'
			? `Forecast: ${locationName}`
			: 'Weather Forecast';

	return (
		<main
			className={`${
				isSidebarOpen ? 'xl:ml-[400px]' : 'md:ml-[130px] md:mr-[130px] md:mt-0 mt-[114px]'
			} flex-1 min-h-screen p-4 sm:p-6 transition-all duration-500 ease-in-out`}>
			<div className='max-w-[1500px] mx-auto'>
				<h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-500 border-b border-gray-600 pb-2 capitalize'>
					{headerTitle}
				</h1>
				{children}
			</div>
		</main>
	);
};

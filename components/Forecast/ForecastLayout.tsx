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
			? `Forecast for ${locationName}`
			: 'Weather Forecast';

	return (
		<main
			className={`${
				isSidebarOpen
					? 'lg:ml-[400px] md:p-10'
					: 'sm:pl-[130px] sm:pr-[130px] sm:pt-[40px] pt-[130px]'
			} flex-1 min-h-screen p-4 sm:p-6 transition-all duration-500 ease-in-out `}>
			<div className='max-w-[1382px] mx-auto'>
				<h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-500 border-b border-gray-600 pb-2'>
					{headerTitle}
				</h1>
				{children}
			</div>
		</main>
	);
};

import { PiWind } from 'react-icons/pi';

export const WindSpeed = ({ windSpeed }: { windSpeed: number }) => {
	const displayWindSpeed = windSpeed.toFixed(1);

	return (
		<div
			className='flex flex-col items-center'
			role='group'
			aria-label={`Wind speed: ${displayWindSpeed} meters per second`}>
			<div className='w-12 h-12 flex items-center justify-center'>
				<PiWind
					size={48}
					className='text-blue-400'
					aria-hidden='true'
					focusable='false'
				/>
			</div>

			<p className='text-xs md:text-[13px] lg:text-[14px] uppercase font-medium mt-1'>
				{displayWindSpeed} m/s
			</p>
		</div>
	);
};

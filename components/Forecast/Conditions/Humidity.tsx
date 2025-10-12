import { IoWaterOutline } from 'react-icons/io5';

export const Humidity = ({ humidity }: { humidity: number }) => {
	return (
		<div
			className='flex flex-col items-center'
			role='group'
			aria-label={`Humidity: ${humidity} percent, described as Humid`}>
			<div className='relative w-12 h-12 flex items-center justify-center'>
				<IoWaterOutline
					size={48}
					className='text-blue-400 opacity-80 absolute m-auto'
					aria-hidden='true'
					focusable='false'
				/>
				<span
					className='text-[12px] font-medium z-10'
					aria-label={`${humidity} percent`}>
					{humidity}%
				</span>
			</div>
			<p
				className='text-xs md:text-[13px] lg:text-[14px] uppercase font-medium mt-1'
				aria-hidden='true'>
				Humid
			</p>
		</div>
	);
};

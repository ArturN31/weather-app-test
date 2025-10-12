import { MdOutlineKeyboardArrowUp } from 'react-icons/md';

export const MaxTemp = ({ maxTemp }: { maxTemp: number }) => {
	const roundedTemp = Math.round(maxTemp);

	return (
		<div
			className='flex items-center text-red-400 font-medium'
			role='group'
			aria-label={`Maximum temperature: ${roundedTemp} degrees`}>
			<MdOutlineKeyboardArrowUp
				className='w-5 h-5 lg:w-6 lg:h-6'
				aria-hidden='true'
				focusable='false'
			/>
			<p className='text-lg md:text-xl lg:text-2xl uppercase font-medium mt-1'>
				{roundedTemp}°
			</p>
		</div>
	);
};

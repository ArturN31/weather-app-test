import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export const MinTemp = ({ minTemp }: { minTemp: number }) => {
	const roundedTemp = Math.round(minTemp);

	return (
		<div
			className='flex items-center text-blue-400 font-medium'
			role='group'
			aria-label={`Minimum temperature: ${roundedTemp} degrees`}>
			<MdOutlineKeyboardArrowDown
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

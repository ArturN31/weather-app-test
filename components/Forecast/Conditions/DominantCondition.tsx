import Image from 'next/image';

export const DominantCondition = ({
	iconURL,
	description,
}: {
	iconURL: string;
	description: string;
}) => {
	return (
		<div
			className='flex flex-col items-center'
			role='group'
			aria-label={`Dominant condition: ${description}`}>
			<Image
				src={iconURL}
				alt={description}
				aria-hidden='true'
				width={80}
				height={80}
				className='scale-125'
			/>
			<p className='text-xs md:text-[13px] lg:text-[14px] uppercase font-medium'>
				{description}
			</p>
		</div>
	);
};

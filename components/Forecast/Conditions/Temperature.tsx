import { MaxTemp } from './MaxTemp';
import { MinTemp } from './MinTemp';

export const Temperature = ({
	avgTemp,
	maxTemp,
	minTemp,
}: {
	avgTemp: number;
	maxTemp: number;
	minTemp: number;
}) => {
	return (
		<div className='flex items-center w-full md:w-auto mb-6 md:mb-0 '>
			<div className='flex justify-center items-center gap-2 mb-3'>
				<p
					className='text-6xl sm:text-7xl font-bold'
					aria-label={`Average temperature: ${Math.round(avgTemp)} degrees`}>
					{Math.round(avgTemp)}°
				</p>

				<div>
					<MaxTemp maxTemp={maxTemp} />
					<MinTemp minTemp={minTemp} />
				</div>
			</div>
		</div>
	);
};

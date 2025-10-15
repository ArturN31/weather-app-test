import { useState } from 'react';
import {
	CartesianGrid,
	LabelList,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface TooltipItem {
	stroke?: string;
	color?: string;
	name: string;
	value: string | number;
	dataKey?: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipItem[] | null;
	label?: string | number;
}

interface CustomLabelProps {
	x?: number;
	y?: number;
	stroke?: string;
	value?: number;
	offsetY?: number;
	labelColor?: string;
}

interface DailyForecastItem extends Forecast {
	day: string;
}

const transformDailyData = (data: Forecast[]): DailyForecastItem[] => {
	return data.map((item, index) => ({
		...item,
		day: getForecastDayLabel(index + 1),
	}));
};

// get the day label (e.g., "Tomorrow", "Mon", "Tue")
const getForecastDayLabel = (index: number) => {
	if (index === 0) return 'Today';

	const date = new Date();
	date.setDate(date.getDate() + index);
	return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		const day = String(label);

		const formatValue = (p: TooltipItem) => {
			const dataKey = p.dataKey || p.name;
			const rawValue =
				typeof p.value === 'number' ? p.value : parseFloat(String(p.value));
			const value = isNaN(rawValue) ? p.value : rawValue.toFixed(1);

			if (dataKey === 'maxTemp') return { name: 'Max Temp', value: `${value}°C` };
			if (dataKey === 'minTemp') return { name: 'Min Temp', value: `${value}°C` };
			if (dataKey === 'avgTemp') return { name: 'Avg Temp', value: `${value}°C` };

			return { name: dataKey, value: value };
		};

		return (
			<div className='p-3 bg-gray-700/90 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl text-gray-100 font-medium'>
				<p className='font-bold text-teal-300 mb-1'>{day}</p>
				{payload.map((p: TooltipItem, index: number) => {
					if (p.value === undefined || p.value === null) return null;

					const { name, value } = formatValue(p);

					return (
						<p
							key={index}
							style={{ color: p.stroke || p.color }}>
							{name}: {value}
						</p>
					);
				})}
			</div>
		);
	}
	return null;
};

const CustomTempLabel = (props: CustomLabelProps) => {
	const { x, y, stroke, value, offsetY, labelColor } = props;

	const formattedValue = value !== undefined ? `${value.toFixed(1)}°C` : '';

	return (
		<text
			x={x}
			y={y}
			dy={offsetY}
			fill={labelColor || stroke}
			fontSize={14}
			fontWeight={600}
			textAnchor='start'>
			{formattedValue}
		</text>
	);
};

export const TemperatureChart = ({ dailyData }: { dailyData: Forecast[] }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = () => setIsOpen(!isOpen);

	return isOpen ? (
		<div
			id='temperature-chart'
			className='bg-gray-800 rounded-2xl shadow-[0px_2px_6px_-2px_black] overflow-hidden'>
			<h3
				className='text-lg lg:text-2xl font-semibold text-gray-200 border-b border-black rounded-t-2xl p-4 hover:bg-gray-700 cursor-pointer'
				onClick={handleClick}>
				Temperature Overview
			</h3>

			<div className='w-full h-80 min-h-[300px] sm:h-96 pb-6'>
				<ResponsiveContainer
					width='100%'
					height='100%'>
					<LineChart
						data={transformDailyData(dailyData)}
						margin={{ top: 25, right: 60, left: 10, bottom: 5 }}>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='#4B5563'
							strokeOpacity={0.5}
						/>

						<XAxis
							dataKey='day'
							stroke='#9CA3AF'
							tick={{ fill: '#D1D5DB', fontSize: 14, fontWeight: 600, dy: 15 }}
							axisLine={false}
							tickLine={false}
						/>

						<YAxis
							stroke='#9CA3AF'
							unit='°C'
							tick={{ fill: '#D1D5DB', fontSize: 14, fontWeight: 600 }}
							axisLine={false}
							tickLine={false}
						/>

						<Tooltip content={<CustomTooltip />} />

						<Legend
							wrapperStyle={{ paddingTop: '20px' }}
							formatter={(value) => (
								<span style={{ color: '#D1D5DB', fontWeight: 600 }}>{value}</span>
							)}
						/>

						<Line
							type='monotone'
							dataKey='maxTemp'
							name='Max Temp'
							stroke='#F43F5E'
							strokeWidth={3}
							dot={{ r: 4, fill: '#F43F5E', stroke: '#111827', strokeWidth: 2 }}
							activeDot={{ r: 8, fill: '#DC2626', stroke: '#111827', strokeWidth: 4 }}>
							<LabelList
								content={
									<CustomTempLabel
										offsetY={-10}
										labelColor='#F43F5E'
									/>
								}
								dataKey='maxTemp'
							/>
						</Line>

						<Line
							type='monotone'
							dataKey='minTemp'
							name='Min Temp'
							stroke='#60A5FA'
							strokeWidth={3}
							dot={{ r: 4, fill: '#60A5FA', stroke: '#111827', strokeWidth: 2 }}
							activeDot={{ r: 8, fill: '#2563EB', stroke: '#111827', strokeWidth: 4 }}>
							<LabelList
								content={
									<CustomTempLabel
										offsetY={20}
										labelColor='#60A5FA'
									/>
								}
								dataKey='minTemp'
							/>
						</Line>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	) : (
		<div
			id='temperature-chart'
			className='bg-gray-800 rounded-2xl shadow-[0px_2px_6px_-2px_black] border-b border-black w-full overflow-hidden'>
			<h3
				className='flex text-xl font-semibold text-gray-200 border-b border-black p-4 hover:bg-gray-700 cursor-pointer'
				onClick={handleClick}>
				Temperature Overview
				<div className='px-4 py-2 text-white italic text-xs'>
					<span>Expand to view</span>
				</div>
			</h3>
		</div>
	);
};

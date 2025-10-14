interface ToggleOption<T extends string> {
	value: T;
	label: string;
}

interface GenericToggleProps<T extends string> {
	options: [ToggleOption<T>, ToggleOption<T>];
	selectedValue: T;
	onSelect: (value: T) => void;
	ariaLabel: string;
}

export const GenericToggle = <T extends string>({
	options,
	selectedValue,
	onSelect,
	ariaLabel,
}: GenericToggleProps<T>) => {
	const [option1, option2] = options;

	return (
		<div
			className='flex justify-center p-1 bg-black/20 rounded-full border border-gray-700'
			role='radiogroup'
			aria-label={ariaLabel}>
			<button
				onClick={() => {
					onSelect(option1.value);
				}}
				role='radio'
				aria-checked={selectedValue === option1.value}
				className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
					selectedValue === option1.value
						? 'bg-gray-100 text-[#004d40] shadow-md'
						: 'text-gray-400 hover:text-gray-200'
				}`}>
				{option1.label}
			</button>
			<button
				onClick={() => {
					onSelect(option2.value);
				}}
				role='radio'
				aria-checked={selectedValue === option2.value}
				className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
					selectedValue === option2.value
						? 'bg-gray-100 text-[#004d40] shadow-md'
						: 'text-gray-400 hover:text-gray-200'
				}`}>
				{option2.label}
			</button>
		</div>
	);
};

export const SearchbarSuggestions = ({
	inputId,
	suggestions,
	searchbarLocation,
	handleInputChange,
	handleSuggestionClick,
}: {
	inputId: string;
	suggestions: Location[];
	searchbarLocation: string;
	handleInputChange: (value: string) => void;
	handleSuggestionClick: (locationName: string) => void;
}) => {
	return (
		<ul
			id={`${inputId}-suggestions`}
			role='listbox'
			className='absolute z-10 w-full mt-1 bg-gray-800 border border-black rounded-lg shadow-xl max-h-60 overflow-y-auto'>
			{suggestions.map((loc, index) => (
				<li
					id={`${inputId}-suggestions-li-${index}`}
					key={loc.name}
					role='option'
					aria-selected={searchbarLocation === loc.name}
					onClick={() => {
						handleInputChange(loc.name);
						handleSuggestionClick(loc.name);
					}}
					className='px-4 py-2 cursor-pointer text-white hover:bg-gray-700 transition-colors truncate'>
					{loc.name}
				</li>
			))}
		</ul>
	);
};

import { useSearchbarLogic } from '@/utils/hooks/useSearchbarLogic';
import { useId } from 'react';
import { SearchbarSuggestions } from './SearchbarSuggestions';

export const SearchbarInput = () => {
	const inputId = useId();

	const {
		localInput,
		currentPlaceholder,
		showSuggestions,
		isInputDisabled,
		isSubmitDisabled,
		suggestions,
		handleSearchSubmit,
		handleSuggestionClick,
		handleInputChange,
		searchbarLocationType,
		searchbarLocation,
	} = useSearchbarLogic();

	return (
		<form
			onSubmit={handleSearchSubmit}
			className='relative'>
			<label
				htmlFor={inputId}
				className='sr-only'>
				Search for weather by {searchbarLocationType}
			</label>

			<div className='flex space-x-2'>
				<input
					id={inputId}
					type='search'
					value={localInput}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder={currentPlaceholder}
					disabled={isInputDisabled}
					autoComplete='off'
					aria-required='true'
					aria-autocomplete='list'
					aria-controls={showSuggestions ? `${inputId}-suggestions` : undefined}
					className='flex-grow border border-gray-600 bg-black/40 text-white placeholder:text-gray-500 px-3 py-2 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'
				/>

				<button
					type='submit'
					disabled={isSubmitDisabled}
					className='px-4 py-2 text-white font-semibold rounded-full cursor-pointer bg-gray-800 backdrop-blur-sm border border-white/20 shadow-[0px_1px_2px_black] hover:shadow-[inset_0px_0px_1px_black] disabled:bg-gray-500 disabled:border-gray-800 disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'>
					Search
				</button>
			</div>

			{showSuggestions && (
				<SearchbarSuggestions
					inputId={inputId}
					suggestions={suggestions}
					searchbarLocation={searchbarLocation}
					handleInputChange={handleInputChange}
					handleSuggestionClick={handleSuggestionClick}
				/>
			)}
		</form>
	);
};

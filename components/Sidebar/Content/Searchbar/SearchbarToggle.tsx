import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const SearchbarToggle = () => {
	const { searchbarLocationType, handleSearchbarLocation, handleSearchbarLocationType } =
		useGeolocationSearch();

	const handleClick = async (toggle: 'city' | 'postcode') => {
		await handleSearchbarLocation('');
		await handleSearchbarLocationType(toggle);
	};

	return (
		<div
			className='flex justify-center p-1 bg-black/20 rounded-full border border-gray-700'
			role='radiogroup'
			aria-label='Select search type'>
			<button
				onClick={() => {
					handleClick('city');
				}}
				role='radio'
				aria-checked={searchbarLocationType === 'city'}
				tabIndex={searchbarLocationType === 'city' ? 0 : -1}
				className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
					searchbarLocationType === 'city'
						? 'bg-gray-100 text-[#004d40] shadow-md'
						: 'text-gray-400 hover:text-gray-200'
				}`}>
				City
			</button>
			<button
				onClick={() => {
					handleClick('postcode');
				}}
				role='radio'
				aria-checked={searchbarLocationType === 'postcode'}
				tabIndex={searchbarLocationType === 'postcode' ? 0 : -1}
				className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
					searchbarLocationType === 'postcode'
						? 'bg-gray-100 text-[#004d40] shadow-md'
						: 'text-gray-400 hover:text-gray-200'
				}`}>
				Postcode
			</button>
		</div>
	);
};

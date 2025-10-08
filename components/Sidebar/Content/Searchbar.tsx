export const Searchbar = ({
	searchType,
	setSearchType,
}: {
	searchType: 'city' | 'postcode';
	setSearchType: React.Dispatch<React.SetStateAction<'city' | 'postcode'>>;
}) => {
	return (
		<div className='grid gap-3'>
			<input
				type='text'
				placeholder={`Enter ${searchType === 'city' ? 'City Name' : 'Postcode'}...`}
				className='border border-gray-600 bg-black/40 text-gray-200 placeholder:text-gray-500 px-3 py-2 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition'
			/>
			<div className='flex justify-center p-1 bg-black/20 rounded-full border border-gray-700'>
				<button
					onClick={() => setSearchType('city')}
					className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
						searchType === 'city'
							? 'bg-gray-100 text-[#004d40] shadow-md'
							: 'text-gray-400 hover:text-gray-200'
					}`}>
					City
				</button>
				<button
					onClick={() => setSearchType('postcode')}
					className={`w-1/2 py-1 text-sm font-semibold rounded-full transition-all hover:cursor-pointer ${
						searchType === 'postcode'
							? 'bg-gray-100 text-[#004d40] shadow-md'
							: 'text-gray-400 hover:text-gray-200'
					}`}>
					Postcode
				</button>
			</div>
		</div>
	);
};

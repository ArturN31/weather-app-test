import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const Recents = () => {
	const { recentSearches, isRecentsLoaded, removeRecentSearch } = useGeolocationSearch();

	if (!isRecentsLoaded) return null;

	const MAX_DISPLAY = 10;

	const handleLocationClick = (location: StoredLocation) => {
		console.log(location);
	};

	const handleRemoveClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		locationName: string,
	) => {
		e.stopPropagation();
		removeRecentSearch(locationName);
	};

	return (
		<div className='text-base font-sans text-white p-3 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 shadow-lg'>
			<p className='border-b border-white/30 pb-2 mb-3 text-white font-semibold'>
				Recent Locations <span className='text-xs'>/ Last 10</span>
			</p>

			{recentSearches.length > 0 && (
				<ul className='pt-1 flex flex-wrap justify-center gap-3'>
					{recentSearches
						.slice()
						.slice(-MAX_DISPLAY)
						.reverse()
						.map((location) => (
							<li
								key={location.location}
								onClick={() => handleLocationClick(location)}
								tabIndex={0}
								className='flex justify-between items-center group py-1.5 px-3 bg-white/10 rounded-full hover:cursor-pointer hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0 transition w-fit'>
								<span className='truncate text-sm font-normal'>{location.location}</span>

								<button
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveClick(e, location.location);
									}}
									className='text-sm text-white/70 ml-2 p-1 w-6 h-6 rounded-full flex items-center justify-center bg-black/30 hover:text-red-300 hover:bg-black/50 transition-all'
									aria-label={`Remove ${location.location} from recents`}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-3.5 w-3.5'
										viewBox='0 0 20 20'
										fill='currentColor'>
										<path
											fillRule='evenodd'
											d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</li>
						))}
				</ul>
			)}

			{recentSearches.length === 0 && (
				<p className='text-sm italic text-white/70'>No recent searches found.</p>
			)}
		</div>
	);
};

import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { RemoveRecentBtn } from './RemoveRecentBtn';
import { RecentLocationBtn } from './RecentLocationBtn';

export const Recents = () => {
	const { recentSearches, isRecentsLoaded } = useGeolocationSearch();

	if (!isRecentsLoaded) return null;

	const MAX_DISPLAY = 10;

	return (
		<div
			className='text-base font-sans text-gray-200 p-4 bg-[#004d40] border border-gray-600 rounded-sm shadow-[inset_0px_0px_4px_1px_black]'
			role='region'
			aria-label='Recent Weather Searches'>
			<h3 className='border-b border-gray-600 pb-2 mb-3 text-gray-100 font-semibold'>
				Recent Search Locations &nbsp;
				<span
					className='text-xs'
					aria-hidden='true'>
					/ Last {MAX_DISPLAY}
				</span>
			</h3>

			{recentSearches.length > 0 && (
				<ul className='grid grid-cols-1 gap-2'>
					{recentSearches
						.slice()
						.slice(-MAX_DISPLAY)
						.reverse()
						.map((location) => (
							<li
								key={location.location}
								className='flex text-gray-200 shadow-sm transition'>
								<RecentLocationBtn location={location} />
								<RemoveRecentBtn locationName={location.location} />
							</li>
						))}
				</ul>
			)}

			{recentSearches.length === 0 && (
				<p className='text-sm italic text-gray-400/70'>No recent searches found.</p>
			)}
		</div>
	);
};

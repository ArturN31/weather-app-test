import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';
import { RemoveRecentBtn } from './RemoveRecentBtn';
import { RecentLocationBtn } from './RecentLocationBtn';
import React from 'react';

export const Recents = () => {
	const { recentSearches, isRecentsLoaded } = useGeolocationSearch();

	if (!isRecentsLoaded) return null;

	const MAX_DISPLAY = 10;

	return (
		<div
			className='text-base font-sans text-gray-200 p-6 bg-dark-brand-green border-t border-[#006652] rounded-xl shadow-xl'
			role='region'
			aria-label='Recent Weather Searches'>
			<h3 className='text-xl font-bold text-center border-b border-[#006652] pb-3 mb-4 text-gray-100'>
				Recent Searches&nbsp;
				<span
					className='text-sm font-normal text-gray-300'
					aria-hidden='true'>
					(Last {MAX_DISPLAY})
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
								className='flex rounded-md overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,77,64,0.3)] transition hover:scale-[1.01]'>
								<RecentLocationBtn location={location} />
								<RemoveRecentBtn locationName={location.location} />
							</li>
						))}
				</ul>
			)}

			{recentSearches.length === 0 && (
				<p className='text-sm italic text-gray-400/70 text-center'>
					No recent searches found. Start by searching above.
				</p>
			)}
		</div>
	);
};

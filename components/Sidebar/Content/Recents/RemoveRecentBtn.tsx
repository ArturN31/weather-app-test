import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const RemoveRecentBtn = ({ locationName }: { locationName: string }) => {
	const { removeRecentSearch } = useGeolocationSearch();

	const handleRemoveClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		locationName: string,
	) => {
		e.stopPropagation();
		removeRecentSearch(locationName);
	};

	return (
		<button
			onClick={(e) => handleRemoveClick(e, locationName)}
			className='bg-gray-900 cursor-pointer text-white p-2 border-l-2 border-gray-900 flex items-center justify-center transition-all hover:bg-red-700 rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-inset'
			aria-label={`Remove ${locationName} from recents`}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-4 w-4'
				viewBox='0 0 20 20'
				fill='currentColor'
				aria-hidden='true'
				focusable='false'>
				<path
					fillRule='evenodd'
					d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
					clipRule='evenodd'
				/>
			</svg>
		</button>
	);
};

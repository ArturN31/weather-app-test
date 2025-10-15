import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const SearchbarStatus = () => {
	const { geolocationStatus } = useGeolocationSearch();

	let content;
	let ariaLiveSetting: 'polite' | 'assertive' = 'polite';
	let roleSetting: 'status' | 'alert' = 'status';

	// PENDING STATE
	if (geolocationStatus.isPending) {
		content = (
			<span className='flex items-center justify-center gap-2'>
				<p className='text-sm italic'>{geolocationStatus.message}</p>
			</span>
		);
	}

	// ERROR/ATTENTION STATE
	else if (geolocationStatus.message) {
		ariaLiveSetting = 'assertive';
		roleSetting = 'alert';

		content = (
			<div className='text-red-400'>
				<p className='text-sm'>{geolocationStatus.message}</p>
			</div>
		);
	}

	return (
		content && (
			<div
				className={`text-center rounded-full p-2 ${
					geolocationStatus.message && !geolocationStatus.isPending
						? 'bg-red-900/40'
						: 'bg-gray-800/40'
				} text-gray-100`}
				role={roleSetting}
				aria-live={ariaLiveSetting}>
				{content}
			</div>
		)
	);
};

import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export const SearchbarStatus = () => {
	const { geolocationRetrievalMessage, geolocationRetrievalPending } =
		useGeolocationSearch();

	let content;
	let ariaLiveSetting: 'polite' | 'assertive' = 'polite';
	let roleSetting: 'status' | 'alert' = 'status';

	// PENDING STATE
	if (geolocationRetrievalPending) {
		content = <p className='text-sm'>{geolocationRetrievalPending}</p>;
	}

	// ERROR/ATTENTION STATE
	if (geolocationRetrievalMessage) {
		ariaLiveSetting = 'assertive';
		roleSetting = 'alert';

		content = (
			<>
				<p className='font-bold'>Attention:</p>
				<p className='text-sm'>{geolocationRetrievalMessage}</p>
			</>
		);
	}

	return (
		content && (
			<div
				className='text-center text-gray-100 p-1'
				role={roleSetting}
				aria-live={ariaLiveSetting}>
				{content}
			</div>
		)
	);
};

export const LoadingSpinner = () => (
	<div
		className='flex items-center justify-center space-x-2'
		role='status'
		aria-live='polite'>
		<div
			className='w-6 h-6 border-4 border-t-4 border-blue-400 rounded-full animate-spin'
			aria-hidden='true'></div>
		<p className='text-blue-400 mt-2 text-xl font-medium'>Loading...</p>
	</div>
);

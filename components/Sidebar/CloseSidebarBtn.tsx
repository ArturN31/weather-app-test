export const CloseSidebarBtn = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
	return (
		<button
			onClick={toggleSidebar}
			className='absolute top-4 right-4 text-gray-400 hover:text-white hover:cursor-pointer transition'
			aria-label='Close Sidebar'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={2.5}
				stroke='currentColor'
				className='w-6 h-6'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M6 18L18 6M6 6l12 12'
				/>
			</svg>
		</button>
	);
};

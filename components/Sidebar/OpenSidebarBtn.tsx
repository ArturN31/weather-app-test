export const OpenSidebarBtn = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
	return (
		<button
			onClick={toggleSidebar}
			className='fixed top-10 left-10 z-50 p-3 rounded-full bg-gray-800 text-white shadow-2xl border border-gray-700 hover:bg-gray-700 transition hover:cursor-pointer'
			aria-label='Open Sidebar'>
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
					d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
				/>
			</svg>
		</button>
	);
};

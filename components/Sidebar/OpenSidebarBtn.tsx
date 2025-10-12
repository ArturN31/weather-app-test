export const OpenSidebarBtn = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
	return (
		<button
			onClick={toggleSidebar}
			className='fixed top-10 left-10 z-50 p-3 rounded-full bg-[#004d40] text-white shadow-lg border border-gray-700 
               transition duration-150 ease-in-out hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-xl 
               focus:outline-none focus:ring-4 focus:ring-[#004d40] focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer'
			aria-label='Open search and recent locations sidebar'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={2.5}
				stroke='currentColor'
				className='w-6 h-6'
				aria-hidden='true'
				role='img'
				focusable='false'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
				/>
			</svg>
		</button>
	);
};

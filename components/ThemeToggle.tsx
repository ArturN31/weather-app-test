import { useDarkMode } from '@/utils/hooks/useDarkMode';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export const ThemeToggle = () => {
	const [isDarkMode, toggleDarkMode] = useDarkMode();

	return (
		<button
			onClick={() => toggleDarkMode()}
			aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
			className={`p-2 rounded-full transition-colors duration-300 ${
				isDarkMode
					? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
					: 'bg-yellow-300 text-gray-800 hover:bg-yellow-200'
			}`}>
			{isDarkMode ? (
				<MdDarkMode className='w-6 h-6' />
			) : (
				<MdLightMode className='w-6 h-6' />
			)}
		</button>
	);
};

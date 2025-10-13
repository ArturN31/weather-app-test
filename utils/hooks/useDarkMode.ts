import { useEffect, useState } from 'react';

type UseDarkModeResult = [boolean, () => void, boolean];

export const useDarkMode = (): UseDarkModeResult => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

	// retrieve initial theme mode based on localStorage
	useEffect(() => {
		const getInitialMode = (): boolean => {
			if (typeof window === 'undefined') return false;

			const storedPreference = localStorage.getItem('theme');
			if (storedPreference === 'dark') return true;
			if (storedPreference === 'light') return false;

			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		};

		setIsDarkMode(getInitialMode());
		setIsMounted(true);
	}, []);

	// update the html class to include/exclude the dark theme
	useEffect(() => {
		if (!isMounted) return;

		const root = window.document.documentElement;

		if (isDarkMode) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkMode, isMounted]);

	return [isDarkMode, toggleDarkMode, isMounted];
};

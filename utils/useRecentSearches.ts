import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

/**
 * custom hook to synchronize the recent searches array with browser's localStorage.
 * handles SSR/hydration by only accessing localStorage on the client.
 * * @param storageKey The localStorage key (e.g., 'recent_location_searches').
 * @param initialValue The default value if no data is found (e.g., []).
 * @returns An array containing [recentSearches, setRecentSearches, isSearchesLoaded].
 */
export function useRecentSearches<T>(storageKey: string, initialValue: T) {
	// retrieve the array from localStorage
	const initializeRecentSearches = (): T => {
		if (!isClient) return initialValue;

		try {
			const itemJson = window.localStorage.getItem(storageKey);
			return itemJson ? (JSON.parse(itemJson) as T) : initialValue;
		} catch (error) {
			console.error(`Error reading recent searches key “${storageKey}”:`, error);
			return initialValue;
		}
	};

	// state
	const [recentSearches, setRecentSearchesState] = useState<T>(initializeRecentSearches);
	const [isSearchesLoaded, setIsSearchesLoaded] = useState(false);

	// update the state and persist it to localStorage
	const setRecentSearches = (newValueOrFunction: T | ((val: T) => T)) => {
		let newRecentSearches;

		// determine the new state value, supporting both direct values and functional updates (prev => [...prev, newItem]).
		if (newValueOrFunction instanceof Function) {
			newRecentSearches = newValueOrFunction(recentSearches);
		} else {
			newRecentSearches = newValueOrFunction;
		}

		setRecentSearchesState(newRecentSearches);

		// attempt to write to localStorage if running in a browser environment
		if (isClient) {
			try {
				const valueJson = JSON.stringify(newRecentSearches);
				window.localStorage.setItem(storageKey, valueJson);
			} catch (error) {
				console.error(`Error setting recent searches key “${storageKey}”:`, error);
			}
		}
	};

	useEffect(() => {
		setIsSearchesLoaded(true);
	}, []);

	useEffect(() => {
		const handler = () => setRecentSearchesState(initializeRecentSearches());
		window.addEventListener('storage', handler);

		return () => window.removeEventListener('storage', handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storageKey]);

	return [recentSearches, setRecentSearches, isSearchesLoaded] as const;
}

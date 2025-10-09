import { useEffect, useState } from 'react';

/**
 * Debounces a value, returning the value only after the specified delay has passed
 * without the value changing again.
 * @param value The value to debounce (e.g., the search input string).
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

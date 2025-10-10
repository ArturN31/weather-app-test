'use client';

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
	useEffect,
} from 'react';
import { useDebounce } from '../useDebounce';
import { useRecentSearches } from '../useRecentSearches';

interface GeolocationContextValue {
	searchbarLocation: string;
	searchbarLocationType: 'city' | 'postcode';
	searchResult: SearchResult;
	geolocationRetrievalPending: boolean;
	geolocationRetrievalMessage: string;
	recentSearches: StoredLocation[];
	isRecentsLoaded: boolean;
	handleSearchbarLocation: (location: string) => void;
	handleSearchbarLocationType: (type: 'city' | 'postcode') => void;
	handleSearchResult: (location: string, coords: Coordinates) => void;
	removeRecentSearch: (locationToRemove: string) => void;
}

const GeolocationContext = createContext<GeolocationContextValue | undefined>(undefined);

const INVALID_COORDS: Coordinates = { latitude: null, longitude: null };
const INITIAL_SEARCH_RESULT: SearchResult = {
	location: '',
	coords: INVALID_COORDS,
};

export const GeolocationSearchProvider = ({ children }: { children: ReactNode }) => {
	// state
	const [searchbarLocation, setSearchbarLocation] = useState<string>('');
	const [searchbarLocationType, setSearchbarLocationType] = useState<'city' | 'postcode'>(
		'city',
	);
	const [searchResult, setSearchResult] = useState<SearchResult>(INITIAL_SEARCH_RESULT);
	const [geolocationRetrievalPending, setGeolocationRetrievalPending] = useState(false);
	const [geolocationRetrievalMessage, setGeolocationRetrievalMessage] = useState('');
	const [recentSearches, setRecentSearches, isRecentsLoaded] = useRecentSearches<
		StoredLocation[]
	>('recent_location_searches', []);

	// adjust the delay value if necessary
	const debouncedLocation = useDebounce(searchbarLocation, 1000);

	// handlers
	const handleSearchbarLocation = (location: string) =>
		setSearchbarLocation(location.toLocaleLowerCase());

	const handleSearchbarLocationType = (type: 'city' | 'postcode') =>
		setSearchbarLocationType(type);

	const handleSearchResult = useCallback((location: string, coords: Coordinates) => {
		setSearchResult((prevResult) => {
			if (
				prevResult.coords.latitude === coords.latitude &&
				prevResult.coords.longitude === coords.longitude &&
				prevResult.location === location
			) {
				return prevResult;
			}
			return { location, coords };
		});
	}, []);

	const removeRecentSearch = useCallback(
		(locationToRemove: string) => {
			setRecentSearches((currentStorage) => {
				return currentStorage.filter(
					(location) =>
						location.location.toLowerCase() !== locationToRemove.toLowerCase(),
				);
			});
		},
		[setRecentSearches],
	);

	const updateRecentSearches = useCallback(
		(newLocation: StoredLocation) => {
			const locationString = newLocation.location.trim();
			const isValidLocation = locationString.length > 0;
			const isValidCoords =
				typeof newLocation.coords.latitude === 'number' &&
				typeof newLocation.coords.longitude === 'number';

			if (!isValidLocation || !isValidCoords) {
				console.warn('Attempted to add invalid search to recents. Skipping.');
				return;
			}

			setRecentSearches((currentStorage) => {
				const isAlreadyAdded = currentStorage.some(
					(location) =>
						location.location.toLowerCase() === newLocation.location.toLowerCase(),
				);

				if (isAlreadyAdded) return currentStorage;

				return [...currentStorage, newLocation];
			});
		},
		[setRecentSearches],
	);

	const getCoordinates = useCallback(
		async (location: string, toggle: 'city' | 'postcode') => {
			setGeolocationRetrievalPending(true);
			setGeolocationRetrievalMessage('Data retrieval pending.');

			try {
				const response = await fetch('/api/geolocation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						queryLocation: location,
						queryToggle: toggle,
					}),
				});

				const data: CoordinatesOutput = await response.json();

				if (!response.ok || data.message) {
					const errorMsg =
						data.message || `Server error: ${response.status} ${response.statusText}`;
					setGeolocationRetrievalMessage(errorMsg);
					setGeolocationRetrievalPending(false);
					handleSearchResult('', INVALID_COORDS);
					return;
				}

				setGeolocationRetrievalMessage('');

				const newCoords: Coordinates = {
					latitude: data.latitude,
					longitude: data.longitude,
				};

				handleSearchResult(location, newCoords);
			} catch (e) {
				console.log(`Error retrieving coordinates: ${e}`);
				setGeolocationRetrievalMessage('A critical network error occurred.');
				handleSearchResult('', INVALID_COORDS);
				setGeolocationRetrievalPending(false);
			}
		},
		[handleSearchResult],
	);

	// handling coordinates retrieval - triggered after debounce
	useEffect(() => {
		const location = debouncedLocation.trim();

		if (!location || location.length < 3) {
			handleSearchResult('', INVALID_COORDS);

			if (!location) {
				setGeolocationRetrievalMessage('Please enter a location.');
			} else {
				setGeolocationRetrievalMessage('Enter at least 3 characters for a location.');
			}

			return;
		}

		handleSearchResult('', INVALID_COORDS);

		getCoordinates(location, searchbarLocationType);
	}, [debouncedLocation, getCoordinates, handleSearchResult, searchbarLocationType]);

	// storage update
	useEffect(() => {
		const { location, coords } = searchResult;
		const { latitude, longitude } = coords;

		if (!location || typeof latitude !== 'number' || typeof longitude !== 'number')
			return;

		if (location !== debouncedLocation) {
			console.warn(
				`Ignoring stale search result for storage: ${location}. Current debounced input: ${debouncedLocation}`,
			);
			return;
		}

		setGeolocationRetrievalPending(false);

		updateRecentSearches({
			location: location,
			toggle: searchbarLocationType,
			coords: coords,
		});
	}, [debouncedLocation, searchbarLocationType, updateRecentSearches, searchResult]);

	const value: GeolocationContextValue = {
		// state
		searchbarLocation,
		searchbarLocationType,
		searchResult,
		geolocationRetrievalPending,
		geolocationRetrievalMessage,
		recentSearches,
		isRecentsLoaded,
		// handlers
		handleSearchbarLocation,
		handleSearchbarLocationType,
		handleSearchResult,
		removeRecentSearch,
	};

	return (
		<GeolocationContext.Provider value={value}>{children}</GeolocationContext.Provider>
	);
};

export const useGeolocationSearch = () => {
	const context = useContext(GeolocationContext);
	if (context === undefined) {
		throw new Error(
			'useGeolocationSearch must be used within a GeolocationSearchProvider',
		);
	}
	return context;
};

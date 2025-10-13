'use client';

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
	useEffect,
	useMemo,
} from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentSearches } from '../hooks/useRecentSearches';

type LocationType = 'city' | 'postcode';
type UnitsType = 'metric' | 'imperial';

interface GeolocationContextValue {
	searchbarLocation: string;
	searchbarLocationType: LocationType;
	searchbarUnitsType: UnitsType;
	searchResult: SearchResult;
	geolocationRetrievalPending: boolean;
	geolocationRetrievalMessage: string;
	recentSearches: StoredLocation[];
	isRecentsLoaded: boolean;
	forecastData: DailyForecastOutput | null;
	forecastRetrievalPending: boolean;
	forecastRetrievalMessage: string;
	handleSearchbarLocation: (location: string) => void;
	handleSearchbarLocationType: (type: LocationType) => void;
	handleSearchbarUnitsType: (type: UnitsType) => void;
	handleSearchResult: (location: string, coords: Coordinates) => void;
	removeRecentSearch: (locationToRemove: string) => void;
	handleGeolocationRetrievalMessage: (message: string) => void;
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
	const [searchbarLocationType, setSearchbarLocationType] =
		useState<LocationType>('city');
	const [searchbarUnitsType, setSearchbarUnitsType] = useState<UnitsType>('metric');
	const [searchResult, setSearchResult] = useState<SearchResult>(INITIAL_SEARCH_RESULT);
	const [geolocationRetrievalPending, setGeolocationRetrievalPending] = useState(false);
	const [geolocationRetrievalMessage, setGeolocationRetrievalMessage] = useState('');
	const [recentSearches, setRecentSearches, isRecentsLoaded] = useRecentSearches<
		StoredLocation[]
	>('recent_location_searches', []);

	const [forecastData, setForecastData] = useState<DailyForecastOutput | null>(null);
	const [forecastRetrievalPending, setForecasRetrievalPending] = useState(false);
	const [forecastRetrievalMessage, setForecasRetrievalMessage] = useState('');

	// adjust the delay value if necessary
	const debouncedLocation = useDebounce(searchbarLocation, 1000);

	// handlers
	const handleSearchbarLocation = useCallback(
		(location: string) => setSearchbarLocation(location.toLocaleLowerCase()),
		[setSearchbarLocation],
	);

	const handleSearchbarLocationType = useCallback(
		(type: LocationType) => setSearchbarLocationType(type),
		[setSearchbarLocationType],
	);

	const handleSearchbarUnitsType = useCallback(
		(type: UnitsType) => setSearchbarUnitsType(type),
		[setSearchbarUnitsType],
	);

	const handleGeolocationRetrievalMessage = useCallback(
		(message: string) => setGeolocationRetrievalMessage(message),
		[setGeolocationRetrievalMessage],
	);

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
		async (location: string, toggle: LocationType) => {
			setGeolocationRetrievalPending(true);
			handleGeolocationRetrievalMessage('Data retrieval pending.');

			setForecastData(null);
			setForecasRetrievalPending(false);
			setForecasRetrievalMessage('');

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
					handleGeolocationRetrievalMessage(errorMsg);
					setGeolocationRetrievalPending(false);
					handleSearchResult('', INVALID_COORDS);
					return;
				}

				handleGeolocationRetrievalMessage('');

				const newCoords: Coordinates = {
					latitude: data.latitude,
					longitude: data.longitude,
				};

				handleSearchResult(location, newCoords);
			} catch (e) {
				console.log(`Error retrieving coordinates: ${e}`);
				handleGeolocationRetrievalMessage('A critical network error occurred.');
				handleSearchResult('', INVALID_COORDS);
				setGeolocationRetrievalPending(false);
			}
		},
		[handleGeolocationRetrievalMessage, handleSearchResult],
	);

	const getForecast = useCallback(async (coords: Coordinates, toggle: UnitsType) => {
		if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number')
			return;

		setForecasRetrievalPending(true);
		setForecasRetrievalMessage('Data retrieval pending.');

		try {
			const response = await fetch('/api/weather', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					latitude: coords.latitude,
					longitude: coords.longitude,
					queryToggle: toggle,
				}),
			});

			const data: DailyForecastOutput = await response.json();

			if (!response.ok || data.message) {
				const errorMsg =
					data.message || `Server error: ${response.status} ${response.statusText}`;
				setForecasRetrievalMessage(errorMsg);
				setForecasRetrievalPending(false);
				return;
			}

			setForecastData(data);
			setForecasRetrievalPending(false);
			setForecasRetrievalMessage('');
		} catch (e) {
			console.log(`Error retrieving forecast: ${e}`);
			setForecasRetrievalMessage('A critical network error occurred.');
			setForecasRetrievalPending(false);
			setForecastData(null);
		}
	}, []);

	// handling coordinates retrieval - triggered after debounce
	useEffect(() => {
		const location = debouncedLocation.trim();

		if (!location || location.length < 3) {
			handleSearchResult('', INVALID_COORDS);

			if (!location) {
				handleGeolocationRetrievalMessage('Please enter a location.');
			} else {
				handleGeolocationRetrievalMessage('Enter at least 3 characters for a location.');
			}

			return;
		}

		handleSearchResult('', INVALID_COORDS);

		getCoordinates(location, searchbarLocationType);
	}, [
		debouncedLocation,
		getCoordinates,
		handleGeolocationRetrievalMessage,
		handleSearchResult,
		searchbarLocationType,
	]);

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

	// forecast retrieval
	useEffect(() => {
		const { latitude, longitude } = searchResult.coords;

		if (typeof latitude !== 'number' || typeof longitude !== 'number') {
			setForecasRetrievalPending(false);
			setForecasRetrievalMessage('');
			return;
		}

		getForecast(searchResult.coords, searchbarUnitsType);
	}, [getForecast, searchResult.coords, searchbarUnitsType]);

	const value: GeolocationContextValue = useMemo(
		() => ({
			// state
			searchbarLocation,
			searchbarLocationType,
			searchbarUnitsType,
			searchResult,
			geolocationRetrievalPending,
			geolocationRetrievalMessage,
			recentSearches,
			isRecentsLoaded,
			forecastData,
			forecastRetrievalPending,
			forecastRetrievalMessage,
			// handlers
			handleSearchbarLocation,
			handleSearchbarLocationType,
			handleSearchbarUnitsType,
			handleSearchResult,
			removeRecentSearch,
			handleGeolocationRetrievalMessage,
		}),
		[
			searchbarLocation,
			searchbarLocationType,
			searchbarUnitsType,
			searchResult,
			geolocationRetrievalPending,
			geolocationRetrievalMessage,
			recentSearches,
			isRecentsLoaded,
			forecastData,
			forecastRetrievalPending,
			forecastRetrievalMessage,
			handleSearchbarLocation,
			handleSearchbarLocationType,
			handleSearchbarUnitsType,
			handleSearchResult,
			removeRecentSearch,
			handleGeolocationRetrievalMessage,
		],
	);

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

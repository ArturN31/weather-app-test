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
import { useRecentSearches } from '../hooks/useRecentSearches';

type LocationType = 'city' | 'postcode';
type UnitsType = 'metric' | 'imperial';

interface GeolocationContextValue {
	searchbarLocation: string;
	searchbarLocationType: LocationType;
	searchbarUnitsType: UnitsType;
	searchResult: SearchResult;
	recentSearches: StoredLocation[];
	isRecentsLoaded: boolean;
	forecastData: DailyForecastOutput | null;
	geolocationStatus: RetrievalStatus;
	forecastStatus: RetrievalStatus;
	handleSearchbarLocation: (location: string) => void;
	handleSearchbarLocationType: (type: LocationType) => void;
	handleSearchbarUnitsType: (type: UnitsType) => void;
	handleSearchResult: (location: string, coords: Coordinates) => void;
	removeRecentSearch: (locationToRemove: string) => void;
	handleGeolocationStatus: (isPending: boolean, message: string) => void;
}

const GeolocationContext = createContext<GeolocationContextValue | undefined>(undefined);

const INVALID_COORDS: Coordinates = { latitude: null, longitude: null };
const INITIAL_SEARCH_RESULT: SearchResult = {
	location: '',
	coords: INVALID_COORDS,
};

const INITIAL_RETRIEVAL_STATUS: RetrievalStatus = {
	isPending: false,
	message: '',
};

export const GeolocationSearchProvider = ({ children }: { children: ReactNode }) => {
	// state
	const [searchbarLocation, setSearchbarLocation] = useState<string>('');
	const [searchbarLocationType, setSearchbarLocationType] =
		useState<LocationType>('city');
	const [searchbarUnitsType, setSearchbarUnitsType] = useState<UnitsType>('metric');
	const [searchResult, setSearchResult] = useState<SearchResult>(INITIAL_SEARCH_RESULT);
	const [recentSearches, setRecentSearches, isRecentsLoaded] = useRecentSearches<
		StoredLocation[]
	>('recent_location_searches', []);

	const [forecastData, setForecastData] = useState<DailyForecastOutput | null>(null);

	const [geolocationStatus, setGeolocationStatus] = useState<RetrievalStatus>(
		INITIAL_RETRIEVAL_STATUS,
	);
	const [forecastStatus, setForecastStatus] = useState<RetrievalStatus>(
		INITIAL_RETRIEVAL_STATUS,
	);

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

	const handleGeolocationStatus = useCallback((isPending: boolean, message: string) => {
		setGeolocationStatus({ isPending, message });
	}, []);

	// const handleForecastStatus = useCallback((isPending: boolean, message: string) => {
	// 	setForecastStatus({ isPending, message });
	// }, []);

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
			setGeolocationStatus({ isPending: true, message: 'Data retrieval pending.' });

			setForecastData(null);
			setForecastStatus({ isPending: false, message: '' });

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
					setGeolocationStatus({ isPending: false, message: errorMsg });
					handleSearchResult('', INVALID_COORDS);
					return;
				}

				setGeolocationStatus({ isPending: false, message: '' });

				const newCoords: Coordinates = {
					latitude: data.latitude,
					longitude: data.longitude,
				};

				handleSearchResult(location, newCoords);
			} catch (e) {
				console.log(`Error retrieving coordinates: ${e}`);
				setGeolocationStatus({
					isPending: false,
					message: 'A critical network error occurred.',
				});
				handleSearchResult('', INVALID_COORDS);
			}
		},
		[handleSearchResult],
	);

	const getForecast = useCallback(async (coords: Coordinates, toggle: UnitsType) => {
		if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number')
			return;

		setForecastStatus({ isPending: true, message: 'Data retrieval pending.' });

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
				setForecastStatus({ isPending: false, message: errorMsg });
				return;
			}

			setForecastData(data);
			setForecastStatus({ isPending: false, message: '' });
		} catch (e) {
			console.log(`Error retrieving forecast: ${e}`);
			setForecastStatus({
				isPending: false,
				message: 'A critical network error occured.',
			});
			setForecastData(null);
		}
	}, []);

	// handling coordinates retrieval
	useEffect(() => {
		const location = searchbarLocation.trim();

		if (!location || location.length < 3) {
			handleSearchResult('', INVALID_COORDS);

			if (!location) {
				setGeolocationStatus({ isPending: false, message: 'Please enter a location.' });
			} else {
				setGeolocationStatus({
					isPending: false,
					message: 'Enter at least 3 characters for a location',
				});
			}

			return;
		}

		handleSearchResult('', INVALID_COORDS);
		getCoordinates(location, searchbarLocationType);
	}, [searchbarLocation, getCoordinates, handleSearchResult, searchbarLocationType]);

	// storage update
	useEffect(() => {
		const { location, coords } = searchResult;
		const { latitude, longitude } = coords;

		if (!location || typeof latitude !== 'number' || typeof longitude !== 'number')
			return;

		if (location !== searchbarLocation) {
			console.warn(
				`Ignoring stale search result for storage: ${location}. Current input: ${searchbarLocation}`,
			);
			return;
		}

		setForecastStatus({ isPending: false, message: '' });

		updateRecentSearches({
			location: location,
			toggle: searchbarLocationType,
			coords: coords,
		});
	}, [searchbarLocation, searchbarLocationType, updateRecentSearches, searchResult]);

	// forecast retrieval
	useEffect(() => {
		const { latitude, longitude } = searchResult.coords;

		if (typeof latitude !== 'number' || typeof longitude !== 'number') {
			setForecastStatus({ isPending: false, message: '' });
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
			recentSearches,
			isRecentsLoaded,
			forecastData,
			forecastStatus,
			geolocationStatus,
			// handlers
			handleSearchbarLocation,
			handleSearchbarLocationType,
			handleSearchbarUnitsType,
			handleSearchResult,
			removeRecentSearch,
			handleGeolocationStatus,
		}),
		[
			searchbarLocation,
			searchbarLocationType,
			searchbarUnitsType,
			searchResult,
			recentSearches,
			isRecentsLoaded,
			forecastData,
			geolocationStatus,
			forecastStatus,
			handleSearchbarLocation,
			handleSearchbarLocationType,
			handleSearchbarUnitsType,
			handleSearchResult,
			removeRecentSearch,
			handleGeolocationStatus,
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

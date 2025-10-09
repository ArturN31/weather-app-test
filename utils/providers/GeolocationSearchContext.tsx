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

interface GeolocationContextValue {
	searchbarLocation: string;
	searchbarLocationType: 'city' | 'postcode';
	searchLocationCoordinates: Coordinates;
	geolocationRetrievalPending: boolean;
	geolocationRetrievalMessage: string;
	handleSearchbarLocation: (location: string) => void;
	handleSearchbarLocationType: (type: 'city' | 'postcode') => void;
	handleLocationCoordinates: (location: Coordinates) => void;
}

const GeolocationContext = createContext<GeolocationContextValue | undefined>(undefined);

export const GeolocationSearchProvider = ({ children }: { children: ReactNode }) => {
	// state
	const [searchbarLocation, setSearchbarLocation] = useState<string>('');
	const [searchbarLocationType, setSearchbarLocationType] = useState<'city' | 'postcode'>(
		'city',
	);
	const [searchLocationCoordinates, setSearchLocationCoordinates] = useState<Coordinates>(
		{ latitude: null, longitude: null },
	);
	const [geolocationRetrievalPending, setGeolocationRetrievalPending] = useState(false);
	const [geolocationRetrievalMessage, setGeolocationRetrievalMessage] = useState('');

	const debouncedLocation = useDebounce(searchbarLocation, 500);

	// handlers
	const handleSearchbarLocation = (location: string) => setSearchbarLocation(location);

	const handleSearchbarLocationType = (type: 'city' | 'postcode') =>
		setSearchbarLocationType(type);

	const handleLocationCoordinates = useCallback(
		(location: Coordinates) => setSearchLocationCoordinates(location),
		[],
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

				if (!response.ok) {
					const errorMsg =
						data.message || `Server error: ${response.status} ${response.statusText}`;
					setGeolocationRetrievalMessage(errorMsg);
					return undefined;
				}

				if (data.message) {
					setGeolocationRetrievalMessage(data.message);
					return undefined;
				}

				setGeolocationRetrievalMessage('');

				handleLocationCoordinates({
					latitude: data.latitude,
					longitude: data.longitude,
				});
			} catch (e) {
				console.log(`Error retrieving coordinates: ${e}`);
				setGeolocationRetrievalMessage('A critical network error occurred.');
			} finally {
				setGeolocationRetrievalPending(false);
			}
		},
		[handleLocationCoordinates],
	);

	useEffect(() => {
		const location = debouncedLocation.trim();

		if (!location) {
			setGeolocationRetrievalMessage('Please enter a location.');
			return;
		}

		getCoordinates(location, searchbarLocationType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedLocation, getCoordinates]);

	const value = {
		// state
		searchbarLocation,
		searchbarLocationType,
		searchLocationCoordinates,
		geolocationRetrievalPending,
		geolocationRetrievalMessage,
		// handlers
		handleSearchbarLocation,
		handleSearchbarLocationType,
		handleLocationCoordinates,
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

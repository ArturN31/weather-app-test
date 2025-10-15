import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGeolocationSearch } from '../providers/GeolocationSearchContext';

export const useSearchbarLogic = () => {
	const {
		searchbarLocation,
		searchbarLocationType,
		geolocationStatus,
		handleSearchbarLocation,
		handleGeolocationStatus,
	} = useGeolocationSearch();

	const [autocompleteState, setAutocompleteState] = useState<{
		allLocations: Location[];
		locationsRetrievalPending: boolean;
	}>({
		allLocations: [],
		locationsRetrievalPending: false,
	});

	const [localInput, setLocalInput] = useState(searchbarLocation);
	const [suggestionHidden, setSuggestionHidden] = useState(false);

	const handleSearchSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const trimmedInput = localInput.trim();
			if (trimmedInput.length > 0) {
				handleSearchbarLocation(trimmedInput);
				setSuggestionHidden(true);
			}
		},
		[localInput, handleSearchbarLocation],
	);

	const handleSuggestionClick = useCallback(
		(locationName: string) => {
			handleSearchbarLocation(locationName);
			setSuggestionHidden(true);
		},
		[handleSearchbarLocation],
	);

	const handleInputChange = useCallback((value: string) => {
		setLocalInput(value);
		setSuggestionHidden(false);
	}, []);

	const fetchLocations = useCallback(async () => {
		if (searchbarLocationType !== 'city') return;

		if (searchbarLocation.trim().length < 3) {
			setAutocompleteState((prev) => ({
				...prev,
				locationsRetrievalPending: false,
			}));
			// DO NOT call handleGeolocationStatus(false, '') here,
			// as it will immediately clear the "Please enter a location" message
			// set by the provider's useEffect.
			return;
		}

		setAutocompleteState((prev) => ({
			...prev,
			locationsRetrievalPending: true,
		}));
		handleGeolocationStatus(false, '');

		try {
			const response = await fetch('/api/locations');

			if (!response.ok) {
				setAutocompleteState({
					allLocations: [],
					locationsRetrievalPending: false,
				});
				handleGeolocationStatus(false, 'Failed to fetch locations for autocomplete.');
				return;
			}

			const data: Location[] = await response.json();
			setAutocompleteState({
				allLocations: data,
				locationsRetrievalPending: false,
			});
			handleGeolocationStatus(false, '');
		} catch (error) {
			console.error('Error fetching locations for autocomplete:', error);
			setAutocompleteState((prev) => ({
				...prev,
				locationsRetrievalPending: false,
			}));
			handleGeolocationStatus(false, `Error fetching locations: ${error}`);
		}
	}, [handleGeolocationStatus, searchbarLocation, searchbarLocationType]);

	const SUGGESTIONS_OUTPUT_LIMIT = 8;
	const suggestions = useMemo(() => {
		const query = localInput.toLowerCase().trim();

		if (
			searchbarLocationType !== 'city' ||
			autocompleteState.locationsRetrievalPending ||
			query.length < 2
		)
			return [];

		return autocompleteState.allLocations
			.filter((location) => location.name.toLowerCase().startsWith(query))
			.slice(0, SUGGESTIONS_OUTPUT_LIMIT);
	}, [localInput, searchbarLocationType, autocompleteState]);

	const showSuggestions =
		suggestions.length > 0 && !geolocationStatus.isPending && !suggestionHidden;

	const currentPlaceholder = `Enter ${
		searchbarLocationType === 'city' ? 'City Name' : 'Postcode'
	}...`;

	const isInputDisabled =
		geolocationStatus.isPending ||
		(searchbarLocationType === 'city' && autocompleteState.locationsRetrievalPending);

	const isSubmitDisabled = localInput.trim().length === 0 || isInputDisabled;

	useEffect(() => {
		if (searchbarLocation !== localInput) setLocalInput(searchbarLocation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchbarLocation]);

	useEffect(() => {
		fetchLocations();
	}, [fetchLocations]);

	return {
		// state
		localInput,
		suggestions,
		showSuggestions,
		currentPlaceholder,
		isInputDisabled,
		isSubmitDisabled,
		// handlers
		handleSearchSubmit,
		handleSuggestionClick,
		handleInputChange,
		// context Values
		geolocationStatus,
		searchbarLocationType,
		searchbarLocation,
	};
};

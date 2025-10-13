import { GenericToggle } from '@/components/GenericToggle';
import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export interface ToggleOption<T extends string> {
	value: T;
	label: string;
}
type LocationType = 'city' | 'postcode';

const LOCATION_OPTIONS: [ToggleOption<LocationType>, ToggleOption<LocationType>] = [
	{ value: 'city', label: 'City' },
	{ value: 'postcode', label: 'Postcode' },
];

export const SearchbarLocationToggle = () => {
	const { searchbarLocationType, handleSearchbarLocation, handleSearchbarLocationType } =
		useGeolocationSearch();

	const handleLocationSelect = async (toggle: LocationType) => {
		await handleSearchbarLocation('');
		await handleSearchbarLocationType(toggle);
	};

	return (
		<GenericToggle<LocationType>
			options={LOCATION_OPTIONS}
			selectedValue={searchbarLocationType as LocationType}
			onSelect={handleLocationSelect}
			ariaLabel='Select search type'
		/>
	);
};

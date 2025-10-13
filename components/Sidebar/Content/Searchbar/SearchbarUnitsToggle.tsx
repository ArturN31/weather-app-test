import { GenericToggle } from '@/components/GenericToggle';
import { useGeolocationSearch } from '@/utils/providers/GeolocationSearchContext';

export interface ToggleOption<T extends string> {
	value: T;
	label: string;
}
type UnitsType = 'metric' | 'imperial';

const LOCATION_OPTIONS: [ToggleOption<UnitsType>, ToggleOption<UnitsType>] = [
	{ value: 'metric', label: 'Metric (C°)' },
	{ value: 'imperial', label: 'Imperial (F°)' },
];

export const SearchbarUnitsToggle = () => {
	const { searchbarUnitsType, handleSearchbarLocation, handleSearchbarUnitsType } =
		useGeolocationSearch();

	const handleLocationSelect = async (toggle: UnitsType) => {
		await handleSearchbarLocation('');
		await handleSearchbarUnitsType(toggle);
	};

	return (
		<GenericToggle<UnitsType>
			options={LOCATION_OPTIONS}
			selectedValue={searchbarUnitsType as UnitsType}
			onSelect={handleLocationSelect}
			ariaLabel='Select search type'
		/>
	);
};

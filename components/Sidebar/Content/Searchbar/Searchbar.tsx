import { SearchbarInput } from './SearchbarInput';
import { SearchbarLocationToggle } from './SearchbarLocationToggle';
import { SearchbarUnitsToggle } from './SearchbarUnitsToggle';

export const Searchbar = () => {
	return (
		<div
			className='grid gap-3'
			role='search'>
			<SearchbarInput />
			<SearchbarLocationToggle />
			<SearchbarUnitsToggle />
		</div>
	);
};

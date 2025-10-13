import { SearchbarToggle } from './SearchbarToggle';
import { SearchbarInput } from './SearchbarInput';

export const Searchbar = () => {
	return (
		<div
			className='grid gap-3'
			role='search'>
			<SearchbarInput />
			<SearchbarToggle />
		</div>
	);
};

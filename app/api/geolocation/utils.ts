export const prepGeolocationApiUrl = (
	queryToggle: 'city' | 'postcode',
	locationQuery: string,
	apiKey: string,
) => {
	const baseUrl = 'http://api.openweathermap.org/geo/1.0';
	const countryCode = 'GB';
	const outputLimit = 1;
	const encodedLocationQuery = encodeURIComponent(locationQuery);

	if (queryToggle.toLocaleLowerCase() === 'city') {
		return `${baseUrl}/direct?q=${encodedLocationQuery},,${countryCode}&limit=${outputLimit}&appid=${apiKey}`;
	}

	if (queryToggle.toLocaleLowerCase() === 'postcode')
		return `${baseUrl}/zip?zip=${encodedLocationQuery},${countryCode}&appid=${apiKey}`;

	throw new Error('Invalid queryToggle value reached internal logic.');
};

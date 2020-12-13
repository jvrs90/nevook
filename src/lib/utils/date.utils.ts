export const parseDate_US_ES = (birthDate: string): string => {
	const dateArray = birthDate.split('/');
	const day = dateArray.splice(0, 1)[0];

	dateArray.splice(1, 0, day);
	return dateArray.join('/');
};

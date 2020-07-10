// This command take in a string and attempts to convert it into a date
// first tries to convert a JavaScript Date
// then tries a unix timestamp

export default (input: string | number): number => {
	const numFromInput = Number(input);

	let dateString: Date;

	if (Object.is(NaN, numFromInput)) {
		// Input is not a number
		dateString = new Date(input);
	} else {
		// Input is number
		dateString = new Date(numFromInput);
	}

	if (Object.is(NaN, dateString.valueOf())) {
		// Invalid Date
		return 0;
	} else {
		return dateString.getTime();
	}
};

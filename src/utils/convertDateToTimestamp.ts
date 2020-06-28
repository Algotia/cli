import { format, parseISO } from "date-fns";

// This command take in a string and attempts to convert it into a date
// it first tries to parse an ISO 8601 string
// then it tries to parse a node.js Date string
// finally, it tries tries to parse a unix timestamp

// should probably create an interface for this
const convert = (input: any) => {
	const unixString = new Date(parseInt(input));
	const dateString = new Date(input);
	const isoString = parseISO(input);

	let parsedInput: number | Date;

	if (isoString.valueOf()) {
		parsedInput = isoString;
	} else if (dateString.valueOf()) {
		parsedInput = dateString;
	} else if (unixString.valueOf()) {
		parsedInput = unixString;
	}

	return format(parsedInput, "T");
};

export default convert;

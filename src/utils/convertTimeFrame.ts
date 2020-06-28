// This function takes in an exchange timeframe (e.g. 1m, 5m, 1h, 1d, etc.)
// and converts it into an object e.g. { unit: "minute", amount: 1}
enum Unit {
	Minute = "minute",
	Hour = "hour",
	Day = "day",
	Week = "week"
}

export default (timeframe: string): { unit: Unit; amount: number } => {
	const amount: number = parseInt(timeframe.replace(/[^0-9\.]+/g, ""));

	let unit: Unit;

	switch (timeframe.replace(/[0-9]/g, "")) {
		case "m":
			unit = Unit.Minute;
			break;
		case "h":
			unit = Unit.Hour;
			break;
		case "d":
			unit = Unit.Day;
			break;
		case "w":
			unit = Unit.Week;
			break;
	}

	return { unit, amount };
};

export default (optionsGiven: Object, possibleQuestions: Object): any[] => {
	let quetionsToAsk = [];
	let keys = Object.keys(optionsGiven);
	keys.forEach((key) => {
		if (!optionsGiven[key]) quetionsToAsk.push(possibleQuestions[key]);
	});
	return quetionsToAsk;
};

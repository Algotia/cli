const getQuestionsToAsk = (
	optionsGiven: Object,
	possibleQuestions: Object
): any[] => {
	let quetionsToAsk = [];
	const possibleQuestionsnNames = Object.keys(possibleQuestions);

	possibleQuestionsnNames.forEach((key) => {
		if (!optionsGiven[key]) quetionsToAsk.push(possibleQuestions[key]);
	});

	return quetionsToAsk;
};

export default getQuestionsToAsk;

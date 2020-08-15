import fuzzy from "fuzzy";
import { createWizard } from "../factories";
import { PossibleQuestionns, Wizard } from "../../types";
import { log, connectAndGetBackfillCollection } from "../../utils";

const backfillsWizard: Wizard = async (bootData, answersGiven) => {
	try {
		const questionsObj: PossibleQuestionns = {
			pretty: {
				type: "list",
				name: "pretty",
				message: "Would you like pretty output?",
				choices: [
					{
						name: "Yes",
						value: true
					},
					{
						name: "No",
						value: false
					}
				]
			}
		};
		const wizard = createWizard(answersGiven, questionsObj);

		return wizard;
	} catch (err) {
		log.error(err);
	}
};

export default backfillsWizard;

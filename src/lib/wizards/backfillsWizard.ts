import fuzzy from "fuzzy";
import { createWizard } from "../factories";
import { PossibleQuestionns, Wizard } from "../../types";
import { log } from "../../utils";

const backfillsWizard: Wizard = async (bootData, answersGiven) => {
	try {
		const { db } = bootData;

		const backfillsCursor = db
			.collection("backfill")
			.find({}, { projection: { _id: 0 } });
		const backfillsArr = await backfillsCursor.toArray();
		const backfillNames = backfillsArr.map((fill) => fill.name);

		const searchBackfills = async (answers: string, input: string) => {
			input = input || "";
			let fuzzyRes = fuzzy.filter(input, backfillNames);
			return fuzzyRes.map((el) => el.original);
		};

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

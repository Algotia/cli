import { Answers } from "inquirer";
import fuzzy from "fuzzy";
import path from "path";
import { createWizard } from "../factories";
import { PossibleQuestionns, BootData } from "../../types";
import { log } from "../../utils";

const backtestWizard = async (bootData: BootData, answersGiven: Answers) => {
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
			dataSet: {
				type: "autocomplete",
				name: "dataSet",
				message:
					"Which data set would you like to test your strategy against: ",
				source: searchBackfills
			},
			strategy: {
				type: "fuzzypath",
				name: "strategy",
				excludePath: (nodePath: string) => {
					if (nodePath.includes("node_modules"))
						return nodePath.includes("node_modules");
					if (nodePath.includes(".git")) return nodePath.includes(".git");
				},
				filter: async (strategyPath: string) => {
					try {
						const strat = await import(path.join(process.cwd(), strategyPath));
						return strat.default;
					} catch (err) {
						log.error(err);
					}
				},
				excludeFilter: (nodePath: string) => nodePath == ".",
				itemType: "file",
				message: "Select the path to your strategy: ",
				suggestOnly: false,
				depthLimit: 8
			}
		};

		const wizard = createWizard(answersGiven, questionsObj);

		return wizard;
	} catch (err) {
		log.error(err);
	}
};

export default backtestWizard;

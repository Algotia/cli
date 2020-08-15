import { Answers } from "inquirer";
import fuzzy from "fuzzy";
import path from "path";
import { createWizard } from "../factories";
import { PossibleQuestionns, BootData } from "../../types";
import { log, connectAndGetBackfillCollection } from "../../utils";

const backtestWizard = async (bootData: BootData, answersGiven: Answers) => {
	try {
		const backfillCollection = await connectAndGetBackfillCollection(bootData);
		const backfillsCursor = backfillCollection.find(
			{},
			{ projection: { _id: 0 } }
		);
		const backfillsArr = await backfillsCursor.toArray();
		const backfillNames = backfillsArr.map((fill) => fill.name);

		const searchBackfills = async (answers: Answers, input: string) => {
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
				rootPath: process.cwd(),
				excludeFilter: (nodePath: string) =>
					nodePath
						.slice(process.cwd().length + 1)
						.startsWith("node_modules" || "."),
				filter: async (strategyPath: string) => {
					const req = require("esm")(module);
					const strategy = req(path.resolve(strategyPath));
					if (strategy.default) {
						return strategy.default;
					} else {
						return strategy;
					}
				},
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

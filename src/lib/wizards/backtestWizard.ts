import inquirer from "inquirer";
import fuzzy from "fuzzy";
import path from "path";
import { BacktestOtions } from "@algotia/core";
import { getQuestionsToAsk, connectToDb } from "../../utils";

interface Anwers {
	dataSetName: string;
	strategyPath: string;
}

export default async (backtestOptions: any): Promise<BacktestOtions> => {
	const client = await connectToDb();
	const db = client.db("algotia");
	const allBackfills = db.collection("backfill").find({});
	const backfills = await allBackfills.toArray();
	const backfillNames = backfills.map((fill) => fill.name);

	inquirer.registerPrompt("fuzzypath", await require("inquirer-fuzzy-path"));
	inquirer.registerPrompt(
		"autocomplete",
		await require("inquirer-autocomplete-prompt")
	);

	const searchBackfills = async (asnwers, input) => {
		try {
		} catch (err) {
			return Promise.reject(err);
		}
		input = input || "";
		let fuzzyRes = fuzzy.filter(input, backfillNames);
		return fuzzyRes.map((el) => el.original);
	};

	const questionsObj = {
		dataSet: {
			type: "autocomplete",
			name: "dataSetName",
			message: "Which data set would you like to test your strategy against: ",
			source: searchBackfills
		},
		strategy: {
			type: "fuzzypath",
			name: "strategyPath",
			excludePath: (nodePath: string) => {
				if (nodePath.includes("node_modules"))
					return nodePath.includes("node_modules");
				if (nodePath.includes(".git")) return nodePath.includes(".git");
			},
			excludeFilter: (nodePath) => nodePath == ".",
			itemType: "file",
			message: "Select the path to your strategy: ",
			suggestOnly: false,
			depthLimit: 8
		}
	};

	const quetionsToAsk = getQuestionsToAsk(backtestOptions, questionsObj);

	const answers: Anwers = await inquirer.prompt(quetionsToAsk);

	const { dataSetName, strategyPath } = answers;
	const processedAnswers: BacktestOtions = {
		strategy: await require(path.join(process.cwd(), strategyPath)),
		dataSet: dataSetName
	};

	return processedAnswers;
};

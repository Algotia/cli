import inquirer from "inquirer";
import fuzzy from "fuzzy";
import { Exchange } from "ccxt";
import { BackfillOptions } from "../../types/commands";
import { getQuestionsToAsk } from "../../utils/index";

export default async (
	opts: BackfillOptions,
	exchange: Exchange
): Promise<BackfillOptions> => {
	try {
		// Register inquirer plugins
		inquirer.registerPrompt("datepicker", await require("inquirer-datepicker"));
		inquirer.registerPrompt(
			"autocomplete",
			await require("inquirer-autocomplete-prompt")
		);

		// Get variables for questions
		const tickers = await exchange.fetchTickers();
		const allTickers = [];
		for (let ticker in tickers) {
			allTickers.push(ticker);
		}

		// Search functions
		const searchPairs = async (answers, input) => {
			input = input || "";
			let fuzzyRes = fuzzy.filter(input, allTickers);
			return fuzzyRes.map((el) => el.original);
		};

		// Object of possible questions to ask
		const questionsObj = {
			since: {
				type: "datepicker",
				name: "since",
				message: "Select the date you would like to backfill from:",
				format: ["Y", "/", "MM", "/", "DD", " ", "HH", ":", "mm", ":", "ss"]
			},
			until: {
				type: "datepicker",
				name: "until",
				message:
					"Select the date you would like to backfill until: \n Default is current exchange time.",
				format: ["Y", "/", "MM", "/", "DD", " ", "HH", ":", "mm", ":", "ss"],
				default: new Date(Number(exchange.milliseconds().toString(10)))
			},
			period: {
				type: "list",
				name: "period",
				message: "Which period would you like to fetch data for?",
				choices: Object.values(exchange.timeframes)
			},
			pair: {
				type: "autocomplete",
				name: "pair",
				message: "Which pair would you like to fetch data for: ",
				source: searchPairs
			},
			limit: {
				type: "input",
				name: "limit"
			},
			documentName: {
				type: "input",
				name: "documentName"
			}
		};

		// If user passed command line arg for a value, don't ask a question for it.
		const quetionsToAsk = getQuestionsToAsk(opts, questionsObj);

		const answers: BackfillOptions = await inquirer.prompt(quetionsToAsk);

		return answers;
	} catch (err) {
		return Promise.reject(err);
	}
};

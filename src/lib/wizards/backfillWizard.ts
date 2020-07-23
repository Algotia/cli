import fuzzy from "fuzzy";
import createWizard from "../factories/createWizard";
import { log } from "../../utils";
import { BootData } from "@algotia/core";

const backfillWizard = async (bootData: BootData, answersGiven) => {
	try {
		const { exchange } = bootData;

		const tickers = await exchange.fetchTickers();
		const allTickers = [];
		for (let ticker in tickers) {
			allTickers.push(ticker);
		}

		// filter
		const periodFilter = async (period: string | number) => {
			const str = period.toString();
			return str.toLowerCase();
		};

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
				format: ["yyyy", "/", "mm", "/", "dd", " ", "HH", ":", "MM", ":", "ss"],
				inital: new Date().toJSON()
			},
			until: {
				type: "datepicker",
				name: "until",
				message:
					"Select the date you would like to backfill until: \n Default is current exchange time.",
				format: ["yyyy", "/", "mm", "/", "dd", " ", "HH", ":", "MM", ":", "ss"],
				default: new Date(Number(exchange.milliseconds().toString(10))).toJSON()
			},
			period: {
				type: "list",
				name: "period",
				message: "Which period would you like to fetch data for?",
				choices: Object.values(exchange.timeframes),
				filter: periodFilter
			},
			pair: {
				type: "autocomplete",
				name: "pair",
				message: "Which pair would you like to fetch data for: ",
				source: searchPairs
			},
			recordLimit: {
				type: "input",
				name: "recordLimit",
				message: "What is the record limit you would like to set?"
			},
			documentName: {
				type: "input",
				name: "documentName",
				message: "Would you like to name this backfill?"
			}
		};

		const wizard = createWizard(answersGiven, questionsObj);

		return wizard;
	} catch (err) {
		log.error(err);
	}
};

export default backfillWizard;

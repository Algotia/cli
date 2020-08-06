import fuzzy from "fuzzy";
import createWizard from "../factories/createWizard";
import { log, connectAndGetBackfillCollection } from "../../utils";
import { BootData } from "@algotia/core";
import { Collection } from "mongodb";

const backfillWizard = async (bootData: BootData, answersGiven: Object) => {
	try {
		const { exchange } = bootData;

		const backfillCollection = await connectAndGetBackfillCollection(bootData);

		const tickers = await exchange.fetchTickers();
		const allTickers = Object.keys(tickers);

		const getDefaultDocumentName = async (backfillCollection: Collection) => {
			const backfillCount = await backfillCollection.countDocuments();

			return `backfill-${backfillCount + 1}`;
		};

		const defaultDocumentName = await getDefaultDocumentName(
			backfillCollection
		);

		// filter
		const periodFilter = async (period: string | number) => {
			const str = period.toString();
			return str.toLowerCase();
		};

		// Search functions
		const searchPairs = async (answers: any, input: string) => {
			input = input || "";
			let fuzzyRes = fuzzy.filter(input, allTickers);
			return fuzzyRes.map((el) => el.original);
		};

		// validators

		const validateDocumentName = async (input: string | number) => {
			const backfillExists = await backfillCollection.findOne({ name: input });

			if (backfillExists)
				return `Backfill named ${input} already exists in the database.`;
			return true;
		};

		const validateRecordLimit = (input: any) => {
			if (typeof Number(input) === "number") return true;
			return "Record limit must be a number";
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
				choices: Object.keys(exchange.timeframes),
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
				message: "What is the record limit you would like to set?",
				// TODO: change default to a dynamic value -- should be set in CCXT
				// wrapper (core package)
				default: 10000,
				validate: validateRecordLimit
			},
			documentName: {
				type: "input",
				name: "documentName",
				message: "Would you like to name this backfill?",
				validate: validateDocumentName,
				default: defaultDocumentName
			},
			verbose: {
				type: "confirm",
				name: "verbose",
				message: "Would you like verbose output?"
			}
		};

		const wizard = createWizard(answersGiven, questionsObj);

		return wizard;
	} catch (err) {
		log.error(err);
	}
};

export default backfillWizard;

import { convertDateToTimestamp } from "../utils/index";
import backfillCommand from "./commands/backfill";
import backfillsCommand from "./commands/backfills";
import { program } from "commander";
const packageJson = require("../../package.json");

// argument parsers
const pInt = (str: string) => parseInt(str, 10);
const pDate = (str: string) => convertDateToTimestamp(str);

// should create an interface for this
export default (bootData) => {
	const { exchange } = bootData;
	program.version(packageJson.version);

	program
		.command("backfill")
		.description("backfill historical data")
		.requiredOption(
			"-s, --since <since>",
			"Unix timestamp (ms) of time to retrieve records from",
			pDate
		)
		.requiredOption("-p, --pair <pair>", "Pair to retrieve records for")
		.option("-P, --period <period>", "Timeframe to retrieve records for", "1m")
		.option(
			"-u, --until <until>",
			"Unix timestamp (ms) of time to retrieve records to",
			pDate,
			// default argument is server time in MS
			exchange.milliseconds()
		)
		.option(
			"-l, --limit <limit>",
			"Number of records to retrieve at one time",
			pInt,
			10
		)
		.option(
			"-n, --collection-name <collectionName>",
			"name for database refrence",
			undefined
		)
		.action(async (options) => {
			const {
				since,
				pair,
				period,
				until,
				limit,
				collectionName
			}: {
				since: number;
				pair: string;
				period: string;
				until: number;
				limit: number;
				collectionName: string;
			} = options;

			const opts = {
				since,
				pair,
				period,
				until,
				recordLimit: limit,
				name: collectionName
			};

			await backfillCommand(exchange, opts);
		});

	// Output of algotia -h should be backfills [command] but is not.
	program
		.command("backfills <command>")
		.description("Read, update, and delete backfill documents")
		.command("list [documentName]")
		.description(
			"Print backfill document(s), when called with no arguments, will print all documents (metadata only)."
		)
		.option("-p, --pretty", "Print (only) metadata in a pretty table", false)
		.action(async (documentName, options) => {
			const { pretty } = options;
			if (documentName) {
				await backfillsCommand.listOne(documentName, pretty);
			} else {
				await backfillsCommand.listAll(pretty);
			}
		});

	program.parse(process.argv);
};

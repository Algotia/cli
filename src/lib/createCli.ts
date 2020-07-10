import {
	backfill as backfillCommand,
	backfills as backfillsCommand,
	BackfillOptions,
	ListOptions,
	DeleteOptions
} from "@algotia/core";
import listPairsCommand from "./commands/list-pairs";
import { program } from "commander";
import { confirmDangerous, bail } from "../utils/index";
const packageJson = require("../../package.json");

// argument parsers
const pInt = (str: string) => parseInt(str, 10);

// should create an interface for this
export default (bootData) => {
	const { exchange, config } = bootData;
	program.version(packageJson.version);

	program
		.command("backfill")
		.description("backfill historical data")
		.requiredOption(
			"-s, --since <since>",
			"Unix timestamp (ms) of time to retrieve records from"
		)
		.requiredOption("-p, --pair <pair>", "Pair to retrieve records for")
		.option("-P, --period <period>", "Timeframe to retrieve records for", "1m")
		.option(
			"-u, --until <until>",
			"Unix timestamp (ms) of time to retrieve records to",
			// default argument is server time in MS
			exchange.milliseconds()
		)
		.option(
			"-l, --limit <limit>",
			"Number of records to retrieve at one time",
			pInt,
			100
		)
		.option(
			"-n, --document-name <documentName>",
			"name for database refrence",
			undefined
		)
		.action(async (options) => {
			try {
				const { verbose } = program;
				const { since, pair, period, until, limit, documentName } = options;

				const opts: BackfillOptions = {
					sinceInput: since,
					untilInput: until,
					pair,
					period,
					recordLimit: limit,
					documentName: documentName,
					verbose: verbose
				};

				await backfillCommand(exchange, opts);
			} catch (err) {
				return Promise.reject(new Error(err));
			}
		});

	// Output of algotia -h should be backfills [command] but is not.
	const backfills = program
		.command("backfills <command>")
		.description("Read, update, and delete backfill documents");

	backfills
		.command("list [documentName]")
		.description(
			"Print backfill document(s), when called with no arguments, will print all documents (metadata only)."
		)
		.option("-p, --pretty", "Print (only) metadata in a pretty table", false)
		.action(async (documentName, options) => {
			try {
				const { pretty } = options;
				const backfillsOptions: ListOptions = {
					pretty
				};
				if (documentName) {
					await backfillsCommand.listOne(documentName, backfillsOptions);
				} else {
					await backfillsCommand.listAll(backfillsOptions);
				}
			} catch (err) {
				return Promise.reject(new Error(err));
			}
		});

	backfills
		.command("delete [documentName]")
		.description(
			"Deletes document(s), if no name passed then deletes all documents."
		)
		.action(async (documentName, options) => {
			try {
				const { verbose } = options;
				const deleteOptions: DeleteOptions = {
					verbose
				};

				const proceed = await confirmDangerous();
				if (proceed) {
					if (documentName) {
						await backfillsCommand.deleteOne(documentName, deleteOptions);
					} else {
						await backfillsCommand.deleteAll(deleteOptions);
					}
				} else {
					bail("Bailing out of deleting all documents.");
				}
			} catch (err) {
				return Promise.reject(new Error(err));
			}
		});

	program
		.command("list-pairs")
		.description(
			"Lists all the valid trading pairs from the exchange in your configuration."
		)
		.option("-v, --verbose")
		.action((options) => {
			listPairsCommand(exchange, options.verbose);
		});

	program.parse(process.argv);
};

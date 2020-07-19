import {
	backfill as backfillCommand,
	backfills as backfillsCommand,
	backtest as backtestCommand,
	// Types
	BacktestOtions,
	BackfillOptions,
	ListOptions,
	DeleteOptions,
	ConfigOptions
} from "@algotia/core";
import { Exchange } from "ccxt";
import path from "path";
import { program } from "commander";

import listPairsCommand from "./commands/list-pairs";
import { backfillWizard, backtestWizard } from "./wizards/index";
import { confirmDangerous, bail, log } from "../utils/index";

const packageJson = require("../../package.json");

// argument parsers
const pInt = (str: string) => parseInt(str, 10);

// should create an interface for this
interface BootData {
	exchange: Exchange;
	config: ConfigOptions;
}
export default async (bootData: BootData) => {
	const { exchange, config } = bootData;

	program.version(packageJson.version);

	// global
	program
		.option("-v, --verbose", "verbose output")
		.option("-c, --config <config>", "Path to configuration file");

	// list-pairs
	program
		.command("list-pairs")
		.description(
			"Lists all the valid trading pairs from the exchange in your configuration."
		)
		.option("-v, --verbose")
		.action(async (options) => {
			try {
				const pairsArr = await listPairsCommand(exchange, options.verbose);
				pairsArr.forEach((pair) => {
					log.info(pair);
				});
			} catch (err) {
				return Promise.reject(err);
			}
		});

	// backfill
	program
		.command("backfill")
		.description("backfill historical data")
		.option(
			"-s, --since <since>",
			"Unix timestamp (ms) of time to retrieve records from"
		)
		.option("-p, --pair <pair>", "Pair to retrieve records for")
		.option("-P, --period <period>", "Timeframe to retrieve records for")
		.option(
			"-u, --until <until>",
			"Unix timestamp (ms) of time to retrieve records to"
			// default argument is server time in MS
		)
		.option(
			"-l, --limit <limit>",
			"Number of records to retrieve at one time",
			pInt
		)
		.option("-n, --document-name <documentName>", "name for database refrence")
		.action(async (options) => {
			try {
				const { verbose } = program;
				const { since, pair, period, until, limit, documentName } = options;
				const wizardOptions = {
					since,
					until,
					pair,
					period,
					limit,
					documentName
				};

				const wizardAnswers = await backfillWizard(wizardOptions, exchange);

				const opts: BackfillOptions = {
					sinceInput: since || wizardAnswers.since,
					untilInput: until || wizardAnswers.until,
					pair: pair || wizardAnswers.pair,
					period: period || wizardAnswers.period,
					recordLimit: limit || wizardAnswers.limit,
					documentName: documentName || wizardAnswers.documentName,
					verbose: verbose
				};

				await backfillCommand(exchange, opts);
			} catch (err) {
				return Promise.reject(new Error(err));
			}
		});

	// backfills <command>
	const backfills = program
		.command("backfills <command>")
		.description("Read, update, and delete backfill documents");

	// backfills list
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

	// backfills delete
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

	// backtest
	program
		.command("backtest")
		.description("Test strategies against historical data")
		.option("-s, --strategy <strategy>", "Path to strategy file.")
		.option("-d, --data-set <dataSet>", "Name of backfillto use.")
		.action(async (options) => {
			try {
				const { strategy, dataSet } = options;
				const wizardOptions = {
					strategy,
					dataSet
				};

				const wizardAnswers = await backtestWizard(wizardOptions);

				const backtestOptions: BacktestOtions = {
					strategy: strategy || wizardAnswers.strategy,
					dataSet: dataSet || wizardAnswers.dataSet
				};
				return await backtestCommand(backtestOptions);
			} catch (err) {
				return Promise.reject(new Error(err));
			}
		});

	program.parse(process.argv);
};

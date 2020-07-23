import { boot, ConfigOptions, BootData } from "@algotia/core";
import commander from "commander";
import { log } from "../../utils";
import { CommandArr, CommandArgs } from "../../types";

const packageJson = require("../../package.json");

const createCli = async (config: ConfigOptions, commandArr: CommandArr) => {
	try {
		const bootData: BootData = await boot(config);
		const { program } = commander;

		const registerCommands = () => {
			commandArr.forEach(async (commandObj) => {
				try {
					const { command, wizard } = commandObj;
					const commandArgs: CommandArgs = {
						bootData,
						program,
						wizard
					};
					await command(commandArgs);
				} catch (err) {
					log.error(err);
				}
			});
		};

		registerCommands();
		program.version(packageJson.version);
		program.parse(process.argv);
	} catch (err) {
		log.error(err);
	}
};

export default createCli;

/*

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
*/

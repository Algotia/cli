import { boot, ConfigOptions, BootData } from "@algotia/core";
import { program } from "commander";
import { log } from "../utils";
import { CommandArr, CommandArgs } from "../types";

const packageJson = require("../../package.json");

const registerCommands = (arr: CommandArr, program, bootData) => {
	arr.forEach(async (commandObj) => {
		try {
			const { command, wizard } = commandObj;
			const commandArgs: CommandArgs = {
				program,
				bootData,
				wizard
			};

			await command(commandArgs);
		} catch (err) {
			log.error(err);
		}
	});
};

const createCli = async (
	config: ConfigOptions,
	commandArr: CommandArr
): Promise<void> => {
	try {
		// Set CLI version to package.json version
		program.version(packageJson.version);

		const bootData: BootData = await boot(config);
		registerCommands(commandArr, program, bootData);

		program.parse(process.argv);
	} catch (err) {
		log.error(err);
	}
};

export default createCli;

/*


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

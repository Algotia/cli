import { log } from "../../utils";
import createCommand from "../factories/createCommand";
import { backtest } from "@algotia/core";
import { CommandOptions, Command } from "../../types";
import { backtestWizard } from "../wizards";

const backfillCommand: Command = async (commandArgs): Promise<void> => {
	try {
		const command = createCommand(commandArgs);

		const options: CommandOptions = [
			["-s, --strategy <strategy>", "Path to strategy file."],
			["-d, --data-set <dataSet>", "Name of backfillto use."],
			["-v, --verbose", "verbose output"]
		];

		command.addCommand("backtest", "Test strategies against historical data.");
		command.addOptions(options);
		command.addWizard(backtestWizard);
		await command.addAction(backtest);
	} catch (err) {
		log.error(err);
	}
};
export default backfillCommand;
//backtest
//program
//.command("backtest")
//.description("Test strategies against historical data")
//.option("-s, --strategy <strategy>", "Path to strategy file.")
//.option("-d, --data-set <dataSet>", "Name of backfillto use.")
//.action(async (options) => {
//try {
//const { strategy, dataSet } = options;
//const wizardOptions = {
//strategy,
//dataSet
//};

//const wizardAnswers = await backtestWizard(wizardOptions);

//const backtestOptions: BacktestOtions = {
//strategy: strategy || wizardAnswers.strategy,
//dataSet: dataSet || wizardAnswers.dataSet
//};
//return await backtestCommand(backtestOptions);
//} catch (err) {
//return Promise.reject(new Error(err));
//}
//});

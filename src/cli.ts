import { getConfig, log } from "./utils/index";
import createCli from "./lib/createCli";
import { backfill, backtest, backfills, listPairs } from "./lib/commands";
import { backfillWizard, backtestWizard, backfillsWizard } from "./lib/wizards";
import { CommandArr, ConfigOptions } from "./types";

(async () => {
	try {
		const commands: CommandArr = [
			{
				command: backfill,
				wizard: backfillWizard
			},
			{
				command: backtest,
				wizard: backtestWizard
			},
			{
				command: backfills,
				wizard: backfillsWizard
			},
			{
				command: listPairs
			}
		];
		const userConfig: ConfigOptions = await getConfig();

		await createCli(userConfig, commands);
	} catch (err) {
		log.error(err);
	}
})();

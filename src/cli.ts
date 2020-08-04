import { getConfig, log } from "./utils/index";
import createCli from "./lib/factories/createCli";
import { backfill, backtest, backfills, listPairs } from "./lib/commands";
import { CommandArr, ConfigOptions } from "./types";

(async () => {
	try {
		const commands: CommandArr = [backfill, backtest, backfills, listPairs];
		const userConfig: ConfigOptions = await getConfig();

		await createCli(userConfig, commands);
	} catch (err) {
		log.error(err);
	}
})();

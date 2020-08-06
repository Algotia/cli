import { BootData, boot } from "@algotia/core";
import { program } from "commander";
import { getConfig, log } from "./utils/index";
import { backfill, backtest, backfills, listPairs } from "./lib/commands";
import { CommandArr, ConfigOptions, CommandArgs } from "./types";

const packageJson = require("../package.json");

(async () => {
	try {
		const commands: CommandArr = [backfill, backtest, backfills, listPairs];
		const userConfig: ConfigOptions = await getConfig();

		const bootData: BootData = await boot(userConfig);

		commands.forEach(async (command) => {
			try {
				const commandArgs: CommandArgs = {
					bootData,
					program
				};
				await command(commandArgs);
			} catch (err) {
				log.error(err);
			}
		});

		program.version(packageJson.version);
		program.parse(process.argv);
	} catch (err) {
		log.error(err);
	}
})();

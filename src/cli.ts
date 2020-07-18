import { boot, BootOptions, ConfigOptions } from "@algotia/core";
import yargs from "yargs-parser";
import log from "fancy-log";
import { getConfig } from "./utils/index";
import createCli from "./lib/createCli";

(async () => {
	try {
		const argv = yargs(process.argv.slice(1));

		const configPath = argv.config || argv.c || false;
		const verbose = argv.verbose || argv.v || false;

		const userConfig: ConfigOptions = await getConfig({
			configPath,
			verbose
		});

		const bootOptions: BootOptions = {
			verbose
		};

		const bootData = await boot(userConfig, bootOptions);

		createCli(bootData);
	} catch (err) {
		log.error(err);
	}
})();

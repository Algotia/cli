import { boot, BootOptions } from "@algotia/core";
import { getConfig } from "./utils/index";
import program from "commander";
import createCli from "./lib/createCli";
import log from "fancy-log";

(async () => {
	try {
		// Register the initial options
		program
			.option("-v, --verbose", "verbose output")
			.option("-c, --config <config>");

		const config = getConfig({
			verbose: program.verbose
		});

		const bootOptions: BootOptions = {
			verbose: program.verbose
		};
		const bootData = await boot(config, bootOptions);
		createCli(bootData);
	} catch (err) {
		log.error(err);
	}
})();

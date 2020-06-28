import { boot, backfill } from "@algotia/core";
import { getConfig } from "./utils/index";
import program from "commander";
import createCli from "./lib/createCli";

(sync () => {
	try {
		// Register the initial options
		program
			.option("-v, --verbose", "verbose output")
			.option("-c, --config <config>");

		const config = getConfig({
			verbose: program.verbose
		});

		const bootOptions = {
			verbose: program.verbose
		};

		const bootData = await boot(config, bootOptions);
		createCli(bootData);
	} catch (err) {
		console.log(err);
	}
})();

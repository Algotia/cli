import { boot, backfill } from "@algotia/core";
import { getConfig } from "./utils/index";
import program from "commander";
import createCli from "./lib/createCli";

(async () => {
	try {
		program
			.option("-v, --verbose", "verbose output")
			.option("-c, --config <config>");

		const config = getConfig({
			verbose: program.verbose
		});
		const bootData = await boot(config);
		createCli(bootData);
	} catch (err) {
		console.log(err);
	}
})();

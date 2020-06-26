import bail from "../utils/bail";
import parseArgs from "yargs-parser";
import chalk from "chalk";
import os from "os";
import path from "path";

import log from "../utils/logs";

process.env["NODE_CONFIG_DIR"] = path.join(os.homedir(), "/.config/algotia/");
import config from "config";

export default (options) => {
	const configSourceArr = config.util.getConfigSources();

	const configDefaults = {
		exchange: {
			exchangeId: "bitfinex",
			apiKey: "beats string validation",
			apiSecret: "enter real api keys",
			timeout: 3000
		}
	};

	if (configSourceArr.length) {
		const formatPath = (path) => path.replace(os.homedir(), "~");
		const configPath = formatPath(configSourceArr[0].name);

		if (options.verbose)
			log.info(`Config detected -- using ${chalk.underline.bold(configPath)}`);

		const userConfig = configSourceArr[0].parsed;
		const newConf = config.util.extendDeep(configDefaults, userConfig);

		return newConf;
	} else {
		console.log("config doesnt exist");
	}
};

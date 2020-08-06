import { ConfigOptions } from "@algotia/core";
import os from "os";
import path from "path";

import { configWizard } from "../../lib/wizards/";
import log from "./log";

process.env["SUPPRESS_NO_CONFIG_WARNING"] = "true";
process.env["NODE_CONFIG_DIR"] = path.join(os.homedir(), "/algotia/");
import config from "config";

const getDefaultConfig = async (): Promise<ConfigOptions> => {
	const configSourceArr = config.util.getConfigSources();

	if (configSourceArr.length) {
		const userConfig = configSourceArr[0].parsed;

		return userConfig;
	} else {
		log.warn("No defailt configuration found.");
		log.info("Starting coniguration wizard");
		return configWizard();
	}
};

export default async (): Promise<ConfigOptions> => {
	return await getDefaultConfig();
};

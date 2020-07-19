import { ConfigOptions } from "@algotia/core";
import chalk from "chalk";
import os from "os";
import path from "path";
import fs from "fs";
import YAML from "yaml";

import { createConfigWizard } from "../lib/wizards/index";
import log from "../utils/logs";

process.env["SUPPRESS_NO_CONFIG_WARNING"] = "true";
process.env["NODE_CONFIG_DIR"] = path.join(os.homedir(), "/algotia/");
import config from "config";

interface GetConfigOptions {
	configPath?: string;
	verbose?: boolean;
}

const getDefaultConfig = async (verbose: boolean): Promise<ConfigOptions> => {
	const configSourceArr = config.util.getConfigSources();

	if (configSourceArr.length) {
		const formatPath = (path: string): string =>
			path.replace(os.homedir(), "~");
		const configPath = formatPath(configSourceArr[0].name);

		if (verbose) {
			log.info(`Config detected -- using ${chalk.underline.bold(configPath)}`);
		}

		const userConfig = configSourceArr[0].parsed;

		return userConfig;
	} else {
		log.warn("No defailt configuration found.");
		return await createConfigWizard();
	}
};

const getCustomConfig = (options: GetConfigOptions): ConfigOptions => {
	const { configPath, verbose } = options;
	const allowedFileExtensions = ["js", "json", "yaml", "yml"];
	const fileExtension = configPath.split(".").pop();

	verbose && log.info(`Configuration file detected at ${configPath}`);

	let userConfig: ConfigOptions;
	if (allowedFileExtensions.includes(fileExtension)) {
		switch (fileExtension) {
			case "js":
				userConfig = require(configPath);
				break;
			case "json":
				const jsonBuffer = fs.readFileSync(configPath, { encoding: "utf8" });
				const jsonConfig = jsonBuffer.toString();
				const parsedJson = JSON.parse(jsonConfig);
				userConfig = parsedJson;

				break;
			case "yaml":
			case "yml":
				const yamlBuffer = fs.readFileSync(configPath);
				const yamlConfig = yamlBuffer.toString();
				const parsedYaml = YAML.parse(yamlConfig);
				userConfig = parsedYaml;
				break;
		}
	} else {
		throw new Error(
			`File type .${fileExtension} is not a supported configuration file type`
		);
	}
	return userConfig;
};

export default async (options: GetConfigOptions): Promise<ConfigOptions> => {
	if (options.configPath) {
		return getCustomConfig(options);
	} else {
		return await getDefaultConfig(options.verbose);
	}
};

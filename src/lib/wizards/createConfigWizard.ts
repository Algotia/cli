import inquirer from "inquirer";
import fs from "fs";
import YAML from "yaml";
import { ConfigOptions } from "@algotia/core";

export default async (): Promise<ConfigOptions> => {
	try {
		const questions = [
			{
				type: "list",
				name: "config.exchange.exchangeId",
				message: "Which exchange would you like to use?",
				choices: ["binance", "kraken", "bitfinex", "bittrex"]
			},
			{
				type: "input",
				name: "config.exchange.apiKey",
				message: "Enter API key (blank for none)"
			},
			{
				type: "input",
				name: "config.exchange.apiSecret",
				message: "Enter API secret (blank for none)"
			},
			{
				type: "input",
				name: "config.exchange.timeout",
				message: "Enter time out in MS (1s = 1000)",
				default: 3000
			},
			{
				type: "list",
				name: "fileExtension",
				message: "Which file format would you like to use?",
				choices: [
					{ name: "JavaScript", value: "js" },
					{ name: "YAML", value: "yaml" },
					{ name: "JSON", value: "json" }
				]
			}
		];

		interface Answers {
			fileExtension: string;
			config: ConfigOptions;
		}

		const answers: Answers = await inquirer.prompt(questions);

		const { config } = answers;

		const fileExtension = `default.${answers.fileExtension}`;
		const configDir = process.env["NODE_CONFIG_DIR"];
		const writePath = `${configDir}${fileExtension}`;

		let configString: string;

		switch (answers.fileExtension) {
			case "js":
				configString = `module.exports = ${JSON.stringify(config)}`;
				break;
			case "json":
				configString = JSON.stringify(config);
				break;
			case "yaml":
				configString = YAML.stringify(config);
		}

		fs.writeFileSync(writePath, configString);

		console.log(config);
		return config;
	} catch (err) {
		return Promise.reject(err);
	}
};

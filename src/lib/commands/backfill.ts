import { log } from "../../utils";
import createCommand from "../factories/createCommand";
import { backfill } from "@algotia/core";
import { CommandOptions, Command } from "../../types";

const backfillCommand: Command = async (commandArgs): Promise<void> => {
	try {
		const command = createCommand(commandArgs);

		const options: CommandOptions = [
			[
				"-s, --since <since>",
				"Unix timestamp (ms) of time to retrieve records from"
			],
			[
				"-u, --until <until>",
				"Unix timestamp (ms) of time to retrieve records to"
				// default argument is server time in MS
			],
			["-p, --pair <pair>", "Pair to retrieve records for"],
			["-P, --period <period>", "Timeframe to retrieve records for"],

			[
				"-l, --record-limit <recordLimit>",
				"Number of records to retrieve at one time"
			],
			["-n, --document-name <documentName>", "name for database refrence"]
		];

		command.addCommand("backfill", "backfill historical data");
		command.addOptions(options);
		await command.addAction(backfill);
	} catch (err) {
		log.error(err);
	}
};
export default backfillCommand;

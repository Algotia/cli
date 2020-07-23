import { listPairs } from "../methods";
import { log } from "../../utils";
import { Command } from "../../types";
import { createCommand } from "../factories";

const listPairsCommand: Command = async (commandArgs) => {
	try {
		const command = createCommand(commandArgs);

		command.addCommand(
			"list-pairs",
			"Lists all the valid trading pairs from the exchange in your configuration."
		);
		command.addAction(listPairs);
	} catch (err) {
		log.error;
	}
};

export default listPairsCommand;

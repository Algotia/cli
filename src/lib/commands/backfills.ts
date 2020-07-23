import { backfills, BootData } from "@algotia/core";
import { log, confirmDangerous } from "../../utils";
import { createCommand } from "../factories";
import { Command, CommandArgs } from "../../types";

const backfillsCommand: Command = async (commandArgs): Promise<void> => {
	try {
		const command = createCommand(commandArgs);

		const backfillsCmd = command.addCommand(
			"backfills <command>",
			"Read, update, and delete backfill documents."
		);

		const listCommandArgs: CommandArgs = {
			...commandArgs,
			program: backfillsCmd
		};

		const list = createCommand(listCommandArgs, true);

		list.addCommand("list [documentName]", "list backfill documents");
		list.addOptions([
			["-p, --pretty", "Format output in human-readable table."]
		]);

		list.addAction(async (bootData, options) => {
			if (options.documentName) {
				return backfills.listOne(bootData, options);
			} else {
				return backfills.listAll(bootData, options);
			}
		});

		const deleteCommandArgs: CommandArgs = {
			...commandArgs,
			program: backfillsCmd
		};

		const deleteCommand = createCommand(deleteCommandArgs, true);

		deleteCommand.addCommand(
			"delete [documentName]",
			"delete backfill document"
		);
		deleteCommand.addAction(async (bootData, options) => {
			if (options.documentName) {
				const proceed = await confirmDangerous(1);
				if (proceed) {
					return backfills.deleteOne(bootData, options);
				}
			} else {
				const backfillCollection = bootData.db.collection("backfill");
				const allBackfills = backfillCollection.find({});
				const backfillsArr = await allBackfills.toArray();

				const proceed = await confirmDangerous(backfillsArr.length);
				if (proceed) {
					return backfills.deleteAll(bootData, options);
				}
			}
		});
	} catch (err) {
		log.error(err);
	}
};
export default backfillsCommand;

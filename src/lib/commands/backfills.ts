import { backfills, BootData } from "@algotia/core";
import {
	log,
	confirmDangerous,
	connectToDb,
	getBackfillCollection
} from "../../utils";
import { createCommand } from "../factories";
import { Command, CommandArgs } from "../../types";
import { listBackfillsWizard } from "../wizards";
import asciichart from "asciichart";

const connectGetBackfillCollection = async (bootData: BootData) => {
	try {
		const { client } = bootData;
		const db = await connectToDb(client);
		const backfillCollection = await getBackfillCollection(db);

		return backfillCollection;
	} catch (err) {
		log.error(err);
	}
};

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

		const list = createCommand(listCommandArgs);

		list.addCommand("list [documentName]", "list backfill documents");
		list.addOptions([
			["-p, --pretty", "Format output in human-readable table."]
		]);
		list.addWizard(listBackfillsWizard);
		list.addAction(async (bootData, options) => {
			if (options.pretty) {
				const listPretty = async (bootData, options) => {
					const backfillArr = await backfills.listBackfills(bootData, options);
					let prettyObj = {};

					backfillArr.forEach((backfill) => {
						prettyObj[backfill.name.toString()] = {
							pair: backfill.pair,
							period: backfill.period,
							since: new Date(backfill.since).toLocaleString(),
							until: new Date(backfill.until).toLocaleString(),
							records: backfill.records.length
						};
					});
					console.table(prettyObj);
				};
				return listPretty(bootData, options);
			} else {
				const listUgly = async (bootData, options) => {
					const backfillArr = await backfills.listBackfills(bootData, options);
					console.log(backfillArr);
				};
				return listUgly(bootData, options);
			}
		});

		const deleteCommandArgs: CommandArgs = {
			...commandArgs,
			program: backfillsCmd
		};

		const deleteCommand = createCommand(deleteCommandArgs);

		deleteCommand.addCommand(
			"delete [documentName]",
			"delete backfill document"
		);
		deleteCommand.addOptions([]);
		deleteCommand.addAction(async (bootData, options) => {
			if (options.documentName) {
				const proceed = await confirmDangerous(1);
				if (proceed) {
					return backfills.deleteBackfills(bootData, options);
				}
			} else {
				const backfillCollection = await connectGetBackfillCollection(bootData);
				const backfillLength = await backfillCollection.countDocuments();

				const proceed = await confirmDangerous(backfillLength);

				if (proceed) {
					return backfills.deleteBackfills(bootData, options);
				}
			}
		});
	} catch (err) {
		log.error(err);
	}
};
export default backfillsCommand;

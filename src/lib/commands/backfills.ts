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
				return await backfills.listOne(bootData, options);
			} else {
				return await backfills.listAll(bootData, options);
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
					return await backfills.deleteOne(bootData, options);
				}
			} else {
				const backfillCollection = bootData.db.collection("backfill");
				const allBackfills = backfillCollection.find({});
				const backfillsArr = await allBackfills.toArray();

				const proceed = await confirmDangerous(backfillsArr.length);
				if (proceed) {
					return await backfills.deleteAll(bootData, options);
				}
			}
		});
	} catch (err) {
		log.error(err);
	}
};
export default backfillsCommand;

//backfills <command>
//const backfills = program
//.command("backfills <command>")
//.description("Read, update, and delete backfill documents");

//backfills list
//backfills
//.command("list [documentName]")
//.description(
//"Print backfill document(s), when called with no arguments, will print all documents (metadata only)."
//)
//.option("-p, --pretty", "Print (only) metadata in a pretty table", false)
//.action(async (documentName, options) => {
//try {
//const { pretty } = options;
//const backfillsOptions: ListOptions = {
//pretty
//};
//if (documentName) {
//await backfillsCommand.listOne(documentName, backfillsOptions);
//} else {
//await backfillsCommand.listAll(backfillsOptions);
//}
//} catch (err) {
//return Promise.reject(new Error(err));
//}
//});

//backfills delete
//backfills
//.command("delete [documentName]")
//.description(
//"Deletes document(s), if no name passed then deletes all documents."
//)
//.action(async (documentName, options) => {
//try {
//const { verbose } = options;
//const deleteOptions: DeleteOptions = {
//verbose
//};

//const proceed = await confirmDangerous();
//if (proceed) {
//if (documentName) {
//await backfillsCommand.deleteOne(documentName, deleteOptions);
//} else {
//await backfillsCommand.deleteAll(deleteOptions);
//}
//} else {
//bail("Bailing out of deleting all documents.");
//}
//} catch (err) {
//return Promise.reject(new Error(err));
//}
//});

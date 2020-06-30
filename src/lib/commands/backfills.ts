import { MongoClient } from "mongodb";
import log from "fancy-log";
import { log as logger } from "../../utils/index";
import chalk from "chalk";
import inquirer from "inquirer";
import { bail } from "../../utils/index";
import { ListOptions, DeleteOptions } from "../../types/interfaces/commands";

const { error, success, info, warn } = logger;

// Utility functions
const connect = async () => {
	try {
		const dbUrl = "mongodb://localhost:27017";
		const dbName = "algotia";
		const dbOptions = {
			useUnifiedTopology: true
		};
		const client = new MongoClient(dbUrl, dbOptions);

		await client.connect();

		const db = client.db(dbName);

		const backfillCollection = db.collection("backfill");

		return { backfillCollection, client };
	} catch (err) {
		bail(err);
	}
};

// Format metadata for console.table
function BackfillRow(data) {
	function format(num: number) {
		return new Date(num).toLocaleString();
	}
	const { name, period, pair, since, until } = data;
	this.document_name = name;
	this.period = period;
	this.pair = pair;
	this["since (formatted)"] = format(since);
	this["until (formatted)"] = format(until);
}

const confirmDangerous = async (documentsAffected?: number) => {
	try {
		const question = [
			{
				type: "confirm",
				name: "proceedDangerous",
				message: `The following operation affects ${documentsAffected} documents and is destructive. Continue?`,
				default: false
			}
		];
		const answer = await inquirer.prompt(question);

		return answer;
	} catch (err) {
		bail(err);
	}
};

// End utility functions

const listOne = async (documentName: string, options: ListOptions) => {
	try {
		const { client, backfillCollection } = await connect();
		const { pretty } = options;
		const oneBackfill = await backfillCollection
			.find({ name: documentName })
			.toArray();

		if (oneBackfill.length !== 0) {
			if (pretty) {
				console.table([new BackfillRow(oneBackfill[0])]);
			} else {
				log(oneBackfill[0]);
			}
		} else {
			log.error(
				`No backfill named ${documentName} saved. Run ${chalk.bold.underline(
					"algotia backfills list"
				)} to see saved documents.`
			);
		}
		await client.close();
		bail();
	} catch (err) {
		bail(err);
	}
};

const listAll = async (options: ListOptions) => {
	try {
		const { pretty } = options;
		const { client, backfillCollection } = await connect();
		const allBackfills = backfillCollection.find({});
		const backfillsArr = await allBackfills.toArray();

		if (backfillsArr.length) {
			let allDocs = [];

			backfillsArr.forEach((doc) => {
				allDocs.push(new BackfillRow(doc));
			});
			if (pretty) {
				console.table(allDocs);
			} else {
				log(allDocs);
			}
		} else {
			log(
				`No backfills saved. Run ${chalk.bold.underline(
					"algotia backfill -h"
				)} for help.`
			);
		}

		await client.close();
		process.exit(0);
	} catch (err) {
		bail(err);
	}
};

const deleteAll = async (options: DeleteOptions) => {
	try {
		const { client, backfillCollection } = await connect();
		const { verbose } = options;
		const allBackfills = backfillCollection.find({});
		const backfillsArr = await allBackfills.toArray();
		const { length } = backfillsArr;
		if (length) {
			const proceed = await confirmDangerous(length);
			if (proceed) {
				await backfillCollection.drop();
				success(
					`Deleted ${length} ${
						length > 1 ? "documents" : "document"
					} from the database.`
				);
			} else {
				bail(`Bailed out of deleting ${length} documents`);
			}
		}

		await client.close();
	} catch (err) {
		bail(err);
	}
};

const deleteOne = async (documentName: string, options: DeleteOptions) => {
	try {
		const { client, backfillCollection } = await connect();
		const { verbose } = options;
		const allBackfills = backfillCollection.find({ name: documentName });
		const backfillsArr = await allBackfills.toArray();
		const { length } = backfillsArr;
		if (length) {
			const proceed = await confirmDangerous(length);
			if (proceed) {
				await backfillCollection.drop();
				success(`Deleted document ${documentName} from the database.`);
			} else {
				bail(`Bailed out of deleting document ${documentName}`);
			}
		}

		await client.close();
	} catch (err) {
		bail(err);
	}
};

const backfills = {
	listOne,
	listAll,
	deleteAll,
	deleteOne
};

export default backfills;

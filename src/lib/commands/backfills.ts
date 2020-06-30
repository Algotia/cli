import { MongoClient } from "mongodb";
import log from "fancy-log";
import chalk from "chalk";
import { bail } from "../../utils/index";
import { ListOptions } from "../../types/interfaces/commands";

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
	const format = (num: number) => new Date(num).toLocaleString();
	const { name, period, pair, since, until } = data;
	this.document_name = name;
	this.period = period;
	this.pair = pair;
	this["since (formatted)"] = format(since);
	this["until (formatted)"] = format(until);
}

const listOne = async (documentName: string, options: ListOptions) => {
	try {
		const { client, backfillCollection } = await connect();
		const { pretty, verbose } = options;
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
		const { pretty, verbose } = options;
		const { client, backfillCollection } = await connect();
		const allBackfills = backfillCollection.find({});
		const backfillsArr = await allBackfills.toArray();

		if (backfillsArr.length > 0) {
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

const deleteAll = async (pretty?: boolean) => {
	try {
		const { client, backfillCollection } = await connect();

		await backfillCollection.drop();
	} catch (err) {
		bail(err);
	}
};

const backfills = {
	listOne,
	listAll
};

export default backfills;

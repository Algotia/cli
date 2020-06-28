import { MongoClient } from "mongodb";
import log from "fancy-log";
import chalk from "chalk";
import { bail } from "../../utils/index";

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

function BackfillRow(data) {
	const format = (num: number) => new Date(num).toLocaleString();
	const { name, period, pair, since, until } = data;
	this.document_name = name;
	this.period = period;
	this.pair = pair;
	this["since (formatted)"] = format(since);
	this["until (formatted)"] = format(until);
}

const listOne = async (documentName: string, pretty?: boolean) => {
	try {
		console.log(pretty);
		const { client, backfillCollection } = await connect();
		const oneBackfill = await backfillCollection
			.find({ name: documentName })
			.toArray();

		if (oneBackfill.length !== 0) {
			if (pretty) {
				console.table([new BackfillRow(oneBackfill[0])]);
			} else {
				console.log(oneBackfill[0]);
			}
		} else {
			console.log(
				`No backfill named ${documentName} saved. Run ${chalk.bold.underline(
					"algotia backfills list"
				)} to see saved documents.`
			);
		}
		await client.close();
		process.exit(0);
	} catch (err) {
		bail(err);
	}
};

const listAll = async (pretty?: boolean) => {
	try {
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
				console.log(allDocs);
			}
		} else {
			console.log(
				`No backfills saved. Run ${chalk.bold.underline("algotia backfill -h")}`
			);
		}

		await client.close();
		process.exit(0);
	} catch (err) {
		bail(err);
	}
};

const backfills = {
	listOne,
	listAll
};

export default backfills;

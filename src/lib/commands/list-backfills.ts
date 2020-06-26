import { MongoClient } from "mongodb";
import log from "fancy-log";
import chalk from "chalk";

export default async () => {
	try {
		const dbUrl = "mongodb://localhost:27017";
		const dbName = "algotia";
		const dbOptions = {
			useUnifiedTopology: true,
		};
		const client = new MongoClient(dbUrl, dbOptions);

		await client.connect();

		const db = client.db(dbName);

		const backfillCollection = db.collection("backfill");

		const allBackfills = backfillCollection.find({});
		const backfillsArr = await allBackfills.toArray();

		function BackfillDoc(data) {
			const format = (num: number) => new Date(num).toLocaleString();
			const { name, period, pair, since, until } = data;
			this.document_name = name;
			this.period = period;
			this.pair = pair;
			this["since (formatted)"] = format(since);
			this["until (formatted)"] = format(until);
		}

		if (backfillsArr.length > 0) {
			let allDocs = [];

			backfillsArr.forEach((doc) => {
				allDocs.push(new BackfillDoc(doc));
			});

			console.table(allDocs);
		} else {
			console.log("no documents");
		}
		await client.close();
		process.exit(0);
	} catch (err) {}
};

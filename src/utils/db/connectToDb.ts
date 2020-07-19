import { MongoClient } from "mongodb";

export default async () => {
	try {
		const dbUrl = "mongodb://localhost:27017";
		const dbName = "algotia";
		const dbOptions = {
			useUnifiedTopology: true
		};
		const client = new MongoClient(dbUrl, dbOptions);
		await client.connect();
		return client;
	} catch (err) {
		return Promise.reject(err);
	}
};

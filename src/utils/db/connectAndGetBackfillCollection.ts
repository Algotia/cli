import connectToDb from "./connectToDb";
import getBackfillCollection from "./getBackfillCollection";
import { BootData } from "@algotia/core";
import { Collection } from "mongodb";
import { log } from "..";

const connectAndGetBackfillCollection = async (
	bootData: BootData
): Promise<Collection> => {
	try {
		const { client } = bootData;
		const db = await connectToDb(client);
		const backfillCollection = await getBackfillCollection(db);

		return backfillCollection;
	} catch (err) {
		log.error(err);
	}
};

export default connectAndGetBackfillCollection;

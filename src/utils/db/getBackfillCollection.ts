import { log } from "..";
import { Db } from "mongodb";

const getBackfillCollection = async (db: Db) => {
	try {
		return db.collection("backfill");
	} catch (err) {
		log.error(err);
	}
};

export default getBackfillCollection;

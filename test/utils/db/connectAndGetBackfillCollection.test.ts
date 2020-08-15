import { boot, BootData } from "@algotia/core";
import { log, connectToDb } from "../../../src/utils";

describe("Connect and return backfill collection", () => {
	let bootData: BootData;

	beforeAll(async () => {
		bootData = await boot({
			exchange: { exchangeId: "bitfinex", timeout: 5000 }
		});
	});

	afterAll(async () => {
		try {
			await bootData.client.close();
		} catch (err) {
			log.error(err);
		}
	});
	test("Client should be connected", async () => {
		expect(bootData.client.isConnected()).toStrictEqual(true);
	});

	test("Collection name should be backfill", async () => {
		const db = await connectToDb(bootData.client);
		const backfillCollection = db.collection("backfill");
		expect(backfillCollection.collectionName).toStrictEqual("backfill");
	});
});

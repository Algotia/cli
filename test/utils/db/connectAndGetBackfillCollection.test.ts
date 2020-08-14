import { connectAndGetBackfillCollection } from "../../../src/utils/db/index";
import { boot, BootData } from "@algotia/core";
import { log } from "../../../src/utils";
import { Collection } from "mongodb";

describe("Connect and return backfill collection", () => {
	let bootData;

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
		expect(backfillCollection.collectionName).toStrictEqual("backfill");
	});
});

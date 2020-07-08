import { Exchange } from "ccxt";
import { backfill, BackfillOptions } from "@algotia/core";

export default async (exchange: Exchange, options: BackfillOptions) => {
	try {
		await backfill(exchange, options);
	} catch (err) {
		return Promise.reject(new Error(err));
	}
};

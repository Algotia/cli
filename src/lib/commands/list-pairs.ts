import { Exchange } from "ccxt";
import log from "fancy-log";
import { sleep, log as logs } from "../../utils/index";

const { info } = logs;

export default async (exchange: Exchange, verbose?: boolean): Promise<void> => {
	try {
		if (verbose) {
			info(
				`The list-pairs method is strictly rate-limited. Sleeping to prevent API key flagging.`
			);
		}
		await sleep(1000, verbose);

		const allTickers = await exchange.fetchTickers();
		let tickerArr = [];
		for (let ticker in allTickers) {
			tickerArr.push(ticker);
		}
		tickerArr.sort();
		tickerArr.forEach((ticker) => {
			log(ticker);
		});
	} catch (err) {
		return Promise.reject(new Error(err));
	}
};

import log from "fancy-log";
import { bail, sleep, log as logs } from "../../utils/index";

const { info } = logs;

export default async (exchange, all?: boolean) => {
	try {
		info(
			`The list-pairs method is strictly rate-limited. Sleeping to prevent API key flagging.`
		);
		await sleep(1000, true);

		if (all) {
			const tickers = await exchange.fetchTickers();
			log(tickers);
			return;
		}
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
		bail(err);
	}
};

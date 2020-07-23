import log from "fancy-log";
import { sleep, log as logs } from "../../utils/index";
import { BootData } from "../../types";

const { info } = logs;

const listPairs = async (bootData: BootData, options: any): Promise<void> => {
	try {
		const { exchange } = bootData;
		if (options.verbose) {
			info(
				`The list-pairs method is strictly rate-limited. Sleeping to prevent API key flagging.`
			);
		}
		await sleep(1000, options.verbose);

		const allTickers = await exchange.fetchTickers();
		let tickerArr = [];
		for (let ticker in allTickers) {
			if (allTickers.hasOwnProperty(ticker)) {
				tickerArr.push(ticker);
			}
		}
		tickerArr.sort();

		return tickerArr.forEach((t) => log.info(t));
	} catch (err) {
		return Promise.reject(new Error(err));
	} finally {
		await bootData.client.close();
	}
};

export default listPairs;

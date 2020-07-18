import { Exchange } from "ccxt";
import { Config } from "./config";

interface IBootData {
	exchange: Exchange;
	config: Config;
}

export type BootData = IBootData;

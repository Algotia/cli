"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const backfill_1 = __importDefault(require("./commands/backfill"));
const commander_1 = require("commander");
const pInt = (str) => parseInt(str);
const pDate = (str) => index_1.convertDateToTimestamp(str);
// should create an interface for this
exports.default = bootData => {
    const { exchange } = bootData;
    commander_1.program.version("0.0.1");
    commander_1.program
        .option("-v, --verbose", "verbose output")
        .option("-c, --config <config>")
        .command("backfill")
        .description("backfill historical data")
        .requiredOption("-s, --since <since>", "Unix timestamp (ms) of time to retrieve records from", pDate)
        .requiredOption("-p, --pair <pair>", "Pair to retrieve records for")
        .option("-P, --period <period>", "Timeframe to retrieve records for", "1m")
        .option("-u, --until <until>", "Unix timestamp (ms) of time to retrieve records to", pDate, exchange.milliseconds())
        .option("-l, --limit <limit>", "Number of records to retrieve at one time", pInt, 10)
        .option("-n, --collection-name <collectionName>", "name for database refrence", undefined)
        .action((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { since, pair, period, until, limit, collectionName } = options;
        const opts = {
            since,
            pair,
            period,
            until,
            recordLimit: limit,
            name: collectionName
        };
        yield backfill_1.default(exchange, opts);
    }));
    commander_1.program.parse(process.argv);
};

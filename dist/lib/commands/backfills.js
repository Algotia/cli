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
const mongodb_1 = require("mongodb");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../../utils/index");
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUrl = "mongodb://localhost:27017";
        const dbName = "algotia";
        const dbOptions = {
            useUnifiedTopology: true
        };
        const client = new mongodb_1.MongoClient(dbUrl, dbOptions);
        yield client.connect();
        const db = client.db(dbName);
        const backfillCollection = db.collection("backfill");
        return { backfillCollection, client };
    }
    catch (err) {
        index_1.bail(err);
    }
});
function BackfillRow(data) {
    const format = (num) => new Date(num).toLocaleString();
    const { name, period, pair, since, until } = data;
    this.document_name = name;
    this.period = period;
    this.pair = pair;
    this["since (formatted)"] = format(since);
    this["until (formatted)"] = format(until);
}
const listOne = (documentName, pretty) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(pretty);
        const { client, backfillCollection } = yield connect();
        const oneBackfill = yield backfillCollection
            .find({ name: documentName })
            .toArray();
        if (oneBackfill.length !== 0) {
            if (pretty) {
                console.table([new BackfillRow(oneBackfill[0])]);
            }
            else {
                console.log(oneBackfill[0]);
            }
        }
        else {
            console.log(`No backfill named ${documentName} saved. Run ${chalk_1.default.bold.underline("algotia backfills list")} to see saved documents.`);
        }
        yield client.close();
        process.exit(0);
    }
    catch (err) {
        index_1.bail(err);
    }
});
const listAll = (pretty) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { client, backfillCollection } = yield connect();
        const allBackfills = backfillCollection.find({});
        const backfillsArr = yield allBackfills.toArray();
        if (backfillsArr.length > 0) {
            let allDocs = [];
            backfillsArr.forEach((doc) => {
                allDocs.push(new BackfillRow(doc));
            });
            if (pretty) {
                console.table(allDocs);
            }
            else {
                console.log(allDocs);
            }
        }
        else {
            console.log(`No backfills saved. Run ${chalk_1.default.bold.underline("algotia backfill -h")}`);
        }
        yield client.close();
        process.exit(0);
    }
    catch (err) {
        index_1.bail(err);
    }
});
const backfills = {
    listOne,
    listAll
};
exports.default = backfills;

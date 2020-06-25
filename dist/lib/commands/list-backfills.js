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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const allBackfills = backfillCollection.find({});
        const backfillsArr = yield allBackfills.toArray();
        function BackfillDoc(data) {
            const format = (num) => new Date(num).toLocaleString();
            const { name, period, pair, since, until } = data;
            this.document_name = name;
            this.period = period;
            this.pair = pair;
            this["since (formatted)"] = format(since);
            this["until (formatted)"] = format(until);
        }
        if (backfillsArr.length > 0) {
            let allDocs = [];
            backfillsArr.forEach(doc => {
                allDocs.push(new BackfillDoc(doc));
            });
            console.table(allDocs);
        }
        else {
            console.log("no documents");
        }
        yield client.close();
        process.exit(0);
    }
    catch (err) { }
});

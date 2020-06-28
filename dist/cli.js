"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@algotia/core");
const index_1 = require("./utils/index");
const commander_1 = __importDefault(require("commander"));
const createCli_1 = __importDefault(require("./lib/createCli"));
(sync());
{
    try {
        // Register the initial options
        commander_1.default
            .option("-v, --verbose", "verbose output")
            .option("-c, --config <config>");
        const config = index_1.getConfig({
            verbose: commander_1.default.verbose
        });
        const bootOptions = {
            verbose: commander_1.default.verbose
        };
        const bootData = await core_1.boot(config, bootOptions);
        createCli_1.default(bootData);
    }
    catch (err) {
        console.log(err);
    }
}
();

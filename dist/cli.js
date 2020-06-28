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
const core_1 = require("@algotia/core");
const index_1 = require("./utils/index");
const commander_1 = __importDefault(require("commander"));
const createCli_1 = __importDefault(require("./lib/createCli"));
(() => __awaiter(void 0, void 0, void 0, function* () {
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
        const bootData = yield core_1.boot(config, bootOptions);
        createCli_1.default(bootData);
    }
    catch (err) {
        console.log(err);
    }
}))();

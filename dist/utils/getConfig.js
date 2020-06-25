"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const find_1 = __importDefault(require("find"));
const bail_1 = __importDefault(require("../utils/bail"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const chalk_1 = __importDefault(require("chalk"));
function getConfig() {
    let config, verbose;
    const argv = yargs_parser_1.default(process.argv);
    if (argv["c"] || argv["config"])
        config = argv["c"] || argv["config"];
    if (argv["v"] || argv["verbose"])
        verbose = argv["v"] || argv["verbose"];
    const paths = find_1.default.fileSync(/config.yaml/g, `${__dirname}/`);
    if (!config) {
        if (paths.length === 0) {
            fancy_log_1.default.warn(`${chalk_1.default.bold.yellow("WARNING")}: no config files detected, falling back to default config.`);
            fancy_log_1.default.warn(`Only ${chalk_1.default.bold.yellow("Public")} API methods will be available.`);
        }
        else if (paths.length > 1) {
            bail_1.default("Error: multiple config files named config.yaml detected");
        }
    }
    let configFile;
    if (config) {
        configFile = config;
    }
    else {
        configFile = paths[0];
    }
    if (verbose)
        fancy_log_1.default(`Config file detected at ${configFile}`);
    let userConfig;
    if (configFile) {
        const configRaw = fs_1.default.readFileSync(configFile, "utf8");
        userConfig = yaml_1.default.parse(configRaw);
    }
    else {
        const defaultConfig = {
            exchange: {
                exchangeId: "bitfinex",
                apiKey: "beatsValidation",
                apiSecret: "thisToo",
                timeout: 3000
            }
        };
        userConfig = defaultConfig;
    }
    return userConfig;
}
exports.default = getConfig;

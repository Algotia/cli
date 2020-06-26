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
    let configFlag;
    let verboseFlag;
    let configFile;
    let config; //return value
    const argv = yargs_parser_1.default(process.argv);
    // First checks for explicitly passed configuration files
    // TODO: I dont like that we need to use yargs parser, maybe way to integrate
    // with commander
    if (argv["c"] || argv["config"])
        configFlag = argv["c"] || argv["config"];
    if (argv["v"] || argv["verbose"])
        verboseFlag = argv["v"] || argv["verbose"];
    if (configFlag) {
        fancy_log_1.default.info(`Using configuration file ${configFlag}}`);
        configFile = configFlag;
    }
    else {
        // If no explicit config, try to find one in the current directory
        let paths = find_1.default.fileSync(/config.yaml/g, __dirname);
        console.log("paths ", paths);
        if (paths.length === 1) {
            // config found
            configFile = paths[0];
            fancy_log_1.default(`Config file detected at ${configFile}`);
        }
        else if (paths.length > 1) {
            // bails if there are multiple config files detected
            bail_1.default("Error: multiple config files named config.yaml detected");
        }
    }
    if (configFile) {
        // If a config.yaml file was passed or found, parse it and set config var
        const configRaw = fs_1.default.readFileSync(configFile, "utf8");
        config = yaml_1.default.parse(configRaw);
    }
    else {
        // If no config explicitly passed or found, fall back to default config --
        // Public methods only
        config = {
            exchange: {
                exchangeId: "bitfinex",
                apiKey: "beatsValidation",
                apiSecret: "thisToo",
                timeout: 3000
            }
        };
        fancy_log_1.default.warn(`${chalk_1.default.bold.yellow("WARNING")}: no config files detected, falling back to default config.`);
        fancy_log_1.default.warn(`Only ${chalk_1.default.bold.yellow("Public")} API methods will be available.`);
    }
    return config;
}
exports.default = getConfig;

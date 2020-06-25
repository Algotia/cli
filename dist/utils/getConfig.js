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
const commander_1 = require("commander");
function getConfig() {
    const { verbose, config } = commander_1.program;
    const paths = find_1.default.fileSync(/config.yaml/g, `${process.cwd()}/`);
    if (paths.length === 0) {
        bail_1.default("Error: no config files detected.");
    }
    else if (paths.length > 1) {
        bail_1.default("Error: multiple config files named config.yaml detected");
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
    const configRaw = fs_1.default.readFileSync(configFile, "utf8");
    const userConfig = yaml_1.default.parse(configRaw);
    return userConfig;
}
exports.default = getConfig;

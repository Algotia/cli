"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const logs_1 = __importDefault(require("../utils/logs"));
process.env["NODE_CONFIG_DIR"] = path_1.default.join(os_1.default.homedir(), "/.config/algotia/");
const config_1 = __importDefault(require("config"));
exports.default = (options) => {
    const configSourceArr = config_1.default.util.getConfigSources();
    const configDefaults = {
        exchange: {
            exchangeId: "bitfinex",
            apiKey: "beats string validation",
            apiSecret: "enter real api keys",
            timeout: 3000
        }
    };
    if (configSourceArr.length) {
        const formatPath = (path) => path.replace(os_1.default.homedir(), "~");
        const configPath = formatPath(configSourceArr[0].name);
        if (options.verbose)
            logs_1.default.info(`Config detected -- using ${chalk_1.default.underline.bold(configPath)}`);
        const userConfig = configSourceArr[0].parsed;
        const newConf = config_1.default.util.extendDeep(configDefaults, userConfig);
        return newConf;
    }
    else {
        logs_1.default.warn("Using default configuration. Please create your own configuration file at ");
        return configDefaults;
    }
};

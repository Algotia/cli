"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fancy_log_1 = __importDefault(require("fancy-log"));
function info(args) {
    fancy_log_1.default(`${chalk_1.default.yellow.bold("INFO: ")} ${args}`);
}
function error() {
    fancy_log_1.default.error(chalk_1.default.red.bold("ERROR: "), arguments);
}
function warn() {
    fancy_log_1.default.warn(chalk_1.default.yellow.bold("WARNING: "), arguments);
}
function success() {
    fancy_log_1.default(chalk_1.default.green.bold("SUCCESS: "), arguments);
}
exports.default = Object.assign({}, {
    info,
    error,
    warn,
    success,
});

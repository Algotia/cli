"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const info = (text) => {
    fancy_log_1.default(chalk_1.default.yellow.bold("INFO: "), ...text);
};
const error = (text) => {
    fancy_log_1.default.error(chalk_1.default.red.bold("ERROR: "), ...text);
};
const warn = (text) => {
    fancy_log_1.default.warn(chalk_1.default.yellow.bold("WARNING: "), ...text);
};
const success = (text) => {
    fancy_log_1.default(chalk_1.default.green.bold("SUCCESS: "), ...text);
};
exports.default = {
    info,
    error,
    warn,
    success
};

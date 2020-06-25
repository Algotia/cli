"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
// should probably create an interface for this
const convert = (input) => {
    const unixString = new Date(parseInt(input));
    const dateString = new Date(input);
    const isoString = date_fns_1.parseISO(input);
    let parsedInput;
    if (isoString.valueOf()) {
        parsedInput = isoString;
    }
    else if (dateString.valueOf()) {
        parsedInput = dateString;
    }
    else if (unixString.valueOf()) {
        parsedInput = unixString;
    }
    return date_fns_1.format(parsedInput, "T");
};
exports.default = convert;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This function takes in an exchange timeframe (e.g. 1m, 5m, 1h, 1d, etc.)
// and converts it into an object e.g. { unit: "minute", amount: 1}
var Unit;
(function (Unit) {
    Unit["Minute"] = "minute";
    Unit["Hour"] = "hour";
    Unit["Day"] = "day";
    Unit["Week"] = "week";
})(Unit || (Unit = {}));
exports.default = (timeframe) => {
    const amount = parseInt(timeframe.replace(/[^0-9\.]+/g, ""));
    let unit;
    switch (timeframe.replace(/[0-9]/g, "")) {
        case "m":
            unit = Unit.Minute;
            break;
        case "h":
            unit = Unit.Hour;
            break;
        case "d":
            unit = Unit.Day;
            break;
        case "w":
            unit = Unit.Week;
            break;
    }
    return { unit, amount };
};

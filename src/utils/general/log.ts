import chalk from "chalk";
import flog from "fancy-log";

type T = any;

function log(t?: T) {
	if (t) flog(t);
}

log.info = (text: T) => {
	flog.info(chalk.yellow.bold("INFO: "), text);
};

log.error = (text: T) => {
	flog.error(chalk.red.bold("ERROR: "), text);
};

log.warn = (text: T) => {
	flog.warn(chalk.yellow.bold("WARNING: "), text);
};

log.success = (text: T) => {
	flog(chalk.green.bold("SUCCESS: "), text);
};

export default log;

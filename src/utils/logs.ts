import chalk from "chalk";
import log from "fancy-log";

const info = (text: any) => {
	log(chalk.yellow.bold("INFO: "), ...text);
};

const error = (text: any) => {
	log.error(chalk.red.bold("ERROR: "), ...text);
};

const warn = (text: any) => {
	log.warn(chalk.yellow.bold("WARNING: "), ...text);
};

const success = (text: any) => {
	log(chalk.green.bold("SUCCESS: "), ...text);
};

export default {
	info,
	error,
	warn,
	success
};

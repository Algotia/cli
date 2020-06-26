import chalk from "chalk";
import log from "fancy-log";

function info(args) {
	log(`${chalk.yellow.bold("INFO: ")} ${args}`);
}

function error() {
	log.error(chalk.red.bold("ERROR: "), arguments);
}

function warn() {
	log.warn(chalk.yellow.bold("WARNING: "), arguments);
}

function success() {
	log(chalk.green.bold("SUCCESS: "), arguments);
}

export default Object.assign(
	{},
	{
		info,
		error,
		warn,
		success,
	}
);

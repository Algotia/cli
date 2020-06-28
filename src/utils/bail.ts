import log from "fancy-log";

export default function bail(
	message?: any,
	signal: string | number = "SIGINT"
) {
	if (message) log.error(`Exiting Algotia. \n Error: ${message}`);
	process.kill(process.pid, signal);
}

import fs from "fs";
import YAML from "yaml";
import find from "find";
import bail from "../utils/bail";
import log from "fancy-log";
import parseArgs from "yargs-parser";
import chalk from "chalk";

function getConfig() {
  let config: string;
  let verbose: boolean;
  let paths: string[];

  const argv = parseArgs(process.argv);

  if (argv["c"] || argv["config"]) config = argv["c"] || argv["config"];
  if (argv["v"] || argv["verbose"]) verbose = argv["v"] || argv["verbose"];

  if (!config) {
    paths = find.files(/config.yaml/g, `${__dirname}/`);
    if (paths.length === 0) {
      log.warn(
        `${chalk.bold.yellow(
          "WARNING"
        )}: no config files detected, falling back to default config.`
      );
      log.warn(
        `Only ${chalk.bold.yellow("Public")} API methods will be available.`
      );
    } else if (paths.length > 1) {
      bail("Error: multiple config files named config.yaml detected");
    }
  }

  let configFile: string;
  let userConfig;

  if (config) {
    configFile = config;
  } else if (paths.length === 1) {
    configFile = paths[0];
  }

  if (verbose) log(`Config file detected at ${configFile}`);

  if (configFile) {
    const configRaw = fs.readFileSync(configFile, "utf8");
    userConfig = YAML.parse(configRaw);
  } else {
    const defaultConfig = {
      exchange: {
        exchangeId: "bitfinex",
        apiKey: "beatsValidation",
        apiSecret: "thisToo",
        timeout: 3000
      }
    };

    userConfig = defaultConfig;
  }

  return userConfig;
}

export default getConfig;

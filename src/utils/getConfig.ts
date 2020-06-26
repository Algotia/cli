import fs from "fs";
import YAML from "yaml";
import find from "find";
import bail from "../utils/bail";
import log from "fancy-log";
import parseArgs from "yargs-parser";
import chalk from "chalk";

function getConfig() {
  let configFlag: string;
  let verboseFlag: boolean;
  let configFile: string;

  let config; //return value

  const argv = parseArgs(process.argv);

  // First checks for explicitly passed configuration files
  // TODO: I dont like that we need to use yargs parser, maybe way to integrate
  // with commander
  if (argv["c"] || argv["config"]) configFlag = argv["c"] || argv["config"];
  if (argv["v"] || argv["verbose"]) verboseFlag = argv["v"] || argv["verbose"];

  if (configFlag) {
    log.info(`Using configuration file ${configFlag}}`);
    configFile = configFlag;
  } else {
    // If no explicit config, try to find one in the current directory
    let paths = find.fileSync(/config.yaml/g, __dirname);
    console.log("paths ", paths);
    if (paths.length === 1) {
      // config found
      configFile = paths[0];
      log(`Config file detected at ${configFile}`);
    } else if (paths.length > 1) {
      // bails if there are multiple config files detected
      bail("Error: multiple config files named config.yaml detected");
    }
  }

  if (configFile) {
    // If a config.yaml file was passed or found, parse it and set config var
    const configRaw = fs.readFileSync(configFile, "utf8");
    config = YAML.parse(configRaw);
  } else {
    // If no config explicitly passed or found, fall back to default config --
    // Public methods only
    config = {
      exchange: {
        exchangeId: "bitfinex",
        apiKey: "beatsValidation",
        apiSecret: "thisToo",
        timeout: 3000
      }
    };

    log.warn(
      `${chalk.bold.yellow(
        "WARNING"
      )}: no config files detected, falling back to default config.`
    );
    log.warn(
      `Only ${chalk.bold.yellow("Public")} API methods will be available.`
    );
  }

  return config;
}

export default getConfig;

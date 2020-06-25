import { boot, backfill } from "@algotia/core";
import { getConfig } from "./utils/index";
import createCli from "./lib/createCli";

(async () => {
  try {
    const config = getConfig();
    const bootData = await boot(config);
    createCli(bootData);
  } catch (err) {
    console.log(err);
  }
})();

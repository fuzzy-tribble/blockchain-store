import mongoose from "mongoose";
import Logger from "../src/lib/logger";
import { Config } from "../src/models";
import { clientConfigs } from "../config.default";

const updateConfigs = async () => {
  Logger.info({
    at: "Scritpts#writeConfig",
    message: `Writing default configs to config collection...`,
  });
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    let writes = clientConfigs.map((conf) => {
      return {
        updateOne: {
          filter: {
            client: conf.client,
            network: conf.network,
          },
          update: conf,
          upsert: true,
        },
      };
    });
    let res = await Config.bulkWrite(writes);
    // console.log(res);

    Logger.info({
      at: "Scritpts#writeConfig",
      message: `Updated config collection.`,
      res: res,
    });
  } catch (err) {
    Logger.error({
      at: "Scritpts#writeConfig",
      message: `Encountered an error while trying to write configs.`,
      error: err,
    });
  } finally {
    await mongoose.connection.close();
  }
};

updateConfigs();

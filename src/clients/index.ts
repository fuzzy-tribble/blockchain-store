import Client from "../lib/client";
import { ClientNames } from "../lib/types";
import { IConfig, Config } from "../models";

import Aave from "./aave";
import Sushiswap from "./sushiswap";

export const loadClients = async (): Promise<Client[]> => {
  // For each db conf, construct the appropriate client
  const clientConfs: IConfig[] = await Config.find({});
  let clients: Client[] = [];
  clients = clientConfs.map((conf) => {
    switch (conf.client) {
      case ClientNames.SUSHISWAP:
        return new Sushiswap(conf);
        break;
      case ClientNames.AAVE:
        return new Aave(conf);
        break;
    }
  });
  return clients;
};

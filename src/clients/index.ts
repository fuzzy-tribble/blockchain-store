import Client from "../lib/client";
import { ClientNames } from "../lib/types";
import { IConfig, Config } from "../models";

import Aave from "./aave";
import Coingecko from "./coingecko";
import DydxSolo from "./dydx";
import Sushiswap from "./sushiswap";

export const loadClients = async (): Promise<Client[]> => {
  // For each db conf, construct the appropriate client
  const clientConfs: IConfig[] = await Config.find({});
  let clients: Client[] = [];
  clientConfs.forEach((conf) => {
    switch (conf.client) {
      case ClientNames.DYDX:
        clients.push(new DydxSolo(conf));
        break;
      case ClientNames.COINGECKO:
        clients.push(new Coingecko(conf));
        break;
      case ClientNames.SUSHISWAP:
        clients.push(new Sushiswap(conf));
        break;
      case ClientNames.AAVE:
        clients.push(new Aave(conf));
        break;
      default:
        break;
    }
  });
  return clients;
};

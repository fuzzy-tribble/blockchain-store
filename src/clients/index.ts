import Client from "../lib/client";
import { ClientNames } from "../lib/types";
import { IConfig, Config } from "../models";

import Coingecko from "./coingecko";
import DydxSolo from "./dydx";

export const loadClients = async (): Promise<Client[]> => {
  const clientConfs = await Config.findAll();

  if (clientConfs.length == 0) {
    throw new Error(
      "Client configs not found (check db connection, check configs exist in db)."
    );
  } else {
    let clients: Client[] = [];
    clientConfs.forEach((conf) => {
      switch (conf.client) {
        case ClientNames.DYDX:
          clients.push(new DydxSolo(conf));
          break;
        case ClientNames.COINGECKO:
          clients.push(new Coingecko(conf));
          break;
        default:
          break;
      }
    });
    return clients;
  }
};

import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { DataError } from "node-json-db/dist/lib/Errors";

import { databaseConfigs } from "../lib/config";
import { ClientAccount, Network, Protocol } from "../lib/types";
import Logger from "../lib/logger";

// TODO - switch out jsondb/lowdb for mongo

export default class BlockchainDb {
  public db: JsonDB;
  public accountsDataPath: string;
  public eventsDataPath: string;

  constructor() {
    // TODO - clean any existing files bc if not {} db wont load
    const config: Config = new Config(
      databaseConfigs.filename,
      true,
      false,
      "/"
    );
    this.db = new JsonDB(config);
    this.accountsDataPath = "/accounts";
    this.eventsDataPath = "/events";
  }

  // ACCOUNT DATA //

  updateAccountsData = (
    network: Network,
    protocol: Protocol,
    data: ClientAccount[]
  ): boolean => {
    let dataPath = `${this.accountsDataPath}/${network}/${protocol}`;
    try {
      Logger.info({
        at: "BlockchainDatabase#updateAccountsData",
        message: `Updating data at: ${dataPath}...`,
      });
      this.db.push(dataPath, data);
      return true;
    } catch (err) {
      Logger.error({
        at: "BlockchainDatabase#updateAccountsData",
        message: `Failed to update data at: ${dataPath}.`,
        error: err,
      });
      return false;
    }
  };

  getAccountsData = (
    network: Network,
    protocol: Protocol,
    dataPath: string = `${this.accountsDataPath}/${network}/${protocol}`
  ): ClientAccount[] => {
    let data: ClientAccount[] = [];
    try {
      Logger.info({
        at: "BlockchainDatabase#getAccountsData",
        message: `Getting data at: ${dataPath}...`,
      });
      data = this.db.getData(dataPath);
    } catch (err) {
      // Pass over this error (no accounts in db yet)
      if ((err as DataError).id !== 5) {
        Logger.error({
          at: "BlockchainDatabase#getAccountsData",
          message: `Failed to get data at: ${dataPath}.`,
          error: err,
        });
        return [];
      }
    } finally {
      Logger.info({
        at: "BlockchainDatabase#getAccountsData",
        message: `Done getting data at: ${dataPath}.`,
      });
      return data;
    }
  };

  // EVENT DATA //

  updateEventsData = (
    data: any,
    dataPath: string = this.eventsDataPath
  ): boolean => {
    try {
      Logger.info({
        at: "BlockchainDatabase#updateEventsData",
        message: `Updating data at: ${dataPath}...`,
      });
      this.db.push(dataPath, data, false);
      return true;
    } catch (err) {
      Logger.error({
        at: "BlockchainDatabase#updateEventsData",
        message: `Failed to update data at: ${dataPath}.`,
        error: err,
      });
      return false;
    }
  };

  getEventsData = (dataPath: string = this.eventsDataPath): any[] => {
    let data: any[] = [];
    try {
      Logger.info({
        at: "BlockchainDatabase#getEventsData",
        message: `Getting data at: ${dataPath}...`,
      });
      data = this.db.getData(dataPath);
    } catch (err) {
      // Pass over this error (no accounts in db yet)
      if ((err as DataError).id !== 5) {
        Logger.error({
          at: "BlockchainDatabase#getEventsData",
          message: `Failed to get data at: ${dataPath}.`,
          error: err,
        });
        return [];
      }
    } finally {
      Logger.info({
        at: "BlockchainDatabase#getEventsData",
        message: `Done getting data at: ${dataPath}.`,
      });
      return data;
    }
  };
}

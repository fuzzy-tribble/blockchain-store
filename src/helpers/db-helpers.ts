import { Mongoose } from "mongoose";
import { databaseConfigs } from "../lib/config";
import Logger from "../lib/logger";
import { Event, Account } from "../models";
import { IAccount } from "../models/account";

export class BlockchainStoreDb {
  public db: Mongoose;

  constructor() {
    this.db = new Mongoose();
  }

  ready = async (url: string = databaseConfigs.url) => {
    Logger.info({
      at: "BlockchainDb#ready",
      message: `Attempting to connect to db at: ${url}`,
    });
    await this.db.connect(url);
    Logger.info({
      at: "BlockchainDb#ready",
      message: "Connected. Ready to go.",
    });
  };

  addEvent = async (eventName: string, eventData: any) => {
    try {
      Logger.info({
        at: "BlockchainDb#addEvent",
        message: `Adding event: ${eventName}...`,
      });
      const newEvent = await Event.create({ name: eventName, data: eventData });
      const res = newEvent.save();
      Logger.info({
        at: "BlockchainDb#addEvent",
        message: `Event added: ${eventName}.`,
        res: res,
      });
    } catch (err) {
      Logger.error({
        at: "BlockchainDb#addEvent",
        message: `Error adding event: ${eventName}`,
        error: err,
      });
    }
  };

  updateAccounts = async (accounts: IAccount[]) => {
    console.log("TODO - updateAccounts  IMPLEMENT", accounts);
  };

  getLastBlockChecked = async (
    network: string,
    client: string
  ): Promise<number> => {
    console.log("TODO - getLastBlockChecked  IMPLEMENT", network, client);
    return 0;
  };

  accountNeedsUpdate = async (account: IAccount): Promise<boolean> => {
    console.log("TODO - accountNeedsUpdate  IMPLEMENT", account);
    return false;
  };

  // _isNewAccount()
  // _isOldAccount()
  // _isRiskyAccount()
  // _getLatestAccountHealthScore()?
  // _isLiquidatableAccount()
  // getRiskyAccounts(keyName, maxPercentile or number of accounts)
}

const db = new BlockchainStoreDb();

export default db;

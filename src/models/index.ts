import mongoose from "mongoose";
import Logger from "../lib/logger";
import { ClientFunctionResult } from "../lib/types";
import { Config, IConfig } from "./config";
import { Event, IEvent } from "./event";
import { Account, IAccount } from "./account";
import { Reserve, IReserve } from "./reserve";

export { IConfig, IEvent, IAccount, IReserve };
export { Config, Event, Account, Reserve };

// TODO - auto do this using mongo connection.collections perhaps...
export enum CollectionNames {
  CONFIGS = "configs",
  EVENTS = "events",
  ACCOUNTS = "accounts",
  RESERVES = "reserves",
  TEST = "test",
}

export const updateDatabase = async (
  fRes: ClientFunctionResult
): Promise<number> => {
  let res = 0;
  switch (fRes.collection) {
    case CollectionNames.ACCOUNTS:
      res = await Account.addData(fRes.data);
      break;
    case CollectionNames.RESERVES:
      res = await Reserve.addData(fRes.data);
      break;
    case CollectionNames.EVENTS:
      res = await Event.addData(fRes.data);
      break;
    default:
      // TEST Collection or anything else
      break;
  }
  return res;
};

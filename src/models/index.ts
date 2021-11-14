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
}

// TODO - maybe move db helpers to this file and keep db stuff together

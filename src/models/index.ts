import { Schema, Error, QueryOptions } from "mongoose";
import { ClientFunctionResult } from "../lib/types";
// import { Config, IConfig } from "./config";
// import { Event, IEvent } from "./event";
// import { Account, IAccount } from "./account";
// import { AccountReserve, IAccountReserve } from "./account-reserve";
// import { Reserve, IReserve } from "./reserve";
// import { Token, IToken } from "./token";
// import { TokenPrice, ITokenPrice } from "./token-price";

// export {
//   IToken,
//   ITokenPrice,
//   IConfig,
//   IEvent,
//   IAccount,
//   IAccountReserve,
//   IReserve,
// };
// export { Token, TokenPrice, Config, Event, Account, AccountReserve, Reserve };

export interface UpdateResult {
  upsertedCount: number;
  modifiedCount: number;
  matchedCount: number;
  upsertedIds: string[];
}

// TODO - auto do this using mongo connection.collections perhaps...
export enum CollectionNames {
  CONFIGS = "configs",
  EVENTS = "events",
  ACCOUNTS = "accounts",
  ACCOUNT_RESERVES = "account-reserves",
  RESERVES = "reserves",
  TOKENS = "tokens",
  TOKEN_PRICES = "token-prices",
  TEST = "test",
}

export const defaultQueryOptions: QueryOptions = {
  // returnDocument: "after",
  upsert: true,
  runValidators: true,
  new: true, // otherwise will fail on empty collection
};

export const defaultSchemaOpts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  timestamps: true,
  // toJSON() or toObject() will not include virtuals by default
  toJSON: { getters: true, virtuals: true },
  toObject: { virtuals: true },
};

Schema.Types.String.checkRequired((v) => {
  return typeof v === "string";
});

// Validators are not run on undefined values (the
// only exception is the required validator), this allows checking
// Allow empty strings to pass the `required` validator (but not null)
// that required values are actuall provided
export const validateRequiredFields = (
  update: object,
  fieldsList: Array<string>
) => {
  let invalidValues: string[] = [];
  fieldsList.forEach((field) => {
    if (update[field] === null || update[field] === undefined) {
      invalidValues.push(
        `Field: ${field} is ${update[field]} (undefined or null) but not allowed to be`
      );
    }
  });
  if (invalidValues.length > 0) {
    throw new Error.ValidatorError({
      message: `The following values are null or undefined: ${invalidValues}`,
    });
  }
};

// export const updateDatabase = async (
//   fRes: ClientFunctionResult
// ): Promise<number> => {
//   let res = 0;
//   switch (fRes.collection) {
//     case CollectionNames.ACCOUNTS:
//       res = await Account.addData(fRes.data as IAccount[]);
//       break;
//     case CollectionNames.RESERVES:
//       res = (await Reserve.addData(fRes.data as IReserve[])) as number;
//       break;
//     case CollectionNames.EVENTS:
//       res = await Event.addData(fRes.data as IEvent[]);
//       break;
//     default:
//       // TEST Collection or anything else
//       break;
//   }
//   return res;
// };

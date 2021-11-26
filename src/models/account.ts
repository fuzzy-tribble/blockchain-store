import {
  Document,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  Schema,
  Error,
} from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, NetworkNames } from "../lib/types";
import { defaultSchemaOpts, validateRequiredFields } from ".";
export interface IAccount {
  address: string;
  client: ClientNames;
  network: NetworkNames;
}
export interface IAccountHealth {
  underCollateralizationRiskScore: number;
  totalBorrowedInEth: number;
  totalCollateralInEth: number;
  totalLiquidationThreshold: number;
}

// DOCUMENT DEFS //
export interface IAccountDoc extends IAccount, Document {
  // TODO - functions for specific documents
}

enum PropertyNames {
  ADDRESS = "address",
  CLIENT = "client",
  NETWORK = "network",
}

// MODEL DEFS //
export interface IAccountModel extends Model<IAccountDoc> {
  addData(accounts: IAccount[]): Promise<number>;
  addDataAndGetIds(accounts: IAccount[]): Promise<Array<number | undefined>>;
  findAccountsOlderThan(age: number): Promise<IAccountDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountSchemaFields: Record<keyof IAccount, any> = {
  address: {
    type: String,
    default: null,
    required: true,
  },
  client: {
    type: String,
    enum: ClientNames,
    default: null,
    required: true,
  },
  network: {
    type: String,
    enum: NetworkNames,
    default: null,
    required: true,
  },
};

const AccountSchema = new Schema(AccountSchemaFields, defaultSchemaOpts);
AccountSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

AccountSchema.pre(["findOneAndUpdate", "updateOne"], function () {
  validateRequiredFields(this.getUpdate() as IAccount, [
    "client",
    "network",
    "address",
  ]);
});

AccountSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateAccount",
    message: `Account updated: ${res.client}.${res.address}.${res.network}.`,
  });
});

AccountSchema.statics.addData = async function (
  accounts: IAccount[]
): Promise<number> {
  let nChanged: number = 0;
  let options: QueryOptions = {
    // returnDocument: "after",
    upsert: true,
    runValidators: true,
    new: true, // otherwise will fail on empty collection
  };
  let summaryRes = {
    nUpserted: 0,
    nModified: 0,
  };
  try {
    await Promise.all(
      accounts.map(async (account) => {
        let filter: FilterQuery<IAccountDoc> = {
          address: account.address,
          client: account.client,
          network: account.network,
        };
        let oneUpdatedRes = await Account.updateOne(filter, account, options);
        summaryRes.nUpserted =
          summaryRes.nUpserted + oneUpdatedRes.upsertedCount;
        summaryRes.nUpserted =
          summaryRes.nUpserted + oneUpdatedRes.modifiedCount;
      })
    );
    Logger.info({
      at: "Database#postUpdateAccount",
      message: `Accounts updated (nUpserted: ${summaryRes.nUpserted}, nModified: ${summaryRes.nModified})`,
    });
    nChanged = summaryRes.nUpserted + summaryRes.nModified;
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating accounts.`,
      error: err,
    });
  } finally {
    return nChanged;
  }
};

AccountSchema.statics.addDataAndGetIds = async function (
  accounts: IAccount[]
): Promise<Array<number | undefined>> {
  let returnResult: Array<number | undefined> = [];
  let options: QueryOptions = {
    // returnDocument: "after",
    upsert: true,
    runValidators: true,
    new: true, // otherwise will fail on empty collection
  };
  try {
    returnResult = await Promise.all(
      accounts.map(async (account) => {
        let filter: FilterQuery<IAccountDoc> = {
          address: account.address,
          client: account.client,
          network: account.network,
        };
        let accountDoc = await Account.findOneAndUpdate(
          filter,
          account,
          options
        );
        return accountDoc?._id;
      })
    );
  } catch (err) {
    Logger.error({
      at: "Database#addDataAndGetIds",
      message: `Error updating accounts.`,
      error: err,
    });
  } finally {
    return returnResult;
  }
};

// AccountSchema.statics.findByClientNetworkToken = async function (
//   client: ClientNames,
//   network: NetworkNames,
//   token: IToken
// ) {
//   const filter = {
//     client: client,
//     network: network,
//     reserveIds: {},
//   };
//   Account.find(filter, function (err, docs) {});
// };

// AccountSchema.virtual("health").get(async function (): Promise<IAccountHealth> {
//   // TODO - implement
//   return {
//     underCollateralizationRiskScore: 0,
//     totalBorrowedInEth: 0,
//     totalCollateralInEth: 0,
//     totalLiquidationThreshold: 0,
//   };
// });

const Account = model<IAccountDoc, IAccountModel>("accounts", AccountSchema);

export { Account };

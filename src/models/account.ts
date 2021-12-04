import {
  Document,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  Schema,
} from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, DatabaseUpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  customRequiredFieldsValidation,
} from "../helpers/db-helpers";
export interface IAccount {
  address: string;
  client: ClientNames;
  network: string;
  [x: string]: any;
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
  addData(accounts: IAccount[]): Promise<DatabaseUpdateResult>;
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
    // enum: NetworkNames,
    default: null,
    required: true,
  },
};

const AccountSchema = new Schema(AccountSchemaFields, defaultSchemaOpts);
AccountSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

AccountSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), AccountSchema.obj);
});

AccountSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateAccount",
    message: `Account updated: ${res.client}.${res.address}.${res.network}.`,
  });
});

AccountSchema.statics.addData = async function (
  accounts: IAccount[]
): Promise<DatabaseUpdateResult> {
  let updateRes: DatabaseUpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  await Promise.all(
    accounts.map(async (account) => {
      try {
        let filter: FilterQuery<IAccountDoc> = {
          address: account.address,
          client: account.client,
          network: account.network,
        };
        let doc = await Account.findOne(filter);
        let res = await Account.updateOne(filter, account, defaultQueryOptions);

        updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
        updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
        doc ? updateRes.modifiedIds.push(doc.id) : "";
        res.upsertedId
          ? updateRes.upsertedIds.push(res.upsertedId.toString())
          : "";
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating accounts.`,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateAccount",
    message: `Accounts updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount})`,
  });
  return updateRes;
};

const Account = model<IAccountDoc, IAccountModel>("accounts", AccountSchema);

export { Account };

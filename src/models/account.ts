import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, NetworkNames } from "../lib/types";
export interface IAccount {
  client: ClientNames;
  network: NetworkNames;
  address: string;
  data?: Array<Record<any, any>>;
}

// DOCUMENT DEFS //
export interface IAccountDoc extends IAccount, Document {
  // TODO - functions for specific documents
}

enum PropertyNames {
  CLIENT = "client",
  NETWORK = "network",
  ADDRESS = "address",
  DATA = "data",
}

// MODEL DEFS //
export interface IAccountModel extends Model<IAccountDoc> {
  addData(accounts: IAccount[]): Promise<number>;
  findAccountsOlderThan(age: number): Promise<IAccountDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountSchemaFields: Record<keyof IAccount, any> = {
  client: { type: String, reqired: true },
  network: { type: String, required: true },
  address: { type: String, required: true },
  data: { type: Array, required: true, default: [] },
};

const schemaOpts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  timestamps: true,
};

const AccountSchema = new Schema(AccountSchemaFields, schemaOpts);

// Compound index must be unique
AccountSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

AccountSchema.statics.addData = async function (
  accounts: IAccount[]
): Promise<number> {
  let numChanged = 0;
  try {
    Logger.info({
      at: "Database#updateAccounts",
      message: `Updating accounts...`,
    });
    let writes: Array<any> = accounts.map((account) => {
      return {
        updateOne: {
          filter: {
            client: account.client,
            network: account.network,
            address: account.address,
          },
          update: {
            $push: { data: account.data },
          },
          upsert: true,
        },
      };
    });
    const res = await this.bulkWrite(writes);
    numChanged = res.nInserted + res.nUpserted + res.nModified;
    Logger.info({
      at: "Database#updateAccounts",
      message: `Accounts changed: ${numChanged}.`,
      details: `nInserted: ${res.nInserted}, nUpserted: ${res.nUpserted},  nModified: ${res.nModified}`,
    });
    if (res.hasWriteErrors()) {
      throw Error(
        `Encountered the following write errors: ${res.getWriteErrors()}`
      );
    }
  } catch (err) {
    Logger.error({
      at: "Database#updateAccounts",
      message: `Error updating accounts.`,
      error: err,
    });
  } finally {
    return numChanged;
  }
};

const Account = model<IAccountDoc, IAccountModel>(
  "accounts",
  AccountSchema
  // "accounts"
);

export { Account };

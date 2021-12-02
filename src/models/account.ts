import {
  Document,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  Schema,
} from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, NetworkNames, UpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  updateValidation,
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
  addData(accounts: IAccount[]): Promise<UpdateResult>;
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

AccountSchema.pre(["updateOne"], updateValidation);

AccountSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateAccount",
    message: `Account updated: ${res.client}.${res.address}.${res.network}.`,
  });
});

AccountSchema.statics.addData = async function (
  accounts: IAccount[]
): Promise<UpdateResult> {
  let updateRes: UpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    matchedCount: 0,
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
        updateRes.matchedCount = updateRes.matchedCount + res.matchedCount;
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

// AccountSchema.statics.addDataAndGetIds = async function (
//   accounts: IAccount[]
// ): Promise<Array<number | undefined>> {
//   let returnResult: Array<number | undefined> = [];
//   let options: QueryOptions = {
//     // returnDocument: "after",
//     upsert: true,
//     runValidators: true,
//     new: true, // otherwise will fail on empty collection
//   };
//   try {
//     returnResult = await Promise.all(
//       accounts.map(async (account) => {
//         let filter: FilterQuery<IAccountDoc> = {
//           address: account.address,
//           client: account.client,
//           network: account.network,
//         };
//         let accountDoc = await Account.findOneAndUpdate(
//           filter,
//           account,
//           options
//         );
//         return accountDoc?._id;
//       })
//     );
//   } catch (err) {
//     Logger.error({
//       at: "Database#addDataAndGetIds",
//       message: `Error updating accounts.`,
//       error: err,
//     });
//   } finally {
//     return returnResult;
//   }
// };

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

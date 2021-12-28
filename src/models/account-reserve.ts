/**
 * Account Reserve model
 *
 * The data of an accounts holdings in a particular reserve
 */
import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import { IAccount, Account, IAccountDoc } from "./account";
import { IReserve, Reserve, IReserveDoc } from "./reserve";
import Logger from "../lib/logger";
import { ClientNames, DatabaseUpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  customRequiredFieldsValidation,
} from "../helpers/db-helpers";

export interface IAccountReserve {
  uid: string;
  account: string | FilterQuery<IAccountDoc>;
  reserve: string | FilterQuery<IReserveDoc>;
  collateralizedByUser?: boolean;
  liquidationThreshold?: number;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface IAccountReserveDoc extends IAccountReserve, Document {}

enum PropertyNames {
  ACCOUNT = "account",
  RESERVE = "reserve",
}

// MODEL DEFS //
export interface IAccountReserveModel extends Model<IAccountReserveDoc> {
  findByClientNetworkToken(
    client: ClientNames,
    network: string,
    tokenId: string
  ): Promise<string[] | null>;
  addData(accountReserves: IAccountReserve[]): Promise<DatabaseUpdateResult>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountReserveSchemaFields: Record<keyof IAccountReserve, any> = {
  uid: { type: String, required: true },
  account: { type: Schema.Types.ObjectId, ref: "accounts", reqired: true },
  reserve: { type: Schema.Types.ObjectId, ref: "reserves", reqired: true },
  collateralizedByUser: { type: Boolean, required: false },
  liquidationThreshold: { type: Number, required: false },
};

const AccountReserveSchema = new Schema(
  AccountReserveSchemaFields,
  defaultSchemaOpts
);

AccountReserveSchema.index({ account: 1, reserve: 1 }, { unique: true });

AccountReserveSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), AccountReserveSchema.obj);
  // verify last update is newew
});

/**
 * Updates/upserts account reserve data for existing accounts and reserves
 *
 * Finds account object id by accountReserve.account filter (or object id string)
 * Finds reserve object id by accountReserve.reserve filter (or object id string)
 * Then updates/upserts account reserve by uid, accountId, reserveId
 * @param accountReserves
 * @returns
 */
AccountReserveSchema.statics.addData = async function (
  accountReserves: IAccountReserve[]
): Promise<DatabaseUpdateResult> {
  let updateRes: DatabaseUpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  await Promise.all(
    accountReserves.map(async (accountReserve) => {
      try {
        Logger.debug({
          at: "Database#addData",
          message: `Account Reserve: `,
          accountReserveUid: accountReserve.uid,
          // data: accountReserve,
        });
        // If objectId string isn't provided lookup the object ids
        if (typeof accountReserve.account === "object") {
          let accountDoc = await Account.findOne(accountReserve.account);
          accountDoc ? (accountReserve.account = accountDoc.id) : null;
        } else {
          Logger.debug({
            at: "Database#addData",
            message: `Account Reserve account object id provided: ${accountReserve.account}`,
          });
        }
        if (typeof accountReserve.reserve === "object") {
          let reserveDoc = await Reserve.findOne(
            accountReserve.reserve as FilterQuery<IReserveDoc>
          );
          reserveDoc ? (accountReserve.reserve = reserveDoc.id) : null;
        } else {
          Logger.debug({
            at: "Database#addData",
            message: `Account Reserve reserve object id provided: ${accountReserve.reserve}`,
          });
        }
        if (
          typeof accountReserve.account === "string" &&
          typeof accountReserve.reserve === "string"
        ) {
          let filter: FilterQuery<IAccountReserveDoc> = {
            uid: accountReserve.uid,
            account: accountReserve.account,
            reserve: accountReserve.reserve,
          };
          let doc = await AccountReserve.findOne(filter);
          let res = await AccountReserve.updateOne(
            filter,
            accountReserve,
            defaultQueryOptions
          );
          updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
          updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
          doc ? updateRes.modifiedIds.push(doc.id) : "";
          res.upsertedId
            ? updateRes.upsertedIds.push(res.upsertedId.toString())
            : "";
        } else {
          throw new Error(
            `Account id and/or reserve id not found for given account reserve`
          );
        }
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating account-reserve.`,
          accountReserveUid: accountReserve.uid,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateAccountReserve",
    message: `AccountReserve updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount}, nInvalid: ${updateRes.invalidCount})`,
  });
  return updateRes;
};

AccountReserveSchema.statics.findByClientNetworkToken = async function (
  client: ClientNames,
  network: string,
  tokenId: string
): Promise<string[] | null> {
  let res: string[] = [];

  let accountId = "093098";
  let reserveId = "347834";
  res.push(accountId.concat(reserveId));

  return res.length == 0 ? null : res;
};

const AccountReserve = model<IAccountReserveDoc, IAccountReserveModel>(
  "accountReserves",
  AccountReserveSchema
);

export { AccountReserve };

import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import { IAccount, Account } from "./account";
import { IReserve, Reserve } from "./reserve";
import Logger from "../lib/logger";
import { UpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  updateValidation,
} from "../helpers/db-helpers";

export interface IAccountReserve {
  account: string | IAccount;
  reserve: string | IReserve;
  collateralizedByUser?: boolean;
  liquidationThreshold?: number;
  // currentTotalCollateral: number; // aToken in aave
  // currentTotalDebt: number;
}

// DOCUMENT DEFS //
export interface IAccountReserveDoc extends IAccountReserve, Document {}

enum PropertyNames {
  ACCOUNT = "account",
  RESERVE = "reserve",
}

// MODEL DEFS //
export interface IAccountReserveModel extends Model<IAccountReserveDoc> {
  addData(accountReserves: IAccountReserve[]): Promise<UpdateResult>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountReserveSchemaFields: Record<keyof IAccountReserve, any> = {
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
  updateValidation(this.getUpdate(), AccountReserveSchema.obj);
});

AccountReserveSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateAccountReserve",
    message: `Account Reserve updated: ${res.account}.${res.reserve}`,
  });
});

AccountReserveSchema.statics.addData = async function (
  accountReserves: IAccountReserve[]
): Promise<UpdateResult> {
  let updateRes: UpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  await Promise.all(
    accountReserves.map(async (accountReserve) => {
      try {
        let accountRes = await Account.addData([
          accountReserve.account as IAccount,
        ]);
        let reserveRes = await Reserve.addData([
          accountReserve.reserve as IReserve,
        ]);
        let accountId = accountRes.upsertedIds.concat(
          accountRes.modifiedIds
        )[0];
        let reserveId = reserveRes.upsertedIds.concat(
          reserveRes.modifiedIds
        )[0];

        if (accountId && reserveId) {
          accountReserve["account"] = accountId;
          accountReserve["reserve"] = reserveId;
          let filter: FilterQuery<IAccountReserveDoc> = {
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
          updateRes.upsertedIds.push(res.upsertedId.toString());
        } else {
          updateRes.invalidCount = updateRes.invalidCount + 1;
          Logger.error({
            at: "Database#addData",
            message: `accountId and reserveId not found for: ${accountReserve}`,
          });
        }
      } catch (err) {
        Logger.error({
          at: "Database#addData",
          message: `Error updating account-reserve.`,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateAccountReserve",
    message: `AccountReserve updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount})`,
  });
  return updateRes;
};

const AccountReserve = model<IAccountReserveDoc, IAccountReserveModel>(
  "account-reserves",
  AccountReserveSchema
);

export { AccountReserve };

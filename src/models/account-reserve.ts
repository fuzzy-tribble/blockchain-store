import {
  Document,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  Schema,
} from "mongoose";
import { IAccount, Account } from "./account";
import { IReserve, Reserve } from "./reserve";
import Logger from "../lib/logger";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  validateRequiredFields,
} from ".";

export interface IAccountReserve {
  account: number | IAccount;
  reserve: number | IReserve;
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
  addData(accountReserves: IAccountReserve[]): Promise<number>;
  addDataAndGetIds(accountReserves: IAccountReserve[]): Promise<Array<number>>;
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

AccountReserveSchema.pre(["findOneAndUpdate", "updateOne"], function () {
  validateRequiredFields(this.getUpdate() as IAccountReserve, [
    "account",
    "reserve",
  ]);
});

AccountReserveSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateAccountReserve",
    message: `Account Reserve updated: ${res.account}.${res.reserve}`,
  });
});

AccountReserveSchema.statics.addData = async function (
  accountReserves: IAccountReserve[]
): Promise<number> {
  let nChanged: number = 0;
  let summaryRes = {
    nUpserted: 0,
    nModified: 0,
  };
  try {
    await Promise.all(
      accountReserves.map(async (accountReserve) => {
        let [accountId] = await Account.addDataAndGetIds([
          accountReserve.account as IAccount,
        ]);
        let [reserveId] = await Reserve.addDataAndGetIds([
          accountReserve.reserve as IReserve,
        ]);
        if (accountId && reserveId) {
          accountReserve["account"] = accountId;
          accountReserve["reserve"] = reserveId;
          let filter: FilterQuery<IAccountReserveDoc> = {
            account: accountReserve.account,
            reserve: accountReserve.reserve,
          };
          let oneUpdatedRes = await AccountReserve.updateOne(
            filter,
            accountReserve,
            defaultQueryOptions
          );
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.upsertedCount;
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.modifiedCount;
        }
      })
    );
    Logger.info({
      at: "Database#postUpdateAccountReserve",
      message: `AccountReserve updated (nUpserted: ${summaryRes.nUpserted}, nModified: ${summaryRes.nModified})`,
    });
    nChanged = summaryRes.nUpserted + summaryRes.nModified;
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating account-reserve.`,
      error: err,
    });
  } finally {
    return nChanged;
  }
};

AccountReserveSchema.statics.addDataAndGetIds = async function (
  accountReserves: IAccountReserve[]
): Promise<Array<number>> {
  let returnResult: Array<number> = [];
  try {
    await Promise.all(
      accountReserves.map(async (accountReserve) => {
        console.log("ACCOUNT-RESERVE: ", accountReserve);
        let [accountId] = await Account.addDataAndGetIds([
          accountReserve.account as IAccount,
        ]);
        let [reserveId] = await Reserve.addDataAndGetIds([
          accountReserve.reserve as IReserve,
        ]);

        console.log("ACCOUNTID: ", accountId);
        console.log("RESERVEID: ", reserveId);

        if (accountId !== undefined && reserveId !== undefined) {
          accountReserve["account"] = accountId;
          accountReserve["reserve"] = reserveId;
          let filter: FilterQuery<IAccountReserveDoc> = {
            account: accountReserve.account,
            reserve: accountReserve.reserve,
          };
          let accountReserveDoc = await AccountReserve.findOneAndUpdate(
            filter,
            accountReserve,
            defaultQueryOptions
          );
          accountReserveDoc ? returnResult.push(accountReserveDoc?.id) : "";
        }
      })
    );
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating tokens.`,
      error: err,
    });
  } finally {
    return returnResult;
  }
};

const AccountReserve = model<IAccountReserveDoc, IAccountReserveModel>(
  "account-reserves",
  AccountReserveSchema
);

export { AccountReserve };

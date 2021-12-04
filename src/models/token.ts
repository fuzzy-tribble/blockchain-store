import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { DatabaseUpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  customRequiredFieldsValidation,
} from "../helpers/db-helpers";
export interface IToken {
  uid: string;
  platforms: { [x: string]: string };
  symbol?: string;
  decimals?: number;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface ITokenDoc extends IToken, Document {}

enum PropertyNames {
  PLATFORMS = "platforms",
  SYMBOL = "symbol",
  UID = "uid",
  DECIMALS = "decimals",
}

// MODEL DEFS //
export interface ITokenModel extends Model<ITokenDoc> {
  addData(Tokens: IToken[]): Promise<DatabaseUpdateResult>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const TokenSchemaFields: Record<keyof IToken, any> = {
  uid: { type: String, required: true },
  platforms: {
    type: Map,
    of: String,
    required: true,
  },
  decimals: { type: Number, required: false, default: null },
  symbol: { type: String, required: false },
};

const TokenSchema = new Schema(TokenSchemaFields, defaultSchemaOpts);
TokenSchema.index({ uid: 1 }, { unique: true });

TokenSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), TokenSchema.obj);
});

// TokenSchema.post(["findOneAndUpdate"], function (res) {
//   Logger.info({
//     at: "Database#postUpdateToken",
//     message: `Token updated: ${res.address}.${res.network}.`,
//   });
// });

TokenSchema.statics.addData = async function (
  tokens: IToken[]
): Promise<DatabaseUpdateResult> {
  let updateRes: DatabaseUpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  // Note: update clause can't have an _id property
  await Promise.all(
    tokens.map(async (token) => {
      try {
        if (typeof token !== "object") {
          throw Error(`Type must be IToken object. Not ${typeof token}`);
        }
        let filter: FilterQuery<ITokenDoc> = {
          uid: token.uid,
        };

        let res = await Token.updateOne(
          filter,
          token,
          defaultQueryOptions
        ).exec();
        updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
        updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
        if (res.matchedCount > 0) {
          let doc = await Token.findOne(filter, "id uid").exec();
          doc ? updateRes.modifiedIds.push(doc.id) : "";
        }
        res.upsertedId
          ? updateRes.upsertedIds.push(res.upsertedId.toString())
          : "";
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating token: ${token.uid}`,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateToken",
    message: `Tokens updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount}, nInvalid: ${updateRes.invalidCount})`,
  });
  return updateRes;
};

const Token = model<ITokenDoc, ITokenModel>("tokens", TokenSchema);

export { Token };

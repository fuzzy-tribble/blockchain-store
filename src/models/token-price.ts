import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import { IToken, Token, ITokenDoc } from "./token";
import { ClientNames, DatabaseUpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  customRequiredFieldsValidation,
} from "../helpers/db-helpers";
import Logger from "../lib/logger";

export interface ITokenPrice {
  token: FilterQuery<ITokenDoc>;
  priceInEth: string;
  source: ClientNames;
  lastUpdated: string;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface ITokenPriceDoc extends ITokenPrice, Document {}

enum PropertyNames {
  TOKEN = "token",
}

// MODEL DEFS //
export interface ITokenPriceModel extends Model<ITokenPriceDoc> {
  addData(tokenPrices: ITokenPrice[]): Promise<DatabaseUpdateResult>;
  findLatestTokenPriceFromSource(
    token: IToken,
    source: ClientNames
  ): Promise<ITokenPriceDoc | null>;
  findPriceDiscrepanciesBySource(
    source: ClientNames
  ): Promise<PriceDiscrepancy | null>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const TokenPriceSchemaFields: Record<keyof ITokenPrice, any> = {
  token: { type: Schema.Types.ObjectId, ref: "tokens", required: true },
  priceInEth: { type: Number, required: true },
  source: { type: String, enum: ClientNames, required: true },
  lastUpdated: { type: Schema.Types.Date, required: true },
};

const TokenPriceSchema = new Schema(TokenPriceSchemaFields, defaultSchemaOpts);
TokenPriceSchema.index(
  { token: 1, lastUpdated: 1, source: 1 },
  { unique: true }
);

TokenPriceSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), TokenPriceSchema.obj);
});

TokenPriceSchema.statics.addData = async function (
  tokenPrices: ITokenPrice[]
): Promise<DatabaseUpdateResult> {
  let updateRes: DatabaseUpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  await Promise.all(
    tokenPrices.map(async (tokenPrice) => {
      try {
        let tokenDoc = await Token.findOne({ uid: tokenPrice.token.uid });
        if (tokenDoc) {
          tokenPrice["token"] = tokenDoc.id;
          let filter: FilterQuery<ITokenPriceDoc> = {
            token: tokenPrice.token,
            lastUpdated: tokenPrice.lastUpdated,
            source: tokenPrice.source,
          };
          let doc = await TokenPrice.findOne(filter);
          let res = await TokenPrice.updateOne(
            filter,
            tokenPrice,
            defaultQueryOptions
          );
          updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
          updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
          doc ? updateRes.modifiedIds.push(doc.id) : "";
          updateRes.upsertedIds.push(res.upsertedId.toString());
        } else {
          throw new Error(`Token id not found for token price for token`);
        }
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating token price.`,
          tokenPrice: tokenPrice.id,
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

TokenPriceSchema.statics.findLatestTokenPriceFromSource = async function (
  token: IToken,
  source: ClientNames
): Promise<ITokenPriceDoc | null> {
  let latestTokenPrice = await TokenPrice.findOne({
    token: await Token.find({
      network: token.network,
      address: token.address,
    }),
    source: source,
  })
    .sort({ lastUpdated: -1 })
    .populate("token");
  // .lean();
  return latestTokenPrice;
};

// TODO - implement and move
interface PriceDiscrepancy {
  sourceA: ClientNames;
  sourceB: ClientNames;
  token: IToken;
  discrepancy: number;
}

TokenPriceSchema.statics.findPriceDiscrepanciesBySource = async function (
  source: ClientNames
): Promise<PriceDiscrepancy | null> {
  // TODO
  // return {
  //   token: 0398209,
  //   prices: {
  //     exchangeA: 038409.2,
  //     exchangeB: 038409.2,
  //     exchangeC: 038409.2,
  //   }
  // }
  throw new Error("NOT IMPLEMENTED");
};

const TokenPrice = model<ITokenPriceDoc, ITokenPriceModel>(
  "tokenPrices",
  TokenPriceSchema
);

export { TokenPrice };

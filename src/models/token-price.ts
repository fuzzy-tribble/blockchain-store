import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import { IToken, Token, ITokenDoc } from "./token";
import { ClientNames, UpdateResult } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  updateValidation,
} from "../helpers/db-helpers";
import Logger from "../lib/logger";

export interface ITokenPrice {
  token: string | FilterQuery<ITokenDoc>;
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
  addData(tokenPrices: ITokenPrice[]): Promise<UpdateResult>;
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

TokenPriceSchema.pre(["updateOne"], updateValidation);

TokenPriceSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateTokenPrice",
    message: `Token price updated: ${res.token}.${res.priceInEth} (${res.source})`,
  });
});

TokenPriceSchema.statics.addData = async function (
  tokenPrices: ITokenPrice[]
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
    tokenPrices.map(async (tokenPrice) => {
      try {
        let { upsertedIds, modifiedIds } = await Token.addData([
          tokenPrice.token as IToken,
        ]);
        let tokenId = upsertedIds.concat(modifiedIds)[0];
        if (tokenId) {
          tokenPrice["token"] = tokenId;
          let filter: FilterQuery<ITokenPriceDoc> = {
            token: tokenId,
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
          updateRes.matchedCount = updateRes.matchedCount + res.matchedCount;
          doc ? updateRes.modifiedIds.push(doc.id) : "";
          updateRes.upsertedIds.push(res.upsertedId.toString());
        } else {
          updateRes.invalidCount = updateRes.invalidCount + 1;
        }
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating token prices.`,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateToken",
    message: `Tokens updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount})`,
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
  "token-prices",
  TokenPriceSchema
);

export { TokenPrice };

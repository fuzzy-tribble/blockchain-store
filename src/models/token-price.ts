import {
  Document,
  FilterQuery,
  model,
  Model,
  QueryOptions,
  Schema,
} from "mongoose";
import { IToken, Token } from "./token";
import { ClientNames } from "../lib/types";
import { defaultSchemaOpts, validateRequiredFields } from ".";
import Logger from "../lib/logger";

export interface ITokenPrice {
  token: number | IToken;
  priceInEth: number;
  source: ClientNames;
  lastUpdated: number;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface ITokenPriceDoc extends ITokenPrice, Document {}

enum PropertyNames {
  TOKEN = "token",
}

// MODEL DEFS //
export interface ITokenPriceModel extends Model<ITokenPriceDoc> {
  addData(tokenPrices: ITokenPrice[]): Promise<number>;
  findLatestTokenPriceFromSource(
    token: IToken,
    source: ClientNames
  ): Promise<ITokenPriceDoc | null>;
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

TokenPriceSchema.pre(["findOneAndUpdate", "updateOne"], function () {
  validateRequiredFields(this.getUpdate() as ITokenPrice, [
    "token",
    "priceInEth",
    "source",
    "lastUpdated",
  ]);
});

TokenPriceSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateTokenPrice",
    message: `Token price updated: ${res.token}.${res.priceInEth} (${res.source})`,
  });
});

TokenPriceSchema.statics.addData = async function (
  tokenPrices: ITokenPrice[]
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
      tokenPrices.map(async (tokenPrice) => {
        let tokenId: number | undefined;
        if (typeof tokenPrice.token !== "number") {
          [tokenId] = await Token.addDataAndGetIds([tokenPrice.token]);
        } else {
          tokenId = tokenPrice.token;
        }
        if (tokenId) {
          let filter: FilterQuery<ITokenPriceDoc> = {
            token: tokenId,
            lastUpdated: tokenPrice.lastUpdated,
            source: tokenPrice.source,
          };
          tokenPrice["token"] = tokenId;
          let oneUpdatedRes = await TokenPrice.updateOne(
            filter,
            tokenPrice,
            options
          );
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.upsertedCount;
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.modifiedCount;
        }
      })
    );
    Logger.info({
      at: "Database#postUpdateToken",
      message: `Tokens updated (nUpserted: ${summaryRes.nUpserted}, nModified: ${summaryRes.nModified})`,
    });
    nChanged = summaryRes.nUpserted + summaryRes.nModified;
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating tokens.`,
      error: err,
    });
  } finally {
    return nChanged;
  }
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

const TokenPrice = model<ITokenPriceDoc, ITokenPriceModel>(
  "token-prices",
  TokenPriceSchema
);

export { TokenPrice };

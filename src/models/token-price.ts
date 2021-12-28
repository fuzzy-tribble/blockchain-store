/**
 * Token price model
 */
import { Document, FilterQuery, model, Model, Schema } from "mongoose";
import { EventsManager } from "../helpers/socket-helpers";
import { IToken, Token, ITokenDoc } from "./token";
import { ClientNames, DatabaseUpdateResult, EventNames } from "../lib/types";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  customRequiredFieldsValidation,
} from "../helpers/db-helpers";
import Logger from "../lib/logger";

export interface ITokenPrice {
  token: string | FilterQuery<ITokenDoc>;
  priceInEth: string;
  source: ClientNames;
  lastUpdated: Date;
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
    tokenUid: string,
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
  lastUpdated: { type: Date, required: true },
};

const TokenPriceSchema = new Schema(TokenPriceSchemaFields, defaultSchemaOpts);
TokenPriceSchema.index(
  { token: 1, lastUpdated: 1, source: 1 },
  { unique: true }
);

TokenPriceSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), TokenPriceSchema.obj);
});

/**
 * Adds token price data for tokens that already exist in db
 *
 * @param text  Comment for parameter ´text´.
 * @event emits a token price update event if is latest update
 * @returns
 */
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
        Logger.debug({
          at: "Database#addData",
          message: `Token price token filter`,
          tokenFilter: tokenPrice.token,
        });
        if (typeof tokenPrice.token !== "string") {
          // need to get the id from the doc if id isn't provided
          let tokenDoc = await Token.findOne(tokenPrice.token);
          tokenDoc ? (tokenPrice.token = tokenDoc.id) : null;
        }
        if (tokenPrice.token !== null) {
          // add token price update even if not latest
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
          if (_isLatestUpdate(doc, tokenPrice)) {
            Logger.debug({
              at: "Database#addData",
              message: `Token price provided is latest. Emitting token price change event.`,
              current: doc?.lastUpdated,
              update: tokenPrice.lastUpdated,
            });
            let updatedDoc = await TokenPrice.findOne(filter);
            if (!updatedDoc)
              throw new Error(
                "Can't find updated token price doc for price change event"
              );
            _emitOnPriceChange(doc, updatedDoc);
          }
        } else {
          throw new Error(`Token uid not found for token price`);
        }
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating token price.`,
          tokenUid: tokenPrice.token,
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
  tokenUid: string,
  source: ClientNames
): Promise<ITokenPriceDoc | null> {
  return _findLatestTokenPrice(tokenUid, source);
};

const _findLatestTokenPrice = async (
  tokenUid: string,
  source: ClientNames
): Promise<ITokenPriceDoc | null> => {
  // TODO - update so source can be empty and find across all sources
  let latestTokenPrice = await TokenPrice.findOne({
    token: await Token.find({
      uid: tokenUid,
    }),
    source: source,
  })
    .sort({ lastUpdated: -1 })
    .populate("token");
  // .lean();
  return latestTokenPrice;
};

const _isLatestUpdate = (
  current: ITokenPriceDoc | null,
  update: ITokenPrice
): boolean => {
  if (current == null) return true;
  else return update.lastUpdated > current.lastUpdated;
};

const _emitOnPriceChange = (
  originalDoc: ITokenPriceDoc | null,
  updatedDoc: ITokenPriceDoc
): void => {
  try {
    EventsManager.emit(EventNames.IS_TOKEN_PRICE_CHANGE, {
      name: EventNames.IS_TOKEN_PRICE_CHANGE,
      source: "TokenPrice#addData",
      data: {
        original: originalDoc?.populate("token"),
        updated: updatedDoc.populate("token"),
      },
    });
  } catch (err) {
    Logger.error({
      at: "Database#emitOnPriceChange",
      message: `Couldn't emit price change event through events manager.`,
      tokenPrice: updatedDoc.id,
      error: err,
    });
  }
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

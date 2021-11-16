import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, ContractAddress, NetworkNames } from "../lib/types";

export interface ITokenPrice {
  priceInEth: string; // price in eth?
  source: ClientNames;
  timestamp: number;
  [x: string]: any;
}

export interface IToken {
  address: ContractAddress | string;
  network: NetworkNames;
  symbol: string;
  name: string;
  decimals: number;
  priceChangePercentage14dInEth?: number;
  priceChangePercentage1hInEth?: number;
  priceChangePercentage1yInEth?: number;
  priceChangePercentage200dInCurrency?: number;
  priceChangePercentage24hInCurrency?: number;
  priceChangePercentage30dInCurrency?: number;
  priceChangePercentage7dInCurrency?: number;
  priceHistory?: Array<ITokenPrice>;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface ITokenDoc extends IToken, Document {}

enum PropertyNames {
  ADDRESS = "address",
  NETWORK = "network",
  SYMBOL = "symbol",
  NAME = "name",
  DECIMALS = "decimals",
}

// MODEL DEFS //
export interface ITokenModel extends Model<ITokenDoc> {
  addData(Tokens: IToken[]): Promise<number>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const TokenSchemaFields: Record<keyof IToken, any> = {
  address: { type: String, required: true },
  network: { type: String, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  decimals: { type: String, required: true },
  priceHistory: { type: Array, required: true, default: [] },
};

const schemaOpts = {
  timestamps: true,
};
const TokenSchema = new Schema(TokenSchemaFields, schemaOpts);
TokenSchema.index({ network: 1, address: 1 }, { unique: true });
TokenSchema.statics.addData = async function (
  tokens: IToken[]
): Promise<number> {
  let numChanged = 0;
  try {
    Logger.info({
      at: "Database#addData",
      message: `Updating tokens...`,
    });
    let writes: Array<any> = tokens.map((token) => {
      return {
        updateOne: {
          filter: {
            network: token.network,
            address: token.address,
          },
          update: token,
          upsert: true,
        },
      };
    });
    const res = await this.bulkWrite(writes);
    numChanged = res.nInserted + res.nUpserted + res.nModified;
    Logger.info({
      at: "Database#updateData",
      message: `Tokens changed: ${numChanged}.`,
      details: `nInserted: ${res.nInserted}, nUpserted: ${res.nUpserted},  nModified: ${res.nModified}`,
    });
    if (res.hasWriteErrors()) {
      throw Error(
        `Encountered the following write errors: ${res.getWriteErrors()}`
      );
    }
  } catch (err) {
    Logger.error({
      at: "Database#updateData",
      message: `Error updating tokens.`,
      error: err,
    });
  } finally {
    return numChanged;
  }
};

const Token = model<ITokenDoc, ITokenModel>("tokens", TokenSchema);

export { Token };

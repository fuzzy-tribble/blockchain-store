import {
  Document,
  FilterQuery,
  QueryOptions,
  model,
  Model,
  Schema,
} from "mongoose";
import Logger from "../lib/logger";
import { NetworkNames } from "../lib/types";
import {
  UpdateResult,
  defaultQueryOptions,
  defaultSchemaOpts,
  validateRequiredFields,
} from ".";
export interface IToken {
  address: string;
  network: NetworkNames;
  symbol?: string;
  name?: string;
  decimals?: number;
  // volatilityRank?: number;
  // marketCapRank?: number;
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
  addData(Tokens: IToken[]): Promise<UpdateResult>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const TokenSchemaFields: Record<keyof IToken, any> = {
  address: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    enum: NetworkNames,
    required: true,
  },
  decimals: { type: Number, required: false, default: null },
  symbol: { type: String, required: false },
  name: { type: String, required: false },
  // volatilityRanking: { type: Number, default: 0 },
};

const TokenSchema = new Schema(TokenSchemaFields, defaultSchemaOpts);
TokenSchema.index({ network: 1, address: 1 }, { unique: true });

TokenSchema.pre(["findOneAndUpdate", "updateOne"], function () {
  validateRequiredFields(this.getUpdate() as IToken, ["network", "address"]);
});

TokenSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateToken",
    message: `Token updated: ${res.address}.${res.network}.`,
  });
});

TokenSchema.statics.addData = async function (
  tokens: IToken[]
): Promise<UpdateResult> {
  let updateRes: UpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    matchedCount: 0,
    upsertedIds: [],
  };
  try {
    await Promise.all(
      tokens.map(async (token) => {
        let filter: FilterQuery<ITokenDoc> = {
          network: token.network,
          address: token.address,
        };
        let res = await Token.updateOne(filter, token, defaultQueryOptions);
        updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
        updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
        updateRes.matchedCount = updateRes.matchedCount + res.matchedCount;
        updateRes.upsertedIds.push(res.upsertedId.toString());
      })
    );
    Logger.info({
      at: "Database#postUpdateToken",
      message: `Tokens updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount})`,
    });
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating tokens.`,
      error: err,
    });
  } finally {
    return updateRes;
  }
};

// TokenSchema.statics.addDataAndGetIds = async function (
//   tokens: IToken[]
// ): Promise<Array<number>> {
//   let returnResult: Array<number> = [];
//   let options: QueryOptions = {
//     // returnDocument: "after",
//     upsert: true,
//     runValidators: true,
//     new: true, // otherwise will fail on empty collection
//   };
//   try {
//     returnResult = await Promise.all(
//       tokens.map(async (token) => {
//         let filter: FilterQuery<ITokenDoc> = {
//           network: token.network,
//           address: token.address,
//         };
//         let tokenDoc = await Token.findOneAndUpdate(filter, token, options);
//         return tokenDoc?.id;
//       })
//     );
//   } catch (err) {
//     Logger.error({
//       at: "Database#addData",
//       message: `Error updating tokens.`,
//       error: err,
//     });
//   } finally {
//     return returnResult;
//   }
// };

// TokenSchema.statics.findByNetworkAddress = async function (
//   network: NetworkNames,
//   address: ContractAddress
// ) {
//   const filter = {
//     network: network,
//     address: address,
//   };
//   const tokenDoc = await this.findOne(filter);
//   return tokenDoc;
// };
// TokenSchema.statics.findLatestTokenPrice = async function (
//   tokenFilter,
//   priceSource: ClientNames = ClientNames.COINGECKO
// ) {
//   const res = await this.findOne(tokenFilter)
//     .populate({
//       path: "prices",
//       match: { source: priceSource },
//     })
//     .exec();
// };

// Schema virtuals
// TokenSchema.virtual("priceChangePercentage14dInEth").get(function () {
//   // TODO - get
// });
// priceChangePercentage14dInEth?: number;
//   priceChangePercentage1hInEth?: number;
//   priceChangePercentage1yInEth?: number;
//   priceChangePercentage200dInCurrency?: number;
//   priceChangePercentage24hInCurrency?: number;
//   priceChangePercentage30dInCurrency?: number;
//   priceChangePercentage7dInCurrency?: number;

const Token = model<ITokenDoc, ITokenModel>("tokens", TokenSchema);

export { Token };

// TODO - consider pruning unused tokens (annually or when db reaches certain size?)

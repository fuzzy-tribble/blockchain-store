import {
  FilterQuery,
  QueryOptions,
  Document,
  model,
  Model,
  Schema,
} from "mongoose";
import { validateRequiredFields, defaultSchemaOpts } from ".";
import Logger from "../lib/logger";
import { ClientNames, NetworkNames } from "../lib/types";
import { IToken, ITokenDoc, Token } from "./token";
export interface IReserve {
  client: ClientNames;
  network: NetworkNames;
  address: string;
  tokens: Array<number | IToken>;
  liquidationThreshold?: number;
}

// DOCUMENT DEFS //
export interface IReserveDoc extends IReserve, Document {}

enum PropertyNames {
  CLIENT = "client",
  NETWORK = "network",
  ADDRESS = "address",
}

// MODEL DEFS //
export interface IReserveModel extends Model<IReserveDoc> {
  addData(reserves: IReserve[]): Promise<number>;
  addDataAndGetIds(reserves: IReserve[]): Promise<Array<number>>;
  findByClientNetwork(
    client: ClientNames,
    network: NetworkNames
  ): Promise<IReserve[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const ReserveSchemaFields: Record<keyof IReserve, any> = {
  client: {
    type: String,
    enum: ClientNames,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    enum: NetworkNames,
    required: true,
  },
  tokens: [{ type: Schema.Types.ObjectId, ref: "tokens" }],
  liquidationThreshold: { type: Number, default: 0, required: true },
};

const ReserveSchema = new Schema(ReserveSchemaFields, defaultSchemaOpts);
ReserveSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

ReserveSchema.pre(["findOneAndUpdate", "updateOne"], function () {
  validateRequiredFields(this.getUpdate() as IReserve, [
    "client",
    "network",
    "address",
  ]);
});

ReserveSchema.post(["findOneAndUpdate"], function (res) {
  Logger.info({
    at: "Database#postUpdateReserve",
    message: `Reserve updated: ${res.client}.${res.network}.${res.address}.`,
  });
});

ReserveSchema.statics.findByClientNetwork = async function (
  client: ClientNames | null = null,
  network: NetworkNames | null = null
): Promise<IReserve[]> {
  let reserves: IReserve[] = [];
  try {
    Logger.info({
      at: "Database#getReserves",
      message: `Getting reserves ${client}, ${network}...`,
    });
    let filter = {};
    client ? Object.assign(filter, { client: client }) : null;
    network ? Object.assign(filter, { network: network }) : null;
    reserves = await this.find(filter).lean().exec();
    Logger.info({
      at: "Database#getReserves",
      message: `Matched: ${reserves.length}.`,
    });
  } catch (err) {
    Logger.error({
      at: "Database#getReserves",
      message: `Error getting reserves.`,
      error: err,
    });
  } finally {
    return reserves;
  }
};

ReserveSchema.statics.addData = async function (
  reserves: IReserve[]
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
      reserves.map(async (reserve) => {
        let tokenIds = await Token.addDataAndGetIds(reserve.tokens as IToken[]);
        if (tokenIds.length == reserve.tokens.length) {
          reserve["tokens"] = tokenIds;
          let filter: FilterQuery<IReserveDoc> = {
            network: reserve.network,
            client: reserve.client,
            address: reserve.address,
          };
          let oneUpdatedRes = await Reserve.updateOne(filter, reserve, options);
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.upsertedCount;
          summaryRes.nUpserted =
            summaryRes.nUpserted + oneUpdatedRes.modifiedCount;
        }
      })
    );
    Logger.info({
      at: "Database#postUpdateReserves",
      message: `Reserves updated (nUpserted: ${summaryRes.nUpserted}, nModified: ${summaryRes.nModified})`,
    });
    nChanged = summaryRes.nUpserted + summaryRes.nModified;
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating reserves.`,
      error: err,
    });
  } finally {
    return nChanged;
  }
};

ReserveSchema.statics.addDataAndGetIds = async function (
  reserves: IReserve[]
): Promise<Array<number>> {
  let returnResult: Array<number> = [];
  let options: QueryOptions = {
    // returnDocument: "after",
    upsert: true,
    runValidators: true,
    new: true, // otherwise will fail on empty collection
  };
  try {
    returnResult = await Promise.all(
      reserves.map(async (reserve) => {
        let tokenIds = await Token.addDataAndGetIds(reserve.tokens as IToken[]);
        if (tokenIds.length == reserve.tokens.length) {
          reserve["tokens"] = tokenIds as number[];
          let filter: FilterQuery<IReserveDoc> = {
            network: reserve.network,
            client: reserve.client,
            address: reserve.address,
          };
          let reserveDoc = await Reserve.findOneAndUpdate(
            filter,
            reserve,
            options
          );
          return reserveDoc?.id;
        }
      })
    );
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating reserves.`,
      error: err,
    });
  } finally {
    return returnResult;
  }
};

// ReserveSchema.statics.findMostInteresting = async function () {};

const Reserve = model<IReserveDoc, IReserveModel>("reserves", ReserveSchema);

export { Reserve };

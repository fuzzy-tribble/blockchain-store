/**
 * Reserve model
 */
import { FilterQuery, Document, model, Model, Schema, Query } from "mongoose";
import {
  defaultSchemaOpts,
  customRequiredFieldsValidation,
  defaultQueryOptions,
} from "../helpers/db-helpers";
import Logger from "../lib/logger";
import { ClientNames, DatabaseUpdateResult } from "../lib/types";
import { IToken, Token, ITokenDoc } from "./token";
export interface IReserve {
  uid: string;
  client: ClientNames;
  network: string;
  tokens: string[] | FilterQuery<ITokenDoc>[];
  liquidationThreshold?: number;
  [x: string]: any;
}

// DOCUMENT DEFS //
export interface IReserveDoc extends IReserve, Document {}

// MODEL DEFS //
export interface IReserveModel extends Model<IReserveDoc> {
  addData(reserves: IReserve[]): Promise<DatabaseUpdateResult>;
  findByClientNetwork(
    client: ClientNames,
    network: string
  ): Promise<IReserve[]>;
}

// SCHEMA DEFS //
const ReserveSchemaFields: Record<keyof IReserve, any> = {
  client: {
    type: String,
    enum: ClientNames,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    // enum: NetworkNames,
    required: true,
  },
  tokens: [{ type: Schema.Types.ObjectId, ref: "tokens" }],
  liquidationThreshold: { type: Number, default: 0, required: true },
};

const ReserveSchema = new Schema(ReserveSchemaFields, defaultSchemaOpts);
ReserveSchema.index({ client: 1, network: 1, uid: 1 }, { unique: true });

ReserveSchema.pre(["updateOne"], function () {
  customRequiredFieldsValidation(this.getUpdate(), ReserveSchema.obj);
});

ReserveSchema.statics.findByClientNetwork = async function (
  client: ClientNames | null = null,
  network: string | null = null
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

/**
 * Updates/upserts by uid, client, network
 * Adds tokens if they don't exist already,
 * then updates/upserts reserve by uid, client, network
 * @param reserves
 * @returns
 */
ReserveSchema.statics.addData = async function (
  reserves: IReserve[]
): Promise<DatabaseUpdateResult> {
  let updateRes: DatabaseUpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  await Promise.all(
    reserves.map(async (reserve) => {
      try {
        let tokenIds: string[] = [];
        let tokenFilters: Array<object> = [];
        reserve.tokens.forEach((token) => {
          typeof token === "string"
            ? tokenIds.push(token)
            : tokenFilters.push(token);
        });

        if (tokenFilters.length > 0) {
          let res = await Token.addData(tokenFilters as IToken[]);
          tokenIds.push(...res.upsertedIds);
          tokenIds.push(...res.modifiedIds);
        }
        if (tokenIds.length == reserve.tokens.length) {
          reserve.tokens = tokenIds;
          let filter: FilterQuery<IReserveDoc> = {
            uid: reserve.uid,
            network: reserve.network,
            client: reserve.client,
          };
          let res = await Reserve.updateOne(
            filter,
            reserve,
            defaultQueryOptions
          );
          updateRes.upsertedCount = updateRes.upsertedCount + res.upsertedCount;
          updateRes.modifiedCount = updateRes.modifiedCount + res.modifiedCount;
          if (res.matchedCount > 0) {
            let doc = await Reserve.findOne(filter).exec();
            doc ? updateRes.modifiedIds.push(doc.id) : "";
          }
          res.upsertedId
            ? updateRes.upsertedIds.push(res.upsertedId.toString())
            : "";
        } else {
          updateRes.invalidCount = updateRes.invalidCount + 1;
          Logger.error({
            at: "Database#addData",
            message: `Not all tokenIds updated successfully for reserve: ${reserve}`,
          });
        }
      } catch (err) {
        updateRes.invalidCount = updateRes.invalidCount + 1;
        Logger.error({
          at: "Database#addData",
          message: `Error updating reserves.`,
          error: err,
        });
      }
    })
  );
  Logger.info({
    at: "Database#postUpdateReserves",
    message: `Reserves updated (nUpserted: ${updateRes.upsertedCount}, nModified: ${updateRes.modifiedCount}, nInvalid: ${updateRes.invalidCount})`,
    // details: updateRes,
  });

  return updateRes;
};

const Reserve = model<IReserveDoc, IReserveModel>("reserves", ReserveSchema);

export { Reserve };

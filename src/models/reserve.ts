import { DaiPriceOracle } from "@dydxprotocol/solo/dist/build/wrappers/DaiPriceOracle";
import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { Client, Network } from "../lib/types";

interface ITokenPrice {
  price: string; // price in eth?
  timestamp: number;
  [x: string]: any;
}

export interface IToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  priceHistory?: Array<ITokenPrice>;
  [x: string]: any;
}

export interface IReserve {
  client: Client;
  network: Network;
  address: string;
  token1: IToken;
  token2?: IToken;
  token3?: IToken;
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
  upsertMany(reserves: IReserve[]): Promise<number>;
  findByClientNetwork(client: Client, network: Network): Promise<IReserve[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const ReserveSchemaFields: Record<keyof IReserve, any> = {
  client: { type: String, reqired: true },
  network: { type: String, required: true },
  address: { type: String, required: true },
  token1: { type: Map, required: false },
  token2: { type: Map, required: false, default: {} },
  token3: { type: Map, required: false, default: {} },
};

const schemaOpts = {
  timestamps: true,
};

const ReserveSchema = new Schema(ReserveSchemaFields, schemaOpts);

ReserveSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

ReserveSchema.statics.findByClientNetwork = async function (
  client: Client | null = null,
  network: Network | null = null
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

ReserveSchema.statics.upsertMany = async function (
  reserves: Array<IReserve>
): Promise<number> {
  let numChanged = 0;
  try {
    Logger.info({
      at: "Database#updateReserves",
      message: `Updating reserves...`,
    });
    let writes: Array<any> = reserves.map((reserve) => {
      return {
        updateOne: {
          filter: {
            client: reserve.client,
            network: reserve.network,
            address: reserve.address,
          },
          update: reserve,
          upsert: true,
        },
      };
    });
    const res = await this.bulkWrite(writes);
    numChanged = res.nInserted + res.nUpserted + res.nModified;
    Logger.info({
      at: "Database#updateReserves",
      message: `Reserves changed: ${numChanged}.`,
      details: `nInserted: ${res.nInserted}, nUpserted: ${res.nUpserted},  nModified: ${res.nModified}`,
    });
    if (res.hasWriteErrors()) {
      throw Error(
        `Encountered the following write errors: ${res.getWriteErrors()}`
      );
    }
  } catch (err) {
    Logger.error({
      at: "Database#updateReserves",
      message: `Error updating reserves.`,
      error: err,
    });
  } finally {
    return numChanged;
  }
};

const Reserve = model<IReserveDoc, IReserveModel>("reserves", ReserveSchema);

export { Reserve };

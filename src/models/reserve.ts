import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { ClientNames, NetworkNames } from "../lib/types";
import { IToken, ITokenDoc, Token } from "./token";
export interface IReserve {
  client: ClientNames;
  network: NetworkNames;
  address: string;
  tokenIds: Array<number>;
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
  findByClientNetwork(
    client: ClientNames,
    network: NetworkNames
  ): Promise<IReserve[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const ReserveSchemaFields: Record<keyof IReserve, any> = {
  client: { type: String, reqired: true },
  network: { type: String, required: true },
  address: { type: String, required: true },
  tokenIds: { type: Array, required: false },
};

const schemaOpts = {
  timestamps: true,
};

const ReserveSchema = new Schema(ReserveSchemaFields, schemaOpts);

ReserveSchema.index({ client: 1, network: 1, address: 1 }, { unique: true });

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
  let reservesNumChanged = 0;
  try {
    Logger.info({
      at: "Database#updateReserves",
      message: `Updating reserves...`,
    });
    let tokens: IToken[] = [];
    let writes: Array<any> = reserves.map((reserve) => {
      reserve.tokens.forEach((token) => tokens.push(token));
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
    const reserveRes = await this.bulkWrite(writes);
    const tokenNumChanged = await Token.addData(tokens);
    reservesNumChanged =
      reserveRes.nInserted + reserveRes.nUpserted + reserveRes.nModified;
    Logger.info({
      at: "Database#updateReserves",
      message: `Reserves changed: ${reservesNumChanged}`,
      reserveDetails: `nInserted: ${reserveRes.nInserted}, nUpserted: ${reserveRes.nUpserted},  nModified: ${reserveRes.nModified}`,
    });
    if (reserveRes.hasWriteErrors()) {
      throw Error(
        `Encountered the following write errors: ${reserveRes.getWriteErrors()}`
      );
    }
  } catch (err) {
    Logger.error({
      at: "Database#updateReserves",
      message: `Error updating reserves.`,
      error: err,
    });
  } finally {
    return reservesNumChanged;
  }
};

ReserveSchema.post("validate", async function (reserveDoc: IReserveDoc) {
  await Token.addData(reserveDoc.tokens as IToken[]);
});

// TODO - consider pruning unused tokens (annually or when db reaches certain size?)

const Reserve = model<IReserveDoc, IReserveModel>("reserves", ReserveSchema);

export { Reserve };

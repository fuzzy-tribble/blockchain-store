import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { NetworkNames, ClientNames } from "../lib/types";
export interface IEvent {
  name: string;
  data?: {};
  network?: NetworkNames;
  client?: ClientNames;
}

// DOCUMENT DEFS //
export interface IEventDoc extends IEvent, Document {}

enum PropertyNames {
  NAME = "name",
  NETWORK = "network",
  CLIENT = "client",
  DATA = "data",
}

// MODEL DEFS //
export interface IEventModel extends Model<IEventDoc> {
  addData(events: Array<IEvent[]>): Promise<number>;
  findLiquidationEvents(): Promise<IEventDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const EventSchemaFields: Record<keyof IEvent, any> = {
  name: { type: String, required: true },
  data: { type: Object, required: false },
  network: { type: String, required: false, default: "" },
  client: { type: String, required: false, default: "" },
};

const schemaOpts = {
  timestamps: true,
};

const EventSchema = new Schema(EventSchemaFields, schemaOpts);

EventSchema.statics.addData = async function (
  events: Array<IEvent>
): Promise<number> {
  let numChanged = 0;
  try {
    Logger.info({
      at: "Database#addEvents",
      message: `Updating events...`,
    });
    let writes = events.map((event) => {
      return {
        insertOne: {
          document: event,
        },
      };
    });
    const res = await this.bulkWrite(writes);
    numChanged = res.nInserted;
    Logger.info({
      at: "Database#addEvents",
      message: `Events changed: ${numChanged}.`,
    });
    if (res.hasWriteErrors()) {
      throw Error(
        `Encountered the following write errors: ${res.getWriteErrors()}`
      );
    }
  } catch (err) {
    Logger.error({
      at: "Database#addEvents",
      message: `Error adding events.`,
      error: err,
    });
  } finally {
    return numChanged;
  }
};

const Event = model<IEventDoc, IEventModel>("events", EventSchema);

export { Event };

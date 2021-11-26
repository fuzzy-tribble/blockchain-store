import {
  Document,
  InsertManyOptions,
  InsertManyResult,
  model,
  Model,
  Schema,
} from "mongoose";
import Logger from "../lib/logger";
import { NetworkNames, ClientNames, EventNames } from "../lib/types";
export interface IEvent {
  name: EventNames;
  client: ClientNames;
  network?: NetworkNames;
  data?: {};
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
  addData(events: IEvent[]): Promise<number>;
  findLiquidationEvents(): Promise<IEventDoc[]>;
  propertyNames: typeof PropertyNames;
}

Schema.Types.String.checkRequired((v) => typeof v === "string");

// SCHEMA DEFS //
const EventSchemaFields: Record<keyof IEvent, any> = {
  name: { type: String, required: true },
  client: { type: String, enum: ClientNames, required: true },
  network: { type: String, enum: NetworkNames, required: false },
  data: { type: Object, required: false },
};

const schemaOpts = {
  timestamps: true,
};

const EventSchema = new Schema(EventSchemaFields, schemaOpts);

EventSchema.statics.addData = async function (
  events: IEvent[]
): Promise<number> {
  let nInserted: number = 0;
  let options: InsertManyOptions = {
    ordered: false, // report any errors at the end
    rawResult: true,
  };
  try {
    // TODO - insertMany should return type InsertManyResult with rawResult:true but doesn't
    let res: any = await Event.insertMany(events, options);
    nInserted = res.insertedCount | 0;
    Logger.info({
      at: "Database#postUpdateEvent",
      message: `Events inserted: ${nInserted}`,
    });
    res.mongoose.validationErrors?.forEach((err) => {
      Logger.error({
        at: "Database#addData",
        message: `Error updating event.`,
        error: err,
      });
    });
  } catch (err) {
    Logger.error({
      at: "Database#addData",
      message: `Error updating events.`,
      error: err,
    });
  } finally {
    return nInserted;
  }
};

const Event = model<IEventDoc, IEventModel>("events", EventSchema);

export { Event };

import { Document, InsertManyOptions, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import {
  NetworkNames,
  ClientNames,
  EventNames,
  UpdateResult,
} from "../lib/types";
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
  addData(events: IEvent[]): Promise<UpdateResult>;
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
): Promise<UpdateResult> {
  let updateRes: UpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  let options: InsertManyOptions = {
    ordered: false, // report any errors at the end
    rawResult: true,
  };
  try {
    // TODO - insertMany should return type InsertManyResult with rawResult:true but doesn't
    let res: any = await Event.insertMany(events, options);
    updateRes.upsertedCount = res.insertedCount;
    Logger.info({
      at: "Database#postUpdateEvent",
      message: `Events inserted: ${updateRes.upsertedCount}`,
    });
    res.mongoose.validationErrors?.forEach((err) => {
      updateRes.invalidCount = updateRes.invalidCount + 1;
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
    return updateRes;
  }
};

const Event = model<IEventDoc, IEventModel>("events", EventSchema);

export { Event };

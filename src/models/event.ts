import { Document, model, Model, Schema } from "mongoose";

export interface IEvent {
  name: string;
  data: {};
}

// DOCUMENT DEFS //
export interface IEventDoc extends IEvent, Document {}

enum PropertyNames {
  NAME = "name",
  DATA = "data",
}

// MODEL DEFS //
export interface IEventModel extends Model<IEventDoc> {
  findLiquidationEvents(): Promise<IEventDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const EventSchemaFields: Record<keyof IEvent, any> = {
  name: { type: String, required: true },
  data: { type: Object, required: false },
};

const schemaOpts = {
  timestamps: true,
};

const EventSchema = new Schema(EventSchemaFields, schemaOpts);

// SO we can call create directly on the model with proper types
EventSchema.statics.create = (attr: IEvent) => {
  return new Event(attr);
};

const Event = model<IEventDoc, IEventModel>("events", EventSchema);

export { Event };

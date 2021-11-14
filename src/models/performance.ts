import { AnyObject, Document, model, Model, Schema } from "mongoose";

export interface IPerformance {
  name: string;
  data: {};
}

// DOCUMENT DEFS //
export interface IPerformanceDoc extends IPerformance, Document {}

enum PropertyNames {
  NAME = "name",
  DATA = "data",
}

// MODEL DEFS //
export interface IPerformanceModel extends Model<IPerformanceDoc> {
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const PerformanceSchemaFields: Record<keyof IPerformance, any> = {
  name: { type: String, required: true },
  data: { type: Object, required: false },
};

const schemaOpts = {
  timestamps: true,
};

const PerformanceSchema = new Schema(PerformanceSchemaFields, schemaOpts);

PerformanceSchema.statics.create = (attr: IPerformance) => {
  return new Performance(attr);
};

const Performance = model<IPerformanceDoc, IPerformanceModel>(
  "Performances",
  PerformanceSchema
);

export { Performance };

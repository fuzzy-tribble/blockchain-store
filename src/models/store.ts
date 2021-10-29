// Store metadata for persistence
import { Document, model, Model, Schema } from "mongoose";

export interface IStore {
  network: string;
  client: string;
  lastBlockChecked: number;
  earliestBlockChecked: number;
}

// DOCUMENT DEFS //
export interface IStoreDoc extends IStore, Document {}

enum PropertyNames {
  NETWORK = "network",
  CLIENT = "client",
  LAST_BLOCK_CHECKED = "lastBlockChecked",
  EARLIEST_BLOCK_CHECKED = "earliestBlockChecked",
}

// MODEL DEFS //
export interface IStoreModel extends Model<IStoreDoc> {
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const StoreSchemaFields: Record<keyof IStore, any> = {
  network: { type: String, required: true },
  client: { type: Object, required: true },
  lastBlockChecked: { type: Number, required: true },
  earliestBlockChecked: { type: Number, required: true },
};

const schemaOpts = {
  timestamps: true,
};

const StoreSchema = new Schema(StoreSchemaFields, schemaOpts);

// // SO we can call create directly on the model with proper types
StoreSchema.statics.create = (attr: IStore) => {
  return new Store(attr);
};

const Store = model<IStoreDoc, IStoreModel>("Stores", StoreSchema);

export { Store };

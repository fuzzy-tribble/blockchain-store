import { Document, model, Model, Schema } from "mongoose";

export interface IAccount {
  address: string;
  isPendingUpdate: boolean;
  latestHealthScore?: string;
  data?: {};
}

// DOCUMENT DEFS //
export interface IAccountDoc extends IAccount, Document {
  // TODO - functions for specific documents
}

enum PropertyNames {
  ADDRESS = "address",
  IS_PENDING_UPDATE = "isPendingUpdate",
  LATEST_HEALTH_SCORE = "latestHealthScore",
  DATA = "data",
}

// MODEL DEFS //
export interface IAccountModel extends Model<IAccountDoc> {
  findAccountsOlderThan(age: number): Promise<IAccountDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountSchemaFields: Record<keyof IAccount, any> = {
  address: { type: String, required: true, index: { unique: true } },
  isPendingUpdate: { type: Boolean, default: false },
  latestHealthScore: { type: String, required: false },
  data: {},
};

const schemaOpts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  timestamps: true,
};

const AccountSchema = new Schema(AccountSchemaFields, schemaOpts);

// METHODS //
// TODO
// ClientAccountSchema.methods.

// STATICS //
AccountSchema.static(
  "findAccountsOlderThan",
  async function findAccountsOlderThan(
    timestamp: number
  ): Promise<IAccountDoc[]> {
    const accounts: IAccountDoc[] = await this.find({
      lastUpdated: { $gte: timestamp },
    });
    return accounts;
  }
);

// SO we can call create directly on the model with proper types
AccountSchema.statics.create = (attr: IAccount) => {
  return new Account(attr);
};

const Account = model<IAccountDoc, IAccountModel>(
  "accounts",
  AccountSchema,
  "accounts"
);

export { Account };

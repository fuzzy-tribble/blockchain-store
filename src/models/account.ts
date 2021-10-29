import { Document, model, Model, Schema } from "mongoose";

export interface IAccount {
  address: string;
  lastUpdated: number;
  isPendingUpdate: boolean;
  latestHealthScore?: string;
  data?: {};
  isLiquidatable?: boolean;
}

// DOCUMENT DEFS //
export interface IAccountDoc extends IAccount, Document {
  getCompleteName(): string;
}

enum PropertyNames {
  ADDRESS = "address",
  LAST_UPDATED = "lastUpdated",
  IS_PENDING_UPDATE = "isPendingUpdate",
  LATEST_HEALTH_SCORE = "latestHealthScore",
  DATA = "data",
  IS_LIQUIDATABLE = "isLiquidatable",
}

// MODEL DEFS //
export interface IAccountModel extends Model<IAccountDoc> {
  findAccountsOlderThan(age: number): Promise<IAccountDoc[]>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const AccountSchemaFields: Record<keyof IAccount, any> = {
  address: String,
  lastUpdated: Number,
  isPendingUpdate: Boolean,
  latestHealthScore: String,
  data: {},
  isLiquidatable: Boolean,
};

const AccountSchema = new Schema(AccountSchemaFields);

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

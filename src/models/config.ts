import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { Client, Network } from "../lib/types";

export interface IConfig {
  client: Client;
  network: Network;
  accountStore: {
    isEnabled: boolean;
    [key: string]: any;
  };
  reserveStore: {
    isEnabled: boolean;
    [key: string]: any;
  };
  dataSources: {
    blockchain: {
      rpcUrl?: string;
      [key: string]: any;
    };
    apis: {
      endpoint?: string;
      [key: string]: any;
    };
    graphql: {
      endpoint?: string;
      queries?: any;
      [key: string]: any;
    };
  };
  [key: string]: any;
}

// DOCUMENT DEFS //
export interface IConfigDoc extends IConfig, Document {}

enum PropertyNames {
  CLIENT = "client",
  NETWORK = "network",
  ACCOUNT_STORE = "accountStore",
  RESERVE_STORE = "reserveStore",
  DATA_SOURCES = "dataSources",
}

// MODEL DEFS //
export interface IConfigModel extends Model<IConfigDoc> {
  findByClientNetwork(client: Client, network: Network): Promise<IConfigDoc>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const ConfigSchemaFields: Record<keyof IConfig, any> = {
  client: { type: String, required: true },
  network: { type: String, required: true },
  accountStore: { type: Map, required: true },
  reserveStore: { type: Map, required: true },
  dataSources: { type: Schema.Types.Mixed, required: true },
};

const schemaOpts = {
  timestamps: true,
};

const ConfigSchema = new Schema(ConfigSchemaFields, schemaOpts);

ConfigSchema.index({ client: 1, network: 1 }, { unique: true });

ConfigSchema.statics.findByClientNetwork = async function (
  client: Client,
  network: Network
): Promise<IConfig | null> {
  let conf: IConfig | null = null;
  try {
    Logger.info({
      at: "Database#getConf",
      message: `Getting conf for ${client}, ${network}...`,
    });
    const filter = {
      client: client,
      network: network,
    };
    conf = await this.findOne(filter).lean();
    Logger.info({
      at: "Database#getConf",
      message: `Matched: ${conf ? 1 : 0}.`,
    });
  } catch (err) {
    Logger.error({
      at: "Database#getConf",
      message: `Error getting conf.`,
      error: err,
    });
  } finally {
    return conf;
  }
};

const Config = model<IConfigDoc, IConfigModel>("configs", ConfigSchema);

export { Config };

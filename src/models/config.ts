import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { ClientFunction, ClientNames, NetworkNames } from "../lib/types";
export interface IConfig {
  client: ClientNames;
  network: NetworkNames;
  pollFunctions: Array<ClientFunction>;
  listenerNames: Array<string>;
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
  POLL_FUNCTIONS = "pollFunctions",
  LISTENER_NAMES = "listenerNames",
  DATA_SOURCES = "dataSources",
}

// MODEL DEFS //
export interface IConfigModel extends Model<IConfigDoc> {
  findByClientNetwork(
    client: ClientNames,
    network: NetworkNames
  ): Promise<IConfigDoc>;
  propertyNames: typeof PropertyNames;
}

// SCHEMA DEFS //
const ConfigSchemaFields: Record<keyof IConfig, any> = {
  client: { type: String, required: true },
  network: { type: String, required: true },
  pollFunctions: { type: Schema.Types.Mixed, required: true },
  listenerNames: { type: Schema.Types.Mixed, required: true },
  dataSources: { type: Schema.Types.Mixed, required: true },
};

const schemaOpts = {
  timestamps: true,
};

const ConfigSchema = new Schema(ConfigSchemaFields, schemaOpts);

ConfigSchema.index({ client: 1, network: 1 }, { unique: true });

ConfigSchema.statics.findByClientNetwork = async function (
  client: ClientNames,
  network: NetworkNames
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

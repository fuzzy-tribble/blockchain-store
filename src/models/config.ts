import { Document, model, Model, Schema } from "mongoose";
import Logger from "../lib/logger";
import { ClientFunction, ClientNames } from "../lib/types";

export interface IBlockchainConf {
  rpcUrl: string;
  contractAddress: string;
  contractAbi: any;
  ifaceAbi?: any;
  lastBlockChecked?: number;
  [key: string]: any;
}

export interface IApiConf {
  baseUrl: string;
  [key: string]: any;
}
export interface IGqlConf {
  endpoint: string;
  queries: Record<string, {}>;
  [key: string]: any;
}
export interface IConfig {
  client: ClientNames;
  network: string;
  pollFunctions: Array<ClientFunction>;
  listenerNames: Array<string>;
  dataSources: {
    blockchain?: IBlockchainConf;
    apis?: IApiConf;
    graphql?: IGqlConf;
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
  getLastBlockChecked(client: ClientNames, network: string): Promise<number>;
  findAll(): Promise<IConfig[]>;
  findByClientNetwork(
    client: ClientNames,
    network: string
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
ConfigSchema.statics.getLastBlockChecked = async function (
  client: ClientNames,
  network: string
): Promise<number> {
  // TODO - implement
  return 0;
};

ConfigSchema.statics.findAll = async function (): Promise<IConfig[]> {
  let clientConfigs: IConfig[] = [];
  try {
    clientConfigs = await Config.find({}).exec();
  } catch (err) {
    Logger.error({
      at: "Database#findAll",
      message: `Error getting all client confs.`,
      error: err,
    });
  } finally {
    return clientConfigs;
  }
};

ConfigSchema.statics.findByClientNetwork = async function (
  client: ClientNames,
  network: string
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

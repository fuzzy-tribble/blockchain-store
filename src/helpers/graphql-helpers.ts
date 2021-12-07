import fetch from "cross-fetch";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client/core";
import Logger from "../lib/logger";
import { IConfig } from "../models";
import { ClientNames } from "../lib/types";
import { IGqlConf } from "../models/config";

export default class GqlClient {
  public client: ClientNames;
  public network: string;
  public gqlConf: IGqlConf;
  public gqlClient: ApolloClient<NormalizedCacheObject>;

  constructor(conf: IConfig) {
    this.client = conf.client;
    this.network = conf.network;
    if (!conf.dataSources.graphql)
      throw new Error("Gql conf must be present in confs provided.");
    this.gqlConf = conf.dataSources.graphql;
    this.gqlClient = new ApolloClient({
      link: new HttpLink({ uri: this.gqlConf.endpoint, fetch }),
      cache: new InMemoryCache(),
    });
  }

  query = async (query: any) => {
    try {
      Logger.info({
        client: this.client,
        at: "Gql#query",
        message: `Querying gql...`,
      });
      const res = await this.gqlClient.query({
        query: query,
      });
      Logger.info({
        client: this.client,
        at: "Gql#query",
        message: `Done querying gql.`,
      });
      return res;
    } catch (err) {
      Logger.error({
        client: this.client,
        at: "Gql#query",
        message: `Querying gql...`,
        error: err,
      });
    }
  };

  subscribe = async () => {
    // TODO - subscribe (https://www.apollographql.com/docs/react/data/subscriptions/)
  };
}

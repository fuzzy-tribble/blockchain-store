import fetch from "cross-fetch";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client/core";
import Logger from "../lib/logger";

export default class GqlClient {
  public clientName: string;
  public gqlClient: ApolloClient<NormalizedCacheObject>;

  constructor(clientName: string, endpoint: string) {
    this.clientName = clientName;
    this.gqlClient = new ApolloClient({
      link: new HttpLink({ uri: endpoint, fetch }),
      cache: new InMemoryCache(),
    });
  }

  query = async (query: any) => {
    try {
      Logger.info({
        client: this.clientName,
        at: "Gql#query",
        message: `Querying gql...`,
      });
      const res = await this.gqlClient.query({
        query: query,
      });
      Logger.info({
        client: this.clientName,
        at: "Gql#query",
        message: `Done querying gql.`,
      });
      return res;
    } catch (err) {
      Logger.error({
        client: this.clientName,
        at: "Gql#query",
        message: `Querying gql...`,
        error: err,
      });
    }
  };
}

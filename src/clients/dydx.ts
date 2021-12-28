import { AxiosRequestConfig } from "axios";
import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import { IAccount, IReserve } from "../models";
import {
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
  DatabaseUpdate,
} from "../lib/types";
import {
  parseMarketsFromApi,
  parseAccountsFromApi,
} from "./helpers/dydx-helpers";

export default class DydxSolo extends Client {
  checkForLiquidatableAccounts = async () => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const accounts = await this._getLiquidatableAccountsFromApi();
    if (accounts) {
      res.success = true;
      res.data = accounts;
    }
    return res;
  };

  getNewReserves = async () => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const accounts = await this._getMarketsFromApi();
    if (accounts) {
      res.success = true;
      res.data = accounts;
    }
    return res;
  };

  _getLiquidatableAccountsFromApi = async (): Promise<
    DatabaseUpdate[] | null
  > => {
    // TODO - accounts url doesn't work...check it out
    let dbUpdate: DatabaseUpdate[] | null = null;
    if (!this.conf.dataSources.apis)
      throw new Error("Api conf must be present in confs provided.");
    const liquidatableAccountsRequest: AxiosRequestConfig = {
      url: `${this.conf.dataSources.apis.baseUrl}/v3/accounts`,
      method: "get",
      responseType: "json",
      params: {
        isLiquidatable: true,
      },
    };
    const res = await apiRequest(this.conf.client, liquidatableAccountsRequest);
    if (res !== null && res.hasOwnProperty("accounts")) {
      dbUpdate = parseAccountsFromApi(
        this.conf.client,
        this.conf.network,
        res.accounts
      );
    }
    return dbUpdate;
  };

  _getMarketsFromApi = async (): Promise<DatabaseUpdate[] | null> => {
    let dbUpdate: DatabaseUpdate[] | null = null;
    if (!this.conf.dataSources.apis)
      throw new Error("Api conf must be present in confs provided.");
    const res = await apiRequest(this.conf.client, {
      url: this.conf.dataSources.apis.allMarkets,
    });
    if (res !== null && res.hasOwnProperty("markets")) {
      dbUpdate = parseMarketsFromApi(
        this.conf.client,
        this.conf.network,
        Object.values(res.markets)
      );
    }
    return dbUpdate;
  };
}

import { AxiosRequestConfig } from "axios";
import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import { IAccount, IReserve } from "../models";
import {
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
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
      collection: CollectionNames.ACCOUNTS,
      data: null,
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
      collection: CollectionNames.RESERVES,
      data: null,
    };
    const accounts = await this._getMarketsFromApi();
    if (accounts) {
      res.success = true;
      res.data = accounts;
    }
    return res;
  };

  _getLiquidatableAccountsFromApi = async (): Promise<IAccount[] | null> => {
    // TODO - accounts url doesn't work...check it out
    let formattedAccounts: IAccount[] = [];
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
      formattedAccounts = parseAccountsFromApi(
        this.conf.client,
        this.conf.network,
        res.accounts
      );
    }
    return formattedAccounts;
  };

  _getMarketsFromApi = async (): Promise<IReserve[] | null> => {
    let formattedReserves: IReserve[] = [];
    const res = await apiRequest(this.conf.client, {
      url: this.conf.dataSources.apis.allMarkets,
    });
    if (res !== null && res.hasOwnProperty("markets")) {
      formattedReserves = parseMarketsFromApi(
        this.conf.client,
        this.conf.network,
        Object.values(res.markets)
      );
    }
    return formattedReserves;
  };
}

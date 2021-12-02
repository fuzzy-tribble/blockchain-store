import { AxiosRequestConfig } from "axios";
import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import { IAccount, IReserve } from "../models";
import { ClientNames } from "../lib/types";
import {
  parseMarketsFromApi,
  parseAccountsFromApi,
} from "./helpers/dydx-helpers";

export default class DydxSolo extends Client {
  getNewAccounts = async () => {
    return await this._getLiquidatableAccountsFromApi();
  };

  getNewReserves = async () => {
    return await this._getMarketsFromApi();
  };

  _getLiquidatableAccountsFromApi = async (): Promise<IAccount[]> => {
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

  _getMarketsFromApi = async (): Promise<IReserve[]> => {
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

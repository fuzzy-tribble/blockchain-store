import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import {
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
  DatabaseUpdate,
} from "../lib/types";
import { IToken, ITokenPrice } from "../models";
import {
  parseCoinMarketDataFromApi,
  parseCoinsAndPlatformsFromApi,
} from "./helpers/coingecko-helpers";

import { CoingeckoCoinMarketData } from "./helpers/coingecko-types";

export default class Coingecko extends Client {
  updateTokenData = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const parsedData = await this._fetchCoinMarketDataFromApi();
    if (parsedData) {
      res.success = true;
      res.data = parsedData;
    }
    return res;
  };

  updateTokens = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const parsedData = await this._fetchCoinListFromApi();
    if (parsedData) {
      res.success = true;
      res.data = parsedData;
    }
    return res;
  };

  private _fetchCoinListFromApi = async (): Promise<
    DatabaseUpdate[] | null
  > => {
    const data = await apiRequest(this.conf.client, {
      method: "GET",
      url: this.conf.dataSources.apis.allCoinsList,
    });
    if (data) {
      const parsedData = parseCoinsAndPlatformsFromApi(data);
      return parsedData;
    } else {
      return null;
    }
  };

  private _fetchCoinMarketDataFromApi = async (): Promise<
    DatabaseUpdate[] | null
  > => {
    const data: CoingeckoCoinMarketData[] = await apiRequest(
      ClientNames.COINGECKO,
      {
        method: "GET",
        url: this.conf.dataSources.apis.coinsMarketData,
      }
    );
    if (data) {
      const parsedData = parseCoinMarketDataFromApi(this.conf.client, data);
      return parsedData;
    } else {
      return null;
    }
  };
}

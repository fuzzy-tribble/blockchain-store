import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import {
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
} from "../lib/types";
import { IToken, ITokenPrice } from "../models";
import {
  CoingeckoCoinMarketData,
  CoingeckoCoinPlatformData,
  CoinGeckoResponse,
  parseCoinMarketDataFromApi,
  parseCoinsAndPlatformsFromApi,
} from "./helpers/coingecko-helpers";

export default class Coingecko extends Client {
  updateTokenData = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TOKEN_PRICES,
      data: null,
    };
    const tokenPrices = await this._fetchCoinMarketDataFromApi();
    if (tokenPrices) {
      res.success = true;
      res.data = tokenPrices;
    }
    return res;
  };

  updateTokens = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TOKENS,
      data: null,
    };
    const tokens = await this._fetchCoinListFromApi();
    if (tokens) {
      res.success = true;
      res.data = tokens;
    }
    return res;
  };

  _fetchCoinListFromApi = async (): Promise<IToken[] | null> => {
    const data = await apiRequest(this.conf.client, {
      method: "GET",
      url: this.conf.dataSources.apis.allCoinsList,
    });
    if (data) {
      const tokens = parseCoinsAndPlatformsFromApi(data);
      return tokens;
    } else {
      return null;
    }
  };

  _fetchCoinMarketDataFromApi = async (): Promise<ITokenPrice[] | null> => {
    const data: CoingeckoCoinMarketData[] = await apiRequest(
      ClientNames.COINGECKO,
      {
        method: "GET",
        url: this.conf.dataSources.apis.coinsMarketData,
      }
    );
    if (data) {
      const tokenPrices = parseCoinMarketDataFromApi(this.conf.client, data);
      return tokenPrices;
    } else {
      return null;
    }
  };
}

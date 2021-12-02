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
} from "./helpers/coingecko-helpers";

export default class Coingecko extends Client {
  updateTokenData = async (): Promise<ClientFunctionResult> => {
    const tokenPrices = await this._fetchCoinMarketDataFromApi();
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TOKEN_PRICES,
      data: tokenPrices,
    };
  };

  updateTokens = async (): Promise<ClientFunctionResult> => {
    const tokens = await this._fetchCoinListFromApi();
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TOKENS,
      data: tokens,
    };
  };

  _fetchCoinListFromApi = async (): Promise<ITokenPrice[]> => {
    let tokenPrices: ITokenPrice[] = [];
    const { success, message, code, data }: CoinGeckoResponse =
      await apiRequest(this.conf.client, {
        method: "GET",
        url: this.conf.dataSources.apis.allCoinsList,
      });
    if (success) {
      tokenPrices = parseCoinMarketDataFromApi(
        this.conf.client,
        data as CoingeckoCoinMarketData[]
      );
    }
    return tokenPrices;
  };

  _fetchCoinMarketDataFromApi = async (): Promise<ITokenPrice[] | void> => {
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
      throw new Error("IMPLEMENT ME");
    }
  };
}

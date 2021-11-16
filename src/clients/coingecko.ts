import { apiRequest } from "../helpers/api-helpers";
import Client from "../lib/client";
import { ClientFunctionResult, ClientNames } from "../lib/types";
import { CollectionNames, IToken } from "../models";
import {
  CoingeckoCoinData,
  CoinGeckoResponse,
  formatCoinDataFromApi,
} from "./helpers/coingecko-helpers";

export default class Coingecko extends Client {
  updateTokenData = async (): Promise<ClientFunctionResult> => {
    const tokens = await this._updateTokenDataFromApi();
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TOKENS,
      data: tokens,
    };
  };

  _updateTokenDataFromApi = async (): Promise<IToken[]> => {
    const { success, message, code, data }: CoinGeckoResponse =
      await apiRequest(ClientNames.COINGECKO, {
        method: "GET",
        url: this.conf.dataSources.apis.allCoinsAndMarketsData,
      });
    const tokens = formatCoinDataFromApi(
      this.conf.network,
      data as CoingeckoCoinData[]
    );
    return tokens;
  };
}

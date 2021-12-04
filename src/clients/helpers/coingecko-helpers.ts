import { ClientNames, CollectionNames, DatabaseUpdate } from "../../lib/types";
import { IToken, ITokenPrice } from "../../models";
import {
  CoingeckoCoinMarketData,
  CoingeckoCoinPlatformData,
} from "./coingecko-types";

export const parseCoinsAndPlatformsFromApi = (
  data: CoingeckoCoinPlatformData[]
): DatabaseUpdate[] => {
  const tokens: IToken[] = [];
  data.forEach((coin) => {
    Object.keys(coin["platforms"]).forEach((network) => {
      if (
        coin["platforms"][network] === "" ||
        coin["platforms"][network] === null ||
        coin["platforms"][network] === undefined
      ) {
        delete coin["platforms"][network];
      }
    });
    if (Object.keys(coin["platforms"]).length > 0) {
      let uid: string;
      if (coin.platforms["ethereum"]) uid = coin.platforms["ethereum"];
      else uid = coin.platforms[Object.keys(coin.platforms)[0]];
      tokens.push({
        uid: uid, // ethereum address if exists or another chain address
        coingeckoId: coin.id,
        ...coin,
      });
    }
  });
  return [{ collectionName: CollectionNames.TOKENS, data: tokens }];
};

export const parseCoinMarketDataFromApi = (
  client: ClientNames,
  data: CoingeckoCoinMarketData[]
): DatabaseUpdate[] => {
  const tokenPrices: ITokenPrice[] = data.map((coinMarketData) => {
    return {
      token: {
        uid: coinMarketData.id,
      },
      coingeckoId: coinMarketData.id,
      priceInEth: coinMarketData.current_price?.toString(),
      source: client,
      lastUpdated: coinMarketData.last_updated,
      ...coinMarketData,
    };
  });
  return [{ collectionName: CollectionNames.TOKEN_PRICES, data: tokenPrices }];
};

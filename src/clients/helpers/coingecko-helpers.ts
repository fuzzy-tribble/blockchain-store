import { ClientNames } from "../../lib/types";
import { IToken, ITokenPrice } from "../../models";

export type CoinGeckoResponse = {
  success: boolean;
  message: string;
  code: number;
  data: object;
};

export interface CoingeckoCoinPlatformData {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [x: string]: string;
  };
}
export interface CoingeckoCoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  roi: any;
  last_updated: string;
  sparkline_in_7d: {
    price: number[];
  } | null;
  price_change_percentage_14d_in_currency: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_1y_in_currency: number;
  price_change_percentage_200d_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  [x: string]: any;
}

export const parseCoinsAndPlatformsFromApi = (
  data: CoingeckoCoinPlatformData[]
): IToken[] => {
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
      tokens.push({
        uid: coin.id,
        coingeckoId: coin.id,
        ...coin,
      });
    }
  });
  return tokens;
};

export const parseCoinMarketDataFromApi = (
  client: ClientNames,
  data: CoingeckoCoinMarketData[]
): ITokenPrice[] => {
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
  return tokenPrices;
};

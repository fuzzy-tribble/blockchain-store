// import {
//   ApiAccount as DydxAccount,
//   ApiMarket as DydxMarket,
// } from "@dydxprotocol/solo";
import { ClientNames, CollectionNames, DatabaseUpdate } from "../../lib/types";
import { IReserve, IAccount } from "../../models";

export interface DydxApiMarket {
  market: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  stepSize: string;
  tickSize: string;
  indexPrice: string;
  oraclePrice: string;
  priceChange24H: string;
  nextFundingRate: string;
  nextFundingAt: string;
  minOrderSize: string;
  type: string;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  volume24H: string;
  trades24H: string;
  openInterest: string;
  incrementalInitialMarginFraction: string;
  incrementalPositionSize: string;
  maxPositionSize: string;
  baselinePositionSize: string;
  assetResolution: string;
  [x: string]: any;
}

interface DydxApiAccountBalance {
  marketId: number;
  par: string;
  wei: string;
  expiredAt: null;
  expiryAddress;
  null;
}

export interface DydxApiAccount {
  owner: string;
  number: string;
  uuid: string;
  balances: {
    [x: string]: DydxApiAccountBalance;
  };
  [x: string]: any;
}

export const parseMarketsFromApi = (
  client: ClientNames,
  network: string,
  apiMarkets: DydxApiMarket[]
): DatabaseUpdate[] => {
  let reserves: IReserve[] = apiMarkets.map((apiMarket) => {
    let tokens = apiMarket.market.split("-").map((tokenSymbol) => {
      return {
        network: network,
        symbol: tokenSymbol,
      };
    });
    return {
      uid: apiMarket.market,
      network: network,
      client: client,
      tokens: tokens,
      ...apiMarket,
    };
  });
  return [
    {
      collectionName: CollectionNames.RESERVES,
      data: reserves,
    },
  ];
};

export const parseAccountsFromApi = (
  client: ClientNames,
  network: string,
  apiAccounts: DydxApiAccount[]
): DatabaseUpdate[] => {
  let accounts: IAccount[] = apiAccounts.map((apiAccount) => {
    return {
      address: apiAccount.owner,
      network: network,
      client: client,
      ...apiAccount,
    };
  });
  return [
    {
      collectionName: CollectionNames.ACCOUNTS,
      data: accounts,
    },
  ];
};

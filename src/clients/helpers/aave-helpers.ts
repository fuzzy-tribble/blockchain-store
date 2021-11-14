import { Client, Network } from "../../lib/types";
import { IReserve } from "../../models";

export interface AaveGqlReserve {
  decimals: number;
  id: string;
  liquidityRate: string;
  name: string;
  price: {
    id: string;
    priceInEth: string;
    lastUpdatedTimestamp: number;
  };
  stableBorrowRate: string;
  symbol: string;
  variableBorrowRate: string;
}

export const formatReservesFromGql = (
  client: Client,
  network: Network,
  reservesList: AaveGqlReserve[]
) => {
  const formattedReserves = reservesList.map((reserve) => {
    let formattedReserve: IReserve = {
      client: client,
      network: network,
      address: reserve.id,
      token1: {
        address: reserve.id,
        symbol: reserve.symbol,
        name: reserve.name,
        decimals: reserve.decimals,
        priceHistory: [
          {
            price: reserve.price.priceInEth,
            timestamp: reserve.price.lastUpdatedTimestamp,
          },
        ],
      },
    };
    return formattedReserve;
  });
  return formattedReserves;
};

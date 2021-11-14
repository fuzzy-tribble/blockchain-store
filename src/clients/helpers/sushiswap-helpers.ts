import { Client, Network } from "../../lib/types";
import { IReserve } from "../../models";

export interface SushiApiPair {
  Pair_ID: string;
  Token_1_contract: string;
  Token_1_symbol: string;
  Token_1_name: string;
  Token_1_decimals: number;
  Token_1_price: number;
  Token_1_reserve: number;
  Token_1_derivedETH: number;
  Token_2_contract: string;
  Token_2_symbol: string;
  Token_2_name: string;
  Token_2_decimals: number;
  Token_2_price: number;
  Token_2_reserve: number;
  Token_2_derivedETH: number;
}

export const formatPairingsFromApi = (
  client: Client,
  network: Network,
  pairingsList: SushiApiPair[]
) => {
  const formattedReserves = pairingsList.map((pairing) => {
    let reserve: IReserve = {
      client: client,
      network: network,
      address: pairing.Pair_ID,
      token1: {
        address: pairing.Token_1_contract,
        symbol: pairing.Token_1_symbol,
        name: pairing.Token_1_name,
        decimals: pairing.Token_1_decimals,
        priceHistory: [{ price: pairing.Token_1_price, timestamp: Date.now() }],
      },
      token2: {
        address: pairing.Token_2_contract,
        symbol: pairing.Token_2_symbol,
        name: pairing.Token_2_name,
        decimals: pairing.Token_2_decimals,
        priceHistory: [{ price: pairing.Token_2_price, timestamp: Date.now() }],
      },
    };
    return reserve;
  });
  return formattedReserves;
};

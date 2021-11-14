import { EventFilter } from "ethers";
import { CollectionNames } from "../models";

// ============ Types ============

// TODO - fix this stupid shit
export type DbBn = {
  type: "BigNumber";
  hex: string;
};

// ===============================

// ============ Enums ============
export enum EventNames {
  LIQUIDATION = "liquidation",
  MAJOR_TOKEN_PRICE_CHANGE = "major-token-price-change",
  LIQUIDATABLE_ACCOUNT = "liquidatable-account",
  ARBITRAGE = "arbitrage",
}

export enum NetworkNames {
  MAINNET = "mainnet",
  POLYGON = "polygon",
  KOVAN = "kovan",
  AVALANCHE = "avalanche",
}

export enum ClientNames {
  AAVE = "aave",
  SUSHISWAP = "sushiswap",
  DYDX = "dydx",
  UNISWAP = "uniswap",
  COMPOUND = "compound",
  MAKER = "maker",
  CURVE = "curve",
}
// ===============================

// ============ Constants ============

export const DAILY_MS: number = 60 * 60 * 24 * 1000;
export const HOURLY_MS: number = 60 * 60 * 1000;
export const FIVE_MINS_IN_MS: number = 60 * 5 * 1000;

// ==================================

// ============ Interfaces ============
export interface ClientFunction {
  name: string;
  args?: string;
  frequency: number;
}

export interface ClientFunctionResult {
  status: boolean;
  client: ClientNames;
  network: NetworkNames;
  collection: CollectionNames;
  data: any;
}
// ==================================

// ============ Classes ============
// ==================================

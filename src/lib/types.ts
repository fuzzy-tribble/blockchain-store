import { EventFilter } from "ethers";

// ============ Types ============

// TODO - fix this stupid shit
export type DbBn = {
  type: "BigNumber";
  hex: string;
};
export type Network = "mainnet" | "polygon" | "kovan" | "avalanche";
export type Client =
  | "aave"
  | "sushiswap"
  | "dydx"
  | "uniswap"
  | "compound"
  | "maker";
export type ClientAccount = {
  address: string;
  data?: {};
};
// ===============================

// ============ Enums ============
// ===============================

// ============ Constants ============

export const DAILY_MS: number = 60 * 60 * 24 * 1000;
export const HOURLY_MS: number = 60 * 60 * 1000;
export const FIVE_MINS_IN_MS: number = 60 * 5 * 1000;

// ==================================

// ============ Interfaces ============

// ============ Classes ============

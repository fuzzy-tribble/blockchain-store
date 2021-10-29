// TODO - cleanup

import { EventFilter } from "ethers";
import { Server } from "socket.io";
import BlockchainNetwork, {
  Network,
  Protocol,
} from "../helpers/blockchain-helpers";
import BigNumber from "bignumber.js";
import { Account } from "../models/account";

// ============ Types ============
// ============ Enums ============
export enum ServerEventNames {
  isLiquidatableAccount = "isLiquidatableAccount",
  isRiskyAccount = "isRiskyAccount",
  isArbitragable = "isArbitragable",
  isYieldFarmerTrigger = "isYieldFarmerTrigger",
}
// ============ Constants ============
export const DAILY_MS: number = 60 * 60 * 24 * 1000;
export const HOURLY_MS: number = 60 * 60 * 1000;
export const FIVE_MINS_IN_MS: number = 60 * 5 * 1000;
// ============ Interfaces ============
// export interface ClientAccount {
//   address: string;
//   lastUpdated: number;
//   isPendingUpdate: boolean;
//   latestHealthScore?: string;
//   data?: {};
//   isLiquidatable?: boolean;
// }

export interface ClientConf {
  name: string;
  bcNetwork: Network;
  bcProtocol: Protocol;
  rpcUrl: string;
  maxBlockQueryChunkSize: number;
  getNewUsersPollFreqMs: number;
  checkUpdateActiveUsersPollFreqMs: number;
  activeUserDataBaseUpdateFrequencyMs: number;
  contractAddress: string;
  contractAbi: unknown;
  ifaceAbi?: unknown;
  [otherOptions: string]: unknown;
  newUsersEventFilter: EventFilter;
  // eventFilters: { [name: string]: EventFilter };
}

// ============ Classes ============

export abstract class Client {
  public conf: ClientConf;
  public bcNetwork: BlockchainNetwork;
  public eventSocket: Server | null;
  public lastBlockNumChecked: number;

  constructor(conf: ClientConf) {
    this.conf = conf;
    this.bcNetwork = new BlockchainNetwork(this.conf);
    this.lastBlockNumChecked = 0;
    this.eventSocket = null;
  }

  abstract setup(eventSocket: Server): void;

  // FOR ACCOUNT STORE
  abstract getNewUsers(): Promise<ClientAccount[]>;
  abstract updateActiveUsers(
    activeUsers: ClientAccount[]
  ): Promise<ClientAccount[]>;
}

// TODO - fix this stupid shit
export type DbBn = {
  type: "BigNumber";
  hex: string;
};

export type AaveUserAccountData = {
  timestamp?: number;
  totalCollateralETH?: DbBn;
  totalDebtETH?: DbBn;
  availableBorrowsETH?: DbBn;
  currentLiquidationThreshold?: DbBn;
  ltv?: DbBn;
  healthFactor?: DbBn;
  [otherOptions: string]: unknown;
};

export type AaveUserConfiguration = {
  timestamp: number;
  "0"?: DbBn;
  [otherOptions: string]: unknown;
};
export interface AaveClientAccount extends ClientAccount {
  data?: {
    getUserAccountData: AaveUserAccountData[];
    getUserConfiguration: AaveUserConfiguration[];
  };
}

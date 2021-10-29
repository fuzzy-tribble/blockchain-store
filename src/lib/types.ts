import { EventFilter } from "ethers";
import { Server } from "socket.io";
import BlockchainNetwork, {
  Network,
  Protocol,
} from "../helpers/blockchain-helpers";
import db, { BlockchainStoreDb } from "../helpers/db-helpers";
import eventSocket, { EventSocket } from "../helpers/socket-helpers";

// ============ Types ============

// TODO - fix this stupid shit
export type DbBn = {
  type: "BigNumber";
  hex: string;
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

export interface ClientConf {
  name: string;

  accountStoreIsEnabled: boolean;
  marketStoreIsEnabled: boolean;

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
  public bcDb: BlockchainStoreDb;
  public eventSocket: EventSocket;
  public lastBlockNumChecked: number;

  constructor(conf: ClientConf) {
    this.conf = conf;
    this.bcNetwork = new BlockchainNetwork(this.conf);
    this.bcDb = db;
    this.eventSocket = eventSocket;
    this.lastBlockNumChecked = 0;
  }

  abstract setup(): void;

  // FOR ACCOUNT STORE
  // abstract getNewUsers(): Promise<ClientAccount[]>;
  // abstract updateActiveUsers(
  //   activeUsers: ClientAccount[]
  // ): Promise<ClientAccount[]>;
}

import "../lib/env";

import {
  Contract,
  ethers,
  EventFilter,
  Signer,
  Event as EthersEvent,
} from "ethers";
import { JsonRpcProvider, Listener } from "@ethersproject/providers";
import { BlockTag } from "@ethersproject/abstract-provider";
import { Interface } from "@ethersproject/abi";
import { CollectionNames, Event, IConfig, updateDatabase } from "../models";

import Logger from "../lib/logger";

export type Network = "mainnet" | "kovan" | "rinkeby";
export type Protocol = "aave" | "dydx" | "sushiswap";
export interface IToken {
  contract: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface ILiquidityReserve {
  id: string;
  assetAddress: IToken;
  configuration?: string;
  liquidityIndex?: string;
}
export interface ILiquidityPair {
  pairId: string;
  token1: IToken & {
    price: number;
    reserve: number;
    derivedETH?: number;
  };
  token2: IToken & {
    price: number;
    reserve: number;
    derivedETH?: number;
  };
}

// TODO - consider implement auto-chunking for large queries
export default class Blockchain {
  public clientConf: IConfig;
  public provider: JsonRpcProvider;
  public signer: Signer;
  public contract: Contract;
  public iface: Interface;

  constructor(conf: IConfig) {
    this.clientConf = conf;
    this.provider = new ethers.providers.JsonRpcProvider(
      this.clientConf.rpcUrl
    );
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      this.clientConf.contractAddress,
      this.clientConf.contractAbi as string,
      this.provider
    );
    this.iface = new Interface(this.clientConf.ifaceAbi as string);
  }

  connect = async (): Promise<boolean> => {
    Logger.info({
      client: this.clientConf.name,
      at: "Blockchain#connect",
      message: `Connecting to blockchain network at: ${this.clientConf.rpcUrl}`,
    });

    return await this._verifyNetworkConnection();
  };

  getLatestBlock = async (): Promise<number> => {
    try {
      await this._verifyNetworkConnection();
      Logger.info({
        client: this.clientConf.name,
        at: "Blockchain#getLatestBlock",
        message: `Connecting to blockchain network at: ${this.clientConf.rpcUrl}`,
      });

      return await this.provider.getBlockNumber();
    } catch (err) {
      Logger.error({
        client: this.clientConf.name,
        at: "Blockchain#getLatestBlock",
        message: "Coun't get latest block.",
        error: err,
      });
      return -1;
    }
  };

  query = async (
    eventFilter: EventFilter,
    fromBlock: BlockTag = -100,
    toBlock?: BlockTag
  ): Promise<Event[]> => {
    Logger.info({
      client: this.clientConf.name,
      at: "Blockchain#query",
      message: `Querying blockchain network for events from block ${fromBlock} to block ${toBlock}...`,
    });

    // TODO - LIMIT CHUNK SIZE AND LET KNOW IN LOGS
    // const chunkSize = toBlock - fromBlock;
    // if (chunkSize > this.clientConf.maxBlockQueryChunkSize) {
    //   chunkSize = latestBlock - this.conf.maxBlockQueryChunkSize;
    // }

    try {
      const networkEvents: Event[] = await this.contract.queryFilter(
        eventFilter,
        fromBlock,
        toBlock
      );
      Logger.info({
        client: this.clientConf.name,
        at: "Blockchain#query",
        message: `Events found: ${networkEvents.length}`,
      });
      return networkEvents;
    } catch (err) {
      Logger.error({
        client: this.clientConf.name,
        at: "Blockchain#query",
        message: "Query failed.",
        error: err,
      });
      return [];
    }
  };

  addListener = async (customEvent: string): Promise<Listener[]> => {
    // TODO - implement
    let filter = "";
    this.contract.on(filter, (eventResult) =>
      this._handleBlockchainListenerEvent(eventResult)
    );
    // Make sure its not a duplicate event that is subscribed to
    return this.contract.listeners();
  };

  removeListener = async (contractEvent: string) => {
    // TODO - implement
    return this.contract.listeners();
  };

  private _handleBlockchainListenerEvent = async (eventData: any) => {
    // TODO - will need to parse event data
    updateDatabase({
      status: true,
      client: this.clientConf.client,
      network: this.clientConf.network,
      collection: CollectionNames.EVENTS,
      data: eventData,
    });
  };

  private _verifyNetworkConnection = async () => {
    try {
      const res = await this.provider.getNetwork();
      Logger.info({
        client: this.clientConf.name,
        at: "Blockchain#verifyNetworkConnection",
        message: `Connected to network: ${res.name}`,
      });
      return true;
    } catch (err) {
      Logger.info({
        client: this.clientConf.name,
        at: "Blockchain#verifyNetworkConnection",
        message: `Not connected to network: ${err}`,
      });
      return false;
    }
  };
}

import "../lib/env";

import { Contract, ethers, EventFilter, Signer, Event } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BlockTag } from "@ethersproject/abstract-provider";
import { Interface } from "@ethersproject/abi";

import Logger from "../lib/logger";
import { ClientConf } from "../lib/types";

export type Network = "mainnet" | "kovan" | "rinkeby";
export type Protocol = "aave" | "dydx" | "sushiswap";

// TODO - consider implement chunking for large queries
export default class BlockchainNetwork {
  public clientConf: ClientConf;
  public provider: JsonRpcProvider;
  public signer: Signer;
  public contract: Contract;
  public iface: Interface;

  constructor(conf: ClientConf) {
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

  connect = async () => {
    Logger.info({
      client: this.clientConf.name,
      at: "BlockchainNetwork#connect",
      message: `Connecting to blockchain network at: ${this.clientConf.rpcUrl}`,
    });

    return await this._verifyNetworkConnection();
  };

  getLatestBlock = async (): Promise<number> => {
    try {
      await this._verifyNetworkConnection();
      Logger.info({
        client: this.clientConf.name,
        at: "BlockchainNetwork#getLatestBlock",
        message: `Connecting to blockchain network at: ${this.clientConf.rpcUrl}`,
      });

      return await this.provider.getBlockNumber();
    } catch (err) {
      Logger.error({
        client: this.clientConf.name,
        at: "BlockchainNetwork#getLatestBlock",
        message: "Coun't get latest block.",
        error: err,
      });
      return -1;
    }
  };

  _verifyNetworkConnection = async () => {
    try {
      const res = await this.provider.getNetwork();
      Logger.info({
        client: this.clientConf.name,
        at: "BlockchainNetwork#verifyNetworkConnection",
        message: `Connected to network: ${res.name}`,
      });
      return true;
    } catch (err) {
      Logger.info({
        client: this.clientConf.name,
        at: "BlockchainNetwork#verifyNetworkConnection",
        message: `Not connected to network: ${err}`,
      });
      return false;
    }
  };

  public query = async (
    eventFilter: EventFilter,
    fromBlock: BlockTag = -100,
    toBlock?: BlockTag
  ): Promise<Event[]> => {
    Logger.info({
      client: this.clientConf.name,
      at: "BlockchainNetwork#query",
      message: `Querying blockchain network for events from block ${fromBlock} to block ${toBlock}...`,
    });

    try {
      const networkEvents: Event[] = await this.contract.queryFilter(
        eventFilter,
        fromBlock,
        toBlock
      );
      Logger.info({
        client: this.clientConf.name,
        at: "BlockchainNetwork#query",
        message: `Events found: ${networkEvents.length}`,
      });
      return networkEvents;
    } catch (err) {
      Logger.error({
        client: this.clientConf.name,
        at: "BlockchainNetwork#query",
        message: "Query failed.",
        error: err,
      });
      return [];
    }
  };
}

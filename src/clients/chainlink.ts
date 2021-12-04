import Blockchain from "../helpers/blockchain-helpers";
import Client from "../lib/client";
import { IConfig, IToken, ITokenPrice } from "../models";

export default class Chainlink extends Client {
  public bc: Blockchain;

  constructor(conf: IConfig) {
    super(conf);
    this.bc = new Blockchain(this.conf);
  }

  setup = async (): Promise<void> => {
    await this.bc.connect();
  };

  tokenPriceListener = async () => {};

  private _fetchLatestPricesFromBlockchain = async (
    tokens: IToken[],
    denomination: string = "eth"
  ): Promise<ITokenPrice[] | null> => {
    // let parsedTokenPrices: ITokenPrice[] = [];
    // let res = await this.bc.query(eventFilter, fromBlock, toBlock);
    return null;
  };

  private _addBlockchainListener = async (
    listenerName: string
  ): Promise<boolean> => {
    return await this.bc.addListener(listenerName);
    // TODO - STOPPED HERE (how many tokens are on this network? too many to listen to all of them? then maybe select the most important ones?)
  };
}

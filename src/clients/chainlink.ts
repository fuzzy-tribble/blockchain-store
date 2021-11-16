import Client from "../lib/client";
import { IConfig, IToken } from "../models";

export default class Chainlink extends Client {
  constructor(conf: IConfig) {
    super(conf);
  }

  private _getLatestPriceFromBlockchain = async (
    tokens: IToken[],
    denomination
  ): Promise<void> => {
    // TODO - update token prices from chainlink blockchain contract
  };
}

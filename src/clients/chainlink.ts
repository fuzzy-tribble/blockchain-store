import Client from "../lib/client";
import { IConfig } from "../models";

export default class Chainlink extends Client {
  constructor(conf: IConfig) {
    super(conf);
  }

  getTokens = async (): Promise<void> => {
    // TODO - not needed (tokens should automatically be added based on client reserves)
  };

  updateTokens = async (): Promise<void> => {
    // TODO - update token prices from chainlink blockchain contract
  };
}

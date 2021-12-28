import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import Logger from "../../src/lib/logger";
import { ClientNames, NetworkNames } from "../../src/lib/types";
import Chainlink from "../../src/clients/chainlink";
import { mongodb_test_uri } from "../mockData";
import { Config, IConfig } from "../../src/models";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Client: chainlink", () => {
  let chainlink: Chainlink;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.CHAINLINK,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    chainlink = new Chainlink(conf);
    await chainlink.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("Parse blockchain data", () => {
    it("should parse price change data from blockchain", () => {});
  });
  describe("Fetch blockchain data", () => {
    it("should fetch/subscribe to blockchain event and emit server event", () => {});
  });
});

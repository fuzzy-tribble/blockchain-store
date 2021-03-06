import mongoose from "mongoose";
import { expect } from "chai";
import { Config, IConfig } from "../../src/models";
import Sushiswap from "../../src/clients/sushiswap";
import { mongodb_test_uri } from "../mockData";
import { ClientNames, NetworkNames } from "../../src/lib/types";

describe("sushiswap-client", () => {
  let sushiswap: Sushiswap;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.SUSHISWAP,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    sushiswap = new Sushiswap(conf);
    await sushiswap.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("Parse api data", () => {
    // TODO - implement
  });

  describe("Fetch api data", () => {
    // TODO - implement
  });

  describe("Poll functions", () => {
    // TODO - implement
  });
});

import { expect } from "chai";
import { Config, IConfig } from "../../src/models";
import Sushiswap from "../../src/clients/sushiswap";
import {
  mockSushiswapPairData,
  mockSushiswapTokenData,
  mongodb_test_uri,
} from "../mockData";
import mongoose from "mongoose";

describe("sushiswap-client", () => {
  let sushiswap: Sushiswap;
  let conf: IConfig | null;
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork("sushiswap", "mainnet");
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    sushiswap = new Sushiswap(conf);
  });

  after(async () => {
    mongoose.connection.close();
  });

  it("should get reserves", async () => {
    let reserves = await sushiswap.getReserves();
    console.log(reserves);
    expect(reserves.length).to.be.greaterThan(1);
  }).timeout(5 * 1000);

  it("should update reserves data", async () => {
    // let res = await aave.updateReserves();
    // console.log(res);
  });

  it("should get accounts", async () => {});
  it("should update accounts data", async () => {});
});

import { expect } from "chai";
import { Config, IConfig } from "../../src/models";
import Sushiswap from "../../src/clients/sushiswap";
import {
  mockSushiswapPairData,
  mockSushiswapTokenData,
  mongodb_test_uri,
} from "../mockData";
import mongoose from "mongoose";
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

  it("should add new reserves", async () => {
    let result = await sushiswap.addNewReserves();
    expect(result.status).to.be.false;
  }).timeout(5 * 1000);

  it("should update reserve pricing data", async () => {
    let result = await sushiswap.updateReservePriceData();
    expect(result.status).to.be.false;
  }).timeout(5 * 1000);
});

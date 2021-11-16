import { expect } from "chai";
import mongoose from "mongoose";
import Aave from "../../src/clients/aave";
import { ClientNames, NetworkNames } from "../../src/lib/types";
import { IConfig, Config } from "../../src/models";
import { mockReserves, mongodb_test_uri } from "../mockData";

describe("aave-client", () => {
  let aave: Aave;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.AAVE,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    aave = new Aave(conf);
    await aave.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  it("should get reserves", async () => {
    let reserves = await aave.getReserves();
    console.log(reserves[0]);
    expect(reserves.length).to.be.greaterThan(1);
  });
  it("should update reserves data", async () => {
    // let res = await aave.updateReserves();
    // console.log(res);
  });

  it("should get accounts", async () => {});
  it("should update accounts data", async () => {});
});

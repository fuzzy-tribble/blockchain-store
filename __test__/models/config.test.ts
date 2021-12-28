import mongoose from "mongoose";
import { expect } from "chai";
import { Config } from "../../src/models/config";
import { mockClientConfigs, mongodb_test_uri } from "../mockData";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: configs", () => {
  let conf = mockClientConfigs[0];

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    await Config.updateOne(
      { client: conf.client, network: conf.network },
      conf,
      { upsert: true }
    );
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should get client config", async () => {
    let res = await Config.findByClientNetwork(conf.client, conf.network);
    expect(res).to.not.be.null;
    expect(res?.client).to.equal(mockClientConfigs[0].client);
    expect(res?.network).to.equal(mockClientConfigs[0].network);
  });
});

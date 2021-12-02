import mongoose from "mongoose";
import { expect } from "chai";
import { Config, IConfig } from "../../src/models/config";
import { mockClientConfigs, mongodb_test_uri } from "../mockData";

describe("configs-db", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should get client config", async () => {
    let conf: IConfig = await Config.findByClientNetwork(
      mockClientConfigs[0].client,
      mockClientConfigs[0].network
    );
    expect(conf.accountStore.isEnabled).to.equal(
      mockClientConfigs[0].accountStore.isEnabled
    );
  });
});

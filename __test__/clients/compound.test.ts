import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Config, IConfig } from "../../src/models";
import Logger from "../../src/lib/logger";

import { ClientNames, NetworkNames } from "../../src/lib/types";
import { mongodb_test_uri } from "../mockData";
import Compound from "../../src/clients/compound";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Client: dydx", () => {
  let compound: Compound;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.COMPOUND,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    compound = new Compound(conf);
    await compound.setup();
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

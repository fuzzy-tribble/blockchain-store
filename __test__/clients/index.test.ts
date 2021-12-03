import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import Logger from "../../src/lib/logger";
import { loadClients } from "../../src/clients";

import mongoose from "mongoose";
import { mongodb_test_uri } from "../mockData";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Client: index", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    mongoose.connection.close();
  });
  it("should load clients", () => {
    return expect(loadClients()).to.eventually.be.not.empty;
  });
});

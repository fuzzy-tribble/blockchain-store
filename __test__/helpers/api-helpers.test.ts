import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { mongodb_test_uri, mockValidUrl, mockInvalidUrl } from "../mockData";
import { apiRequest } from "../../src/helpers/api-helpers";
import { ClientNames } from "../../src/lib/types";
import Logger from "../../src/lib/logger";
import { delay } from "../../src/helpers/delay";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: api-helpers", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    mongoose.connection.close();
  });

  it("should fetch api data if valid request", () => {
    return expect(apiRequest(ClientNames.CHAINLINK, { url: mockValidUrl })).to
      .eventually.be.not.null;
  });

  it("should handle invalid requests", async () => {
    return expect(apiRequest(ClientNames.CHAINLINK, { url: mockInvalidUrl })).to
      .eventually.be.null;
  });
});

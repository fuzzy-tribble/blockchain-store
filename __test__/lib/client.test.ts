import { expect } from "chai";
import mongoose from "mongoose";
import { mongodb_test_uri, MockClient } from "../mockData";
import Client from "../../src/lib/client";
import { delay } from "../../src/helpers/delay";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("client", () => {
  let testClient: Client;
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    testClient = new MockClient();
    await testClient.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  it("should add listeners", async () => {});

  it("should poll functions", async () => {
    testClient.start();
    await delay(5 * 1000);
    expect(testClient.pollCounters["mockPollFunction1"]).to.be.greaterThan(2);
    expect(testClient.pollCounters["mockPollFunction2"]).to.be.greaterThan(1);
    testClient.stop();
  }).timeout(8 * 1000);
});

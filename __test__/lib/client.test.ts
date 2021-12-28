import { expect } from "chai";
import mongoose from "mongoose";
import { mongodb_test_uri, MockClient } from "../mockData";
import Client from "../../src/lib/client";
import { delay } from "../../src/helpers/delay";
import Logger from "../../src/lib/logger";

// // Silence logs while running tests
// Logger.transports.forEach((t) => (t.silent = true));

describe("client", () => {
  let testClient: Client;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    testClient = new MockClient();
    await testClient.setup();
  });

  after(async () => {
    testClient.stop();
    mongoose.connection.close();
  });

  it("should start/stop client", async () => {
    testClient.start();
    await delay(5 * 1000);
    testClient.stop();
  }).timeout(8 * 1000);

  it("should run poll function without failures", async () => {
    let pc = testClient.pollCounters["mockPollFunction1"];
    expect(pc.successCount).to.be.greaterThan(0);
    expect(pc.failCount).to.equal(0);
  });

  it("should run poll function with failures", async () => {
    let pc = testClient.pollCounters["mockPollFunction2"];
    expect(pc.successCount).to.equal(0);
    expect(pc.failCount).to.be.greaterThan(0);
  });

  // it("should poll functions", async () => {
  //   testClient.start();
  //   await delay(6 * 1000);
  //   console.log(JSON.stringify(testClient.pollCounters));
  //   expect(
  //     testClient.pollCounters["mockPollFunction1"].successCount
  //   ).to.be.greaterThan(0);
  //   expect(
  //     testClient.pollCounters["mockPollFunction2"].successCount
  //   ).to.be.greaterThan(0);
  //   testClient.stop();
  // }).timeout(10 * 1000);

  it("should add listeners / subscribers - TODO", async () => {
    // TODO
  });
});

import mongoose from "mongoose";
import { expect } from "chai";
import { EventsManager } from "../../src/helpers/socket-helpers";
import Logger from "../../src/lib/logger";
import { mongodb_test_uri, mockEvents } from "../mockData";
import { Event } from "../../src/models/event";
import { delay } from "../../src/helpers/delay";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: socket-helpers", () => {
  let mockEvent = mockEvents[0];

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should be ready", async () => {
    let result = await EventsManager.isReady();
    expect(result).to.be.true;
  }).timeout(12 * 1000);

  it("should log connection status (connect, disconnect, connection error)", () => {});

  it("should have local database listener by default", async () => {
    let n = await EventsManager.serverSocket?.allSockets();
    expect(n?.size).to.equal(1);
  });

  it("should save emitted events to events db", async () => {
    EventsManager.emit(mockEvent.name, mockEvent);
    await delay(1 * 1000); // wait for db update on emit
    let res = await Event.find({ name: mockEvent.name });
    expect(res.length).to.equal(1);
    expect(res[0].name).to.equal(mockEvent.name);
  }).timeout(4 * 1000);
});

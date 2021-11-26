import { expect } from "chai";
import mongoose from "mongoose";
import { Event } from "../../src/models/event";
import { mockEvents, mockInvalidEvents, mongodb_test_uri } from "../mockData";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: events", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  beforeEach(async () => {
    await Event.collection.deleteMany({});
    let nDocs = await Event.countDocuments();
    expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should insert events (no overwirting/upserting)", async () => {
    let nInserted = await Event.addData(mockEvents);
    expect(nInserted).to.equal(mockEvents.length);
  });
  it("should not insert INVALID events", async () => {
    let nChanged = await Event.addData(mockInvalidEvents as any);
    expect(nChanged).to.equal(0);
    expect(await Event.countDocuments()).to.equal(0);
  });
});

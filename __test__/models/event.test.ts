import { expect } from "chai";
import mongoose from "mongoose";
import { Event, IEvent } from "../../src/models";
import { mockEvents, mongodb_test_uri } from "../mockData";

describe("events-db", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should add and never overwrite event", async () => {
    let nChanged = await Event.addEvents(mockEvents);
    expect(nChanged).to.equal(mockEvents.length);
  });
});

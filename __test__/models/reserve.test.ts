import mongoose from "mongoose";
import { expect } from "chai";
import { IReserve, Reserve } from "../../src/models/reserve";
import { Token } from "../../src/models/token";
import {
  mockReserves,
  mockReservesUpdated,
  mockInvalidReserves,
  mongodb_test_uri,
  mockTokens,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// // Display mongo logs
// mongoose.set("debug", true);

describe("Collection: reserves", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    await mongoose.connection.dropDatabase();
  });

  beforeEach(async () => {
    await Reserve.collection.deleteMany({});
    await Token.collection.deleteMany({});
    let nDocs = await Reserve.countDocuments();
    expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should upsert RESERVES", async () => {
    let res = await Reserve.addData(mockReserves);
    expect(res.modifiedCount + res.upsertedCount).to.equal(mockReserves.length);
  });

  it("should upsert RESERVES already in db", async () => {
    let res1 = await Reserve.addData(mockReserves);
    let res2 = await Reserve.addData(mockReservesUpdated);
    expect(res2.modifiedCount + res2.upsertedCount).to.equal(
      mockReservesUpdated.length
    );
  });

  it("should handle adding invalid RESERVES (returns nChanged=0 and doesn't add to db)", async () => {
    let res = await Reserve.addData(mockInvalidReserves as any[]);
    expect(res.upsertedIds.concat(res.modifiedIds)).to.be.empty;
    expect(res.invalidCount).to.equal(mockInvalidReserves.length);
    expect(await Reserve.countDocuments()).to.equal(0);
  });

  it("should find reserves by client, network", async () => {
    let reserves: IReserve[] = await Reserve.findByClientNetwork(
      mockReserves[0].client,
      mockReserves[0].network
    );
    expect(reserves.length).to.be.lessThan(mockReserves.length);
  });
});

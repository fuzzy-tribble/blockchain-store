import mongoose from "mongoose";
import { expect } from "chai";
import { IReserve, Reserve } from "../../src/models/reserve";
import { Token } from "../../src/models/token";
import {
  mockReserves,
  mockInvalidReserves,
  mongodb_test_uri,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: reserves", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
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

  it("should upsert RESERVES and return nChanged", async () => {
    let nChanged = await Reserve.addData(mockReserves);
    expect(nChanged).to.equal(mockReserves.length);
  });

  it("should upsert RESERVES and return ids", async () => {
    let ids = await Reserve.addDataAndGetIds(mockReserves);
    console.log(ids);
    expect(ids.length).to.equal(mockReserves.length);
  });

  // it("should handle adding invalid RESERVES (returns ids=[] and doesn't add to db)", async () => {
  //   let ids = await Reserve.addDataAndGetIds(mockInvalidReserves as any[]);
  //   expect(ids).to.be.empty;
  //   expect(await Reserve.countDocuments()).to.equal(0);
  // });

  // it("should handle adding invalid RESERVES (returns nChanged=0 and doesn't add to db)", async () => {
  //   let nChanged = await Reserve.addData(mockInvalidReserves as any[]);
  //   expect(nChanged).to.equal(0);
  //   expect(await Reserve.countDocuments()).to.equal(0);
  // });

  // it("should find reserves by client, network", async () => {
  //   let reserves: IReserve[] = await Reserve.findByClientNetwork(
  //     mockReserves[0].client,
  //     mockReserves[0].network
  //   );
  //   expect(reserves.length).to.be.lessThan(mockReserves.length);
  // });
});

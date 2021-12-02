import mongoose, { FilterQuery } from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { AccountReserve } from "../../src/models/account-reserve";
import {
  mockInvalidAccountReserves,
  mockAccountReserves,
  mockAccountReservesUpdated,
  mongodb_test_uri,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: account-reserve", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    // expect(mongoose.connection).to.not.be.undefined;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
    // expect(mongoose.connection).to.be.undefined;
  });

  it("should upsert ACCOUNT-RESERVES", async () => {
    let res = await AccountReserve.addData(mockAccountReserves);
    expect(res.modifiedCount + res.upsertedCount).to.equal(
      mockAccountReserves.length
    );
  });

  it("should upsert ACCOUNT-RESERVES already in db", async () => {
    let res1 = await AccountReserve.addData(mockAccountReserves);
    let res2 = await AccountReserve.addData(mockAccountReservesUpdated);
    expect(res2.modifiedCount + res2.upsertedCount).to.equal(
      mockAccountReserves.length
    );
    expect(res1.upsertedIds).to.have.all.members(res2.modifiedIds);
  });

  it("should handle adding invalid ACCOUNT-RESERVES (returns nChanged=0 and doesn't add to db)", async () => {
    let res = await AccountReserve.addData(mockInvalidAccountReserves as any[]);
    expect(res.modifiedCount + res.upsertedCount).to.equal(0);
    expect(await AccountReserve.countDocuments()).to.equal(0);
  });
});

import mongoose, { FilterQuery } from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { AccountReserve } from "../../src/models/account-reserve";
import {
  mockInvalidAccountReserves,
  mockAccountReserves,
  mockAccountReservesUpdated,
  mongodb_test_uri,
  mockAccounts,
  mockTokens,
  mockReserves,
} from "../mockData";
import Logger from "../../src/lib/logger";
import { Account, Reserve, Token } from "../../src/models";
import { EventsManager } from "../../src/helpers/socket-helpers";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Collection: account-reserve", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    await mongoose.connection.dropDatabase();
    await mongoose.connect(mongodb_test_uri);
    let res1 = await Account.addData(mockAccounts);
    let res2 = await Reserve.addData(mockReserves);
    expect(res1.invalidCount + res2.invalidCount).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await AccountReserve.collection.deleteMany({});
  });

  it("should upsert ACCOUNT-RESERVES", async () => {
    let res = await AccountReserve.addData(mockAccountReserves);
    expect(res.invalidCount).to.equal(0);
    expect(res.modifiedCount + res.upsertedCount).to.equal(
      mockAccountReserves.length
    );
  });

  it("should upsert ACCOUNT-RESERVES already in db", async () => {
    let res1 = await AccountReserve.addData(mockAccountReserves);
    console.log("RES1: ", res1);
    let res2 = await AccountReserve.addData(mockAccountReservesUpdated);
    console.log("RES2: ", res2);
    expect(res2.invalidCount + res1.invalidCount).to.equal(0);
    expect(res2.modifiedCount + res2.upsertedCount).to.equal(
      mockAccountReserves.length
    );
  });

  it("should handle adding invalid ACCOUNT-RESERVES (returns nChanged=0 and doesn't add to db)", async () => {
    let res = await AccountReserve.addData(mockInvalidAccountReserves as any[]);
    console.log("RES: ", res);
    expect(res.modifiedCount + res.upsertedCount).to.equal(0);
    expect(res.invalidCount).to.equal(mockInvalidAccountReserves.length);
    expect(await AccountReserve.countDocuments()).to.equal(0);
  });
});

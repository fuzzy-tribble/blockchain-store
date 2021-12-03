import mongoose from "mongoose";
import { Account, IAccount } from "../../src/models/account";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  mongodb_test_uri,
  mockAccounts,
  mockAccountsUpdated,
  mockInvalidAccounts,
  mockInvalidTokens,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Collection: accounts", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  beforeEach(async () => {
    await Account.collection.deleteMany({});
    let nDocs = await Account.countDocuments();
    expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should upsert ACCOUNTS", async () => {
    let res = await Account.addData(mockAccounts);
    expect(res.upsertedCount).to.equal(mockAccounts.length);
  });

  it("should upsert ACCOUNTS already in db", async () => {
    let res1 = await Account.addData(mockAccounts);
    let res2 = await Account.addData(mockAccountsUpdated);
    expect(res2.modifiedCount + res2.upsertedCount).to.equal(
      mockAccountsUpdated.length
    );
  });

  // it("should throw db validation error on invalid ACCOUNTS", async () => {
  //   mockInvalidAccounts.forEach(async (account) => {
  //     let filter = {
  //       address: account.address,
  //       client: account.client,
  //       network: account.network,
  //     };
  //     let options = {
  //       upsert: true,
  //       runValidators: true,
  //     };
  //     expect(await Account.countDocuments()).to.equal(0);
  //     return expect(
  //       Account.updateOne(filter as any, account as IAccount, options)
  //     ).to.eventually.rejectedWith("ValidationError");
  //   });
  // });

  it("should handle adding invalid accounts (returns nChanged=0 and doesn't add to db)", async () => {
    let res = await Account.addData(mockInvalidAccounts as any[]);
    expect(res.invalidCount).to.equal(mockInvalidAccounts.length);
    expect(await Account.countDocuments()).to.equal(0);
  });
});

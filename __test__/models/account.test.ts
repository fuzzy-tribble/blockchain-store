import mongoose from "mongoose";
import { Account, IAccount } from "../../src/models/account";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  mongodb_test_uri,
  mockAccounts,
  mockInvalidAccounts,
  mockInvalidTokens,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

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

  it("should upsert ACCOUNTS and return nChanged", async () => {
    let nChanged = await Account.addData(mockAccounts);
    expect(nChanged).to.equal(mockAccounts.length);
  });

  it("should upsert ACCOUNTS and return ids", async () => {
    let ids = await Account.addDataAndGetIds(mockAccounts);
    expect(ids.length).to.equal(mockAccounts.length);
  });

  it("should throw db validation error on invalid ACCOUNTS", async () => {
    mockInvalidAccounts.forEach((account) => {
      let filter = {
        address: account.address,
        client: account.client,
        network: account.network,
      };
      let options = {
        upsert: true,
        runValidators: true,
      };
      expect(
        Account.updateOne(filter as any, account as IAccount, options)
      ).to.eventually.rejectedWith("ValidationError");
    });
    expect(await Account.countDocuments()).to.equal(0);
  });

  it("should throw db validation error on invalid ACCOUNTS", async () => {
    mockInvalidAccounts.forEach((account) => {
      let filter = {
        address: account.address,
        client: account.client,
        network: account.network,
      };
      let options = {
        upsert: true,
        runValidators: true,
        new: true,
      };
      expect(
        Account.findOneAndUpdate(filter as any, account as IAccount, options)
      ).to.eventually.rejectedWith("ValidationError");
    });
    expect(await Account.countDocuments()).to.equal(0);
  });

  it("should handle adding invalid accounts (returns ids=[] and doesn't add to db)", async () => {
    let ids = await Account.addDataAndGetIds(mockInvalidAccounts as any[]);
    expect(ids).to.be.empty;
    expect(await Account.countDocuments()).to.equal(0);
  });

  it("should handle adding invalid accounts (returns nChanged=0 and doesn't add to db)", async () => {
    let nChanged = await Account.addData(mockInvalidAccounts as any[]);
    expect(nChanged).to.equal(0);
    expect(await Account.countDocuments()).to.equal(0);
  });
});

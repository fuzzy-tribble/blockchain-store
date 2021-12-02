import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Token } from "../../src/models/token";
import {
  mockInvalidTokens,
  mockTokens,
  mockTokensUpdated,
  mongodb_test_uri,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: tokens", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    await mongoose.connection.dropDatabase();
  });

  beforeEach(async () => {
    await Token.collection.deleteMany({});
    let nDocs = await Token.countDocuments();
    expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should upsert TOKENS", async () => {
    let res = await Token.addData(mockTokens);
    expect(res.modifiedCount + res.upsertedCount).to.equal(mockTokens.length);
  });

  it("should upsert TOKENS already in db", async () => {
    let res1 = await Token.addData(mockTokens);
    let res2 = await Token.addData(mockTokensUpdated);
    expect(res1.modifiedCount + res1.upsertedCount).to.equal(mockTokens.length);
    expect(res1.upsertedIds).to.have.all.members(res2.modifiedIds);
  });

  it("should throw db validation error on invalid TOKENS", () => {
    mockInvalidTokens.forEach((token) => {
      let filter = {
        uid: token.uid,
      };
      let options = {
        upsert: true,
        runValidators: true,
      };
      return expect(
        Token.updateOne(filter as any, token, options)
      ).to.eventually.rejectedWith("ValidationError");
    });
  });

  it("should handle adding invalid TOKENS (returns ids=[] and doesn't add to db)", async () => {
    let res = await Token.addData(mockInvalidTokens as any[]);
    expect(res.invalidCount).to.equal(mockInvalidTokens.length);
    expect(res.upsertedIds).to.be.empty;
    expect(await Token.countDocuments()).to.equal(0);
  });
});

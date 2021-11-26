import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { IToken, ITokenDoc, Token } from "../../src/models/token";
import { mockInvalidTokens, mockTokens, mongodb_test_uri } from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: tokens", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    // expect(mongoose.connection).to.not.be.undefined;
  });

  beforeEach(async () => {
    await Token.collection.deleteMany({});
    let nDocs = await Token.countDocuments();
    expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
    // expect(mongoose.connection).to.be.undefined;
  });

  it("should upsert TOKENS and return nChanged", async () => {
    let updateRes = await Token.addData(mockTokens);
    expect(updateRes.modifiedCount + updateRes.upsertedCount).to.equal(
      mockTokens.length
    );
  });

  // it("should upsert TOKENS and return ids", async () => {
  //   let ids = await Token.addDataAndGetIds(mockTokens);
  //   expect(ids.length).to.equal(mockTokens.length);
  // });
  it("should throw db validation error on invalid TOKENS", async () => {
    mockInvalidTokens.forEach((token) => {
      let filter = {
        address: token.address,
        network: token.network,
      };
      let options = {
        upsert: true,
        runValidators: true,
      };
      expect(
        Token.updateOne(filter as any, token, options)
      ).to.eventually.rejectedWith("ValidationError");
    });
  });
  // it("should throw db validation error on invalid TOKENS", async () => {
  //   mockInvalidTokens.forEach((token) => {
  //     let filter = {
  //       address: token.address,
  //       network: token.network,
  //     };
  //     let options = {
  //       upsert: true,
  //       runValidators: true,
  //       new: true,
  //     };
  //     expect(
  //       Token.findOneAndUpdate(filter as any, token, options)
  //     ).to.eventually.be.rejectedWith("ValidationError");
  //   });
  // });
  it("should handle adding invalid TOKENS (returns ids=[] and doesn't add to db)", async () => {
    let ids = await Token.addDataAndGetIds(mockInvalidTokens as any[]);
    expect(ids).to.be.empty;
    expect(await Token.countDocuments()).to.equal(0);
  });
  it("should handle adding invalid TOKENS (returns nChanged=0 and doesn't add to db)", async () => {
    let nChanged = await Token.addData(mockInvalidTokens as any[]);
    expect(nChanged).to.equal(0);
    expect(await Token.countDocuments()).to.equal(0);
  });
});

import mongoose from "mongoose";
import { expect } from "chai";
import { IToken, Token } from "../../src/models";
import { mockTokens, mongodb_test_uri } from "../mockData";

describe("Token-model", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should add data to token collection", async () => {
    let nChanged = await Token.addData(mockTokens);
    expect(nChanged).to.equal(mockTokens.length);
  });
  it("should find Tokens by address, network", async () => {});
  it("should find Tokens by reserve", async () => {});
});

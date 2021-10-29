import mongoose from "mongoose";
import { assert } from "chai";

describe("accounts-db", () => {
  let a, b, c;

  before(async () => {
    // await mongoose.connect("mongodb://127.0.0.1:27017/test");
  });

  after(() => {
    // close connection
    // await mongoose.disconnect()
  });

  it("should add new accounts", () => {
    let username = "darth_sidious";

    username.should.be.a("string");
    username.should.equal("darth_sidious");
    username.should.have.lengthOf(13);
  });

  it("should update existing account", () => {});
  it("should get most risky accounts", () => {});
  it("should get least risky accounts", () => {});
});

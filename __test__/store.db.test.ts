import mongoose from "mongoose";
import { Store } from "../src/models";
import { expect } from "chai";

describe("store", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should not create new account without proper params", async () => {});
  it("should add a new account", async () => {});
  it("should update existing account", async () => {});
  it("should get most risky accounts", () => {});
  it("should get least risky accounts", () => {});
});

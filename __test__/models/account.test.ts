import mongoose from "mongoose";
import { Account, IAccount } from "../../src/models/account";
import { expect } from "chai";
import {
  mongodb_test_uri,
  mockAccounts,
  mockUpdatedAccountData,
} from "../mockData";

describe("accounts-db", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    // await mongoose.connection.db.dropCollection("accounts");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should get accounts", async () => {});
  it("should update account data", async () => {});
});

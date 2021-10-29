import mongoose from "mongoose";
import { Account } from "../src/models/account";
import { expect } from "chai";

describe("accounts-db", () => {
  const FIRST_ADDRESS = "000000001111111122222222";

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it("should not create new account without proper params", async () => {
    const newAccount = await Account.create({});
    // TODO - should throw error?
    expect(newAccount.address).to.be.undefined;
  });

  it("should add a new account", async () => {
    const newAccount = await Account.create({ address: FIRST_ADDRESS });
    expect(newAccount.address).to.equal(FIRST_ADDRESS);
    expect(newAccount.isPendingUpdate).to.be.false;
  });

  it("should update existing account", async () => {
    const newAccount = await Account.create({ address: FIRST_ADDRESS });
    await newAccount.save();
    await Account.updateOne(
      {
        address: FIRST_ADDRESS,
      },
      {
        isPendingUpdate: true,
      }
    );
    const accounts = await Account.find({ address: FIRST_ADDRESS });
    expect(accounts.length).to.equal(1);
    expect(accounts[0].isPendingUpdate).to.be.true;
  });
  it("should get most risky accounts", () => {});
  it("should get least risky accounts", () => {});
});

import mongoose from "mongoose";
import { Account } from "../src/models/account";

const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 5);

const run = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  // // Add accounts
  // const account = await Account.create({
  //   address: "55132165anclkasndklsa",
  //   lastUpdated: Date.now(),
  // });
  // const res = await account.save();
  // console.log(res);

  const oldAccounts = await Account.findAccountsOlderThan(0);
  oldAccounts.forEach((acnt) => {
    console.log(acnt);
  });
};

run();

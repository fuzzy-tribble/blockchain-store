import mongoose, { FilterQuery } from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  AccountReserve,
  IAccountReserveDoc,
} from "../../src/models/account-reserve";
import { Account, IAccount } from "../../src/models/account";
import { Reserve, IReserve } from "../../src/models/reserve";
import { Token } from "../../src/models/token";
import { defaultQueryOptions } from "../../src/models";
import {
  mockInvalidAccountReserves,
  mockAccountReserves,
  mongodb_test_uri,
} from "../mockData";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Collection: account-reserve", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    // expect(mongoose.connection).to.not.be.undefined;
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connect(mongodb_test_uri);
    // await AccountReserve.collection.deleteMany({});
    // await Account.collection.deleteMany({});
    // await Reserve.collection.deleteMany({});
    // await Token.collection.deleteMany({});
    // let nDocs = await AccountReserve.countDocuments();
    // expect(nDocs).to.equal(0);
  });

  after(async () => {
    await mongoose.connection.close();
    // expect(mongoose.connection).to.be.undefined;
  });

  it("TMP TEST ACCOUNT-RESERVES", async () => {
    let accountReserve = mockAccountReserves[0];
    console.log("ACCOUNT_RESERVE: ", accountReserve);
    let [accountId] = await Account.addDataAndGetIds([
      accountReserve.account as IAccount,
    ]);
    console.log("ACCOUNTID: ", accountId);
    let [reserveId] = await Reserve.addDataAndGetIds([
      accountReserve.reserve as IReserve,
    ]);
    console.log("RESERVEID: ", reserveId);
    if (accountId && reserveId) {
      accountReserve["account"] = accountId;
      accountReserve["reserve"] = reserveId;
      let filter: FilterQuery<IAccountReserveDoc> = {
        account: accountReserve.account,
        reserve: accountReserve.reserve,
      };
      let oneUpdatedRes = await AccountReserve.updateOne(
        filter,
        accountReserve,
        defaultQueryOptions
      );
      console.log("RES: ", oneUpdatedRes);
    }
  });

  // it("should upsert ACCOUNT-RESERVES and return nChanged", async () => {
  //   let nChanged = await AccountReserve.addData(mockAccountReserves);
  //   expect(nChanged).to.equal(mockAccountReserves.length);
  // });

  // it("should upsert ACCOUNT-RESERVES and return ids", async () => {
  //   let ids = await AccountReserve.addDataAndGetIds(mockAccountReserves);
  //   console.log(ids);
  //   expect(ids.length).to.equal(mockAccountReserves.length);
  // });

  // // it("should handle adding invalid ACCOUNT-RESERVES (returns ids=[] and doesn't add to db)", async () => {
  // //   let ids = await AccountReserve.addDataAndGetIds(
  // //     mockInvalidAccountReserves as any[]
  // //   );
  // //   expect(ids).to.be.empty;
  // //   expect(await AccountReserve.countDocuments()).to.equal(0);
  // // });

  // // it("should handle adding invalid ACCOUNT-RESERVES (returns nChanged=0 and doesn't add to db)", async () => {
  // //   let nChanged = await AccountReserve.addData(
  // //     mockInvalidAccountReserves as any[]
  // //   );
  // //   expect(nChanged).to.equal(0);
  // //   expect(await AccountReserve.countDocuments()).to.equal(0);
  // // });
});

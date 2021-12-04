import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  mockAccounts,
  mockReserves,
  mockEvents,
  mongodb_test_uri,
} from "../mockData";
import {
  customRequiredFieldsValidation,
  validateMany,
  updateDatabase,
} from "../../src/helpers/db-helpers";
import Logger from "../../src/lib/logger";
import {
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
} from "../../src/lib/types";
import { Account, Reserve, Event } from "../../src/models";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Helpers: db-helpers", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("Validator helpers", () => {
    const kittySchemaFields = {
      name: { type: String, required: true },
    };
    const kittySchema = new mongoose.Schema(kittySchemaFields);
    const Kitten = mongoose.model("Kitten", kittySchema);

    // beforeEach(async () => {
    //   await Kitten.deleteMany({});
    // });

    it("should validateMany", async () => {
      const silence = new Kitten({ name: "Silence" });
      await silence.save();
      let res = validateMany([silence], Kitten.schema);
      expect(res.validCount).to.equal(1);
    });

    it("should run updateValidation pre updateOne", async () => {
      kittySchema.pre(["updateOne"], function () {
        customRequiredFieldsValidation(this.getUpdate(), kittySchema.obj);
      });
      let res = await Kitten.updateOne({ name: "Silence" }, { name: "Scream" });
      expect(res.modifiedCount).to.equal(1);
    });
  });

  describe("Database update helpers", () => {
    beforeEach(async () => {
      await Account.deleteMany({});
      await Reserve.deleteMany({});
      await Event.deleteMany({});
    });

    it("should updateDatabase (mockAccountData)", async () => {
      let functionResult: ClientFunctionResult = {
        success: false,
        client: ClientNames.AAVE,
        network: "mainnet",
        data: [
          { collectionName: CollectionNames.ACCOUNTS, data: mockAccounts },
        ],
      };
      let res = await updateDatabase(functionResult.data);
      expect(res.success).to.be.true;
    });
    it("should updateDatabase (mockReserveData)", async () => {
      let functionResult: ClientFunctionResult = {
        success: false,
        client: ClientNames.AAVE,
        network: "mainnet",
        data: [
          { collectionName: CollectionNames.RESERVES, data: mockReserves },
        ],
      };
      let res = await updateDatabase(functionResult.data);
      expect(res.success).to.be.true;
    });
    it("should updateDatabase (mockEventData)", async () => {
      let functionResult: ClientFunctionResult = {
        success: false,
        client: ClientNames.AAVE,
        network: "mainnet",
        data: [{ collectionName: CollectionNames.EVENTS, data: mockEvents }],
      };
      let res = await updateDatabase(functionResult.data);
      expect(res.success).to.be.true;
    });
  });
});

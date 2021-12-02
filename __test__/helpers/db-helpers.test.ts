import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { mockTokens, mongodb_test_uri } from "../mockData";
import {
  defaultQueryOptions,
  defaultSchemaOpts,
  updateValidation,
  //   updateDatabase,
  validateRequiredFields,
  validateMany,
} from "../../src/helpers/db-helpers";
import Logger from "../../src/lib/logger";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: db-helpers", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    mongoose.connection.close();
  });

  it("should validateMany", async () => {
    const kittySchemaFields = {
      name: { type: String, required: true },
    };
    const kittySchema = new mongoose.Schema(kittySchemaFields);
    const Kitten = mongoose.model("Kitten", kittySchema);
    await Kitten.deleteMany({});
    const silence = new Kitten({ name: "Silence" });
    await silence.save();
    let res = validateMany([silence], Kitten.schema);
    expect(res.validCount).to.equal(1);
  });
});

import { expect } from "chai";
import mongoose from "mongoose";
import { mongodb_test_uri } from "./mockData";

describe("Mongodb and mongoose basics ", () => {
  after(async () => {
    await mongoose.connection.close();
  });

  it("should connect and show ready state = 1 (connected)", async () => {
    await mongoose.connect(mongodb_test_uri);
    expect(mongoose.connection.readyState).to.equal(1);
  });

  it("should insert doc successfully", async () => {
    const kittySchema = new mongoose.Schema({
      name: String,
    });
    const Kitten = mongoose.model("Kitten", kittySchema);
    await Kitten.deleteMany({});
    const silence = new Kitten({ name: "Silence" });
    await silence.save();
    expect(await Kitten.countDocuments()).to.equal(1);
  });
});

import mongoose from "mongoose";
import { expect } from "chai";
import { IReserve, Reserve } from "../../src/models";
import { mockReserves, mongodb_test_uri } from "../mockData";

describe("reserve-model", () => {
  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should upsert reserves", async () => {
    let nChanged = await Reserve.addData(mockReserves);
    expect(nChanged).to.equal(mockReserves.length);
  });
  it("should find reserves by client, network", async () => {
    let reserves: IReserve[] = await Reserve.findByClientNetwork(
      mockReserves[0].client,
      mockReserves[0].network
    );
    expect(reserves.length).to.be.lessThan(mockReserves.length);
  });
});

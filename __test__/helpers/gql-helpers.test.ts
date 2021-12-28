import mongoose from "mongoose";
import { expect } from "chai";
import GqlClient from "../../src/helpers/graphql-helpers";
import Logger from "../../src/lib/logger";
import { ClientNames } from "../../src/lib/types";
import { Config, IConfig } from "../../src/models";
import { mockGqlQuery, mongodb_test_uri } from "../mockData";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: gql-helpers", () => {
  let gql: GqlClient;
  let conf: IConfig | null = null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should find confs", async () => {
    conf = await Config.findByClientNetwork(ClientNames.AAVE, "mainnet");
    if (!conf) throw Error("Conf must be defined");
    gql = new GqlClient(conf);
  });

  it("should query", async () => {
    const res = await gql.query(mockGqlQuery);
    expect(res?.data.reserves.length).to.be.greaterThan(1);
  }).timeout(5 * 1000);

  it("should handle invalid queries", () => {
    //TODO
  });
});

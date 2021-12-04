import { expect } from "chai";
import GqlClient from "../../src/helpers/graphql-helpers";
import Logger from "../../src/lib/logger";
import { mockGqlEndpoint, mockGqlQuery } from "../mockData";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: gql-helpers", () => {
  let gql: GqlClient;

  before(async () => {
    gql = new GqlClient("aave", mockGqlEndpoint);
  });

  it("should query", async () => {
    const res = await gql.query(mockGqlQuery);
    expect(res?.data.reserves.length).to.be.greaterThan(1);
  });
});

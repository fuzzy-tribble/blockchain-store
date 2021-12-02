import { gql } from "@apollo/client/core";
import { expect } from "chai";
import GqlClient from "../../src/helpers/graphql-helpers";

const mockQuery = gql`
  query GetReserveData {
    reserves(where: { usageAsCollateralEnabled: true }) {
      id
      name
      price {
        id
      }
      liquidityRate
      variableBorrowRate
      stableBorrowRate
      symbol
      decimals
    }
  }
`;
const sampleEndpoint =
  "https://api.thegraph.com/subgraphs/name/aave/protocol-v2";

describe("gql-helpers", () => {
  let gql: GqlClient;

  before(async () => {
    gql = new GqlClient("aave", sampleEndpoint);
  });

  it("should query", async () => {
    const res = await gql.query(mockQuery);
    expect(res?.data.reserves.length).to.be.greaterThan(1);
  });
});

import { expect } from "chai";
import mongoose from "mongoose";
import Aave from "../../src/clients/aave";
import {
  parseLiquidatableAccountReservesFromApi,
  parseReservesFromGql,
} from "../../src/clients/helpers/aave-helpers";
import { validateMany } from "../../src/helpers/db-helpers";
import Logger from "../../src/lib/logger";
import { ClientNames, NetworkNames } from "../../src/lib/types";
import { IConfig, Config, Token, TokenPrice, Reserve } from "../../src/models";
import { mongodb_test_uri } from "../mockData";

const mockLiquidatableAccountsFromApi = require("../mockData/aave/liquidatableAccountsFromApi.json");
const mockAaveReservesFromGql = require("../mockData/aave/reservesFromGql.json");

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Client: aave", () => {
  let aave: Aave;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.AAVE,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    aave = new Aave(conf);
    await aave.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("API data sources", () => {
    describe("Parse data", () => {
      it("Parse liquidatable accounts/reserves from api data", () => {
        // let parsedData = parseLiquidatableAccountReservesFromApi(
        //   mockLiquidatableAccountsFromApi
        // );
      });
      describe("Fetch api data", () => {
        it("Fetch liquidatable accounts/reserves from api data", () => {});
      });
      describe("Poll functions", () => {
        it("Poll checkLiquidatableAccountsApi() successfully", () => {});
      });
    });
  });

  describe("Graphql data sources", () => {
    describe("Fetch gql data", () => {});
    describe("Parse gql data", () => {
      let parsedData = parseReservesFromGql(
        aave.conf.client,
        aave.conf.network,
        mockAaveReservesFromGql
      );
      let tokenRes = validateMany(parsedData[0].data, Token.schema);
      let tokenPriceRes = validateMany(parsedData[1].data, TokenPrice.schema);
      let reservesRes = validateMany(parsedData[2].data, Reserve.schema);
      expect(tokenRes.invalidCount).to.equal(0);
      expect(tokenPriceRes.invalidCount).to.equal(0);
      expect(reservesRes.invalidCount).to.equal(0);
    });
    describe("Gql poll functions", () => {});
  });

  describe("Blockchain data sources", () => {
    describe("Fetch blockchain data", () => {});
    describe("Parse blockchain data", () => {});
    describe("Blockchain poll functions", () => {});
    describe("Blockchain listeners", () => {});
  });
});

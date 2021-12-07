import { expect } from "chai";
import mongoose from "mongoose";
import Aave from "../../src/clients/aave";
import {
  parseLiquidatableAccountReservesFromApi,
  parseReservesFromGql,
} from "../../src/clients/helpers/aave-helpers";
import {
  AaveApiAccountReserve,
  AaveGqlReserve,
} from "../../src/clients/helpers/aave-types";
import { validateMany } from "../../src/helpers/db-helpers";
import Logger from "../../src/lib/logger";
import { ClientNames, DatabaseUpdate, NetworkNames } from "../../src/lib/types";
import {
  IConfig,
  Config,
  Token,
  TokenPrice,
  Reserve,
  AccountReserve,
  Account,
} from "../../src/models";
import { mongodb_test_uri } from "../mockData";

let tmp = require("../mockData/aave/liquidatableAccountsFromApi.json");
const mockLiquidatableAccountsFromApi: AaveApiAccountReserve[] = tmp.data;
tmp = require("../mockData/aave/reservesFromGql.json");
const mockAaveReservesFromGql: AaveGqlReserve[] = tmp.data.reserves;

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

// mongoose.set("debug", true);

describe("Client: aave", () => {
  let aave: Aave;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    let conf = await Config.findByClientNetwork(
      ClientNames.AAVE,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    aave = new Aave(conf);
    // await aave.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("API data sources", () => {
    describe("Parse data", () => {
      let parsedData: DatabaseUpdate[];

      before(() => {
        parsedData = parseLiquidatableAccountReservesFromApi(
          aave.conf.client,
          aave.conf.network,
          mockLiquidatableAccountsFromApi
        );
      });

      it("should have valid parsed tokens", () => {
        let res = validateMany(parsedData[0].data, Token.schema);
        expect(res.invalidCount).to.equal(0);
      });
      it("should have valid parsed reserves", () => {
        let res = validateMany(parsedData[1].data, Reserve.schema);
        expect(res.invalidCount).to.equal(0);
      });
      it("should have valid parsed account reserves", () => {
        let res = validateMany(parsedData[2].data, AccountReserve.schema);
        expect(res.invalidCount).to.equal(0);
      });
      it("should have valid parsed accounts", () => {
        let res = validateMany(parsedData[3].data, Account.schema);
        expect(res.invalidCount).to.equal(0);
      });
    });

    // describe("Fetch api data", () => {
    //   it("Fetch liquidatable accounts/reserves from api data", () => {});
    // });
    // describe("Poll functions", () => {
    //   it("Poll checkLiquidatableAccountsApi() successfully", () => {});
    // });
  });

  // describe("Graphql data sources", () => {
  //   // describe("Fetch gql data", () => {});
  //   describe("Parse gql reserves", () => {
  //     let parsedData: DatabaseUpdate[];
  //     before(() => {
  //       parsedData = parseReservesFromGql(
  //         aave.conf.client,
  //         aave.conf.network,
  //         mockAaveReservesFromGql
  //       );
  //     });
  //     it("should be valid db update: tokens", () => {
  //       let tokenRes = validateMany(parsedData[0].data, Token.schema);
  //       expect(tokenRes.invalidCount).to.equal(0);
  //       expect(tokenRes.validCount).to.equal(mockAaveReservesFromGql.length);
  //     });
  //     it("should be valid db update: tokenPrices", () => {
  //       let tokenPriceRes = validateMany(parsedData[1].data, TokenPrice.schema);
  //       expect(tokenPriceRes.invalidCount).to.equal(0);
  //     });
  //     it("should be valid db update: reserves", () => {
  //       let reservesRes = validateMany(parsedData[2].data, Reserve.schema);
  //       expect(reservesRes.invalidCount).to.equal(0);
  //     });
  //   });
  //   // describe("Gql poll functions", () => {});
  // });

  // // describe("Blockchain data sources", () => {
  // //   describe("Fetch blockchain data", () => {});
  // //   describe("Parse blockchain data", () => {});
  // //   describe("Blockchain poll functions", () => {});
  // //   describe("Blockchain listeners", () => {});
  // // });
});

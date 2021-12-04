import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  Config,
  IConfig,
  IToken,
  Reserve,
  Token,
  Account,
} from "../../src/models";
import Logger from "../../src/lib/logger";
import Dydx from "../../src/clients/dydx";
import {
  parseMarketsFromApi,
  parseAccountsFromApi,
  DydxApiMarket,
  DydxApiAccount,
} from "../../src/clients/helpers/dydx-helpers";
import { ClientNames, NetworkNames } from "../../src/lib/types";
import { mongodb_test_uri } from "../mockData";
import { validateMany } from "../../src/helpers/db-helpers";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

const { markets } = require("../mockData/dydx/markets.json");
const mockMarkets: DydxApiMarket[] = Object.values(markets);
const { accounts } = require("../mockData/dydx/accounts.json");
const mockAccounts: DydxApiAccount[] = accounts;

describe("Client: dydx", () => {
  let dydx: Dydx;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.DYDX,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    dydx = new Dydx(conf);
    await dydx.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("Parse api data", () => {
    it("should parse RESERVES (markets) from api", () => {
      let reserves = parseMarketsFromApi(
        ClientNames.DYDX,
        "ethereum",
        mockMarkets
      );
      let res = validateMany(reserves, Reserve.schema);
      expect(res.validCount).to.equal(reserves.length);
    });

    it("should parse ACCOUNTS from api", () => {
      let accounts = parseAccountsFromApi(
        ClientNames.DYDX,
        "ethereum",
        mockAccounts
      );
      let res = validateMany(accounts, Account.schema);
      expect(res.validCount).to.equal(accounts.length);
    });
  });

  describe("Fetch api data", () => {
    it("should fetch RESERVES (markets) from api", () => {
      return expect(dydx.getNewReserves()).to.eventually.be.not.empty;
    });

    // it("should fetch ACCOUNTS from api", () => {
    //   return expect(dydx.getNewAccounts()).to.eventually.not.be.empty;
    // });
  });

  describe("Poll functions", () => {
    // TODO - implement
  });
});

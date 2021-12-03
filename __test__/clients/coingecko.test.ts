import mongoose from "mongoose";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import Logger from "../../src/lib/logger";
import { ClientNames, NetworkNames } from "../../src/lib/types";
import { Config, IConfig, Token, TokenPrice } from "../../src/models";
import Coingecko from "../../src/clients/coingecko";
import {
  CoingeckoCoinMarketData,
  CoingeckoCoinPlatformData,
  parseCoinMarketDataFromApi,
  parseCoinsAndPlatformsFromApi,
} from "../../src/clients/helpers/coingecko-helpers";
import { mongodb_test_uri } from "../mockData";
import { validateMany } from "../../src/helpers/db-helpers";

// Use chai-as-promised plugin for async throws
chai.use(chaiAsPromised);

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

const mockCoinsAndPlatforms: CoingeckoCoinPlatformData[] = require("../mockData/coingecko/coinsAndPlatforms.json");
const mockCoinMarketData: CoingeckoCoinMarketData[] = require("../mockData/coingecko/coinMarketData.json");

describe("Client: coingecko", () => {
  let coingecko: Coingecko;
  let conf: IConfig | null;

  before(async () => {
    await mongoose.connect(mongodb_test_uri);
    conf = await Config.findByClientNetwork(
      ClientNames.COINGECKO,
      NetworkNames.MAINNET
    );
    if (!conf) {
      throw Error("conf not found for client/network supplied.");
    }
    coingecko = new Coingecko(conf);
    await coingecko.setup();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe("Parse api data", () => {
    it("should parse coins data from api", () => {
      let tokens = parseCoinsAndPlatformsFromApi(mockCoinsAndPlatforms);
      let res = validateMany(tokens, Token.schema);
      expect(res.validCount).to.equal(mockCoinsAndPlatforms.length);
    });
    it("should parse coins market from api", () => {
      let tokenPrices = parseCoinMarketDataFromApi(
        coingecko.conf.client,
        mockCoinMarketData
      );
      let res = validateMany(tokenPrices, TokenPrice.schema);
      expect(res.validCount).to.be.lessThan(mockCoinMarketData.length);
    });
  });

  describe("Fetch api data", () => {
    it("should fetch coins and platforms list from api", () => {
      return expect(coingecko.updateTokens()).to.eventually.be.not.empty;
    });
    it("should fetch coins market data from api", () => {
      return expect(coingecko.updateTokenData()).to.eventually.be.not.empty;
    });
  });

  describe("Poll functions", () => {
    it("should updateTokens and return valid tokens", async () => {
      let clientFunctionResult = await coingecko.updateTokens();
      let tokens = clientFunctionResult.data;
      let res = validateMany(tokens, Token.schema);
      expect(res.validCount).to.equal(tokens.length);
    }).timeout(15 * 1000);

    it("should updateTokenData and return valid token prices", async () => {
      let clientFunctionResult = await coingecko.updateTokenData();
      let tokenPrices = clientFunctionResult.data;
      let res = validateMany(tokenPrices, TokenPrice.schema);
      expect(res.validCount).to.equal(tokenPrices.length);
    }).timeout(15 * 1000);
  });
});

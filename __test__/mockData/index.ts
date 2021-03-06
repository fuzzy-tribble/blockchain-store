import "../../src/lib/env";
import { clientConfigs } from "../../config.default";
import { IReserve } from "../../src/models/reserve";
import { IAccountReserve } from "../../src/models/account-reserve";
import { IAccount } from "../../src/models/account";
import { IToken } from "../../src/models/token";
import { ITokenPrice } from "../../src/models/token-price";
import { IConfig } from "../../src/models/config";
import { IEvent } from "../../src/models/event";
import {
  ClientFunctionResult,
  ClientNames,
  EventNames,
  NetworkNames,
  CollectionNames,
} from "../../src/lib/types";
import Client from "../../src/lib/client";
import { gql } from "@apollo/client/core";
import { delay } from "../../src/helpers/delay";

export const mongodb_test_uri = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@127.0.0.1:27017`;
export const mockValidUrl =
  "https://random-data-api.com/api/address/random_address";
export const mockInvalidUrl = "https://api.com/poop";

export const mockGqlQuery = gql`
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
export const mockGqlEndpoint =
  "https://api.thegraph.com/subgraphs/name/aave/protocol-v2";

export const mockEvents: Array<IEvent> = [
  // DUPLICATE EVENTS SHOULD NOT OVERWRITE
  {
    name: EventNames.IS_ARBITRAGABLE,
    source: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
  {
    name: EventNames.IS_ARBITRAGABLE,
    source: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
  // DATALESS EVENTS SHOULD BE INSERTED
  {
    name: EventNames.IS_LIQUIDATABLE_ACCOUNT,
    network: NetworkNames.KOVAN,
    source: ClientNames.AAVE,
  },
];

export const mockInvalidEvents = [
  {
    name: null, // name must be a string
    source: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
];

export const mockTokens: Array<IToken> = [
  {
    platforms: {
      ethereum: "0x1eb16ec378f0ce8f81449120629f52ba28961d47",
      xdai: "0x1eb16ec378f0ce8f81449120629f52ba28961d47",
    },
    symbol: "POOP",
    uid: "token-1",
    decimals: 8,
  },
  {
    platforms: {
      ethereum: "00000000",
    },
    symbol: "WETH",
    uid: "token-2",
    decimals: 18,
    someOtherTokenData: 90,
  },
];

export const mockTokensUpdated: Array<IToken> = [
  {
    platforms: {
      ethereum: "0",
      xdai: "0x1eb16ec378f0ce8f81449120629f52ba28961d47",
    },
    symbol: "POOP",
    uid: "token-1",
    decimals: 8,
  },
  {
    uid: "token-2",
    platforms: {
      nantucknet: "023948209348",
    },
  },
];

export const mockInvalidTokens = [
  {},
  {
    platforms: {},
    uid: undefined,
    decimals: 18,
  },
  {
    // DOES NOT CATCH UNDEFINED INSIDE MAP
    platforms: undefined,
    uid: "poop",
    decimals: 18,
  },
];

export const nowDate: Date = new Date();
export const beforeDate: Date = new Date();
beforeDate.setDate(-1);

export const mockTokenPrices: Array<ITokenPrice> = [
  {
    token: {
      uid: mockTokens[0].uid,
    },
    priceInEth: "398",
    source: ClientNames.COINGECKO,
    lastUpdated: beforeDate,
  },
  {
    token: { uid: mockTokens[1].uid },
    priceInEth: "45",
    source: ClientNames.COINGECKO,
    lastUpdated: beforeDate,
  },
  {
    token: { uid: mockTokens[1].uid },
    priceInEth: "46",
    source: ClientNames.CHAINLINK,
    lastUpdated: beforeDate,
  },
];

export const mockTokenPricesUpdated: Array<ITokenPrice> = [
  {
    token: { uid: mockTokens[0].uid },
    priceInEth: "999",
    source: ClientNames.COINGECKO,
    lastUpdated: nowDate,
  },
  {
    token: { uid: mockTokens[1].uid },
    priceInEth: "111",
    source: ClientNames.COINGECKO,
    lastUpdated: nowDate,
  },
];

export const mockInvalidTokenPrices = [
  {
    // source is undefined
    token: { uid: mockTokens[0].uid },
    priceInEth: "398",
    lastUpdated: Date.now().toString(),
  },
];

export const mockAccounts: Array<IAccount> = [
  {
    address: "8888",
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
  },
  {
    address: "9999",
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
  },
];

export const mockAccountsUpdated: Array<IAccount> = [
  {
    // add another param
    address: "8888",
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    somethingElse: 398,
  },
  {
    // change address
    address: "somethingElse",
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
  },
];

export const mockInvalidAccounts = [
  {},
  { client: null, address: null, network: null },
  { client: undefined, address: undefined, network: undefined },
  {
    address: 621327, // must be have a network
    client: ClientNames.SUSHISWAP,
  },
  {
    address: "9999",
    client: undefined, // must have client
    network: "mainnet",
  },
  {
    address: "9999", // must have client
    network: NetworkNames.MAINNET,
  },
];

export const mockReserves: Array<IReserve> = [
  // FROM AAVE
  {
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
    uid: "0x0000000000085d4780b73119b644ae5ecd22b3760xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    tokens: [mockTokens[0]],
  },
  // FROM SUSHISWAP
  {
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    uid: "0x055cedfe14bce33f985c41d9a1934b7654611aac",
    tokens: [mockTokens[0], mockTokens[1]],
  },
  {
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    uid: "0x05767d9ef41dc40689678ffca0608878fb3de906",
    tokens: mockTokens,
  },
];

export const mockReservesUpdated: Array<IReserve> = [
  {
    // update tokens
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
    uid: "0x0000000000085d4780b73119b644ae5ecd22b3760xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    tokens: [mockTokens[0], mockTokens[1]],
  },
  {
    // add additional data
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    uid: "0x055cedfe14bce33f985c41d9a1934b7654611aac",
    additionalData: 9023948290,
    tokens: mockTokens,
  },
  {
    // changed network name
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.POLYGON,
    uid: "0x05767d9ef41dc40689678ffca0608878fb3de906",
    tokens: [mockTokens[1]],
  },
];

export const mockInvalidReserves = [
  {
    // invalid tokens
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
    address:
      "0x0000000000085d4780b73119b644ae5ecd22b3760xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    tokens: [{ network: mockTokens[0].network }],
  },
  {
    // network is undefined
    client: ClientNames.SUSHISWAP,
    address: "0x055cedfe14bce33f985c41d9a1934b7654611aac",
    tokens: [mockTokens[0]],
  },
];

export const mockAccountReserves: Array<IAccountReserve> = [
  {
    uid: mockAccounts[0].address.concat(mockReserves[0].uid),
    account: {
      address: mockAccounts[0].address,
      client: mockAccounts[0].client,
      network: mockAccounts[0].network,
    },
    reserve: {
      uid: mockReserves[0].uid,
      client: mockReserves[0].client,
      network: mockReserves[0].network,
    },
  },
  {
    uid: "tippytappy",
    account: {
      address: mockAccounts[1].address,
      client: mockAccounts[1].client,
      network: mockAccounts[1].network,
    },
    reserve: {
      uid: mockReserves[1].uid,
      client: mockReserves[1].client,
      network: mockReserves[1].network,
    },
  },
];

export const mockAccountReservesUpdated: Array<IAccountReserve> = [
  {
    uid: mockAccounts[0].address.concat(mockReserves[0].uid),
    account: {
      address: mockAccounts[0].address,
      client: mockAccounts[0].client,
      network: mockAccounts[0].network,
    },
    reserve: {
      uid: mockReserves[0].uid,
      client: mockReserves[0].client,
      network: mockReserves[0].network,
    },
    someUpdate: 2849309,
  },
  {
    uid: "tippytappy",
    account: {
      address: mockAccounts[1].address,
      client: mockAccounts[1].client,
      network: mockAccounts[1].network,
    },
    reserve: {
      uid: mockReserves[1].uid,
      client: mockReserves[1].client,
      network: mockReserves[1].network,
    },
    someDataUpdate: "askjdalkdj",
  },
];

export const mockInvalidAccountReserves = [
  {
    //empty not allowed
  },
  {
    // null not allowed
    uid: null,
    account: null,
    reserve: null,
  },
  {
    // don't exist in db
    uid: 283409,
    account: 123,
    reserve: 556,
  },
];

export const mockClientConfigs = clientConfigs;

const conf: IConfig = {
  client: ClientNames.AAVE,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    { fname: "mockPollFunction1", frequency: 1 * 1000 },
    { fname: "mockPollFunction2", frequency: 2 * 1000 },
  ],
  listenerNames: [],
  dataSources: {},
  subscriptions: [],
  cListeners: [],
};

export class MockClient extends Client {
  constructor() {
    super(conf);
  }
  // client function result and db result success
  mockPollFunction1 = async (): Promise<ClientFunctionResult> => {
    await delay(1 * 1000);
    return {
      success: true,
      client: this.conf.client,
      network: this.conf.network,
      data: [
        {
          collectionName: CollectionNames.TEST,
          data: ["test data"],
        },
      ],
    };
  };
  // Client function fail and db fail
  mockPollFunction2 = async (): Promise<ClientFunctionResult> => {
    await delay(2 * 1000);
    return {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
  };

  // // Client function success and db fail
  // mockPollFunction3 = async (): Promise<ClientFunctionResult> => {
  //   await delay(1 * 1000);
  //   return {
  //     success: true,
  //     client: this.conf.client,
  //     network: this.conf.network,
  //     data: [],
  //   };
  // };
}

import {
  CollectionNames,
  IConfig,
  IEvent,
  IReserve,
  IToken,
} from "../src/models";
import { clientConfigs } from "../config.default";
import {
  ClientFunctionResult,
  ClientNames,
  EventNames,
  NetworkNames,
} from "../src/lib/types";
import Client from "../src/lib/client";

export const mongodb_test_uri = "mongodb://127.0.0.1:27017/test";

export const mockAccounts = [
  {
    address: "00000000",
    data: [{ symbol: "PoOp" }],
  },
  {
    address: "00000000",
    data: [{ symbol: "SoAp", health: "squal" }],
  },
  {
    address: "11111111",
    data: [
      {
        id: "0x0d8775f648430679a709e98d2b0cb6250d2887ef0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
        name: "Basic Attention Token",
      },
    ],
  },
  {
    address: "22222222",
    data: [
      {
        symbol: "poop",
        health: 90,
      },
    ],
  },
];

export const mockUpdatedAccountData = [
  {
    address: "00000000",
    data: [{ symbol: "DANCE" }],
  },
  {
    address: "11111111",
    data: [
      {
        id: "1234",
        name: "SCARY Attention Token",
        price: {
          __typename: "PriceOracleAsset",
          id: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
        },
        liquidityRate: "559992009745606521109022",
        variableBorrowRate: "9504091326245523459366916",
        stableBorrowRate: "43577273323207890656238450",
      },
    ],
  },
  {
    address: "22222222",
    data: [
      {
        symbol: "poop",
        health: 254,
      },
    ],
  },
];

export const mockEvents: Array<IEvent> = [
  {
    name: EventNames.ARBITRAGE,
    network: "",
    client: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
  {
    name: EventNames.ARBITRAGE,
    network: "",
    client: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
  {
    name: EventNames.LIQUIDATABLE_ACCOUNT,
    network: NetworkNames.KOVAN,
    client: ClientNames.AAVE,
    data: { somestuff: "slemkla" },
  },
];

export const mockTokens: Array<IToken> = [
  {
    address: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
    network: NetworkNames.MAINNET,
    symbol: "CVX",
    name: "Convex Token",
    decimals: 18,
  },
  {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    network: NetworkNames.POLYGON,
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
  },
];

export const mockReserves: Array<IReserve> = [
  // FROM AAVE
  {
    client: ClientNames.AAVE,
    network: NetworkNames.MAINNET,
    address:
      "0x0000000000085d4780b73119b644ae5ecd22b3760xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    tokens: [
      {
        address:
          "0x0000000000085d4780b73119b644ae5ecd22b3760xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
        symbol: "TUSD",
        network: NetworkNames.MAINNET,
        name: "TrueUSD",
        decimals: 18,
      },
    ],
  },
  // FROM SUSHISWAP
  {
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    address: "0x055cedfe14bce33f985c41d9a1934b7654611aac",
    tokens: [
      {
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        network: NetworkNames.MAINNET,
        symbol: "DAI",
        name: "Dai Stablecoin",
        decimals: 18,
      },
      {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        network: NetworkNames.MAINNET,
        symbol: "USDT",
        name: "Tether USD",
        decimals: 6,
      },
    ],
  },
  {
    client: ClientNames.SUSHISWAP,
    network: NetworkNames.MAINNET,
    address: "0x05767d9ef41dc40689678ffca0608878fb3de906",
    tokens: [
      {
        address: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
        network: NetworkNames.MAINNET,
        symbol: "CVX",
        name: "Convex Token",
        decimals: 18,
      },
      {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        network: NetworkNames.MAINNET,
        symbol: "WETH",
        name: "Wrapped Ether",
        decimals: 18,
      },
    ],
  },
];

export const mockClientConfigs = clientConfigs;

export const mockUpdatedClientConfigs = [];

/// SUSHISWAP ///
// "https://api2.sushipro.io/?action=all_pairs";
export const mockSushiswapPairData = [
  {
    action: "all_pairs",
    chain: "Ethereum",
    number_of_results: 2143,
  },
  [
    {
      Pair_ID: "0x00040a7ebfc9f6fbce4d23bd66b79a603ba1c323",
      Token_1_contract: "0x0000000000085d4780b73119b644ae5ecd22b376",
      Token_1_symbol: "TUSD",
      Token_1_name: "TrueUSD",
      Token_1_decimals: 18,
      Token_1_price: 0.0099762588,
      Token_1_reserve: 9.9762588e-11,
      Token_1_derivedETH: 0.0002306266936470548,
      Token_2_contract: "0x71b6296174c5f07d37cafd6e9b72ab5bb3f14fac",
      Token_2_symbol: "Xi",
      Token_2_name: "Stable Yield Credit",
      Token_2_decimals: 8,
      Token_2_price: 100.23797698592182,
      Token_2_reserve: 1e-8,
      Token_2_derivedETH: 0.00008930359195344008,
    },
    {
      Pair_ID: "0x00088e1f7510370fab86a7bd10578b578c61c723",
      Token_1_contract: "0x0000000000095413afc295d19edeb1ad7b71c952",
      Token_1_symbol: "LON",
      Token_1_name: "Tokenlon",
      Token_1_decimals: 18,
      Token_1_price: 2.127235819951091,
      Token_1_reserve: 0.05681923975862338,
      Token_1_derivedETH: 0.0004893006192693382,
      Token_2_contract: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
      Token_2_symbol: "SUSHI",
      Token_2_name: "SushiToken",
      Token_2_decimals: 18,
      Token_2_price: 0.470093626019795,
      Token_2_reserve: 0.026710362445819365,
      Token_2_derivedETH: 0.0025742874802954898,
    },
    {
      Pair_ID: "0x0018fb451a46ae397b8569936bc5bb5ff03cfd18",
      Token_1_contract: "0xa91ac63d040deb1b7a5e4d4134ad23eb0ba07e14",
      Token_1_symbol: "BEL",
      Token_1_name: "Bella",
      Token_1_decimals: 18,
      Token_1_price: 1971.5592785586427,
      Token_1_reserve: 6938.466401295773,
      Token_1_derivedETH: 0.0005072127482421299,
      Token_2_contract: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      Token_2_symbol: "WETH",
      Token_2_name: "Wrapped Ether",
      Token_2_decimals: 18,
      Token_2_price: 0.0005072127482421299,
      Token_2_reserve: 3.5192786119869095,
      Token_2_derivedETH: 1,
    },
  ],
];

// "https://api2.sushipro.io/?action=all_tokens";
export const mockSushiswapTokenData = [
  {
    action: "all_tokens",
    chain: "Ethereum",
    number_of_results: 1721,
  },
  [
    {
      Contract: "0x0000000000004946c0e9f43f4dee607b0ef1fa1c",
      Symbol: "CHI",
      Name: "Chi Gastoken by 1inch",
      Decimals: 0,
    },
    {
      Contract: "0x0000000000085d4780b73119b644ae5ecd22b376",
      Symbol: "TUSD",
      Name: "TrueUSD",
      Decimals: 18,
    },
    {
      Contract: "0x0000000000095413afc295d19edeb1ad7b71c952",
      Symbol: "LON",
      Name: "Tokenlon",
      Decimals: 18,
    },
    {
      Contract: "0x0000a1c00009a619684135b824ba02f7fbf3a572",
      Symbol: "ALCH",
      Name: "Alchemy",
      Decimals: 18,
    },
  ],
];

const conf: IConfig = {
  client: ClientNames.AAVE,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    { name: "mockPollFunction1", frequency: 1 * 1000 },
    { name: "mockPollFunction2", frequency: 2 * 1000 },
  ],
  listenerNames: [],
  dataSources: {
    blockchain: {
      rpcUrl: "",
    },
    apis: {
      endpoint: "",
    },
    graphql: {
      endpoint: "",
      queries: {},
    },
  },
};
export class MockClient extends Client {
  constructor() {
    super(conf);
  }
  mockPollFunction1 = async (): Promise<ClientFunctionResult> => {
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TEST,
      data: "mockPollFunction1 result data",
    };
  };
  mockPollFunction2 = async () => {
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.TEST,
      data: "mockPollFunction2 result data",
    };
  };
}

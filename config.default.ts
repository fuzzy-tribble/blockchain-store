import "./src/lib/env";
import { utils } from "ethers";
import { IConfig } from "./src/models/config";
import { gql } from "@apollo/client/core";
import { ClientNames, EventNames, NetworkNames } from "./src/lib/types";

const dydxConfigs: IConfig = {
  client: ClientNames.DYDX,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    {
      fname: "getNewReserves",
      frequency: 24 * 60 * 60 * 1000, // every 24 hours
    },
    // {
    //   name: "checkForLiquidatableAccounts",
    //   frequency: 24 * 60 * 60 * 1000, // every 10 minutes
    // },
  ],
  cListeners: [],
  dataSources: {
    apis: {
      baseUrl: "https://api.dydx.exchange",
      allMarkets: "https://api.dydx.exchange/v3/markets",
    },
  },
  subscriptions: [],
};

const coingeckoConfigs: IConfig = {
  client: ClientNames.COINGECKO,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    {
      fname: "updateTokens",
      frequency: 24 * 60 * 60 * 1000, // every 24 hours
    },
    {
      fname: "updateTokenData",
      frequency: 1 * 60 * 60 * 1000, // every 1 hours
    },
  ],
  cListeners: [],
  dataSources: {
    apis: {
      // Free API* has a rate limit of 50 calls/minute
      baseUrl: "https://api.coingecko.com/api/v3/",
      allCoinsList:
        "https://api.coingecko.com/api/v3/coins/list?include_platform=true",
      coinsMarketData:
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eth&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d",
    },
  },
  subscriptions: [],
};

const chainlinkMainnetConfigs: IConfig = {
  client: ClientNames.CHAINLINK,
  network: NetworkNames.MAINNET,
  pollFunctions: [],
  subscriptions: [
    {
      subscribe: { fname: "subscribeToPriceChangeEvents" },
      unsubscribe: { fname: "unsubscribeFromPriceChangeEvents" },
    },
  ],
  cListeners: [],
  dataSources: {
    blockchain: {
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      maxBlockQueryChunkSize: 100,
      contractAddress: "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf",
      contractAbi: [
        {
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "description",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint80", name: "_roundId", type: "uint80" },
          ],
          name: "getRoundData",
          outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "latestRoundData",
          outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "version",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      priceChangeListener: "",
    },
  },
};

const aaveMainnetConfigs: IConfig = {
  client: ClientNames.AAVE,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    {
      fname: "updateReservesList",
      frequency: 24 * 60 * 60 * 1000, // every 24 hours
    },
    {
      fname: "checkLiquidatableAccountsApi",
      frequency: 1 * 60 * 60 * 1000, // every 1 hours
    },
  ],
  subscriptions: [],
  cListeners: [
    [EventNames.IS_TOKEN_PRICE_CHANGE, { fname: "handleTokenPriceChange" }],
  ],
  dataSources: {
    blockchain: {
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      maxBlockQueryChunkSize: 100,
      // Proxy contract address and abi
      contractAddress: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
      contractAbi: [
        {
          inputs: [{ internalType: "address", name: "admin", type: "address" }],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        { stateMutability: "payable", type: "fallback" },
        {
          inputs: [],
          name: "admin",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "implementation",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "_logic", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
          ],
          name: "upgradeTo",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            { internalType: "bytes", name: "data", type: "bytes" },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      // Lending pool contract abi
      ifaceAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "onBehalfOf",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "borrowRateMode",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "borrowRate",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint16",
              name: "referral",
              type: "uint16",
            },
          ],
          name: "Borrow",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "onBehalfOf",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint16",
              name: "referral",
              type: "uint16",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "target",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "initiator",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "asset",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "premium",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "referralCode",
              type: "uint16",
            },
          ],
          name: "FlashLoan",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "collateralAsset",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "debtAsset",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "debtToCover",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "liquidatedCollateralAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "liquidator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "receiveAToken",
              type: "bool",
            },
          ],
          name: "LiquidationCall",
          type: "event",
        },
        { anonymous: false, inputs: [], name: "Paused", type: "event" },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "RebalanceStableBorrowRate",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "repayer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Repay",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "liquidityRate",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "stableBorrowRate",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "variableBorrowRate",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "liquidityIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "variableBorrowIndex",
              type: "uint256",
            },
          ],
          name: "ReserveDataUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "ReserveUsedAsCollateralDisabled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "ReserveUsedAsCollateralEnabled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "rateMode",
              type: "uint256",
            },
          ],
          name: "Swap",
          type: "event",
        },
        { anonymous: false, inputs: [], name: "Unpaused", type: "event" },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "reserve",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Withdraw",
          type: "event",
        },
        {
          inputs: [],
          name: "FLASHLOAN_PREMIUM_TOTAL",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "LENDINGPOOL_REVISION",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "MAX_NUMBER_RESERVES",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "interestRateMode",
              type: "uint256",
            },
            { internalType: "uint16", name: "referralCode", type: "uint16" },
            { internalType: "address", name: "onBehalfOf", type: "address" },
          ],
          name: "borrow",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "address", name: "onBehalfOf", type: "address" },
            { internalType: "uint16", name: "referralCode", type: "uint16" },
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            {
              internalType: "uint256",
              name: "balanceFromBefore",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "balanceToBefore",
              type: "uint256",
            },
          ],
          name: "finalizeTransfer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiverAddress",
              type: "address",
            },
            { internalType: "address[]", name: "assets", type: "address[]" },
            { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
            { internalType: "uint256[]", name: "modes", type: "uint256[]" },
            { internalType: "address", name: "onBehalfOf", type: "address" },
            { internalType: "bytes", name: "params", type: "bytes" },
            { internalType: "uint16", name: "referralCode", type: "uint16" },
          ],
          name: "flashLoan",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getAddressesProvider",
          outputs: [
            {
              internalType: "contract ILendingPoolAddressesProvider",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "asset", type: "address" }],
          name: "getConfiguration",
          outputs: [
            {
              components: [
                { internalType: "uint256", name: "data", type: "uint256" },
              ],
              internalType: "struct DataTypes.ReserveConfigurationMap",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "asset", type: "address" }],
          name: "getReserveData",
          outputs: [
            {
              components: [
                {
                  components: [
                    { internalType: "uint256", name: "data", type: "uint256" },
                  ],
                  internalType: "struct DataTypes.ReserveConfigurationMap",
                  name: "configuration",
                  type: "tuple",
                },
                {
                  internalType: "uint128",
                  name: "liquidityIndex",
                  type: "uint128",
                },
                {
                  internalType: "uint128",
                  name: "variableBorrowIndex",
                  type: "uint128",
                },
                {
                  internalType: "uint128",
                  name: "currentLiquidityRate",
                  type: "uint128",
                },
                {
                  internalType: "uint128",
                  name: "currentVariableBorrowRate",
                  type: "uint128",
                },
                {
                  internalType: "uint128",
                  name: "currentStableBorrowRate",
                  type: "uint128",
                },
                {
                  internalType: "uint40",
                  name: "lastUpdateTimestamp",
                  type: "uint40",
                },
                {
                  internalType: "address",
                  name: "aTokenAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "stableDebtTokenAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "variableDebtTokenAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "interestRateStrategyAddress",
                  type: "address",
                },
                { internalType: "uint8", name: "id", type: "uint8" },
              ],
              internalType: "struct DataTypes.ReserveData",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "asset", type: "address" }],
          name: "getReserveNormalizedIncome",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "asset", type: "address" }],
          name: "getReserveNormalizedVariableDebt",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getReservesList",
          outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "user", type: "address" }],
          name: "getUserAccountData",
          outputs: [
            {
              internalType: "uint256",
              name: "totalCollateralETH",
              type: "uint256",
            },
            { internalType: "uint256", name: "totalDebtETH", type: "uint256" },
            {
              internalType: "uint256",
              name: "availableBorrowsETH",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "currentLiquidationThreshold",
              type: "uint256",
            },
            { internalType: "uint256", name: "ltv", type: "uint256" },
            { internalType: "uint256", name: "healthFactor", type: "uint256" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "user", type: "address" }],
          name: "getUserConfiguration",
          outputs: [
            {
              components: [
                { internalType: "uint256", name: "data", type: "uint256" },
              ],
              internalType: "struct DataTypes.UserConfigurationMap",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "address", name: "aTokenAddress", type: "address" },
            {
              internalType: "address",
              name: "stableDebtAddress",
              type: "address",
            },
            {
              internalType: "address",
              name: "variableDebtAddress",
              type: "address",
            },
            {
              internalType: "address",
              name: "interestRateStrategyAddress",
              type: "address",
            },
          ],
          name: "initReserve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract ILendingPoolAddressesProvider",
              name: "provider",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "collateralAsset",
              type: "address",
            },
            { internalType: "address", name: "debtAsset", type: "address" },
            { internalType: "address", name: "user", type: "address" },
            { internalType: "uint256", name: "debtToCover", type: "uint256" },
            { internalType: "bool", name: "receiveAToken", type: "bool" },
          ],
          name: "liquidationCall",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "address", name: "user", type: "address" },
          ],
          name: "rebalanceStableBorrowRate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "rateMode", type: "uint256" },
            { internalType: "address", name: "onBehalfOf", type: "address" },
          ],
          name: "repay",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "configuration", type: "uint256" },
          ],
          name: "setConfiguration",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [{ internalType: "bool", name: "val", type: "bool" }],
          name: "setPause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            {
              internalType: "address",
              name: "rateStrategyAddress",
              type: "address",
            },
          ],
          name: "setReserveInterestRateStrategyAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "bool", name: "useAsCollateral", type: "bool" },
          ],
          name: "setUserUseReserveAsCollateral",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "rateMode", type: "uint256" },
          ],
          name: "swapBorrowRateMode",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
          ],
          name: "withdraw",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      newUsersEventFilter: {
        address: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
        topics: [
          [
            utils.id(
              "Borrow(address,address,address,uint256,uint256,uint256,uint16)"
            ),
          ],
        ],
      },
    },
    apis: {
      baseUrl: "https://aave-api-v2.aave.com/",
      liquidatableAccountReserves:
        "https://protocol-api.aave.com/liquidations?get=proto",
    },
    graphql: {
      endpoint: "https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
      gatewayEndpoint: "",
      poolReservesSubscription:
        "src/v2/graphql/subscriptions/reserves-update-subscription.graphql",
      queries: {
        // a list of all the reserves that are able to be used as collateral, along with each reserve's interest rate details
        GET_RESERVES_LIST: gql`
          query GetReserveList {
            reserves(where: { usageAsCollateralEnabled: true }) {
              id
              name
              price {
                id
                priceInEth
                lastUpdateTimestamp
                type
                priceSource
              }
              liquidityRate
              variableBorrowRate
              stableBorrowRate
              symbol
              decimals
            }
          }
        `,
        GET_USER_POSITIONS: gql`
          query GetUserPositions {
            userReserves(where: { user: "USER_ADDRESS" }) {
              id
              reserve {
                id
                symbol
              }
              user {
                id
              }
            }
          }
        `,
      },
    },
  },
};

const sushiswapMainnet: IConfig = {
  client: ClientNames.SUSHISWAP,
  network: NetworkNames.MAINNET,
  pollFunctions: [
    {
      fname: "getReserves",
      frequency: 24 * 60 * 60 * 1000, // every 24 hours
    },
    {
      fname: "updateReserves",
      frequency: 2 * (60 * 1000), // every 2 minutes
    },
  ],
  listenerNames: [EventNames.IS_TOKEN_PRICE_CHANGE],
  dataSources: {
    apis: {
      baseUrl: "https://api2.sushipro.io/",
      GET_ALL_PAIRS: {
        method: "get",
        url: "https://api2.sushipro.io/?action=all_pairs",
      },
    },
  },
  subscriptions: [],
  cListeners: [],
};

const compound: IConfig = {
  client: ClientNames.COMPOUND,
  network: NetworkNames.MAINNET,
  pollFunctions: [],
  listenerNames: [],
  dataSources: {
    apis: {
      baseUrl: "https://api.compound.finance/api",
    },
  },
  subscriptions: [],
  cListeners: [],
};

const uniswapMainnet: IConfig = {
  client: ClientNames.UNISWAP,
  network: NetworkNames.MAINNET,
  pollFunctions: [],
  listenerNames: [],
  dataSources: {
    apis: {
      baseUrl: "",
      allLiquidatableAccounts:
        "https://protocol-api.aave.com/liquidations?get=uniswap",
    },
    graphql: {
      endpoint: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      queries: {},
    },
  },
  subscriptions: [],
  cListeners: [],
};

export const clientConfigs = [
  dydxConfigs,
  coingeckoConfigs,
  aaveMainnetConfigs,
  // sushiswapMainnet,
];

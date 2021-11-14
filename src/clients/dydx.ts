import { AxiosRequestConfig } from "axios";
import { apiRequest } from "../helpers/api-helpers";
import {
  ApiAccount as DydxAccount,
  ApiMarket as DydxMarket,
} from "@dydxprotocol/solo";

// Mainnet
const apiBaseUrl = "https://api.dydx.exchange";

// // Ropsten
// const apiBaseUrl = "https://api.stage.dydx.exchange";

const accountsResultSample = {
  accounts: [
    {
      owner: "0x6f2aabdf2dab927e06f0b3480fe0d414a9416964",
      number: "0",
      uuid: "74875e03-a2f4-4f42-a813-6650666e7154",
      balances: {
        "0": {
          marketId: 0,
          par: "-28286128576625",
          wei: "-28848538302495",
          expiresAt: null,
          expiryAddress: null,
        },
        "1": {
          marketId: 1,
          par: "0",
          wei: "0",
          pendingWei: "0",
          expiresAt: null,
          orderNumber: null,
          expiryAddress: null,
          expiryOrderNumber: null,
          isPendingBlock: false,
        },
        "2": {
          marketId: 2,
          par: "76453",
          wei: "86029",
          expiresAt: null,
          expiryAddress: null,
        },
        "3": {
          marketId: 3,
          par: "54115103244350073",
          wei: "61019861170450336",
          expiresAt: null,
          expiryAddress: null,
        },
      },
    },
    {
      owner: "0x830610327a7b6748675967a8e1af1094518db568",
      number: "0",
      uuid: "976f320b-53d6-4a37-9cbe-8c3041608b0c",
      balances: {
        "0": {
          marketId: 0,
          par: "-19771909582912591",
          wei: "-20165032106496135",
          expiresAt: null,
          expiryAddress: null,
        },
        "1": {
          marketId: 1,
          par: "0",
          wei: "0",
          pendingWei: "0",
          expiresAt: null,
          orderNumber: null,
          expiryAddress: null,
          expiryOrderNumber: null,
          isPendingBlock: false,
        },
        "2": {
          marketId: 2,
          par: "91453735",
          wei: "102909472",
          expiresAt: null,
          expiryAddress: null,
        },
        "3": {
          marketId: 3,
          par: "0",
          wei: "0",
          pendingWei: "0",
          expiresAt: null,
          orderNumber: null,
          expiryAddress: null,
          expiryOrderNumber: null,
          isPendingBlock: false,
        },
      },
    },
  ],
};

const marketsResultSample = {
  markets: {
    "BTC-USD": {
      market: "BTC-USD",
      status: "ONLINE",
      baseAsset: "BTC",
      quoteAsset: "USD",
      stepSize: "0.0001",
      tickSize: "1",
      indexPrice: "63268.5700",
      oraclePrice: "63226.5300",
      priceChange24H: "1347.380000",
      nextFundingRate: "-0.0000128700",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.001",
      type: "PERPETUAL",
      initialMarginFraction: "0.04",
      maintenanceMarginFraction: "0.03",
      volume24H: "1055082330.693300",
      trades24H: "91849",
      openInterest: "6315.1532",
      incrementalInitialMarginFraction: "0.01",
      incrementalPositionSize: "1.5",
      maxPositionSize: "170",
      baselinePositionSize: "9",
      assetResolution: "10000000000",
    },
    "SUSHI-USD": {
      market: "SUSHI-USD",
      status: "ONLINE",
      baseAsset: "SUSHI",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.001",
      indexPrice: "12.4523",
      oraclePrice: "12.4413",
      priceChange24H: "0.302298",
      nextFundingRate: "-0.0001245657",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "52340841.739500",
      trades24H: "12926",
      openInterest: "2326645.3",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "10000",
      maxPositionSize: "491000",
      baselinePositionSize: "49200",
      assetResolution: "10000000",
    },
    "AVAX-USD": {
      market: "AVAX-USD",
      status: "ONLINE",
      baseAsset: "AVAX",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "66.0020",
      oraclePrice: "65.9060",
      priceChange24H: "2.601904",
      nextFundingRate: "0.0000516816",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "20235532.668000",
      trades24H: "11972",
      openInterest: "312941.8",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "1800",
      maxPositionSize: "91000",
      baselinePositionSize: "9000",
      assetResolution: "10000000",
    },
    "1INCH-USD": {
      market: "1INCH-USD",
      status: "ONLINE",
      baseAsset: "1INCH",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "4.6054",
      oraclePrice: "4.5890",
      priceChange24H: "0.167137",
      nextFundingRate: "0.0000084415",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "7639358.921000",
      trades24H: "1953",
      openInterest: "3341037",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "35000",
      maxPositionSize: "1700000",
      baselinePositionSize: "170000",
      assetResolution: "10000000",
    },
    "ETH-USD": {
      market: "ETH-USD",
      status: "ONLINE",
      baseAsset: "ETH",
      quoteAsset: "USD",
      stepSize: "0.001",
      tickSize: "0.1",
      indexPrice: "4471.6700",
      oraclePrice: "4465.5250",
      priceChange24H: "113.590000",
      nextFundingRate: "0.0000010133",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.01",
      type: "PERPETUAL",
      initialMarginFraction: "0.04",
      maintenanceMarginFraction: "0.03",
      volume24H: "1065074889.692800",
      trades24H: "106509",
      openInterest: "111511.953",
      incrementalInitialMarginFraction: "0.01",
      incrementalPositionSize: "28",
      maxPositionSize: "2820",
      baselinePositionSize: "140",
      assetResolution: "1000000000",
    },
    "XMR-USD": {
      market: "XMR-USD",
      status: "ONLINE",
      baseAsset: "XMR",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.1",
      indexPrice: "272.3885",
      oraclePrice: "272.0000",
      priceChange24H: "-4.050551",
      nextFundingRate: "0.0000125000",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "1273816.839000",
      trades24H: "1333",
      openInterest: "14602.41",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "200",
      maxPositionSize: "6000",
      baselinePositionSize: "400",
      assetResolution: "100000000",
    },
    "COMP-USD": {
      market: "COMP-USD",
      status: "ONLINE",
      baseAsset: "COMP",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.1",
      indexPrice: "364.3561",
      oraclePrice: "364.1799",
      priceChange24H: "8.438590",
      nextFundingRate: "0.0000202862",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "11380444.124000",
      trades24H: "8296",
      openInterest: "55528.50",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "330",
      maxPositionSize: "16600",
      baselinePositionSize: "1700",
      assetResolution: "100000000",
    },
    "ALGO-USD": {
      market: "ALGO-USD",
      status: "ONLINE",
      baseAsset: "ALGO",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "1.8897",
      oraclePrice: "1.8861",
      priceChange24H: "0.064758",
      nextFundingRate: "0.0000254209",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "3922700.162000",
      trades24H: "2325",
      openInterest: "2014781",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "55000",
      maxPositionSize: "2700000",
      baselinePositionSize: "275000",
      assetResolution: "1000000",
    },
    "BCH-USD": {
      market: "BCH-USD",
      status: "ONLINE",
      baseAsset: "BCH",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.1",
      indexPrice: "595.5750",
      oraclePrice: "595.7500",
      priceChange24H: "6.542000",
      nextFundingRate: "0.0000196786",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "9070980.959000",
      trades24H: "1484",
      openInterest: "26968.26",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "170",
      maxPositionSize: "8300",
      baselinePositionSize: "840",
      assetResolution: "100000000",
    },
    "CRV-USD": {
      market: "CRV-USD",
      status: "ONLINE",
      baseAsset: "CRV",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "4.3407",
      oraclePrice: "4.3430",
      priceChange24H: "0.016667",
      nextFundingRate: "0.0000195032",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "19523430.235000",
      trades24H: "13308",
      openInterest: "5802771",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "37000",
      maxPositionSize: "1900000",
      baselinePositionSize: "190000",
      assetResolution: "1000000",
    },
    "UNI-USD": {
      market: "UNI-USD",
      status: "ONLINE",
      baseAsset: "UNI",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.001",
      indexPrice: "25.6598",
      oraclePrice: "25.6323",
      priceChange24H: "0.159838",
      nextFundingRate: "-0.0000887889",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "31881308.827200",
      trades24H: "8242",
      openInterest: "1340933.9",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "4000",
      maxPositionSize: "210000",
      baselinePositionSize: "20800",
      assetResolution: "10000000",
    },
    "MKR-USD": {
      market: "MKR-USD",
      status: "ONLINE",
      baseAsset: "MKR",
      quoteAsset: "USD",
      stepSize: "0.001",
      tickSize: "1",
      indexPrice: "2588.9438",
      oraclePrice: "2589.5000",
      priceChange24H: "76.726382",
      nextFundingRate: "0.0001079466",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.01",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "7810954.563000",
      trades24H: "1563",
      openInterest: "6732.014",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "40",
      maxPositionSize: "2000",
      baselinePositionSize: "200",
      assetResolution: "1000000000",
    },
    "LTC-USD": {
      market: "LTC-USD",
      status: "ONLINE",
      baseAsset: "LTC",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.1",
      indexPrice: "201.2346",
      oraclePrice: "201.1700",
      priceChange24H: "8.944624",
      nextFundingRate: "0.0000529696",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "3007805.652000",
      trades24H: "1369",
      openInterest: "132842.58",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "560",
      maxPositionSize: "28000",
      baselinePositionSize: "2800",
      assetResolution: "100000000",
    },
    "EOS-USD": {
      market: "EOS-USD",
      status: "ONLINE",
      baseAsset: "EOS",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "4.6953",
      oraclePrice: "4.6880",
      priceChange24H: "0.024416",
      nextFundingRate: "0.0000582421",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "4676842.252000",
      trades24H: "2182",
      openInterest: "3684486",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "22000",
      maxPositionSize: "1100000",
      baselinePositionSize: "110000",
      assetResolution: "1000000",
    },
    "DOGE-USD": {
      market: "DOGE-USD",
      status: "ONLINE",
      baseAsset: "DOGE",
      quoteAsset: "USD",
      stepSize: "10",
      tickSize: "0.0001",
      indexPrice: "0.2723",
      oraclePrice: "0.2726",
      priceChange24H: "0.000472",
      nextFundingRate: "0.0000225934",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "100",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "14073107.523000",
      trades24H: "4459",
      openInterest: "104226970",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "400000",
      maxPositionSize: "22000000",
      baselinePositionSize: "2180000",
      assetResolution: "100000",
    },
    "ATOM-USD": {
      market: "ATOM-USD",
      status: "ONLINE",
      baseAsset: "ATOM",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "37.6309",
      oraclePrice: "37.6669",
      priceChange24H: "0.400443",
      nextFundingRate: "0.0000011013",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "26208666.067000",
      trades24H: "4530",
      openInterest: "753801.7",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "3000",
      maxPositionSize: "158000",
      baselinePositionSize: "16000",
      assetResolution: "10000000",
    },
    "SOL-USD": {
      market: "SOL-USD",
      status: "ONLINE",
      baseAsset: "SOL",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.001",
      indexPrice: "205.6741",
      oraclePrice: "205.5000",
      priceChange24H: "1.224148",
      nextFundingRate: "0.0000420885",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "72683666.422400",
      trades24H: "21154",
      openInterest: "405029.9",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "700",
      maxPositionSize: "34900",
      baselinePositionSize: "3400",
      assetResolution: "10000000",
    },
    "UMA-USD": {
      market: "UMA-USD",
      status: "ONLINE",
      baseAsset: "UMA",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "12.4314",
      oraclePrice: "12.4100",
      priceChange24H: "0.971654",
      nextFundingRate: "0.0000122666",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "2512366.134000",
      trades24H: "676",
      openInterest: "213867.5",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "1000",
      maxPositionSize: "30000",
      baselinePositionSize: "2000",
      assetResolution: "10000000",
    },
    "AAVE-USD": {
      market: "AAVE-USD",
      status: "ONLINE",
      baseAsset: "AAVE",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.01",
      indexPrice: "326.1503",
      oraclePrice: "325.6200",
      priceChange24H: "11.710448",
      nextFundingRate: "0.0000192458",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "5863965.168600",
      trades24H: "4624",
      openInterest: "55549.85",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "300",
      maxPositionSize: "17000",
      baselinePositionSize: "1700",
      assetResolution: "100000000",
    },
    "ADA-USD": {
      market: "ADA-USD",
      status: "ONLINE",
      baseAsset: "ADA",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "1.9898",
      oraclePrice: "1.9817",
      priceChange24H: "0.009485",
      nextFundingRate: "0.0000551095",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "5220326.647000",
      trades24H: "2620",
      openInterest: "10329434",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "46000",
      maxPositionSize: "2300000",
      baselinePositionSize: "230000",
      assetResolution: "1000000",
    },
    "SNX-USD": {
      market: "SNX-USD",
      status: "ONLINE",
      baseAsset: "SNX",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "10.5540",
      oraclePrice: "10.5600",
      priceChange24H: "0.284000",
      nextFundingRate: "0.0000125000",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "6544673.546000",
      trades24H: "3600",
      openInterest: "1025210.4",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "11000",
      maxPositionSize: "520000",
      baselinePositionSize: "52000",
      assetResolution: "10000000",
    },
    "FIL-USD": {
      market: "FIL-USD",
      status: "ONLINE",
      baseAsset: "FIL",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "65.0540",
      oraclePrice: "64.9052",
      priceChange24H: "2.102311",
      nextFundingRate: "0.0000321704",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "11387319.138000",
      trades24H: "5720",
      openInterest: "329142.8",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "1400",
      maxPositionSize: "68000",
      baselinePositionSize: "6800",
      assetResolution: "10000000",
    },
    "ZEC-USD": {
      market: "ZEC-USD",
      status: "ONLINE",
      baseAsset: "ZEC",
      quoteAsset: "USD",
      stepSize: "0.01",
      tickSize: "0.1",
      indexPrice: "172.7145",
      oraclePrice: "172.3906",
      priceChange24H: "2.244484",
      nextFundingRate: "0.0000191968",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "8045650.084000",
      trades24H: "3877",
      openInterest: "17012.46",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "100",
      maxPositionSize: "3000",
      baselinePositionSize: "200",
      assetResolution: "100000000",
    },
    "YFI-USD": {
      market: "YFI-USD",
      status: "ONLINE",
      baseAsset: "YFI",
      quoteAsset: "USD",
      stepSize: "0.0001",
      tickSize: "1",
      indexPrice: "34495.1094",
      oraclePrice: "34497.3854",
      priceChange24H: "674.873891",
      nextFundingRate: "0.0000075664",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "0.001",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "4776044.721600",
      trades24H: "3770",
      openInterest: "419.9907",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "3",
      maxPositionSize: "140",
      baselinePositionSize: "14",
      assetResolution: "10000000000",
    },
    "LINK-USD": {
      market: "LINK-USD",
      status: "ONLINE",
      baseAsset: "LINK",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.001",
      indexPrice: "32.2307",
      oraclePrice: "32.1968",
      priceChange24H: "1.374087",
      nextFundingRate: "0.0000418710",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "15746356.037500",
      trades24H: "4772",
      openInterest: "952085.1",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "3900",
      maxPositionSize: "200000",
      baselinePositionSize: "20000",
      assetResolution: "10000000",
    },
    "DOT-USD": {
      market: "DOT-USD",
      status: "ONLINE",
      baseAsset: "DOT",
      quoteAsset: "USD",
      stepSize: "0.1",
      tickSize: "0.01",
      indexPrice: "51.4601",
      oraclePrice: "51.4700",
      priceChange24H: "4.382679",
      nextFundingRate: "0.0000803422",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "1",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "70527261.288000",
      trades24H: "17314",
      openInterest: "808304.7",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "2900",
      maxPositionSize: "150000",
      baselinePositionSize: "14600",
      assetResolution: "10000000",
    },
    "MATIC-USD": {
      market: "MATIC-USD",
      status: "ONLINE",
      baseAsset: "MATIC",
      quoteAsset: "USD",
      stepSize: "1",
      tickSize: "0.001",
      indexPrice: "1.9263",
      oraclePrice: "1.9195",
      priceChange24H: "0.022300",
      nextFundingRate: "0.0000261419",
      nextFundingAt: "2021-11-02T14:00:00.000Z",
      minOrderSize: "10",
      type: "PERPETUAL",
      initialMarginFraction: "0.10",
      maintenanceMarginFraction: "0.05",
      volume24H: "11033567.695000",
      trades24H: "3037",
      openInterest: "12868887",
      incrementalInitialMarginFraction: "0.02",
      incrementalPositionSize: "80000",
      maxPositionSize: "4000000",
      baselinePositionSize: "410000",
      assetResolution: "1000000",
    },
  },
};

const liquidatableAccountsRequest: AxiosRequestConfig = {
  url: `${apiBaseUrl}/v3/accounts`,
  method: "get",
  responseType: "json",
  params: {
    isLiquidatable: true,
  },
};

const soloMarketRequest: AxiosRequestConfig = {
  method: "GET",
  url: `${apiBaseUrl}/v3/markets`,
  responseType: "json",
};

export default class DydxSolo {
  getNewAccounts = async () => {
    return await this._getLiquidatableAccounts();
  };

  updateExistingAccounts = () => {
    return [];
  };

  getNewMarkets = async () => {
    return await this._getSoloMarkets();
  };

  updateExistingMarkets = () => {
    return [];
  };

  _getLiquidatableAccounts = async () => {
    const { markets } = await apiRequest("dydx", liquidatableAccountsRequest);
    console.log(JSON.stringify(markets));
    // TODO - convert to an array of markets
    return markets;
  };

  _getSoloMarkets = async () => {
    const { data } = await apiRequest("dydx", soloMarketRequest);
    return data;
  };
}

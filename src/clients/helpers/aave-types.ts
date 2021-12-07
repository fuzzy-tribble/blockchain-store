import { DbBn } from "../../lib/types";

// AAVE BLOCKCHAIN DATA
export type AaveUserAccountData = {
  totalCollateralETH?: DbBn;
  totalDebtETH?: DbBn;
  availableBorrowsETH?: DbBn;
  currentLiquidationThreshold?: DbBn;
  ltv?: DbBn;
  healthFactor?: DbBn;
  [otherOptions: string]: unknown;
};

export type AaveUserConfiguration = {
  "0"?: DbBn;
  [otherOptions: string]: unknown;
};

// AAVE GQL DATA
export interface AaveGqlReserve {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  liquidityRate: string;
  stableBorrowRate: string;
  variableBorrowRate: string;
  price: {
    id: string;
    priceInEth: string;
    lastUpdateTimestamp: number;
    [x: string]: any;
  };
  [x: string]: any;
}

// AAVE API DATA
export interface AaveApiReserve {
  id: string;
  underlyingAsset: string;
  symbol: string;
  decimals: number;
  __typename: string;
  name: string;
  liquidityRate: string;
  usageAsCollateralEnabled: boolean;
  reserveLiquidationBonus: string;
  lastUpdateTimestamp: number;
  aToken: AaveApiToken;
  [x: string]: any;
}

export interface AaveApiToken {
  id: string;
  __typename: string;
}

export interface AaveApiReservesData {
  principalATokenBalance: string;
  userBalanceIndex: string;
  redirectedBalance: string;
  interestRedirectionAddress: string;
  usageAsCollateralEnabledOnUser: boolean;
  borrowRate: string;
  borrowRateMode: string;
  originationFee: string;
  principalBorrows: string;
  variableBorrowIndex: string;
  lastUpdateTimestamp: number;
  __typename: string;
  principalBorrowsUSD: string;
  currentBorrowsUSD: string;
  originationFeeUSD: string;
  currentUnderlyingBalanceUSD: string;
  originationFeeETH: string;
  currentBorrows: string;
  currentBorrowsETH: string;
  principalBorrowsETH: string;
  currentUnderlyingBalance: string;
  currentUnderlyingBalanceETH: string;
  reserve: AaveApiReserve;
  [x: string]: any;
}

export interface AaveApiUser {
  id: string;
  reservesData: AaveApiReservesData[];
  totalLiquidityETH: string;
  totalLiquidityUSD: string;
  totalCollateralETH: string;
  totalCollateralUSD: string;
  totalFeesETH: string;
  totalFeesUSD: string;
  totalBorrowsETH: string;
  totalBorrowsUSD: string;
  totalBorrowsWithFeesETH: string;
  totalBorrowsWithFeesUSD: string;
  availableBorrowsETH: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  maxAmountToWithdrawInEth: string;
  healthFactor: string;
  [x: string]: any;
}
export interface AaveApiAccountReserve {
  id: string;
  user: AaveApiUser;
  reserve: AaveApiReserve;
  [x: string]: any;
}

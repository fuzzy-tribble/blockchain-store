import {
  ReserveData as AaveReserveData,
  UserSummaryData as AaveAccountData,
} from "@aave/protocol-js";

export AaveReserveData

// https://github.com/aave/aave-js/blob/58feb26dbbc81e410738a962342d8cab5376b660/src/tx-builder/types/index.ts

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
export interface AaveAccount extends IAccount {
  data?: {
    getUserAccountData: AaveUserAccountData[];
    getUserConfiguration: AaveUserConfiguration[];
  };
}

import {
  ReserveData as AaveReserveData,
  UserSummaryData as AaveAccountData,
  v2,
} from "@aave/protocol-js";
import { Interface, LogDescription } from "@ethersproject/abi";
import { Log } from "@ethersproject/abstract-provider";
import { ClientNames, NetworkNames, DbBn } from "../../lib/types";
import { IAccount, IReserve } from "../../models";

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
export interface AaveGqlReserve {
  decimals: number;
  id: string;
  liquidityRate: string;
  name: string;
  price: {
    id: string;
    priceInEth: string;
    lastUpdatedTimestamp: number;
  };
  stableBorrowRate: string;
  symbol: string;
  variableBorrowRate: string;
  // totalDeposits
  //   totalLiquidity
  //   availableLiquidity
  //   totalLiquidityAsCollateral
}

export const parseAccountsFromBorrowTransactionLogs = (
  client: ClientNames,
  network: NetworkNames,
  ifaceAbi: string,
  txLogs: Log[]
): IAccount[] => {
  // Borrow event transactions only

  let iface = new Interface(ifaceAbi as string);
  let initiatorArgIdx: number = 1;
  let accounts: IAccount[] = [];

  txLogs.map((log: Log) => {
    let parsedTx: LogDescription = iface.parseLog(log);
    accounts.push({
      client: client,
      network: network,
      address: parsedTx.args[initiatorArgIdx] as string,
    });
  });

  return accounts;
};

export const formatReservesFromGql = (
  client: ClientNames,
  network: NetworkNames,
  reservesList: AaveGqlReserve[]
) => {
  const formattedReserves = reservesList.map((reserve) => {
    let formattedReserve: IReserve = {
      client: client,
      network: network,
      address: reserve.id,
      token1: {
        address: reserve.id,
        symbol: reserve.symbol,
        name: reserve.name,
        decimals: reserve.decimals,
        priceHistory: [
          {
            price: reserve.price.priceInEth,
            timestamp: reserve.price.lastUpdatedTimestamp,
          },
        ],
      },
    };
    return formattedReserve;
  });
  return formattedReserves;
};

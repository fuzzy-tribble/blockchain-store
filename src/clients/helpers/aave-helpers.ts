import {
  ReserveData as AaveReserveData,
  UserSummaryData as AaveAccountData,
  v2,
} from "@aave/protocol-js";
import { Interface, LogDescription } from "@ethersproject/abi";
import { Log } from "@ethersproject/abstract-provider";
import { FilterQuery } from "mongoose";
import { mockTokens } from "../../../__test__/mockData";
import {
  ClientNames,
  NetworkNames,
  DbBn,
  CollectionNames,
  DatabaseUpdate,
} from "../../lib/types";
import {
  IAccount,
  IAccountReserve,
  IReserve,
  IToken,
  ITokenPrice,
  Reserve,
} from "../../models";
import { ITokenDoc } from "../../models/token";
import { AaveApiAccountReserve, AaveGqlReserve } from "./aave-types";

// https://github.com/aave/aave-js/blob/58feb26dbbc81e410738a962342d8cab5376b660/src/tx-builder/types/index.ts

export const parseReservesFromGql = (
  client: ClientNames,
  network: string,
  reserves: AaveGqlReserve[]
): DatabaseUpdate[] => {
  let parsedReserves: IReserve[] = [];
  let parsedTokenPrices: ITokenPrice[] = [];
  let parsedTokens: IToken[] = [];

  reserves.forEach((reserve) => {
    let parsedToken: IToken = {
      uid: reserve.price.id,
      name: reserve.name,
      symbol: reserve.symbol,
      decimals: reserve.decimals,
      // TODO - add this platforms...don't overwrite
      platforms: {
        ethereum: reserve.price.id,
      },
    };
    parsedTokens.push(parsedToken);

    let parsedTokenPrice: ITokenPrice = {
      address: reserve.price.id,
      lastUpdated: reserve.price.lastUpdateTimestamp.toString(),
      priceInEth: reserve.price.priceInEth,
      source: reserve.price.priceSource,
      type: reserve.price.type,
      token: { uid: parsedToken.uid },
    };
    parsedTokenPrices.push(parsedTokenPrice);

    let parsedReserve: IReserve = {
      uid: reserve.id,
      client: client,
      network: network,
      liquidityRate: reserve.liquidityRate,
      stableBorrowRate: reserve.stableBorrowRate,
      variableBorrowRate: reserve.variableBorrowRate,
      tokens: [parsedToken.uid],
    };
    parsedReserves.push(parsedReserve);
  });
  return [
    {
      collectionName: CollectionNames.TOKENS,
      data: parsedTokens,
    },
    {
      collectionName: CollectionNames.TOKEN_PRICES,
      data: parsedTokenPrices,
    },
    {
      collectionName: CollectionNames.RESERVES,
      data: parsedReserves,
    },
  ];
};

export const parseLiquidatableAccountReservesFromApi = (
  client: ClientNames,
  network: string,
  accountReserves: AaveApiAccountReserve[]
): DatabaseUpdate[] => {
  let parsedTokens: IToken[] = [];
  let parsedReserves: IReserve[] = [];
  let parsedAccountReserves: IAccountReserve[] = [];
  let parsedAccounts: IAccount[] = [];

  accountReserves.forEach((accountReserve) => {
    if (accountReserve.user.hasOwnProperty("reservesData")) {
      accountReserve.user.reservesData.forEach((reserveData) => {
        // GET TOKEN DATA
        let parsedToken: IToken = {
          uid: reserveData.reserve.aToken.id,
          __typename: reserveData.reserve.aToken.__typename,
          platforms: {
            ethereum: reserveData.reserve.aToken.id,
          },
        };
        parsedTokens.push(parsedToken);
        delete (reserveData as any).reserve.aToken;

        let parsedReserve: IReserve = {
          ...reserveData.reserve,
          uid: reserveData.reserve.id,
          client: client,
          network: network,
          tokens: [parsedToken.uid],
        };
        parsedReserves.push(parsedReserve);
        delete (reserveData as any).reserve;

        let parsedAccountReserve: IAccountReserve = {
          ...reserveData,
          reserve: parsedReserve.uid,
          account: accountReserve.user.id,
        };
        parsedAccountReserves.push(parsedAccountReserve);
      });
    }
    let userId = accountReserve.user.id;
    delete (accountReserve as any).reserve;
    delete (accountReserve as any).user.reservesData;
    delete (accountReserve as any).user.id;
    let userData = accountReserve.user;
    delete (accountReserve as any).user;
    let parsedAccount: IAccount = {
      ...userData,
      ...accountReserve,
      address: userId,
      client: client,
      network: network,
    };
    parsedAccounts.push(parsedAccount);
  });
  return [
    {
      collectionName: CollectionNames.TOKENS,
      data: parsedTokens,
    },
    {
      collectionName: CollectionNames.RESERVES,
      data: parsedReserves,
    },
    {
      collectionName: CollectionNames.ACCOUNT_RESERVES,
      data: parsedAccountReserves,
    },
    {
      collectionName: CollectionNames.ACCOUNTS,
      data: parsedAccounts,
    },
  ];
};

// export const parseAccountsFromBorrowTransactionLogs = (
//   client: ClientNames,
//   network: NetworkNames,
//   ifaceAbi: string,
//   txLogs: Log[]
// ): IAccount[] => {
//   // Borrow event transactions only

//   let iface = new Interface(ifaceAbi as string);
//   let initiatorArgIdx: number = 1;
//   let accounts: IAccount[] = [];

//   txLogs.map((log: Log) => {
//     let parsedTx: LogDescription = iface.parseLog(log);
//     accounts.push({
//       client: client,
//       network: network,
//       address: parsedTx.args[initiatorArgIdx] as string,
//     });
//   });

//   return accounts;
// };

// export const formatReservesFromGql = (
//   client: ClientNames,
//   network: NetworkNames,
//   reservesList: AaveGqlReserve[]
// ) => {
//   const formattedReserves = reservesList.map((reserve) => {
//     let formattedReserve: IReserve = {
//       client: client,
//       network: network,
//       address: reserve.id,
//       token1: {
//         address: reserve.id,
//         symbol: reserve.symbol,
//         name: reserve.name,
//         decimals: reserve.decimals,
//         priceHistory: [
//           {
//             price: reserve.price.priceInEth,
//             timestamp: reserve.price.lastUpdatedTimestamp,
//           },
//         ],
//       },
//     };
//     return formattedReserve;
//   });
//   return formattedReserves;
// };

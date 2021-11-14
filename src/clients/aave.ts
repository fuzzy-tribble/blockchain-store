import { Interface, LogDescription } from "@ethersproject/abi";
import { TransactionRequest, Log } from "@ethersproject/abstract-provider";
import { IConfig, IAccount, IReserve } from "../models";
import Client from "../lib/client";
import Blockchain from "../helpers/blockchain-helpers";
import { v2 } from "@aave/protocol-js";
import GqlClient from "../helpers/graphql-helpers";
import { AaveGqlReserve, formatReservesFromGql } from "./helpers/aave-helpers";

export default class Aave extends Client {
  // public bc: Blockchain;
  public gql: GqlClient;

  constructor(conf: IConfig) {
    super(conf);
    // this.bc = new Blockchain(conf);
    this.gql = new GqlClient(
      conf.client,
      conf.dataSources.graphql.endpoint as string
    );
  }

  setup = async (): Promise<void> => {
    // this.bc ? await this.bc.connect() : null;
  };

  // getAccounts = async (): Promise<IAccount[]> => {
  //   // getAccountsFromGql()
  //   return await this._getAccountsFromBlockchain();
  // };

  // updateAccounts = async () => {
  //   return await this._updateAccountsFromBlockchain();
  // };

  getReserves = async () => {
    return await this._getReservesFromGql();
  };

  updateReserves = async () => {
    // update reserves if _isOld or _isRisky
    // return await this._updateReservesFromApi();
  };

  // _getAccountsFromBlockchain = async (
  //   toBlock: number | "latest" = "latest"
  // ): Promise<IAccount[]> => {
  //   let newUsers: AaveAccount[] = [];
  //   const latestBlockChecked: number = await this.bcDb.getLastBlockChecked(
  //     this.conf.bcNetwork,
  //     this.conf.bcProtocol
  //   );

  //   let txEventLogs: Log[] = await this.bcNetwork.query(
  //     this.conf.newUsersEventFilter,
  //     latestBlockChecked,
  //     toBlock
  //   );

  //   newUsers = this._getAccountsFromBorrowTransactionLogs(txEventLogs);
  //   return newUsers;
  // };
  // _updateAccountsFromBlockchain = async (activeUsers: IAccount[]) => {
  //   const promises = activeUsers.map(async (activeUser) => {
  //     let updatedActiveUser = activeUser as AaveAccount;
  //     if (await this._accountNeedsUpdate(activeUser)) {
  //       updatedActiveUser = await this._updateActiveAccountData(
  //         activeUser as AaveAccount
  //       );
  //     }
  //     return updatedActiveUser;
  //   });
  //   const allUpdatedActiveUsers = await Promise.all(promises);
  //   return allUpdatedActiveUsers;
  // };

  _getReservesFromGql = async () => {
    const {
      data: { reserves },
    }: any = await this.gql.query(
      this.conf.dataSources.graphql.queries.GET_RESERVES_LIST
    );
    return formatReservesFromGql(
      this.conf.client,
      this.conf.network,
      reserves as AaveGqlReserve[]
    );
  };

  _updateReservesPricesFromApi = async (reservesToUpdate: Array<IReserve>) => {
    // TODO - stopped here (update most volatile reserves)
  };

  // _updateActiveAccountData = async (
  //   account: AaveAccount
  // ): Promise<AaveAccount> => {
  //   let updatedUser: AaveAccount = {
  //     address: account.address,
  //     isPendingUpdate: false,
  //     data: {
  //       getUserAccountData: [],
  //       getUserConfiguration: [],
  //     },
  //   };

  //   const clientFunctions = [
  //     { name: "getUserAccountData", values: [account.address] },
  //     { name: "getUserConfiguration", values: [account.address] },
  //   ];

  //   const promises = clientFunctions.map(async (f) => {
  //     const txReq: TransactionRequest = {
  //       to: this.conf.contractAddress,
  //       data: this.bcNetwork.iface.encodeFunctionData(f.name, f.values),
  //     };
  //     const encodedRes = await this.bcNetwork.provider.call(txReq);
  //     const decodedRes = this.bcNetwork.iface.decodeFunctionResult(
  //       f.name,
  //       encodedRes
  //     );
  //     const res: AaveUserAccountData | AaveUserConfiguration = {
  //       fName: f.name,
  //       results: {
  //         timestamp: Math.floor(Date.now()),
  //         ...decodedRes,
  //       },
  //     };
  //     return res;
  //   });

  //   const allUpdatedUserData = await Promise.all(promises);
  //   allUpdatedUserData.map((data) => {
  //     let values = data.results as AaveUserAccountData;
  //     if (data.fName == clientFunctions[0].name) {
  //       updatedUser.data?.getUserAccountData.push(values);
  //       updatedUser.latestHealthScore = (values.healthFactor as any)._hex;
  //     } else if (data.fName == clientFunctions[1].name) {
  //       // TODO - parse this user configuration to asset type and amount
  //       updatedUser.data?.getUserConfiguration.push(
  //         values as AaveUserConfiguration
  //       );
  //     }
  //   });

  //   return updatedUser;
  // };

  // _getAccountsFromBorrowTransactionLogs = (txLogs: Log[]): AaveAccount[] => {
  //   // Borrow event transactions only

  //   let iface = new Interface(this.conf.ifaceAbi as string);
  //   let initiatorArgIdx: number = 1;
  //   let accounts: AaveAccount[] = [];

  //   txLogs.map((log: Log) => {
  //     let parsedTx: LogDescription = iface.parseLog(log);
  //     accounts.push({
  //       address: parsedTx.args[initiatorArgIdx],
  //       isPendingUpdate: false,
  //     });
  //   });

  //   return accounts;
  // };

  // _accountNeedsUpdate = async (account: IAccount) => {
  //   // if new, old, risky, NOT if pending update
  //   return await this.bcDb.accountNeedsUpdate(account);
  // };

  // _isRiskyAccount = (account: IAccount): boolean => {
  //   console.log("TODO = riskyLogic: ", account.address);
  //   return false;
  //   // isRiksy if account is in the bottom X percentile health factor
  //   // isRisky if account collateral is most volatile
  // };

  // _isLiquidatableAccount = (account: AaveAccount): boolean => {
  //   console.log("TODO - implement _isLiquidatableAccount: ");
  //   // this.eventSocket?.emit(ServerEventNames.isLiquidatableAccount, account);
  //   return false;
  // };

  // _getLatestAccountHealthScore = (account: AaveAccount): string => {
  //   // latest gets pushed on top of the stack so will be 0
  //   let latestHf: string | undefined =
  //     account.data?.getUserAccountData[0].healthFactor?.hex;
  //   if (latestHf !== undefined) {
  //     return latestHf;
  //   } else {
  //     throw Error(
  //       `Aave#_getLatestAccountHealthScore can't get called on accounts without data: ${account.address}`
  //     );
  //   }
  // };
}

import {
  IConfig,
  IAccount,
  IReserve,
  Config,
  IEvent,
  AccountReserve,
} from "../models";
import Client from "../lib/client";
import Blockchain from "../helpers/blockchain-helpers";
import { TransactionRequest, Log } from "@ethersproject/abstract-provider";
import GqlClient from "../helpers/graphql-helpers";
import {
  AaveGqlReserve,
  AaveUserConfiguration,
  AaveUserAccountData,
} from "./helpers/aave-types";
import {
  ClientFunctionResult,
  EventNames,
  CollectionNames,
  DatabaseUpdate,
} from "../lib/types";
import {
  parseLiquidatableAccountReservesFromApi,
  parseReservesFromGql,
} from "./helpers/aave-helpers";
import { apiRequest } from "../helpers/api-helpers";
export default class Aave extends Client {
  public bc: Blockchain;
  public gql: GqlClient;

  constructor(conf: IConfig) {
    super(conf);
    this.bc = new Blockchain(conf);
    this.gql = new GqlClient(conf);
  }

  checkLiquidatableAccountsApi = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const liqAccounts = await this._fetchLiquidatableAccountReservesFromApi();
    if (liqAccounts) {
      res.success = true;
      res.data = liqAccounts;
    }
    return res;
  };

  // findNewAccounts = async (): Promise<ClientFunctionResult> => {
  //   let res: ClientFunctionResult = {
  //     success: false,
  //     client: this.conf.client,
  //     network: this.conf.network,
  //     collection: CollectionNames.ACCOUNTS,
  //     data: null,
  //   };
  //   const accounts = await this._getAccountsFromBlockchain();
  //   if (accounts) {
  //     res.success = true;
  //     res.data = accounts;
  //   }
  //   return res;
  // };

  updateReservesList = async (): Promise<ClientFunctionResult> => {
    let res: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    const reserves = await this._fetchReservesListFromGql();
    if (reserves) {
      res.success = true;
      res.data = reserves;
    }
    return res;
  };

  // updateReservesPriceData = async (): Promise<ClientFunctionResult> => {
  //   // update reserves if _isOld or _isRisky
  //   // const reserves = await this._updateReservesFromApi();
  //   return {
  //     success: false,
  //     client: this.conf.client,
  //     network: this.conf.network,
  //     collection: CollectionNames.RESERVES,
  //     data: {},
  //   };
  // };

  // handleEvent = async (event: IEvent) => {
  //   switch (event.name) {
  //     case EventNames.MAJOR_TOKEN_PRICE_CHANGE:
  //       let accounts: IAccount[] = Account.findByClientNetworkToken();
  //       this._updateAccountHealthScore(accounts);
  //       break;
  //   }
  //   // TODO - if client/network reserves have token
  //   // TODO - update client account health scores with that token
  // };

  private _fetchLiquidatableAccountReservesFromApi = async () => {
    if (!this.conf.dataSources.apis)
      throw new Error("Api conf must be present in confs provided.");
    const { data } = await apiRequest(this.conf.client, {
      method: "GET",
      url: this.conf.dataSources.apis.liquidatableAccountReserves,
    });
    if (data) {
      const parsedData = parseLiquidatableAccountReservesFromApi(
        this.conf.client,
        this.conf.network,
        data
      );
      return parsedData;
    } else {
      return null;
    }
  };

  // private _getAccountsFromBlockchain = async (
  //   toBlock: number | "latest" = "latest"
  // ): Promise<IAccount[]> => {
  //   let newUsers: IAccount[] = [];
  //   const latestBlockChecked: number = await Config.getLastBlockChecked(
  //     this.conf.bcNetwork,
  //     this.conf.bcProtocol
  //   );

  //   let txEventLogs: Log[] = await this.bc.query(
  //     this.conf.newUsersEventFilter,
  //     latestBlockChecked,
  //     toBlock
  //   );

  //   newUsers = parseAccountsFromBorrowTransactionLogs(
  //     this.conf.dataSources.blockchain.ifaceAbi,
  //     txEventLogs
  //   );
  //   return newUsers;
  // };

  // private _updateAccountsFromBlockchain = async (activeUsers: IAccount[]) => {
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

  private _fetchReservesListFromGql = async (): Promise<
    DatabaseUpdate[] | null
  > => {
    // TODO - do this through gql client??
    if (!this.conf.dataSources.graphql)
      throw new Error("Api conf must be present in confs provided.");
    const res = await this.gql.query(
      this.conf.dataSources.graphql.queries.GET_RESERVES_LIST
    );
    if (res) {
      let parsedData = parseReservesFromGql(
        this.conf.client,
        this.conf.network,
        res.data.reserves
      );
      return parsedData;
    } else {
      return null;
    }
  };

  // private _updateActiveAccountData = async (
  //   account: IAccount
  // ): Promise<IAccount> => {
  //   let updatedUserData: Record<string, any[]> = {
  //     getUserAccountData: [],
  //     getUserConfiguration: [],
  //   };
  //   let updatedUser: IAccount = {
  //     address: account.address,
  //     client: this.conf.client,
  //     network: this.conf.network,
  //     data: [],
  //   };

  //   const clientFunctions = [
  //     { name: "getUserAccountData", values: [account.address] },
  //     { name: "getUserConfiguration", values: [account.address] },
  //   ];

  //   const promises = clientFunctions.map(async (f) => {
  //     const txReq: TransactionRequest = {
  //       to: this.conf.contractAddress,
  //       data: this.bc.iface.encodeFunctionData(f.name, f.values),
  //     };
  //     const encodedRes = await this.bc.provider.call(txReq);
  //     const decodedRes = this.bc.iface.decodeFunctionResult(f.name, encodedRes);
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
  //       updatedUserData.getUserAccountData.push(values);
  //       // updatedUser.latestHealthScore = (values.healthFactor as any)._hex;
  //     } else if (data.fName == clientFunctions[1].name) {
  //       // TODO - parse this user configuration to asset type and amount
  //       updatedUserData.getUserConfiguration.push(
  //         values as AaveUserConfiguration
  //       );
  //     }
  //   });

  //   updatedUser.data = [updatedUserData];
  //   return updatedUser;
  // };
}

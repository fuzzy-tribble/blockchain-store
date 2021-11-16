import {
  IConfig,
  IAccount,
  IReserve,
  CollectionNames,
  Config,
} from "../models";
import Client from "../lib/client";
import Blockchain from "../helpers/blockchain-helpers";
import { TransactionRequest, Log } from "@ethersproject/abstract-provider";
import GqlClient from "../helpers/graphql-helpers";
import {
  AaveGqlReserve,
  AaveUserConfiguration,
  AaveUserAccountData,
  formatReservesFromGql,
  parseAccountsFromBorrowTransactionLogs,
} from "./helpers/aave-helpers";
import { ClientFunctionResult } from "../lib/types";
export default class Aave extends Client {
  public bc: Blockchain;
  public gql: GqlClient;

  constructor(conf: IConfig) {
    super(conf);
    this.bc = new Blockchain(conf);
    this.gql = new GqlClient(
      conf.client,
      conf.dataSources.graphql.endpoint as string
    );
  }

  addNewAccounts = async (): Promise<ClientFunctionResult> => {
    const accounts = await this._getAccountsFromBlockchain();
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.ACCOUNTS,
      data: accounts,
    };
  };

  getReserves = async (): Promise<ClientFunctionResult> => {
    const reserves = await this._getReservesFromGql();
    return {
      status: true,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: reserves,
    };
  };

  updateReservesPriceData = async (): Promise<ClientFunctionResult> => {
    // update reserves if _isOld or _isRisky
    // const reserves = await this._updateReservesFromApi();
    return {
      status: false,
      client: this.conf.client,
      network: this.conf.network,
      collection: CollectionNames.RESERVES,
      data: {},
    };
  };

  private _getAccountsFromBlockchain = async (
    toBlock: number | "latest" = "latest"
  ): Promise<IAccount[]> => {
    let newUsers: IAccount[] = [];
    const latestBlockChecked: number = await Config.getLastBlockChecked(
      this.conf.bcNetwork,
      this.conf.bcProtocol
    );

    let txEventLogs: Log[] = await this.bc.query(
      this.conf.newUsersEventFilter,
      latestBlockChecked,
      toBlock
    );

    newUsers = parseAccountsFromBorrowTransactionLogs(
      this.conf.dataSources.blockchain.ifaceAbi,
      txEventLogs
    );
    return newUsers;
  };

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

  private _getReservesFromGql = async () => {
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

  private _updateReservesPricesFromApi = async (
    reservesToUpdate: Array<IReserve>
  ) => {
    // TODO - stopped here (update most volatile reserves)
  };

  private _updateActiveAccountData = async (
    account: IAccount
  ): Promise<IAccount> => {
    let updatedUserData: Record<string, any[]> = {
      getUserAccountData: [],
      getUserConfiguration: [],
    };
    let updatedUser: IAccount = {
      address: account.address,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };

    const clientFunctions = [
      { name: "getUserAccountData", values: [account.address] },
      { name: "getUserConfiguration", values: [account.address] },
    ];

    const promises = clientFunctions.map(async (f) => {
      const txReq: TransactionRequest = {
        to: this.conf.contractAddress,
        data: this.bc.iface.encodeFunctionData(f.name, f.values),
      };
      const encodedRes = await this.bc.provider.call(txReq);
      const decodedRes = this.bc.iface.decodeFunctionResult(f.name, encodedRes);
      const res: AaveUserAccountData | AaveUserConfiguration = {
        fName: f.name,
        results: {
          timestamp: Math.floor(Date.now()),
          ...decodedRes,
        },
      };
      return res;
    });

    const allUpdatedUserData = await Promise.all(promises);
    allUpdatedUserData.map((data) => {
      let values = data.results as AaveUserAccountData;
      if (data.fName == clientFunctions[0].name) {
        updatedUserData.getUserAccountData.push(values);
        // updatedUser.latestHealthScore = (values.healthFactor as any)._hex;
      } else if (data.fName == clientFunctions[1].name) {
        // TODO - parse this user configuration to asset type and amount
        updatedUserData.getUserConfiguration.push(
          values as AaveUserConfiguration
        );
      }
    });

    updatedUser.data = [updatedUserData];
    return updatedUser;
  };

  private _handleMajorTokenPriceChange = async () => {
    // TODO - update/calculate healthscores for accounts with collateral in that token
    // TODO - emit EventNames.LIQUIDATABLE_ACCOUNT if any are found
  };
}

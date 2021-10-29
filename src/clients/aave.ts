import { Interface, LogDescription } from "@ethersproject/abi";
import { TransactionRequest, Log } from "@ethersproject/abstract-provider";
import { BigNumber } from "bignumber.js";
import { Server } from "socket.io";
import { clientConfigs } from "../lib/config";
import { ClientConf, Client, DbBn } from "../lib/types";
import { IAccount } from "../models/account";

const DEFAULT_CONF = clientConfigs.aaveMainnet;

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

export default class Aave extends Client {
  constructor(conf: ClientConf = DEFAULT_CONF) {
    super(conf);
  }

  setup = async () => {
    await this.bcNetwork.connect();
  };

  getNewUsers = async (
    toBlock: number | "latest" = "latest"
  ): Promise<IAccount[]> => {
    let newUsers: AaveAccount[] = [];
    const latestBlockChecked: number = await this.bcDb.getLastBlockChecked(
      this.conf.bcNetwork,
      this.conf.bcProtocol
    );

    let txEventLogs: Log[] = await this.bcNetwork.query(
      this.conf.newUsersEventFilter,
      latestBlockChecked,
      toBlock
    );

    newUsers = this._getAccountsFromBorrowTransactionLogs(txEventLogs);
    return newUsers;
  };

  updateActiveUsers = async (activeUsers: IAccount[]) => {
    const promises = activeUsers.map(async (activeUser) => {
      let updatedActiveUser = activeUser as AaveAccount;
      if (this._accountNeedsUpdate(activeUser)) {
        updatedActiveUser = await this._updateActiveAccountData(
          activeUser as AaveAccount
        );
      }
      return updatedActiveUser;
    });
    const allUpdatedActiveUsers = await Promise.all(promises);
    return allUpdatedActiveUsers;
  };

  _updateActiveAccountData = async (
    account: AaveAccount
  ): Promise<AaveAccount> => {
    let updatedUser: AaveAccount = {
      address: account.address,
      isPendingUpdate: false,
      data: {
        getUserAccountData: [],
        getUserConfiguration: [],
      },
    };

    const clientFunctions = [
      { name: "getUserAccountData", values: [account.address] },
      { name: "getUserConfiguration", values: [account.address] },
    ];

    const promises = clientFunctions.map(async (f) => {
      const txReq: TransactionRequest = {
        to: this.conf.contractAddress,
        data: this.bcNetwork.iface.encodeFunctionData(f.name, f.values),
      };
      const encodedRes = await this.bcNetwork.provider.call(txReq);
      const decodedRes = this.bcNetwork.iface.decodeFunctionResult(
        f.name,
        encodedRes
      );
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
        updatedUser.data?.getUserAccountData.push(values);
        updatedUser.latestHealthScore = (values.healthFactor as any)._hex;
      } else if (data.fName == clientFunctions[1].name) {
        // TODO - parse this user configuration to asset type and amount
        updatedUser.data?.getUserConfiguration.push(
          values as AaveUserConfiguration
        );
      }
    });

    return updatedUser;
  };

  _getAccountsFromBorrowTransactionLogs = (txLogs: Log[]): AaveAccount[] => {
    // Borrow event transactions only

    let iface = new Interface(this.conf.ifaceAbi as string);
    let initiatorArgIdx: number = 1;
    let accounts: AaveAccount[] = [];

    txLogs.map((log: Log) => {
      let parsedTx: LogDescription = iface.parseLog(log);
      accounts.push({
        address: parsedTx.args[initiatorArgIdx],
        isPendingUpdate: false,
      });
    });

    return accounts;
  };

  _accountNeedsUpdate = async (account: IAccount) => {
    // if new, old, risky, NOT if pending update
    return await this.bcDb.accountNeedsUpdate(account);
  };

  _isRiskyAccount = (account: IAccount): boolean => {
    console.log("TODO = riskyLogic: ", account.address);
    return false;
    // isRiksy if account is in the bottom X percentile health factor
    // isRisky if account collateral is most volatile
  };

  _isLiquidatableAccount = (account: AaveAccount): boolean => {
    console.log("TODO - implement _isLiquidatableAccount: ");
    // this.eventSocket?.emit(ServerEventNames.isLiquidatableAccount, account);
    return false;
  };

  _getLatestAccountHealthScore = (account: AaveAccount): string => {
    // latest gets pushed on top of the stack so will be 0
    let latestHf: string | undefined =
      account.data?.getUserAccountData[0].healthFactor?.hex;
    if (latestHf !== undefined) {
      return latestHf;
    } else {
      throw Error(
        `Aave#_getLatestAccountHealthScore can't get called on accounts without data: ${account.address}`
      );
    }
  };
}

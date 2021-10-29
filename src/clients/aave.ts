import { Interface, LogDescription } from "@ethersproject/abi";
import { TransactionRequest, Log } from "@ethersproject/abstract-provider";
import { BigNumber } from "bignumber.js";
import { Server } from "socket.io";
import { clientConfigs } from "../lib/config";
import {
  ClientConf,
  Client,
  ClientAccount,
  ServerEventNames,
  AaveClientAccount,
  AaveUserAccountData,
  AaveUserConfiguration,
} from "../lib/types";

const DEFAULT_CONF = clientConfigs.aaveMainnet;
export default class Aave extends Client {
  constructor(conf: ClientConf = DEFAULT_CONF) {
    super(conf);
  }

  setup = async (eventSocket: Server) => {
    await this.bcNetwork.connect();
    this.eventSocket = eventSocket;
  };

  getNewUsers = async (): Promise<ClientAccount[]> => {
    // TODO - BLOCK TRACKING SHOULD BE IN ACCOUNT-STORE PROBABLY?
    let newUsers: AaveClientAccount[] = [];
    let latestBlock = await this.bcNetwork.getLatestBlock();
    let uncheckedBlocks = latestBlock - this.lastBlockNumChecked;

    if (uncheckedBlocks > this.conf.maxBlockQueryChunkSize) {
      // too many unchecked blocks...can't check them all
      // just default to max chunk queury size
      this.lastBlockNumChecked = latestBlock - this.conf.maxBlockQueryChunkSize;
    }

    let txEventLogs: Log[] = await this.bcNetwork.query(
      this.conf.newUsersEventFilter,
      this.lastBlockNumChecked,
      latestBlock
    );

    newUsers = this._getAccountsFromBorrowTransactionLogs(txEventLogs);
    return newUsers;
  };

  updateActiveUsers = async (activeUsers: ClientAccount[]) => {
    const promises = activeUsers.map(async (activeUser) => {
      let updatedActiveUser = activeUser as AaveClientAccount;
      if (this._accountNeedsUpdate(activeUser)) {
        updatedActiveUser = await this._updateActiveAccountData(
          activeUser as AaveClientAccount
        );
      }
      return updatedActiveUser;
    });
    const allUpdatedActiveUsers = await Promise.all(promises);
    return allUpdatedActiveUsers;
  };

  _updateActiveAccountData = async (
    account: AaveClientAccount
  ): Promise<AaveClientAccount> => {
    let updatedUser: AaveClientAccount = {
      address: account.address,
      lastUpdated: Date.now(),
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

  _getAccountsFromBorrowTransactionLogs = (
    txLogs: Log[]
  ): AaveClientAccount[] => {
    // Borrow event transactions only

    let iface = new Interface(this.conf.ifaceAbi as string);
    let initiatorArgIdx: number = 1;
    let accounts: AaveClientAccount[] = [];

    txLogs.map((log: Log) => {
      let parsedTx: LogDescription = iface.parseLog(log);
      accounts.push({
        address: parsedTx.args[initiatorArgIdx],
        lastUpdated: Date.now(),
        isPendingUpdate: false,
      });
    });

    return accounts;
  };

  _accountNeedsUpdate = (account: ClientAccount) => {
    if ((account as AaveClientAccount).isPendingUpdate) {
      return false;
    } else if (this._isNewAccount(account as AaveClientAccount)) {
      console.log("_isNewAccount:", account.address);
      return true;
    } else if (this._isOldAccount(account as AaveClientAccount)) {
      console.log("_isOldAccount:", account.address);
      return true;
    } else if (this._isRiskyAccount(account as AaveClientAccount)) {
      console.log("_isRiskyAccount:", account.address);
      return true;
    } else {
      return false;
    }
  };

  _isNewAccount = (account: ClientAccount): boolean => {
    return !account.data;
  };

  _isOldAccount = (account: ClientAccount): boolean => {
    const timeSinceLastUpdateMs = Date.now() - account.lastUpdated;
    return (
      timeSinceLastUpdateMs > this.conf.activeUserDataBaseUpdateFrequencyMs
    );
  };

  _isRiskyAccount = (account: AaveClientAccount): boolean => {
    console.log("TODO = riskyLogic: ", account.address);
    return false;
    // const oneEtherInWei = new BigNumber("1000000000000000000");
    // const hf = account.latestHealthScore;

    // if (hf.gt(oneEtherInWei)) {
    //   this.eventSocket?.emit(ServerEventNames.isRiskyAccount, account);
    //   return true;
    // } else {
    //   return false;
    // }
  };

  _isLiquidatableAccount = (account: AaveClientAccount): boolean => {
    console.log("TODO - implement _isLiquidatableAccount: ");
    this.eventSocket?.emit(ServerEventNames.isLiquidatableAccount, account);
    return false;
  };

  _getLatestAccountHealthScore = (account: AaveClientAccount): string => {
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

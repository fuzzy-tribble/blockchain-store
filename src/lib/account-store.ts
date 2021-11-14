/**
 * Monitor (poll and/or listen) for updates to client accounts
 */
import Logger from "./logger";
import { delay } from "../helpers/delay";
import { Client, ClientAccount } from "./types";
import db, { Database } from "../helpers/db-helpers";

export enum AccountStoreEventNames {
  GetNewUsers = "GetNewUsers",
  UpdateActiveUsers = "UpdateActiveUsers",
}
export default class AccountStore {
  public client: Client;
  public db: Database;
  public pollEventCounters: any;

  constructor(client: Client, db: Database) {
    this.client = client;
    this.db = db;
    this.pollEventCounters = {
      GetNewUsers: 0,
      UpdateActiveUsers: 0,
    };
  }

  start = async () => {
    Logger.info({
      client: this.client.conf.name,
      at: "AccountStore#start",
      message: "Starting account store",
    });

    // start polls
    // start listeners

    this._poll(
      AccountStoreEventNames.GetNewUsers,
      this.client.conf.getNewUsersPollFreqMs
    );
    this._poll(
      AccountStoreEventNames.UpdateActiveUsers,
      this.client.conf.checkUpdateActiveUsersPollFreqMs
    );
  };

  _poll = async (pollEvent: AccountStoreEventNames, frequency: number) => {
    for (;;) {
      try {
        this.pollEventCounters[pollEvent]++;
        await this._executeEvent(pollEvent);
      } catch (error) {
        Logger.error({
          client: this.client.conf.name,
          pollCount: this.pollEventCounters[pollEvent],
          at: `AccountStore#_poll(${pollEvent})`,
          message: (error as Error).message,
          error,
        });
      }
      await delay(frequency);
    }
  };

  _executeEvent = async (pollEvent: AccountStoreEventNames) => {
    let numChanged: number = 0;

    Logger.info({
      client: this.client.conf.name,
      pollCount: this.pollEventCounters[pollEvent],
      at: `AccountStore#_execute(${pollEvent})`,
      message: "Executing event...",
    });

    switch (pollEvent) {
      case AccountStoreEventNames.GetNewUsers:
        let newUsers: ClientAccount[] = await this.client.getNewUsers();
        this.db.updateAccountsData(
          this.client.conf.bcNetwork,
          this.client.conf.bcProtocol,
          newUsers
        );
        numChanged = newUsers.length;
        break;

      case AccountStoreEventNames.UpdateActiveUsers:
        // Get them all
        let activeUsers: ClientAccount[] = this.db.getAccountsData(
          this.client.conf.bcNetwork,
          this.client.conf.bcProtocol
        );
        if (activeUsers.length > 0) {
          // Change db status to pending
          this._updateAccountStatusToPending(activeUsers);
          // Update them all
          let updatedActiveUsers: ClientAccount[] = [];
          if (activeUsers.length > 0) {
            updatedActiveUsers = await this.client.updateActiveUsers(
              activeUsers
            );
            this.db.updateAccountsData(
              this.client.conf.bcNetwork,
              this.client.conf.bcProtocol,
              updatedActiveUsers
            );
            numChanged = updatedActiveUsers.length;
          }
        }
        break;
    }
    Logger.info({
      client: this.client.conf.name,
      pollCount: this.pollEventCounters[pollEvent],
      at: `AccountStore#_execute(${pollEvent})`,
      message: `Done executing. Total accounts: ${numChanged}`,
    });
  };

  _updateAccountStatusToPending = (accounts: ClientAccount[]) => {
    let pendingUpdatedActiveUsers = accounts.forEach((user) => {
      return Object.assign(user, { isPending: true });
    });
    this.db.updateAccountsData(
      this.client.conf.bcNetwork,
      this.client.conf.bcProtocol,
      pendingUpdatedActiveUsers
    );
    return true;
  };
}

/**
 * Monitor (poll and/or listen) for updates to client reserves
 */

import Logger from "./logger";
import Store, { StoreEventNames, StoreNames } from "./store";
import Client from "./client";

export default class ReserveStore extends Store {
  constructor(client: Client) {
    super(StoreNames.RESERVE_STORE, client);
  }

  _executeEvent = async (pollEvent: StoreEventNames) => {
    let numChanged: number = 0;

    Logger.info({
      client: this.client.conf.name,
      pollCount: this.pollEventCounters[pollEvent],
      at: `ReserveStore#_execute(${pollEvent})`,
      message: "Executing event...",
    });

    switch (pollEvent) {
      case StoreEventNames.GET_NEW:
        // Get new Reserves - client specific operation
        let newOnes: any[] = await this.client.getReserves();
        // Update Reserves will only add new Reserves to db
        const updated = await this.db.updateReserves(
          this.client.conf.bcNetwork,
          this.client.conf.bcProtocol,
          newOnes
        );
        numChanged = 0;
        break;

      case StoreEventNames.UPDATE_EXISTING:
        // Get Reserves that need update
        let needsUpdate = await this.db.findReservesNeedingUpdate();
        // Pass them to the client to update
        let updatedOnes = await this.client.updateReserves(needsUpdate);
        this.db.updateReserves(
          this.client.conf.bcNetwork,
          this.client.conf.bcProtocol,
          updatedOnes
        );
        numChanged = 0;
        break;
    }
    Logger.info({
      client: this.client.conf.name,
      pollCount: this.pollEventCounters[pollEvent],
      at: `ReserveStore#_execute(${pollEvent})`,
      message: `Done executing. Total modified: ${numChanged}`,
    });
  };
}

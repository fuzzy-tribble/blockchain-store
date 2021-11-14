import { BlockchainStoreDb } from "../helpers/db-helpers";
import Store, { StoreEventNames, StoreNames } from "./store";
import Client from "./client";
import Logger from "./logger";

export default class PerformanceStore extends Store {
  constructor(client: Client, db: BlockchainStoreDb) {
    super(StoreNames.PERFORMANCE_STORE, client, db);
  }

  // Montor performance of liquidators and arbitragers

  // timeDelta = liquidatableAccountFound.time - liquidationCalledOnAccount

  // GET NEW : LIQUIDATORS (accounts making liquidation calls)

  // UPDATE EXISTING : 

  _executeEvent(pollEvent: StoreEventNames): Promise<void> {
    let numChanged: number = 0;
    Logger.info({
        client: this.client.conf.name,
        pollCount: this.pollEventCounters[pollEvent],
        at: `MarketStore#_execute(${pollEvent})`,
        message: "Executing event...",
      });
  
      switch (pollEvent) {
        case StoreEventNames.GET_NEW:
          // Get new accounts making liquidation calls
          let newOnes: any[] = await this.client.getLiquidators();
          // TODO - update db
          numChanged = 0;
          break;
  
        case StoreEventNames.UPDATE_EXISTING:
          // Update Liquidators
          let needsUpdate: any[] = await this.db.findLiquidatorsNeedingUpdate()
          let updatedOnes: any[] = await this.client.updateLiquidators(needsUpdate);
          this.db.updateLiquidators(
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
        at: `MarketStore#_execute(${pollEvent})`,
        message: `Done executing. Total modified: ${numChanged}`,
      });
    };
  }
}

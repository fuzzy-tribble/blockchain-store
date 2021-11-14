import "./lib/env";
import clients from "./clients";
import eventSocket from "./helpers/socket-helpers";
import db from "./helpers/db-helpers";

import AccountStore from "./lib/account-store";
import MarketStore from "./lib/account-store";

async function start() {
  const accountStores: AccountStore[] = [];
  const marketStores: MarketStore[] = [];

  await db.ready();
  await eventSocket.ready();

  const promises = clients.map(async (client) => {
    return await client.setup();
  });
  await Promise.all(promises);

  clients.map((client) => {
    if (client.conf.accountStore.isEnabled) {
      // Start Account Store
      let accountStore = new AccountStore(client, db);
      accountStores.push(accountStore);
      // accountStore.start();
    }

    if (client.conf.marketStoreIsEnabled) {
      // Start Market Store
      let marketStore = new MarketStore(client, db);
      marketStores.push(marketStore);
      console.log("TODO - implement market store");
    }
  });
}

start();

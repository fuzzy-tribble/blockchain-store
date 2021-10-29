import "./lib/env";
import AccountStore from "./lib/account-store";
import { socketConnect } from "./helpers/socket-helpers";
import { clientsList } from "./clients";
import { Client } from "./lib/types";
import { Server } from "socket.io";
import BlockchainDb from "./helpers/db-helpers";

async function start() {
  const clients: Client[] = clientsList;
  const accountStores: AccountStore[] = [];
  const db: BlockchainDb = new BlockchainDb();

  const eventSocket: Server = await socketConnect(db);

  // Setup clients (connect to bc and event sockets)
  const promises = clients.map(async (client) => {
    return await client.setup(eventSocket);
  });
  await Promise.all(promises);

  clients.map((client) => {
    // Start Account Store for each client
    let accountStore = new AccountStore(client, db);
    accountStores.push(accountStore);
    accountStore.start();
  });
}

start();

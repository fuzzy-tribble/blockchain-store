import "./lib/env";
import mongoose from "mongoose";
import { loadClients } from "./clients";
// import eventSocket from "./helpers/socket-helpers";

async function start() {
  await mongoose.connect(process.env.MONGODB_URL);
  // mongoose.connection.readyState == 1
  // await eventSocket.ready();

  const clients = await loadClients();

  // SETUP CLIENTS //
  const promises = clients.map(async (client) => {
    return await client.setup();
  });
  await Promise.all(promises);

  // START CLIENTS //
  clients.forEach((client) => {
    client.start();
  });
}

start();

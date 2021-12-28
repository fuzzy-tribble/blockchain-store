import "./lib/env";
import mongoose from "mongoose";
import { loadClients } from "./clients";
import EventsManager from "./helpers/socket-helpers";
// import eventSocket from "./helpers/socket-helpers";

async function start() {
  // Connect to DB
  if (!process.env.MONGODB_URL) new Error("MONGODB_URL is undefined");
  await mongoose.connect(process.env.MONGODB_URL);

  if (mongoose.connection.readyState !== 1)
    throw new Error("Mongoose didn't connect successfully");

  // Connect to EventsManager
  if (!process.env.EVENT_SOCKET_URL) new Error("EVENT_SOCKET_URL is undef");
  if (!process.env.EVENT_SOCKET_PORT) new Error("EVENT_SOCKET_PORT is undef");
  await EventsManager.start();

  if (!EventsManager.ready)
    throw new Error("EventsManager didn't start successfully");

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

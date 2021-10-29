import http from "http";
import ioserver, { Socket, Server } from "socket.io";
import { io } from "socket.io-client";
import { serverConfigs } from "../lib/config";
import Logger from "../lib/logger";
import BlockchainDb from "./db-helpers";
import { delay } from "./delay";

const server = http.createServer();
const eventSocket: Server = new ioserver.Server(server);
let connected: boolean = false;

export const socketConnect = async (db: BlockchainDb): Promise<Server> => {
  _startLocalListener(db);
  Logger.info({
    at: "EventSocket#socketConnect",
    message: "Checking socket connection",
  });
  while (!connected) {
    await delay(2 * 1000);
  }
  return eventSocket;
};

eventSocket.on("connect", (socket: Socket) => {
  Logger.info({
    at: "EventSocket#connected",
    message: `Client connected with id: ${socket.id}`,
  });
  connected = true;
});

const _startLocalListener = (db: BlockchainDb) => {
  const clientSocket = io("http://127.0.0.1:3001");
  clientSocket.onAny((eventName, ...args) => {
    db.updateEventsData({
      eventName: eventName,
      timestamp: Date.now(),
      eventData: { ...args },
    });
  });
};

eventSocket.listen(3001);

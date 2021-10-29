import http from "http";
import ioserver, { Socket, Server } from "socket.io";
import { io } from "socket.io-client";
import { eventSocketConfigs } from "../lib/config";
import Logger from "../lib/logger";
import db from "../helpers/db-helpers";
import { delay } from "./delay";

export enum ServerEventNames {
  IS_LIQUIDATABLE_ACCOUNT = "isLiquidatableAccount",
  IS_RISKY_ACCOUNT = "isRiskyAccount",
  IS_ARBITRAGABLE = "isArbitragable",
  IS_YIELD_FARMER_TRIGGER = "isYieldFarmerTrigger",
}

export class EventSocket {
  public server: http.Server;
  public socket: Server;
  public isConnected: boolean;

  constructor() {
    this.server = http.createServer();
    this.socket = new ioserver.Server(this.server);
    this.isConnected = false;

    // Add connect listener
    this.socket.on("connect", (socket: Socket) => {
      Logger.info({
        at: "EventSocket#connected",
        message: `Connected with id: ${socket.id}`,
      });
      this.isConnected = true;
    });
  }

  ready = async (): Promise<Server> => {
    this._startLocalListener();

    Logger.info({
      at: "EventSocket#socketConnect",
      message: "Checking socket connection...",
    });

    while (!this.isConnected) {
      await delay(2 * 1000);
    }
    return this.socket;
  };

  _startLocalListener = (
    socketUrl: string = eventSocketConfigs.url,
    socketPort: number = eventSocketConfigs.port
  ) => {
    const clientSocket = io(`${socketUrl}:${socketPort}`);
    clientSocket.onAny(async (eventName, ...args) => {
      Logger.info({
        at: "EventSocket#localListener",
        message: `Listener heard event: ${eventName}`,
      });
      await db.addEvent(eventName, { ...args });
    });
  };
}

const eventSocket = new EventSocket();
eventSocket.socket.listen(eventSocketConfigs.port);

export default eventSocket;

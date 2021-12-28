import "../lib/env";
import http from "http";
import ioserver, { Socket as ServerSocket, Server } from "socket.io";
import { io, Socket as ClientSocket } from "socket.io-client";
import Logger from "../lib/logger";
import { Event as DbEventModel, IEvent } from "../models";
import { DatabaseUpdateResult, EventNames } from "../lib/types";
import { delay } from "./delay";

export class SocketEventsManager {
  private socketUrl: string;
  private socketPort: string;
  public serverSocket: Server | null;
  private localDbClientSocket: ClientSocket | null;

  constructor() {
    if (!process.env.EVENT_SOCKET_URL)
      throw new Error("EVENT_SOCKET_URL must be defined in env");
    this.socketUrl = process.env.EVENT_SOCKET_URL;
    if (!process.env.EVENT_SOCKET_PORT)
      throw new Error("EVENT_SOCKET_PORT must be defined in env");
    this.socketPort = process.env.EVENT_SOCKET_PORT;

    this.localDbClientSocket = null;
    this.serverSocket = null;
  }

  /**
   * Start local client db socket and server socket
   */
  start = async (): Promise<void> => {
    if (!this.localDbClientSocket) {
      await this._setupLocalDbClientSocket();
    } else {
      Logger.debug({
        at: "SocketEventsManager#start",
        message: `Local client socket already setup`,
      });
    }

    if (!this.serverSocket) {
      await this._setupServerSocket();
    } else {
      Logger.debug({
        at: "SocketEventsManager#start",
        message: `EventsManager's server socket is already listening on port ${this.socketPort}`,
      });
    }
  };

  /**
   * Gives the sockets up to 5 seconds to get connected/ready
   * @returns sockets are ready to be used
   */
  isReady = async (maxWaitTimeMs: number = 10 * 1000): Promise<boolean> => {
    let result = false;
    let startTime = Date.now();
    let timeElapsed = 0;
    while (timeElapsed < maxWaitTimeMs) {
      timeElapsed = Date.now() - startTime;
      await delay(1 * 1000);
      Logger.info({
        at: "EventSocket#isReady",
        message: `Waiting for socket to connect for ${(
          (maxWaitTimeMs - timeElapsed) /
          1000
        ).toFixed(0)}s...`,
      });
      result =
        this.localDbClientSocket !== null &&
        this.localDbClientSocket.id !== undefined &&
        this.serverSocket !== null;
      if (result) return true;
    }
    return false;
  };

  /**
   * Close server and disconnect all clients
   */
  close = () => {
    // TODO - may not be necessary
    this.localDbClientSocket?.close();
    this.localDbClientSocket = null;

    // Close server and disconnect all clients (also closes http server)
    this.serverSocket?.close();
    this.serverSocket = null;
  };

  emit = (eventName: string, ...args: any): boolean => {
    if (!this.serverSocket)
      throw new Error("Server socket must first be initialized");
    return this.serverSocket.emit(eventName, ...args);
  };

  private _setupServerSocket = async (): Promise<void> => {
    this.serverSocket = new ioserver.Server(http.createServer());
    this.serverSocket.on("connect", (socket: ServerSocket) => {
      Logger.info({
        at: "EventSocket#connectionListener",
        message: `Connected with id: ${socket.id}`,
      });
    });
    this.serverSocket.on("connect_error", (socket: ServerSocket) => {
      Logger.info({
        at: "EventSocket#connectionListener",
        message: `Connect error.`,
      });
    });
    this.serverSocket.on("disconnect", (socket: ServerSocket) => {
      Logger.info({
        at: "EventSocket#connectionListener",
        message: `Disconnected.`,
      });
    });
    this.serverSocket.listen(parseInt(this.socketPort));
  };

  private _setupLocalDbClientSocket = async (): Promise<void> => {
    // Setup local client (listen for any event and add to db)
    this.localDbClientSocket = io(`${this.socketUrl}:${this.socketPort}`);
    this.localDbClientSocket.onAny(
      async (eventName: EventNames, eventData: IEvent) => {
        await this._handleAddToDb(eventName, eventData);
      }
    );
  };
  private _handleAddToDb = async (
    eventName: EventNames,
    eventData: IEvent
  ): Promise<void> => {
    let dbRes: DatabaseUpdateResult | null = null;
    Logger.info({
      at: "EventSocket#dbListener",
      message: `Listener heard event: ${eventName}`,
      eventData: eventData,
    });
    try {
      dbRes = await DbEventModel.addData([eventData]);
    } catch (err) {
      Logger.error({
        at: "EventSocket#dbListener",
        dbRes: dbRes?.errors,
        err: err,
      });
    }
  };
}

export const EventsManager = new SocketEventsManager();

// import eventSocket, { EventSocket } from "../helpers/socket-helpers";
import { delay } from "../helpers/delay";
import { IConfig } from "../models";
import { updateDatabase } from "../helpers/db-helpers";
import { EventsManager } from "../helpers/socket-helpers";
import Logger from "./logger";
import {
  ClientFunction,
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
  DatabaseUpdateResult,
  EventNames,
} from "./types";

interface PollCounter {
  pending: boolean;
  successCount: number;
  failCount: number;
}

export default abstract class Client {
  public conf: IConfig;
  public pollCounters: Record<string, PollCounter>;
  public running: boolean;

  constructor(conf: IConfig) {
    this.running = false;
    this.conf = conf;
    this.pollCounters = {};
  }

  setup = async (): Promise<void> => {
    // Override if client-specific setup is required
  };

  start = async (): Promise<void> => {
    Logger.info({
      at: `${this.conf.client}#start`,
      message: "Starting client polls and/or listeners...",
    });

    this.running = true;

    // Start polls
    this.conf.pollFunctions.forEach((pollFunction) => {
      this.pollCounters[pollFunction.fname] = {
        pending: false,
        successCount: 0,
        failCount: 0,
      };
      this._poll(pollFunction);
    });

    // Start subscriptions
    this.conf.subscriptions.forEach((subscription) => {
      if (subscription.subscribe)
        this._executeFunctionByName(subscription.subscribe);
    });

    // Start listeners
    this.conf.listeners.forEach(([eventName, clientFunction]) => {
      this._addListener(eventName, clientFunction);
    });
  };

  stop = async (): Promise<void> => {
    this.running = false;

    // Stop subscriptions
    this.conf.subscriptions.forEach((subscription) => {
      if (subscription.unsubscribe)
        this._executeFunctionByName(subscription.unsubscribe);
    });

    // Stop listeners
    this.conf.listeners.forEach(([eventName, clientFunction]) => {
      this._removeListener(eventName, clientFunction);
    });
  };

  private _poll = async (clientFunctionSig: ClientFunction): Promise<void> => {
    while (this.running) {
      try {
        if (this.pollCounters[clientFunctionSig.fname].pending) {
          throw new Error(
            `Cannot execute poll function until previous poll for that function is complete: ${clientFunctionSig.fname}`
          );
        } else {
          this.pollCounters[clientFunctionSig.fname].pending = true;
          Logger.info({
            at: `${this.conf.client}#_poll(${clientFunctionSig.fname})`,
            message: "Executing poll function...",
            pollCount: this.pollCounters[clientFunctionSig.fname],
          });
          let success = await this._executeFunctionByName(clientFunctionSig);
          this.pollCounters[clientFunctionSig.fname].pending = false;
          if (success) {
            this.pollCounters[clientFunctionSig.fname].successCount++;
          } else {
            this.pollCounters[clientFunctionSig.fname].failCount++;
          }
          Logger.info({
            at: `${this.conf.client}#_poll(${clientFunctionSig.fname})`,
            message: `Done executing poll function.`,
            pollCount: this.pollCounters[clientFunctionSig.fname],
          });
        }
      } catch (error) {
        Logger.error({
          at: `${this.conf.client}#_poll(${clientFunctionSig.fname})`,
          message: (error as Error).message,
          pollCount: this.pollCounters[clientFunctionSig.fname],
          error,
        });
      }
      await delay(clientFunctionSig.frequency || 1000);
    }
  };

  private _removeListener = async (
    eventName: EventNames,
    clientHandlerFunction: ClientFunction
  ) => {
    // eventsManager.socket.removeListener(
    //   eventName,
    //   this[clientHandlerFunction.fname]
    // );
  };

  private _addListener = async (
    eventName: EventNames,
    clientHandlerFunction: ClientFunction
  ) => {
    // eventsManager.socket.addListener(
    //   eventName,
    //   this[clientHandlerFunction.fname]
    // );
    // ServerEventSocket.socket.on(eventName, this[clientHandlerFunction.fname]);
  };

  private _executeFunctionByName = async (
    clientFunctionSig: ClientFunction
  ): Promise<boolean> => {
    let functionResult: ClientFunctionResult = {
      success: false,
      client: this.conf.client,
      network: this.conf.network,
      data: [],
    };
    let dbSuccess = false;
    try {
      functionResult = await this[clientFunctionSig.fname].call(
        clientFunctionSig.args
      );
      if (functionResult.success && functionResult.data.length > 0) {
        let databaseResult = await updateDatabase(functionResult.data);
        if (databaseResult.success) {
          dbSuccess = true;
        } else {
          Logger.debug({
            at: `${this.conf.client}#_execute(${clientFunctionSig.fname})`,
            message: `Database errors.`,
            databaseUpdateResult: databaseResult,
          });
        }
      } else {
        Logger.debug({
          at: `${this.conf.client}#_execute(${clientFunctionSig.fname})`,
          message: `Client function failed. Not running updateDatabase`,
          clientFunctionResult: functionResult,
        });
      }
    } catch (err) {
      Logger.error({
        at: `${this.conf.client}#_execute(${clientFunctionSig.fname})`,
        message: `Error while executing poll function.`,
        error: err,
        pollCount: this.pollCounters[clientFunctionSig.fname],
      });
    } finally {
      Logger.debug({
        at: `${this.conf.client}#_execute(${clientFunctionSig.fname})`,
        message: `Execution result.`,
        clientFunctionResult: `Client function execution success: ${functionResult.success}`,
        databaseUpdateResult: `Database updated without any errors: ${dbSuccess}`,
      });
      return functionResult.success && dbSuccess;
    }
  };
}

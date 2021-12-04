// import eventSocket, { EventSocket } from "../helpers/socket-helpers";
import { delay } from "../helpers/delay";
import { IConfig } from "../models";
import { updateDatabase } from "../helpers/db-helpers";
import Logger from "./logger";
import {
  ClientFunction,
  ClientFunctionResult,
  ClientNames,
  CollectionNames,
  DatabaseUpdateResult,
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
  // public eventSocket: EventSocket;

  constructor(conf: IConfig) {
    this.running = false;
    this.conf = conf;
    this.pollCounters = {};
    // this.eventSocket = eventSocket;
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
      this.pollCounters[pollFunction.name] = {
        pending: false,
        successCount: 0,
        failCount: 0,
      };
      this._poll(pollFunction);
    });

    // Start listeners
    this.conf.listenerNames.forEach((listener) => {
      // TODO
      // this._addListener(listener);
    });
  };

  stop = async (): Promise<void> => {
    this.running = false;
    // TODO - remove listeners
  };

  private _poll = async (clientFunctionSig: ClientFunction): Promise<void> => {
    while (this.running) {
      try {
        if (this.pollCounters[clientFunctionSig.name].pending) {
          throw new Error(
            `Cannot execute poll function until previous poll for that function is complete: ${clientFunctionSig.name}`
          );
        } else {
          this.pollCounters[clientFunctionSig.name].pending = true;
          Logger.info({
            at: `${this.conf.client}#_poll(${clientFunctionSig.name})`,
            message: "Executing poll function...",
            pollCount: this.pollCounters[clientFunctionSig.name],
          });
          let success = await this._executeFunctionByName(clientFunctionSig);
          this.pollCounters[clientFunctionSig.name].pending = false;
          if (success) {
            this.pollCounters[clientFunctionSig.name].successCount++;
          } else {
            this.pollCounters[clientFunctionSig.name].failCount++;
          }
          Logger.info({
            at: `${this.conf.client}#_poll(${clientFunctionSig.name})`,
            message: `Done executing poll function.`,
            pollCount: this.pollCounters[clientFunctionSig.name],
          });
        }
      } catch (error) {
        Logger.error({
          at: `${this.conf.client}#_poll(${clientFunctionSig.name})`,
          message: (error as Error).message,
          pollCount: this.pollCounters[clientFunctionSig.name],
          error,
        });
      }
      await delay(clientFunctionSig.frequency);
    }
  };

  private _addListener = async (listenerName: string) => {
    // TODO
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
      functionResult = await this[clientFunctionSig.name].call(
        clientFunctionSig.args
      );
      if (functionResult.success && functionResult.data.length > 0) {
        let databaseResult = await updateDatabase(functionResult.data);
        if (databaseResult.success) {
          dbSuccess = true;
        } else {
          Logger.debug({
            at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
            message: `Database errors.`,
            databaseUpdateResult: databaseResult,
          });
        }
      } else {
        Logger.debug({
          at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
          message: `Client function failed. Not running updateDatabase`,
          clientFunctionResult: functionResult,
        });
      }
    } catch (err) {
      Logger.error({
        at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
        message: `Error while executing poll function.`,
        error: err,
        pollCount: this.pollCounters[clientFunctionSig.name],
      });
    } finally {
      Logger.debug({
        at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
        message: `Execution result.`,
        clientFunctionResult: `Client function execution success: ${functionResult.success}`,
        databaseUpdateResult: `Database updated without any errors: ${dbSuccess}`,
      });
      return functionResult.success && dbSuccess;
    }
  };
}

// import eventSocket, { EventSocket } from "../helpers/socket-helpers";
import { delay } from "../helpers/delay";
import { IConfig, updateDatabase } from "../models";
import Logger from "./logger";
import { ClientFunction, ClientFunctionResult, ClientNames } from "./types";
export default abstract class Client {
  public conf: IConfig;
  public pollCounters: {};
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
      this._poll(pollFunction);
    });

    // Start listeners
    this.conf.listeners.forEach((listener) => {
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
        this._updatePollCounter(clientFunctionSig.name);
        await this._executeFunctionByName(clientFunctionSig);
        // TODO - handle execution return errors
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

  private _updatePollCounter = (fName: string) => {
    fName in this.pollCounters
      ? this.pollCounters[fName]++
      : (this.pollCounters[fName] = 0);
  };

  private _addListener = async (listenerName: string) => {
    // TODO
  };

  private _executeFunctionByName = async (
    clientFunctionSig: ClientFunction
  ): Promise<any[]> => {
    let functionResult: ClientFunctionResult | 0 = 0;
    let databaseResult = 0;
    try {
      Logger.info({
        at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
        message: "Executing function...",
        pollCount: this.pollCounters[clientFunctionSig.name],
      });
      functionResult = await this[clientFunctionSig.name].call(
        clientFunctionSig.args
      );
      if (functionResult) {
        databaseResult = await updateDatabase(functionResult);
      }
      Logger.info({
        at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
        message: `Done executing.`,
        pollCount: this.pollCounters[clientFunctionSig.name],
      });
    } catch (err) {
      Logger.error({
        at: `${this.conf.client}#_execute(${clientFunctionSig.name})`,
        message: `Error while executing function.`,
        error: err,
        pollCount: this.pollCounters[clientFunctionSig.name],
      });
    } finally {
      return [functionResult, databaseResult];
    }
  };
}

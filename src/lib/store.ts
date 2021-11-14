import Client from "./client";
import Logger from "./logger";
import { delay } from "../helpers/delay";
import { Client as ClientNames, Network as NetworkNames } from "./types";
import { CollectionNames } from "../models";

export default abstract class Store {
  public client: Client;
  public storeName: CollectionNames;
  public clientName: ClientNames;
  public pollCounters: any;

  constructor(storeName: CollectionNames, client: Client) {
    this.client = client;
    this.storeName = storeName;
    this.clientName = this.client.conf.client;
    // TODO - initialize poll counters to 0
  }

  start = async (): Promise<void> => {
    Logger.info({
      client: this.clientName,
      at: `${this.storeName}Store#start`,
      message: "Starting store...",
    });

    // Start polls
    this.client.conf.polls.forEach((poll) => {
      this._poll(poll.functionName, poll.frequency);
    });

    // Start listeners
    this.client.conf.listeners.forEach((listener) => {
      this._addListener(listener);
    });
  };

  _poll = async (pollFunction: string, frequency: number): Promise<void> => {
    for (;;) {
      try {
        pollFunction in this.pollCounters
          ? Object.assign(this.pollCounters, { pollFunction: 0 })
          : this.pollCounters[pollFunction]++;

        await this._executeFunctionByName(pollFunction);
      } catch (error) {
        Logger.error({
          client: this.clientName,
          pollCount: this.pollCounters[pollFunction],
          at: `${this.storeName}Store#_poll(${pollFunction})`,
          message: (error as Error).message,
          error,
        });
      }
      await delay(frequency);
    }
  };

  _addListener = async (listenerName: string) => {
    this.client.addListener(listenerName);
  };

  _executeFunctionByName = async (functionName: string) => {
    let functionResult: any = null;
    try {
      Logger.info({
        client: this.client.conf.name,
        pollCount: this.pollCounters[functionName],
        at: `${this.storeName}Store#_execute(${functionName})`,
        message: "Executing event...",
      });
      functionResult = await this.client[functionName];
      functionResult
        ? updateDb(this.storeName, this.clientName, functionResult)
        : null;
      Logger.info({
        client: this.client.conf.name,
        pollCount: this.pollCounters[functionName],
        at: `${this.storeName}Store#_execute(${functionName})`,
        message: `Done executing.`,
      });
    } catch (err) {
    } finally {
      return functionResult;
    }
  };
}

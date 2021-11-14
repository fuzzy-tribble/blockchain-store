import mongoose from "mongoose";
import "../lib/env";
import Logger from "../lib/logger";
import { Account, CollectionNames } from "../models";

export const dbReady = async (dbUri: string): Promise<void> => {
  Logger.info({
    at: "Database#ready",
    message: `Attempting to connect to db at: ${dbUri}`,
  });
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(dbUri);
  }
  Logger.info({
    at: "Database#ready",
    message: `Connected. Ready to go.`,
    collections: mongoose.connection.collections,
  });
};

export const updateDb = async (collection: CollectionNames, clientName: Client, functionResult) {
  switch (collection) {
    case CollectionNames.ACCOUNTS:
      await Account.addData(functionResult)
      break;
    case CollectionNames.EVENTS:
      await Event.addData(functionResult)
      break;
  }
}

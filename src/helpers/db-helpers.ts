import { Schema, Error, QueryOptions, Query } from "mongoose";
// import { Account, IAccount, Reserve, IReserve, Event, IEvent } from "../models";
import {
  ClientFunctionResult,
  CollectionNames,
  UpdateResult,
} from "../lib/types";
import Logger from "../lib/logger";

export const defaultQueryOptions: QueryOptions = {
  // returnDocument: "after",
  upsert: true,
  runValidators: true,
  new: true, // otherwise will fail on empty collection
};

export const defaultSchemaOpts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  timestamps: true,
  // toJSON() or toObject() will not include virtuals by default
  toJSON: { getters: true, virtuals: true },
  toObject: { virtuals: true },
  strict: false,
};

Schema.Types.String.checkRequired((v) => {
  return typeof v === "string";
});

export function updateValidation(this) {
  let objectOfInterest = this.getUpdate();
  if (!objectOfInterest) {
    objectOfInterest = this.getFilter();
  }
  let requiredFields: string[] = [];
  let schemaObject = this["schema"]["obj"];
  Object.keys(schemaObject).forEach((key) => {
    if (schemaObject[key].required && schemaObject[key].default == undefined) {
      requiredFields.push(key);
    }
  });
  validateRequiredFields(objectOfInterest as object, requiredFields);
}

// Validators are not run on undefined values (the
// only exception is the required validator), this allows checking
// Allow empty strings to pass the `required` validator (but not null)
// that required values are actuall provided
export const validateRequiredFields = (
  update: object,
  fieldsList: Array<string>
) => {
  // NOTE: can't use .validate because it doesn't check undefined
  // Logger.debug({
  //   at: "Database#validate",
  //   message: `Validating fields: '${fieldsList}'`,
  //   schemaObject: update,
  // });
  let invalidValues: string = "";
  fieldsList.forEach((field) => {
    if (update[field] === null || update[field] === undefined) {
      invalidValues = invalidValues + `'${field}' is '${update[field]}'; `;
    }
  });
  if (invalidValues !== "") {
    throw new Error.ValidatorError({
      message: `${invalidValues}`,
    });
  }
};

export const validateMany = (
  items: object[],
  schema: Schema
): { validCount: number; invalidCount: number } => {
  let schemaObject = schema["obj"];
  let res = {
    validCount: 0,
    invalidCount: 0,
  };
  items.map((item) => {
    try {
      let requiredFields: string[] = [];
      Object.keys(schemaObject).forEach((key) => {
        if (
          schemaObject[key].required &&
          schemaObject[key].default == undefined
        ) {
          requiredFields.push(key);
        }
      });
      validateRequiredFields(item, requiredFields);
      res.validCount = res.validCount + 1;
    } catch (err) {
      res.invalidCount = res.invalidCount + 1;
      Logger.error({
        at: "Database#addData",
        message: `Error updating reserves.`,
        error: err,
      });
    }
  });
  return res;
};

export const updateDatabase = async (
  fRes: ClientFunctionResult
): Promise<UpdateResult> => {
  let res: UpdateResult = {
    upsertedCount: 0,
    modifiedCount: 0,
    matchedCount: 0,
    invalidCount: 0,
    upsertedIds: [],
    modifiedIds: [],
  };
  // switch (fRes.collection) {
  //   case CollectionNames.ACCOUNTS:
  //     res = await Account.addData(fRes.data as IAccount[]);
  //     break;
  //   case CollectionNames.RESERVES:
  //     res = await Reserve.addData(fRes.data as IReserve[]);
  //     break;
  //   case CollectionNames.EVENTS:
  //     res = await Event.addData(fRes.data as IEvent[]);
  //     break;
  //   default:
  //     // TEST Collection or anything else
  //     break;
  // }
  return res;
};

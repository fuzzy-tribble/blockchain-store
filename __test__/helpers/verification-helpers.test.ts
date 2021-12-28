import { expect } from "chai";
import Logger from "../../src/lib/logger";

// Silence logs while running tests
Logger.transports.forEach((t) => (t.silent = true));

describe("Helpers: verification-helpers", () => {
  before(async () => {});

  after(async () => {});

  it("should verify client confs ...", async () => {
    //TODO - functions should exist and be callable
  });
});

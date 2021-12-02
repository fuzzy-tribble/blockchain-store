// import mongoose from "mongoose";
// import { expect } from "chai";
// import {
//   CollectionNames,
//   //   databaseIsReady,
//   updateDatabase,
// } from "../../src/models";
// import {
//   mockAccounts,
//   mockEvents,
//   mockReserves,
//   mongodb_test_uri,
// } from "../mockData";
// import {
//   ClientFunctionResult,
//   ClientNames,
//   NetworkNames,
// } from "../../src/lib/types";

// describe("database", () => {
//   before(async () => {
//     await mongoose.connect(mongodb_test_uri);
//   });

//   after(async () => {
//     await mongoose.connection.close();
//   });

//   it("should update EVENTS data", async () => {
//     let mockFunctionResult: ClientFunctionResult = {
//       status: true,
//       client: ClientNames.AAVE,
//       network: NetworkNames.MAINNET,
//       collection: CollectionNames.EVENTS,
//       data: mockEvents,
//     };
//     let res = await updateDatabase(mockFunctionResult);
//     expect(res).to.equal(mockEvents.length);
//   });

//   it("should update RESERVES data", async () => {
//     let mockFunctionResult: ClientFunctionResult = {
//       status: true,
//       client: ClientNames.AAVE,
//       network: NetworkNames.MAINNET,
//       collection: CollectionNames.RESERVES,
//       data: mockReserves,
//     };
//     let res = await updateDatabase(mockFunctionResult);
//     expect(res).to.equal(mockReserves.length);
//   });

//   it("should update ACCOUNTS data", async () => {
//     let mockFunctionResult: ClientFunctionResult = {
//       status: true,
//       client: ClientNames.AAVE,
//       network: NetworkNames.MAINNET,
//       collection: CollectionNames.ACCOUNTS,
//       data: mockAccounts,
//     };
//     let res = await updateDatabase(mockFunctionResult);
//     expect(res).to.equal(mockAccounts.length);
//   });
// });

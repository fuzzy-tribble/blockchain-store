// Client connection and listening for events example
import { io, Socket } from "socket.io-client";
import { ClientAccount } from "../src/lib/types";
import { ServerEventNames } from "../src/lib/types";

const socket: Socket = io("http://127.0.0.1:3001");

socket.onAny((eventName, ...args) => {
  console.log(`EVENT: ${eventName}`);
  console.log(...args);
});

socket.on("connect", function () {
  console.log("Client has connected to the server: ", socket.id);
});

socket.on("disconnect", () => {
  console.log("Client has disconnected from server: ", socket.id); // undefined
});

socket.on("hello", (arg) => {
  console.log("GOT HELLO", arg);
});

socket.on(ServerEventNames.isLiquidatableAccount, (account: ClientAccount) => {
  console.log(`${ServerEventNames.isLiquidatableAccount} event called`);
  sampleLiquidatorFunction(account);
});

socket.on(ServerEventNames.isRiskyAccount, (account: ClientAccount) => {
  console.log(`${ServerEventNames.isRiskyAccount} event called`);
  sampleLiquidatorFunction(account);
});

const sampleLiquidatorFunction = (account: ClientAccount) => {
  console.log("pretending to liquidate account: ", JSON.stringify(account));
};

// TODO
// socket.close()

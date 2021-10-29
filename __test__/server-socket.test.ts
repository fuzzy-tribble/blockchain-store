import http from "http";
// import * as socketio from "socket.io";
import ioserver, { Socket, Server } from "socket.io";
import { delay } from "../src/helpers/delay";
import { ClientAccount } from "../src/lib/types";

const accountSample: ClientAccount = {
  address: "0x1b4F9F9388E47BBE635Fd80E88Df4f8414C8F9F1",
  isLiquidatable: false,
  data: [
    [
      {
        "0": { type: "BigNumber", hex: "0xb1a23e7dfafafb4c" },
        "1": { type: "BigNumber", hex: "0x3b70da0a8d0cf47b" },
        "2": { type: "BigNumber", hex: "0x40e71e80d5d5eea1" },
        "3": { type: "BigNumber", hex: "0x1d4c" },
        "4": { type: "BigNumber", hex: "0x1b58" },
        "5": { type: "BigNumber", hex: "0x1f1abba3764f5fee" },
        type: "getUserAccountData",
        timestamp: 1634935446295,
        totalCollateralETH: {
          type: "BigNumber",
          hex: "0xb1a23e7dfafafb4c",
        },
        totalDebtETH: {
          type: "BigNumber",
          hex: "0x3b70da0a8d0cf47b",
        },
        availableBorrowsETH: {
          type: "BigNumber",
          hex: "0x40e71e80d5d5eea1",
        },
        currentLiquidationThreshold: {
          type: "BigNumber",
          hex: "0x1d4c",
        },
        ltv: { type: "BigNumber", hex: "0x1b58" },
        healthFactor: { type: "BigNumber", hex: "0x1f1abba3764f5fee" },
      },
      {
        "0": [{ type: "BigNumber", hex: "0x02040000" }],
        type: "getUserConfiguration",
        timestamp: 1634935446293,
      },
    ],
  ],
};
const eventNames = ["isLiquidatableAccount"];

const server = http.createServer();
const io = new ioserver.Server(server);

io.on("connection", (socket: Socket) => {
  console.log("Client connected with id: ", socket.id);

  socket.emit(eventNames[0], accountSample);

  // EMIT EVENTS WHEN CALLED

  //   socket.broadcast.emit("hello", "world_1"); // DOESN"T WORK
  //   io.emit("hello", "world_2_YES");
  //   io.local.emit("hello", "world_9_YES");
});

// io.sockets.emit("hello", "world");

io.listen(3001);

const testEmitAtRandomEvents = async (io: Server) => {
  for (let i = 0; i < 5; i++) {
    _emitEvent(io);
    await delay(6 * 1000);
  }
};

let counter = 0;
const _emitEvent = (io: Server) => {
  console.log(`EMITTING EVENT: ${counter}`, io.sockets._ids);
  io.emit(eventNames[0], counter++);

  // io.emit(eventNames[0], accountSample);

  //   console.log(io.sockets);
  //   io.on("connection", (socket: Socket) => {
  //     console.log("EMITTING EVENT");
  //     socket.emit(eventNames[0], accountSample);
  //   });
};

testEmitAtRandomEvents(io);

// import { createServer } from "http";
// import { io as Client } from "socket.io-client";
// import { Server } from "socket.io";
// import { assert } from "chai";

// describe("event-socketio", () => {
//   let io, serverSocket, clientSocket;
//   const url = "http://127.0.0.1";
//   const port = "3000";

//   before((done) => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     httpServer.listen(() => {
//       clientSocket = Client(`${url}:${port}`);
//       io.on("connection", (socket) => {
//         serverSocket = socket;
//       });
//       clientSocket.on("connect", done);
//     });
//   });

//   after(() => {
//     io.close();
//     clientSocket.close();
//   });

//   it("should work", (done) => {
//     clientSocket.on("hello", (arg) => {
//       assert.equal(arg, "world");
//       done();
//     });
//     serverSocket.emit("hello", "world");
//   }).timeout(5000);

//   //   it("should work (with ack)", (done) => {
//   //     serverSocket.on("hi", (cb) => {
//   //       cb("hola");
//   //     });
//   //     clientSocket.emit("hi", (arg) => {
//   //       assert.equal(arg, "hola");
//   //       done();
//   //     });
//   //   });
// });

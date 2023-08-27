import { Server } from "socket.io";

const socketIOInit = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("connection attempt");
  });

  return io;
};

export default socketIOInit;

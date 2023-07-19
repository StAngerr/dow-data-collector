export const scrappingTasks = (io, socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);

    io.emit("chat message", msg);
  });

  socket.emit();
};

export const scrappingTaskSendEvent = (io, msg) => io.emit(`scrapping-${msg}`);

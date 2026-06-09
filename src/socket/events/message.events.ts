export const registerMessageEvents = (socket: any) => {
  socket.on("message:send", async (payload: any) => {
    console.log("message send trigger:", payload);
  });
};

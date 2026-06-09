export const registerPresenceEvents = (socket: any) => {
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
};
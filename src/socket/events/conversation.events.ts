export const registerConversationEvents = (socket: any) => {
  socket.on("conversation:join", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);

    console.log("joined:", conversationId);
  });

  socket.on("conversation:leave", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);

    console.log("left:", conversationId);
  });
};
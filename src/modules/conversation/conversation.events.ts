import { prisma } from "../../lib/prisma";

const joinConversation = (socket: any) => {
  socket.on("conversation:join", async (conversationId: string) => {
    if (!conversationId) return;

    if (!socket.data.allowedRooms) {
      socket.data.allowedRooms = new Set<string>();
    }

    if (socket.data.allowedRooms.has(conversationId)) {
      socket.join(`conversation:${conversationId}`);
      return;
    }

    const isMember = await prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId: socket.data.user.id,
      },
    });
    if (!isMember) {
      throw new Error("User is not a member of the conversation");
    }

    socket.data.allowedRooms.add(conversationId);

    socket.join(`conversation:${conversationId}`);
  });
};

const leaveConversation = (socket: any) => {
  socket.on("conversation:leave", (conversationId: string) => {
    if (!conversationId) return;

    socket.leave(`conversation:${conversationId}`);
  });
};

const typingMessage = (socket: any) => {
  socket.on("typing:start", (conversationId: string) => {
    const userId = socket.data.user.id;

    socket.to(`conversation:${conversationId}`).emit("typing:start", {
      conversationId,
      userId,
    });
  });

  socket.on("typing:stop", (conversationId: string) => {
    const userId = socket.data.user.id;
    socket.to(`conversation:${conversationId}`).emit("typing:stop", {
      conversationId,
      userId,
    });
  });
};

export const ConversationSocketEvents = (socket: any) => {
  joinConversation(socket);
  leaveConversation(socket);
  typingMessage(socket);
};

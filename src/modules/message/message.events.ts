import { getIO } from "../../config/socket.config";
import { MessageType } from "../../generated/prisma/enums";
import { ISocketMessagePayload } from "../../interfaces";
import { broadcastNewMessage } from "./message.helper";
import { MessageServices } from "./message.service";

const sendTextMessage = (socket: any) => {
  socket.on("message:send", async (data: ISocketMessagePayload) => {
    const { conversationId, content } = data;
    const userId = socket.data.user.id;

    const hasAccess = socket.data.allowedRooms?.has(conversationId);
    if (!hasAccess) {
      throw new Error("User does not have access to this conversation");
    }

    const message = await MessageServices.sendMessage({
      conversationId,
      userId,
      content,
      type: MessageType.TEXT,
    });

    await broadcastNewMessage(conversationId, userId, message);
  });
};

const seenMessage = (socket: any) => {
  socket.on("message:seen", async (conversationId: string) => {
    const userId = socket.data.user.id;

    const hasAccess = socket.data.allowedRooms?.has(conversationId);
    if (!hasAccess) {
      throw new Error("User does not have access to this conversation");
    }

    await MessageServices.updateMessageSeen(conversationId, userId);

    socket.to(`conversation:${conversationId}`).emit("message:seen", {
      conversationId,
      userId,
    });
  });
};

export const MessageSocketEvents = (socket: any) => {
  sendTextMessage(socket);
  seenMessage(socket);
};

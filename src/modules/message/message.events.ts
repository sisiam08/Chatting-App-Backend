import status from "http-status";
import createAppError from "../../errors/appError";
import { MessageType } from "../../generated/prisma/enums";
import { ISocketMessagePayload } from "../../interfaces";
import { broadcastNewMessage } from "./message.helper";
import { MessageServices } from "./message.service";

const sendTextMessage = (socket: any) => {
  socket.on("message:send", async (data: ISocketMessagePayload) => {
    const { conversationId, content } = data;
    const userId = socket.data.userId;

    const hasAccess = socket.data.allowedRooms?.has(conversationId);
    if (!hasAccess) {
      createAppError(
        "User does not have access to this conversation",
        status.FORBIDDEN,
      );
      return;
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
    const userId = socket.data.userId;

    const hasAccess = socket.data.allowedRooms?.has(conversationId);
    if (!hasAccess) {
      createAppError(
        "User does not have access to this conversation",
        status.FORBIDDEN,
      );
      return;
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

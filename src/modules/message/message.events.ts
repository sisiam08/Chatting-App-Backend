import { getIO } from "../../config/socket";
import { ISocketMessagePayload } from "../../interfaces";
import { MessageServices } from "./message.service";

const sendMessage = (socket: any) => {
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
    });

    const receiverId = message.conversation.members.find(
      (member) => member.userId !== userId,
    )?.userId!;

    getIO()
      .to(`conversation:${conversationId}`)
      .emit("message:new", message, async () => {
        if (connectedDevicesCount > 0) {
          try {
            await MessageServices.updateMessageDelivered(message.id);
          } catch (err) {
            console.error("Error updating message delivered status:", err);
          }
        }
      });
    getIO().to(`user-room:${receiverId}`).emit("notification:new", message);

    const userRoom = getIO().sockets.adapter.rooms.get(
      `user-room:${receiverId}`,
    );
    const connectedDevicesCount = userRoom ? userRoom.size : 0;
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
  sendMessage(socket);
  seenMessage(socket);
};

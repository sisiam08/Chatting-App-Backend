import { getIO } from "../../config/socket.config";
import { MessageServices } from "./message.service";

export const broadcastNewMessage = async (
  conversationId: string,
  userId: string,
  message: any,
) => {
  let finalMessage = message;

  const receiverId = message.conversation.members.find(
    (member: any) => member.userId !== userId,
  )?.userId!;

  const userRoom = getIO().sockets.adapter.rooms.get(`user-room:${receiverId}`);
  const isReceiverOnline = userRoom && userRoom.size > 0;

  if (isReceiverOnline) {
    try {
      finalMessage = await MessageServices.updateMessageDelivered(message.id);
    } catch (err) {
      console.error("Error updating message delivered status:", err);
    }
  }

  getIO()
    .to(`conversation:${conversationId}`)
    .emit("message:new", finalMessage);
  getIO().to(`user-room:${receiverId}`).emit("notification:new", finalMessage);
};

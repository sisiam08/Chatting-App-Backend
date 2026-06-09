import { getIO } from "../../socket/socket";
import { ICreateMessagePayload } from "../../interfaces";
import { prisma } from "../../lib/prisma";

const sendMessage = async ({
  conversationId,
  senderId,
  content,
}: ICreateMessagePayload) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });

  const io = getIO();

  io.to(`conversation:${conversationId}`).emit("message:new", {
    id: message.id,
    conversationId,
    senderId,
    content,
    createdAt: message.createdAt,
  });

  return message;
};

const getMessages = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const MessageServices = {
  sendMessage,
  getMessages,
};

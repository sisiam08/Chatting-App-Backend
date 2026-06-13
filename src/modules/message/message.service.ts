import { Prisma } from "../../generated/prisma/client";
import { ICreateMessagePayload } from "../../interfaces";
import { prisma } from "../../lib/prisma";

const sendMessage = async ({
  conversationId,
  userId,
  content,
}: ICreateMessagePayload) => {
  return await prisma.message.create({
    data: {
      conversationId,
      senderId: userId,
      content,
    },
    include: {
      conversation: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const getMessages = async (
  userId: string,
  participantId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const sorted = [userId, participantId].sort();

  const directKey = `${sorted[0]}:${sorted[1]}`;
  const conversation = await prisma.conversation.findFirst({
    where: {
      directKey,
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const data = await prisma.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    take: -(limit + 1),
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: {
      createdAt: "asc",
    },
  });

  let nextCursor: string | undefined = undefined;
  if (data.length > limit) {
    const nextMessage = data.shift();
    nextCursor = nextMessage?.id;
  }

  return {
    messages: data,
    nextCursor,
  };
};

const updateMessageDelivered = async (messageId: string) => {
  return await prisma.message.update({
    where: { id: messageId },
    data: {
      deliveredAt: new Date(),
    },
  });
};

const updateMessageSeen = async (conversationId: string, userId: string) => {
  return await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      seenAt: null,
    },
    data: {
      seenAt: new Date(),
    },
  });
};

const offlineMessages = async (userId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      conversation: {
        members: {
          some: {
            userId,
          },
        },
      },
      deliveredAt: null,
    },
    orderBy: {
      conversationId: "asc",
    },
  });

  messages.forEach(async (message) => {
    await updateMessageDelivered(message.id);
  });

  return messages;
};

export const MessageServices = {
  sendMessage,
  getMessages,
  updateMessageDelivered,
  updateMessageSeen,
  offlineMessages,
};

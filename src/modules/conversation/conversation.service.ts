import { ChatType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createOrGetDirectConversation = async (
  senderUserId: string,
  receiverUserId: string,
) => {
  const sorted = [senderUserId, receiverUserId].sort();

  const directKey = `${sorted[0]}:${sorted[1]}`;

  const existing = await prisma.conversation.findFirst({
    where: {
      directKey,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (existing) return existing;

  const conversation = await prisma.conversation.create({
    data: {
      type: ChatType.DIRECT,
      directKey,
      members: {
        create: [{ userId: senderUserId }, { userId: receiverUserId }],
      },
    },
    include: {
      members: true,
    },
  });

  return conversation;
};

const getConversationList = async (userId: string) => {
  const data = await prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      _count: {
        select: {
          messages: {
            where: {
              senderId: {
                not: userId,
              },
              seenAt: null,
            },
          },
        },
      },
      messages: {
        take: 1,
        select: {
          content: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      members: {
        where: {
          userId: { not: userId },
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  const formattedData = data.map((conversation) => ({
    id: conversation.id,
    unreadMessageCount: conversation._count.messages,
    lastMessage: conversation.messages[0]?.content || "",
    participant: conversation.members[0]?.user || null,
  }));
  return formattedData;
};

export const ConversationServices = {
  createOrGetDirectConversation,
  getConversationList,
};

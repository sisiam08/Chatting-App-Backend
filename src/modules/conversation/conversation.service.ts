import { ChatType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createOrGetDirectConversation = async (senderUserId: string, receiverUserId: string) => {
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

export const ConversationServices = {
  createOrGetDirectConversation,
};

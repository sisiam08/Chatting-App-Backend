import { prisma } from "../../lib/prisma";

const createOrGetDirectConversation = async (userA: string, userB: string) => {
  const sorted = [userA, userB].sort();

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
      type: "DIRECT",
      directKey,
      members: {
        create: [{ userId: userA }, { userId: userB }],
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

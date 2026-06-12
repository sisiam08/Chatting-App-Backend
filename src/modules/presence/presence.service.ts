import { prisma } from "../../lib/prisma";

const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: isOnline,
      ...(isOnline === false && { lastSeenAt: new Date() }),
    },
    select: {
      id: true,
      isOnline: true,
    },
  });
};

export const PresenceServices = {
  updateOnlineStatus,
};

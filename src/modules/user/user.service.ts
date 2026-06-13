import { ISearchUser, IUpdateUserInfo } from "../../interfaces/user.type";
import { prisma } from "../../lib/prisma";


const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

const getAllUsers = async (search?: ISearchUser, cursor?: string) => {
  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search.name,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search.email,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search.phone,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const limit: number = 10;

  const data = await prisma.user.findMany({
    where: { AND: andConditions },
    take: -(limit + 1),
    ...(cursor && { cursor: { id: cursor } }),
  });

  let nextCursor: string | undefined = undefined;
  if (data.length > limit) {
    const nextUser = data.shift();
    nextCursor = nextUser?.id;
  }
  return { data, cursor: nextCursor };
};

const updateUserInfo = async (userId: string, updateData: IUpdateUserInfo) => {
  const { name, phone, image } = updateData;

  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(image && { image }),
    },
  });
};

export const UserServices = {
  getUserById,
  getAllUsers,
  updateUserInfo,
};

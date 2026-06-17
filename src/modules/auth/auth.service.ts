import { UserRole } from "../../generated/prisma/enums";
import { IGoogleLogin } from "../../interfaces";
import { prisma } from "../../lib/prisma";

export const googleLogin = async (userInfo: IGoogleLogin) => {
  const { id, name, email, emailVerified, image, role } = userInfo;
  await prisma.user.create({
    data: {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      emailVerified: userInfo.emailVerified,
      role: userInfo.role as UserRole,
      ...(image && { image: userInfo.image }),
    },
  });
};

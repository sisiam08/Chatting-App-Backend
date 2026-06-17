import { NextFunction, Response } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { UserRole } from "../generated/prisma/enums";

export const auth_middleware = (role: UserRole[]) => {
  return [
    verifySession({ sessionRequired: true }),

    async (req: SessionRequest, res: Response, next: NextFunction) => {
      try {
        const session = req.session;

        if (!session) {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        }

        const sessionPayload = session.getAccessTokenPayload();

        const userInfo = {
          id: session.getUserId(),
          name: sessionPayload.name,
          email: sessionPayload.email,
          role: sessionPayload.role as UserRole,
        };

        if (role.length > 0 && !role.includes(userInfo.role)) {
          return res.status(403).json({
            success: false,
            message: "You don't have permission to access this resource",
          });
        }

        req.user = userInfo;

        next();
      } catch (error) {
        next(error);
      }
    },
  ];
};

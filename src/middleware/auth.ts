import { NextFunction, Request, Response } from "express";
import { UserRole } from "../generated/prisma/enums";
import { auth } from "../lib/auth";

export const auth_middleware = (role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email not verified. Please login with google.",
        });
      }

      if (role.length > 0 && !role.includes(session.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to access this resource",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as UserRole,
        emailVerified: session.user.emailVerified,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

import { UserRole } from "../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

export type * from "./route.type";
export type * from "./message.type";

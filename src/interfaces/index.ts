import { UserRole } from "../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export type * from "./route.type";
export type * from "./message.type";
export type * from "./user.type";
export type * from "./error.type";
export type * from "./auth.type";
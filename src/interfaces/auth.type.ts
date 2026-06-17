import { UserRole } from "../generated/prisma/enums";

export interface IGoogleLogin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  image?: string;
}

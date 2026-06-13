import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVar } from "../config/env";
import { UserRole } from "../generated/prisma/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: envVar.betterAuth.betterAuthUrl,
  trustedOrigins: [envVar.appUrl!, envVar.betterAuth.betterAuthUrl!],
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRole.USER,
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      isOnline: {
        type: "boolean",
        defaultValue: false,
        required: true,
      },
      lastSeenAt: {
        type: "date",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: envVar.google.gooleClientId!,
      clientSecret: envVar.google.gooleClientSecret!,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});

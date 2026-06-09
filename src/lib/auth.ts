import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVar } from "../config/env";

export const auth = betterAuth({
  baseURL: envVar.betterAuth.betterAuthUrl,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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

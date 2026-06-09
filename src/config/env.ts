import dotenv from "dotenv";

dotenv.config();

export const envVar = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URL,
  appUrl: process.env.APP_URL!,
  betterAuth: {
    betterAuthUrl: process.env.BETTER_AUTH_URL!,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  },
  google:{
    gooleClientId: process.env.GOOGLE_CLIENT_ID,
    gooleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }
};

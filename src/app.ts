import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVar } from "./config/env";
import { auth } from "./lib/auth";
import router from "./routes";

const app: Application = express();

app.use(
  cors({
    origin: [envVar.appUrl, envVar.betterAuth.betterAuthUrl],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

export default app;

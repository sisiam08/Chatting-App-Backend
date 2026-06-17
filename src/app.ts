import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVar } from "./config/env";
import router from "./routes";
import { notFoundMiddleware } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import { initSuperTokens } from "./config/supertokens.config";
import supertokens from "supertokens-node";

const app: Application = express();

initSuperTokens();

app.use(
  cors({
    origin: [envVar.appUrl, envVar.apiUrl],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", ...supertokens.getAllCORSHeaders()],
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use(middleware());

app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

app.use(notFoundMiddleware);

app.use(errorHandler());

app.use(globalErrorHandler);

export default app;

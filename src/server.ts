import http from "http";
import app from "./app";
import { envVar } from "./config/env";
import { initSocket } from "./socket/socket";

const bootstrap = async () => {
  try {
    const httpServer = http.createServer(app);

    initSocket(httpServer);

    httpServer.listen(envVar.port, () => {
      console.log(`Server is running on http://localhost:${envVar.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();

import { envVar } from "./config/env";
import app from "./app";

const bootstrap = async () => {
  try {
    app.listen(envVar.port, () => {
      console.log(`Server is running on http://localhost:${envVar.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();

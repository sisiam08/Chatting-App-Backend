import { Server } from "socket.io";
import http from "http";
import { envVar } from "../config/env";
import { registerConversationEvents } from "./events/conversation.events";
import { registerMessageEvents } from "./events/message.events";
import { registerPresenceEvents } from "./events/presence.events";

let io: Server;

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: [envVar.appUrl, envVar.betterAuth.betterAuthUrl],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    registerConversationEvents(socket);
    registerMessageEvents(socket);
    registerPresenceEvents(socket);
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

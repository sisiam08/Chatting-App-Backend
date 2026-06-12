import { Server } from "socket.io";
import http from "http";
import { envVar } from "./env";
import { socketAuth } from "../middleware/socketAuth";
import { MessageSocketEvents } from "../modules/message/message.events";
import { ConversationSocketEvents } from "../modules/conversation/conversation.events";
import { PresenceSocketEvents } from "../modules/presence/presence.events";

let io: Server;

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: [envVar.appUrl, envVar.betterAuth.betterAuthUrl],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    socket.join(`user-room:${socket.data.user.id}`);

    console.log("Socket Connected with :", {
      socketId: socket.id,
      userId: socket.data.user.id,
      userName: socket.data.user.name,
      userEmail: socket.data.user.email,
    });

    PresenceSocketEvents(socket);
    ConversationSocketEvents(socket);
    MessageSocketEvents(socket);
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

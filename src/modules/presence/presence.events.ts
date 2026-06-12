import { getIO } from "../../config/socket";
import { PresenceServices } from "./presence.service";

const onlineUser = async (socket: any) => {
  const userId = socket.data.user.id;
  const userRoom = getIO().sockets.adapter.rooms.get(`user-room:${userId}`);
  const connectedDevicesCount = userRoom ? userRoom.size : 0;

  if (connectedDevicesCount === 1) {
    try {
      const onlineStatus = await PresenceServices.updateOnlineStatus(userId, true);

      socket.broadcast.emit("user:status_change", {
        userId: onlineStatus.id,
        isOnline: onlineStatus.isOnline,
      });
    } catch (err) {
      console.error("Error updating online status:", err);
    }
  }
};

const offlineUser = (socket: any) => {
  socket.on("disconnect", async () => {
    const userId = socket.data.user.id;
    const userRoom = getIO().sockets.adapter.rooms.get(`user-room:${userId}`);
    const connectedDevicesCount = userRoom ? userRoom.size : 0;

    if (connectedDevicesCount === 0) {
      try {
        const offlineStatus = await PresenceServices.updateOnlineStatus(userId, false);

        getIO().emit("user:status_change", {
          userId: offlineStatus.id,
          isOnline: offlineStatus.isOnline,
        });
      } catch (err) {
        console.error("Error updating offline status:", err);
      }
    }
  });
};

export const PresenceSocketEvents = (socket: any) => {
  onlineUser(socket);
  offlineUser(socket);
};

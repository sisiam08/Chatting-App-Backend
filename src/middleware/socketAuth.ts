import { Socket } from "socket.io";
import cookie from "cookie";
import { auth } from "../lib/auth";

export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const handshakeCookies = socket.handshake.headers.cookie;

    if (!handshakeCookies) {
      throw new Error("No cookies found in handshake");
    }

    const parsedCookies = cookie.parse(handshakeCookies);

    const sessionToken = parsedCookies["better-auth.session_token"];

    if (!sessionToken) {
      throw new Error("No session token found in cookies");
    }

    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!session || !session.user) {
      throw new Error("Invalid session");
    }

    socket.data.user = session.user;

    next();
  } catch (error) {
    return next(new Error("Socket authentication failed"));
  }
};

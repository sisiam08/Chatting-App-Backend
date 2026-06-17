import { Socket } from "socket.io";
import cookie from "cookie";
import createAppError from "../errors/appError";
import status from "http-status";
import Session from "supertokens-node/recipe/session";

export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const handshakeCookies = socket.handshake.headers.cookie;

    if (!handshakeCookies) {
      createAppError("No cookies found in handshake", status.BAD_REQUEST);
      return;
    }

    const cookies = cookie.parse(handshakeCookies);

    const accessToken = cookies["sAccessToken"];
    const frontToken = cookies["sFrontToken"];

    if (!accessToken) {
      createAppError(
        "Authentication error: Access token missing",
        status.BAD_REQUEST,
      );
      return;
    }

    const session = await Session.getSessionWithoutRequestResponse(
      accessToken,
      frontToken,
    );

    if (!session) {
      createAppError("Invalid session", status.UNAUTHORIZED);
      return;
    }

    socket.data.userId = session.getUserId();

    next();
  } catch (error) {
    return next(new Error("Socket authentication failed"));
  }
};

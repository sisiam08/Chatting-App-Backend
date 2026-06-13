import { Router } from "express";
import { MessageControllers } from "./message.controller";
import { auth_middleware } from "../../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/:conversationId",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  MessageControllers.getMessages,
);

export const MessageRoutes = router;

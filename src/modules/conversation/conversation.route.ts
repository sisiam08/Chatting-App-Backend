import { Router } from "express";
import { ConversationControllers } from "./conversation.controller";
import { auth_middleware } from "../../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.post(
  "/direct",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  ConversationControllers.createOrGetDirectConversation,
);

router.get("/", auth_middleware([UserRole.USER, UserRole.ADMIN]), ConversationControllers.getConversationList);

export const ConversationRoutes = router;

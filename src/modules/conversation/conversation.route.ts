import { Router } from "express";
import { ConversationControllers } from "./conversation.controller";

const router = Router();

router.post("/direct", ConversationControllers.createOrGetDirectConversation);

export const ConversationRoutes = router;

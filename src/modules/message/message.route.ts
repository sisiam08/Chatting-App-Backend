import { Router } from "express";
import { MessageControllers } from "./message.controller";

const router = Router();


router.get("/:conversationId", MessageControllers.getMessages);

export const MessageRoutes = router;

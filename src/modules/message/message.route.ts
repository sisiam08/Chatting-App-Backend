import { Router } from "express";
import { MessageControllers } from "./message.controller";
import { auth_middleware } from "../../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";
import { handleMulterErrors, upload } from "../../config/multer.config";

const router = Router();

router.post(
  "/file-message",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  upload.single("file"),
  handleMulterErrors,
  MessageControllers.sendFileMessage,
);

router.get(
  "/:conversationId",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  MessageControllers.getMessages,
);

export const MessageRoutes = router;

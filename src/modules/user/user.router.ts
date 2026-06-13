import { Router } from "express";
import { UserControllers } from "./user.controller";
import { auth_middleware } from "../../middleware/auth";
import { UserRole } from "../../generated/prisma/enums";
import { handleMulterErrors, upload } from "../../config/multer.config";

const router = Router();

router.get(
  "/profile",
  auth_middleware([UserRole.USER]),
  UserControllers.getMyProfile,
);

router.get(
  "/:id",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  UserControllers.getUserById,
);

router.get(
  "/",
  auth_middleware([UserRole.USER, UserRole.ADMIN]),
  UserControllers.getAllUsers,
);

router.patch(
  "/",
  auth_middleware([UserRole.USER]),
  upload.single("image"),
  handleMulterErrors,
  UserControllers.updateUserInfo,
);

export const UserRoutes = router;

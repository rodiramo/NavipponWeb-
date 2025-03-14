import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authGuard, getNotifications);
router.put("/:notificationId/read", authGuard, markNotificationAsRead);

export default router;

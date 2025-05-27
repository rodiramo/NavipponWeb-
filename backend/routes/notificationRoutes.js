import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notificationController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authGuard, getNotifications);
router.delete("/", authGuard, clearAllNotifications);
router.delete("/:notificationId", authGuard, deleteNotification);

router.put("/:notificationId/read", authGuard, markNotificationAsRead);

export default router;

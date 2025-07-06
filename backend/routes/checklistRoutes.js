// routes/checklistRoutes.js
import express from "express";
import {
  getUserChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  bulkUpdateChecklistItems,
  getChecklistStats,
} from "../controllers/checklistController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.get("/:userId", getUserChecklist);
router.post("/", createChecklistItem);
router.put("/bulk-update", bulkUpdateChecklistItems);
router.put("/:itemId", updateChecklistItem);
router.delete("/:itemId", deleteChecklistItem);

router.get("/:userId/stats", getChecklistStats);

export default router;

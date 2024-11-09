import express from "express";
const router = express.Router();
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperience,
  updateExperience,
} from "../controllers/experienceControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/").post(authGuard, adminGuard, createExperience).get(getAllExperiences);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updateExperience)
  .delete(authGuard, adminGuard, deleteExperience)
  .get(getExperience);

export default router;
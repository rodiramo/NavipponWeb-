import express from "express";
const router = express.Router();
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperience,
  updateExperience,
  getExperienceById,
  getExperienceCount,
  getTopExperiences, 
} from "../controllers/experienceControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.route("/").post(authGuard, adminGuard, createExperience).get(getAllExperiences);
router.get("/count", authGuard, adminGuard, getExperienceCount);
router.get("/top", getTopExperiences);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updateExperience)
  .delete(authGuard, adminGuard, deleteExperience)
  .get(getExperience);
router.route("/id/:id").get(getExperienceById);

export default router;
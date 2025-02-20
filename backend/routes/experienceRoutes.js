import express from "express";
import upload from "../middleware/uploadPictureMiddleware.js";
const router = express.Router();

import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperience,
  updateExperience,
  getExperienceById,
} from "../controllers/experienceControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

// ✅ Create Experience (Upload Image First)
router.route("/").get(getAllExperiences);
router.post(
  "/",
  authGuard,
  adminGuard,
  upload.single("experiencePicture"),
  createExperience
);

// ✅ Update Experience (Upload Image First)
router
  .route("/:slug")
  .put(authGuard, adminGuard, updateExperience)
  .delete(authGuard, adminGuard, deleteExperience)
  .get(getExperience);

// ✅ Get Experience by ID
router.route("/id/:id").get(getExperienceById);

export default router;

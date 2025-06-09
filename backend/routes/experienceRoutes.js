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
  getExperienceCount,
  getTopExperiences,
} from "../controllers/experienceControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.get("/count", authGuard, getExperienceCount);
router.get("/top", getTopExperiences);

router
  .route("/")
  .post(
    authGuard,
    adminGuard,
    upload.single("experiencePicture"),
    createExperience
  )
  .get(getAllExperiences);

router
  .route("/:slug")
  .put(authGuard, adminGuard, updateExperience)
  .delete(authGuard, adminGuard, deleteExperience)
  .get(getExperience);

router.route("/id/:id").get(getExperienceById);

export default router;

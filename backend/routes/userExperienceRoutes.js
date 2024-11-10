import express from "express";
const router = express.Router();
import {
  createExperience,
  deleteExperience,
  updateExperience,
  getUserExperiences,
  getSingleUserExperience, // Importa la función para obtener una experiencia específica
} from "../controllers/userExperienceControllers";
import { authGuard } from "../middleware/authMiddleware";

// Rutas para los usuarios autenticados
router.route("/").post(authGuard, createExperience);
router.route("/user").get(authGuard, getUserExperiences);
router
  .route("/:slug")
  .get(authGuard, getSingleUserExperience) // Añade la ruta para obtener una experiencia específica
  .put(authGuard, updateExperience)
  .delete(authGuard, deleteExperience);

export default router;
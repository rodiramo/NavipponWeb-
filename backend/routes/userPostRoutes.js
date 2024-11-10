import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts, // Importa la nueva función
  getPost,
} from "../controllers/userPostControllers";
import { authGuard } from "../middleware/authMiddleware";

// Rutas para los usuarios autenticados
router.route("/").post(authGuard, createPost);
router.route("/user").get(authGuard, getUserPosts);
router
  .route("/:slug")
  .put(authGuard, updatePost)
  .delete(authGuard, deletePost)
  .get(getPost);

export default router;
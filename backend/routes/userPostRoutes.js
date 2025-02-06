import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,  
  getPost,
} from "../controllers/userPostControllers";
import { authGuard } from "../middleware/authMiddleware";

router.route("/").post(authGuard, createPost);
router.route("/user").get(authGuard, getUserPosts);
router
  .route("/:slug")
  .put(authGuard, updatePost)
  .delete(authGuard, deletePost)
  .get(getPost);

export default router;
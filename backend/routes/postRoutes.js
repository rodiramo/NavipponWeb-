import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  getPostCount,
  toggleSavePost,
  getSavedPosts,
  removeSavedPosts,
  checkIfPostSaved,
  getSavedPostsCount,
  clearAllSavedPosts,
} from "../controllers/postControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadPictureMiddleware.js";

// ✅ Ensure multer processes the image **before** reaching the controller
router.post("/", authGuard, upload.single("postPicture"), createPost);

// 🔖 Post-related save routes
router.post("/:postId/save", authGuard, toggleSavePost);
router.get("/:postId/saved", authGuard, checkIfPostSaved);

// 🔖 User saved posts routes
router.get("/users/saved-posts", authGuard, getSavedPosts);
router.delete("/users/saved-posts", authGuard, removeSavedPosts);
router.get("/users/saved-posts/count", authGuard, getSavedPostsCount);
router.delete("/users/saved-posts/clear", authGuard, clearAllSavedPosts);
router.route("/").get(getAllPosts);
router.get("/count", authGuard, adminGuard, getPostCount);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;

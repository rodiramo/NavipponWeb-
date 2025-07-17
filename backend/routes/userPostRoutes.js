import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getPost,
  toggleSavePost,
  getSavedPosts,
  removeSavedPosts,
  checkIfPostSaved,
  getSavedPostsCount,
  clearAllSavedPosts,
} from "../controllers/userPostControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadPictureMiddleware.js";

// ✅ Ensure multer processes the image **before** reaching the controller
router.post(
  "/",
  authGuard,
  (req, res, next) => {
    console.log("📥 Incoming Request Received! ✅");
    next();
  },
  upload.single("postPicture"),
  createPost
);

// 🔖 Post-related save routes
router.post("/users/:postId/save", authGuard, toggleSavePost);
router.get("/users/:postId/saved", authGuard, checkIfPostSaved);

// 🔖 User saved posts routes
router.get("/users/saved-posts", authGuard, getSavedPosts);
router.delete("/users/saved-posts", authGuard, removeSavedPosts);
router.get("/users/saved-posts/count", authGuard, getSavedPostsCount);
router.delete("/users/saved-posts/clear", authGuard, clearAllSavedPosts);

router.route("/user").get(authGuard, getUserPosts);
router
  .route("/:slug")
  .put(authGuard, upload.single("postPicture"), updatePost) // ✅ Ensure Multer for updates
  .delete(authGuard, deletePost)
  .get(getPost);

export default router;

import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  getPost,
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

router.route("/user").get(authGuard, getUserPosts);
router
  .route("/:slug")
  .put(authGuard, upload.single("postPicture"), updatePost) // ✅ Ensure Multer for updates
  .delete(authGuard, deletePost)
  .get(getPost);

export default router;

import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  getPostCount,
} from "../controllers/postControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadPictureMiddleware.js";

// ✅ Ensure multer processes the image **before** reaching the controller
router.post("/", authGuard, upload.single("postPicture"), createPost);

router.route("/").get(getAllPosts);
router.get("/count", authGuard, adminGuard, getPostCount);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;

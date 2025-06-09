import express from "express";
const router = express.Router();
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  getCommentCount,
} from "../controllers/commentControllers.js";  
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";  

router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);

router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);

router.get("/count", authGuard, adminGuard, getCommentCount);

export default router;

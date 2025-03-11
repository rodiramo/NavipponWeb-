import express from "express";
const router = express.Router();
import {
    createReview,
    deleteReview,
    getAllReviews,
    updateReview,
    getReviewCount
} from "../controllers/reviewControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

router
    .route("/")
    .post(authGuard, createReview)
    .get(authGuard, adminGuard, getAllReviews);

router
    .route("/:reviewId")
    .put(authGuard, updateReview)
    .delete(authGuard, deleteReview);

router.get("/count", authGuard, adminGuard, getReviewCount);

export default router;
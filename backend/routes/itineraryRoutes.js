import express from "express";
const router = express.Router();
import {
    createItinerary,
    getUserItineraries,
    getItinerary,
    getItineraryForEdit,
    updateItinerary,
    deleteItinerary,
} from "../controllers/itineraryControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";

router.route("/")
    .post(authGuard, createItinerary)
    .get(authGuard, getUserItineraries);

router.route("/:id")
    .get(authGuard, getItinerary)
    .patch(authGuard, updateItinerary)
    .delete(authGuard, deleteItinerary);

router.route("/:id/edit")
    .get(authGuard, getItineraryForEdit);

export default router;
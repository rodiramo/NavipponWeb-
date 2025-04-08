import express from "express";
const router = express.Router();
import {
  createItinerary,
  getUserItineraries,
  getItinerary,
  getItineraryForEdit,
  updateItinerary,
  deleteItinerary,
  leaveItinerary,
  getInvitedItineraries,
  addTraveler,
  updateTravelerRole,
  removeTraveler,
} from "../controllers/itineraryControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";

// Itinerary creation, listing, etc.
router
  .route("/")
  .post(authGuard, createItinerary)
  .get(authGuard, getUserItineraries);

// Leave itinerary
router.patch("/leave/:id", authGuard, leaveItinerary);

// Get itineraries where the user is invited
router.route("/invited").get(authGuard, getInvitedItineraries);

// Itinerary by ID (view, update, delete)
router
  .route("/:id")
  .get(authGuard, getItinerary)
  .patch(authGuard, updateItinerary)
  .delete(authGuard, deleteItinerary);

// For editing an itinerary (if needed)
router.route("/:id/edit").get(authGuard, getItineraryForEdit);

// New routes for traveler management
router.patch("/addTraveler/:id", authGuard, addTraveler);
router.patch("/updateTravelerRole/:id", authGuard, updateTravelerRole);
router.patch("/removeTraveler/:id", authGuard, removeTraveler);

export default router;

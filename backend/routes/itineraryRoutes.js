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

// Crear un nuevo itinerario y obtener todos los itinerarios del usuario autenticado
router.route("/")
    .post(authGuard, createItinerary)
    .get(authGuard, getUserItineraries);

// Obtener, actualizar y eliminar un itinerario por ID
router.route("/:id")
    .get(authGuard, getItinerary)
    .patch(authGuard, updateItinerary)
    .delete(authGuard, deleteItinerary);

// Obtener un itinerario por ID para edición
router.route("/:id/edit")
    .get(authGuard, getItineraryForEdit);

export default router;
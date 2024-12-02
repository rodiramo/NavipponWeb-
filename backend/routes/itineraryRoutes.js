const express = require('express');
const router = express.Router();
const {
    createItinerary,
    getUserItineraries,
    getItinerary,
    getItineraryWithDetails,
    updateItinerary,
    deleteItinerary,
    getDaysWithExperiences,
} = require('../controllers/itineraryControllers');
const { authGuard } = require('../middleware/authMiddleware');

// Rutas para itinerarios
router.post('/', authGuard, createItinerary);
router.get('/', authGuard, getUserItineraries);
router.get('/:id', authGuard, getItinerary);
router.get('/:id/details', authGuard, getItineraryWithDetails); // Nueva ruta para obtener los detalles del itinerario
router.put('/:id', authGuard, updateItinerary);
router.delete('/:id', authGuard, deleteItinerary);
router.get('/days/experiences', authGuard, getDaysWithExperiences);

module.exports = router;
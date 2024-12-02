const express = require('express');
const router = express.Router();
const {
    createDay,
    getDayById,
    updateDay,
    deleteDay,
    getDaysByItineraryId,
    getFavoriteHotels,
    getFavoriteAttractions,
    getFavoriteRestaurants,
    getDaysWithExperiences // Añadir la función getDaysWithExperiences
} = require('../controllers/dayControllers');
const { authGuard } = require('../middleware/authMiddleware');

// Rutas para días
router.post('/', authGuard, createDay);
router.get('/:id', authGuard, getDayById);
router.put('/:id', authGuard, updateDay);
router.delete('/:id', authGuard, deleteDay);
router.get('/itinerary/:itineraryId', authGuard, getDaysByItineraryId);

// Ruta para obtener días con experiencias
router.get('/with-experiences', authGuard, getDaysWithExperiences); // Añadir esta línea

// Rutas para favoritos por categoría
router.get('/favorites/hotels', authGuard, getFavoriteHotels);
router.get('/favorites/attractions', authGuard, getFavoriteAttractions);
router.get('/favorites/restaurants', authGuard, getFavoriteRestaurants);

module.exports = router;
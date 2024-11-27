const express = require('express');
const router = express.Router();
const { createItinerary, getItineraries, getItineraryById, updateItinerary, deleteItinerary, getFavoriteHotels, getFavoriteAttractions, getFavoriteRestaurants } = require('../controllers/itineraryControllers');
const { authGuard } = require('../middleware/authMiddleware');

router.post('/', authGuard, createItinerary);
router.get('/', authGuard, getItineraries);
router.get('/:id', authGuard, getItineraryById);
router.put('/:id', authGuard, updateItinerary);
router.delete('/:id', authGuard, deleteItinerary);
router.get('/favorites/hotels', authGuard, getFavoriteHotels);
router.get('/favorites/attractions', authGuard, getFavoriteAttractions);
router.get('/favorites/restaurants', authGuard, getFavoriteRestaurants);

module.exports = router;
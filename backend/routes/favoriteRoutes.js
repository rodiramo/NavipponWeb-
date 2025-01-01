const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getUserFavorites, getFavoritesCount } = require('../controllers/favoriteControllers');  
const { authGuard } = require('../middleware/authMiddleware');

router.post('/', authGuard, addFavorite);
router.delete('/', authGuard, removeFavorite);
router.get('/:userId', authGuard, getUserFavorites);
router.get('/count/:experienceId', getFavoritesCount); 
router.get('/user/:userId', authGuard, getUserFavorites); 

module.exports = router;
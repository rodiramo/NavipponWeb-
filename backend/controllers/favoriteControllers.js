const Favorite = require('../models/Favorite');

const addFavorite = async (req, res) => {
    try {
        const { userId, experienceId } = req.body;
        console.log("Datos recibidos en addFavorite:", { userId, experienceId });
        const favorite = new Favorite({ userId, experienceId });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        console.error("Error en addFavorite:", error);
        res.status(500).json({ error: 'Error al agregar a favoritos' });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { userId, experienceId } = req.body;
        console.log("Datos recibidos en removeFavorite:", { userId, experienceId });
        await Favorite.findOneAndDelete({ userId, experienceId });
        res.status(200).json({ message: 'Eliminado de favoritos' });
    } catch (error) {
        console.error("Error en removeFavorite:", error);
        res.status(500).json({ error: 'Error al eliminar de favoritos' });
    }
};

const getUserFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Datos recibidos en getUserFavorites:", { userId });
        const favorites = await Favorite.find({ userId }).populate('experienceId');
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error en getUserFavorites:", error);
        res.status(500).json({ error: 'Error al obtener los favoritos' });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getUserFavorites
};
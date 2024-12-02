const Day = require('../models/Day');
const Favorite = require('../models/Favorite');
const Experience = require('../models/Experience');

// Crear un nuevo día
const createDay = async (req, res, next) => {
    try {
        const { region, prefecture, date, hotel, activities, restaurants } = req.body;
        const userId = req.user._id;

        // Obtener los favoritos y verificar si están relacionados con la experiencia seleccionada
        const favorites = await Favorite.find({ userId, region, prefecture }).populate('experienceId');
        const selectedHotel = favorites.find(fav => fav._id.toString() === hotel);
        const selectedActivities = favorites.filter(fav => activities.includes(fav._id.toString()));
        const selectedRestaurants = favorites.filter(fav => restaurants.includes(fav._id.toString()));

        // Asegúrate de que el precio exista en experienceId
        const budget = 
            (selectedHotel && selectedHotel.experienceId && selectedHotel.experienceId.price ? selectedHotel.experienceId.price : 0) +
            selectedActivities.reduce((sum, fav) => sum + (fav.experienceId && fav.experienceId.price ? fav.experienceId.price : 0), 0) +
            selectedRestaurants.reduce((sum, fav) => sum + (fav.experienceId && fav.experienceId.price ? fav.experienceId.price : 0), 0);

        const newDay = new Day({
            date,
            region,
            prefecture,
            userId,
            hotel: selectedHotel ? selectedHotel._id : null,
            activities: selectedActivities.map(fav => fav._id),
            restaurants: selectedRestaurants.map(fav => fav._id),
            budget
        });

        await newDay.save();
        res.status(201).json(newDay);
    } catch (error) {
        console.error('Error creating day:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un día por ID
const getDayById = async (req, res, next) => {
    try {
        const day = await Day.findById(req.params.id);
        if (!day) {
            return res.status(404).json({ message: 'Día no encontrado' });
        }
        res.status(200).json(day);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un día
const updateDay = async (req, res, next) => {
    try {
        const updatedDay = await Day.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDay) {
            return res.status(404).json({ message: 'Día no encontrado' });
        }
        res.status(200).json(updatedDay);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un día
const deleteDay = async (req, res, next) => {
    try {
        const day = await Day.findByIdAndDelete(req.params.id);
        if (!day) {
            return res.status(404).json({ message: 'Día no encontrado' });
        }
        res.status(200).json({ message: 'Día eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los días de un itinerario
const getDaysByItineraryId = async (req, res, next) => {
    try {
        const days = await Day.find({ itineraryId: req.params.itineraryId });
        res.status(200).json(days);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener días con experiencias
const getDaysWithExperiences = async (req, res) => {
    try {
        const userId = req.query.userId;

        const days = await Day.find({ userId }).populate({
            path: 'hotel',
            model: 'Favorite',
            populate: {
                path: 'experienceId',
                model: 'Experience',
            },
        }).populate({
            path: 'activities',
            model: 'Favorite',
            populate: {
                path: 'experienceId',
                model: 'Experience',
            },
        }).populate({
            path: 'restaurants',
            model: 'Favorite',
            populate: {
                path: 'experienceId',
                model: 'Experience',
            },
        });

        // Filtrar datos inválidos
        const filteredDays = days.map(day => ({
            ...day.toObject(),
            activities: day.activities.filter(fav => fav.experienceId !== null),
            restaurants: day.restaurants.filter(fav => fav.experienceId !== null),
            hotel: day.hotel && day.hotel.experienceId ? day.hotel : null,
        }));

        console.log('Filtered days with experiences:', JSON.stringify(filteredDays, null, 2));
        res.status(200).json(filteredDays);
    } catch (error) {
        console.error('Error fetching days with experiences:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener favoritos por categoría
const getFavoritesByCategory = async (req, res) => {
    try {
        const { userId, region, prefecture, category } = req.query;
        const query = { userId };
        if (region) query.region = region;
        if (prefecture) query.prefecture = prefecture;
        if (category) query['experienceId.categories'] = category;
        const favorites = await Favorite.find(query).populate('experienceId');
        res.status(200).json(favorites);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFavoriteHotels = (req, res) => getFavoritesByCategory({ ...req, query: { ...req.query, category: 'Hoteles' } }, res);
const getFavoriteAttractions = (req, res) => getFavoritesByCategory({ ...req, query: { ...req.query, category: 'Atractivos' } }, res);
const getFavoriteRestaurants = (req, res) => getFavoritesByCategory({ ...req, query: { ...req.query, category: 'Restaurantes' } }, res);

module.exports = {
    createDay,
    getDayById,
    updateDay,
    deleteDay,
    getDaysByItineraryId,
    getDaysWithExperiences,
    getFavoriteHotels,
    getFavoriteAttractions,
    getFavoriteRestaurants
};
const Itinerary = require('../models/Itinerary');
const Favorite = require('../models/Favorite');

// Función para generar los días entre dos fechas
const generateDays = (startDate, endDate) => {
    const days = [];
    let currentDate = new Date(startDate);
    let dayNumber = 1;
    while (currentDate <= new Date(endDate)) {
        days.push({
            dayNumber: dayNumber,
            date: new Date(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
        dayNumber++;
    }
    return days;
};

const createItinerary = async (req, res) => {
    try {
        const { title, startDate, endDate, region, prefecture } = req.body;
        const validRegion = region || "Hokkaido";
        const validPrefecture = prefecture || "Hokkaido";

        const days = generateDays(startDate || new Date(), endDate || new Date());
        const itineraryDays = await Promise.all(days.map(async day => {
            const favorites = await Favorite.find({ userId: req.user._id, region: validRegion, prefecture: validPrefecture }).populate('experienceId');
            const hotel = favorites.find(fav => fav.experienceId && fav.experienceId.categories === 'Hoteles') || null;
            const activities = favorites.filter(fav => fav.experienceId && fav.experienceId.categories === 'Atractivos');
            const restaurants = favorites.filter(fav => fav.experienceId && fav.experienceId.categories === 'Restaurantes');

            const budget = (hotel ? hotel.experienceId.price : 0) +
                activities.reduce((sum, fav) => sum + fav.experienceId.price, 0) +
                restaurants.reduce((sum, fav) => sum + fav.experienceId.price, 0);

            return {
                ...day,
                region: validRegion,
                prefecture: validPrefecture,
                hotel: hotel ? hotel._id : null,
                activities: activities.map(fav => fav._id),
                restaurants: restaurants.map(fav => fav._id),
                budget,
                notes: ''
            };
        }));

        const totalBudget = itineraryDays.reduce((sum, day) => sum + day.budget, 0);

        const itinerary = new Itinerary({
            title: title || "Nuevo Itinerario",
            startDate: startDate || new Date(),
            endDate: endDate || new Date(),
            region: validRegion,
            prefecture: validPrefecture,
            userId: req.user._id,
            days: itineraryDays,
            totalBudget
        });

        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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

const getItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ userId: req.user._id });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getItineraryById = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
            .populate('days.hotel')
            .populate('days.activities')
            .populate('days.restaurants')
            .populate({
                path: 'days.hotel',
                populate: { path: 'experienceId' }
            })
            .populate({
                path: 'days.activities',
                populate: { path: 'experienceId' }
            })
            .populate({
                path: 'days.restaurants',
                populate: { path: 'experienceId' }
            });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerario no encontrado' });
        }
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateItinerary = async (req, res) => {
    try {
        const { title, startDate, endDate, days } = req.body;

        const generatedDays = generateDays(startDate || new Date(), endDate || new Date());

        const updatedDays = await Promise.all(generatedDays.map(async (generatedDay, index) => {
            const day = days[index] || {};
            const favorites = await Favorite.find({ userId: req.user._id, region: day.region, prefecture: day.prefecture }).populate('experienceId');
            const hotel = favorites.find(fav => fav.experienceId && fav.experienceId.categories === 'Hoteles') || null;
            const activities = day.activities.map(activityId => {
                const activity = favorites.find(fav => fav._id.toString() === activityId.toString() && fav.experienceId.categories === 'Atractivos');
                return activity ? activity._id : null;
            }).filter(Boolean);
            const restaurants = day.restaurants.map(restaurantId => {
                const restaurant = favorites.find(fav => fav._id.toString() === restaurantId.toString() && fav.experienceId.categories === 'Restaurantes');
                return restaurant ? restaurant._id : null;
            }).filter(Boolean);

            const budget = (hotel ? hotel.experienceId.price : 0) +
                activities.reduce((sum, activityId) => {
                    const activity = favorites.find(fav => fav._id.toString() === activityId.toString());
                    return sum + (activity ? activity.experienceId.price : 0);
                }, 0) +
                restaurants.reduce((sum, restaurantId) => {
                    const restaurant = favorites.find(fav => fav._id.toString() === restaurantId.toString());
                    return sum + (restaurant ? restaurant.experienceId.price : 0);
                }, 0);

            return {
                ...generatedDay,
                region: day.region || "Hokkaido",
                prefecture: day.prefecture || "Hokkaido",
                hotel: hotel ? hotel._id : null,
                activities,
                restaurants,
                budget,
                notes: day.notes || ''
            };
        }));

        const totalBudget = updatedDays.reduce((sum, day) => sum + day.budget, 0);

        const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, {
            title,
            startDate,
            endDate,
            days: updatedDays,
            totalBudget
        }, { new: true });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerario no encontrado' });
        }

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteItinerary = async (req, res, next) => {
    try {
        console.log("Deleting itinerary with id:", req.params.id);  
        const itinerary = await Itinerary.findByIdAndDelete(req.params.id);

        if (!itinerary) {
            const error = new Error("Itinerario no encontrado");
            return next(error);
        }

        return res.json({
            message: "El itinerario ha sido eliminado",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createItinerary,
    getFavoritesByCategory,
    getFavoriteHotels,
    getFavoriteAttractions,
    getFavoriteRestaurants,
    getItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary
};
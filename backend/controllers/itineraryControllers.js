const Itinerary = require('../models/Itinerary');
const Day = require('../models/Day');
const Favorite = require('../models/Favorite');
const Experience = require('../models/Experience');
const mongoose = require('mongoose');

// Crear un nuevo itinerario
const createItinerary = async (req, res, next) => {
    try {
        const { title, startDate, endDate } = req.body;
        const userId = req.user._id;

        const newItinerary = new Itinerary({
            title: title || "Nuevo Itinerario",
            startDate: startDate || new Date(),
            endDate: endDate || new Date(),
            userId,
            totalBudget: 0,
            days: []
        });

        const createdItinerary = await newItinerary.save();
        return res.json(createdItinerary);
    } catch (error) {
        next(error);
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

// Actualizar un itinerario
const updateItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            const error = new Error("Itinerario no encontrado");
            next(error);
            return;
        }

        const { title, startDate, endDate, days } = req.body;

        console.log('Updating itinerary with data:', { title, startDate, endDate, days });

        // Validar que los arrays estén definidos
        const validDays = days.map(day => ({
            ...day,
            activities: day.activities || [],
            restaurants: day.restaurants || [],
            hotel: day.hotel || null,
        }));

        // Actualizar los días y obtener sus IDs
        const dayIds = await Promise.all(validDays.map(async (day) => {
            if (day._id) {
                await Day.findByIdAndUpdate(day._id, day);
                return day._id;
            } else if (day.date || day.activities.length || day.restaurants.length || day.hotel) {
                const newDay = new Day({ ...day, userId: req.user._id });
                await newDay.save();
                return newDay._id;
            }
        }).filter(Boolean)); // Filtrar undefined

        console.log('Updated day IDs:', dayIds);

        // Calcular el presupuesto total sumando los presupuestos de los días
        const totalBudget = await Day.aggregate([
            { $match: { _id: { $in: dayIds.map(day => mongoose.Types.ObjectId(day)) } } },
            { $group: { _id: null, total: { $sum: "$budget" } } }
        ]);

        itinerary.title = title || itinerary.title;
        itinerary.startDate = startDate || itinerary.startDate;
        itinerary.endDate = endDate || itinerary.endDate;
        itinerary.days = dayIds;
        itinerary.totalBudget = totalBudget[0] ? totalBudget[0].total : 0;

        const updatedItinerary = await itinerary.save();
        console.log('Itinerary updated:', updatedItinerary);
        return res.json(updatedItinerary);
    } catch (error) {
        console.error('Error updating itinerary:', error);
        next(error);
    }
};

// Eliminar un itinerario
const deleteItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findByIdAndDelete(req.params.id);

        if (!itinerary) {
            const error = new Error("Itinerario no encontrado");
            return next(error);
        }

        // Eliminar los días asociados
        await Day.deleteMany({ _id: { $in: itinerary.days } });

        console.log('Itinerary and associated days deleted:', itinerary);
        return res.json({
            message: "Itinerario eliminado con éxito",
        });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        next(error);
    }
};

// Obtener un itinerario
const getItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate({
            path: 'days',
            populate: {
                path: 'hotel activities restaurants',
                populate: {
                    path: 'experienceId',
                    model: 'Experience'
                }
            }
        });

        if (!itinerary) {
            const error = new Error("Itinerario no encontrado");
            return next(error);
        }

        console.log('Fetched itinerary:', itinerary);
        return res.json(itinerary);
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        next(error);
    }
};

// Obtener todos los itinerarios del usuario
const getUserItineraries = async (req, res, next) => {
    try {
        const { searchKeyword, page, limit } = req.query;
        const query = {
            userId: req.user._id,
            title: { $regex: searchKeyword, $options: 'i' },
        };
        const itineraries = await Itinerary.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Itinerary.countDocuments(query);

        console.log('Fetched user itineraries:', itineraries);
        res.status(200).json({ data: itineraries, headers: { total } });
    } catch (error) {
        console.error('Error fetching user itineraries:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener un itinerario con detalles
const getItineraryWithDetails = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id).populate({
            path: 'days',
            model: 'Day',
            populate: [
                {
                    path: 'hotel',
                    model: 'Favorite',
                    populate: {
                        path: 'experienceId',
                        model: 'Experience',
                    },
                },
                {
                    path: 'activities',
                    model: 'Favorite',
                    populate: {
                        path: 'experienceId',
                        model: 'Experience',
                    },
                },
                {
                    path: 'restaurants',
                    model: 'Favorite',
                    populate: {
                        path: 'experienceId',
                        model: 'Experience',
                    },
                },
            ],
        });

        if (!itinerary) {
            const error = new Error("Itinerario no encontrado");
            return next(error);
        }

        console.log('Fetched itinerary with details:', itinerary);
        return res.json(itinerary);
    } catch (error) {
        console.error('Error fetching itinerary with details:', error);
        next(error);
    }
};

module.exports = {
    createItinerary,
    getUserItineraries,
    getItinerary,
    updateItinerary,
    deleteItinerary,
    getDaysWithExperiences,
    getItineraryWithDetails,
};
import Itinerary from "../models/Itinerary.js";
import Favorite from "../models/Favorite.js";
import Experience from "../models/Experience.js";
import {
  createItineraryUpdateNotification,
  createItineraryInviteNotification,
} from "../services/notificationService.js";

const createItinerary = async (req, res, next) => {
  try {
    const {
      name,
      travelDays,
      totalBudget,
      boards,
      notes,
      isPrivate,
      travelers, // array of objects: { userId, role }
    } = req.body;

    const itinerary = new Itinerary({
      name,
      travelDays,
      totalBudget,
      boards,
      notes,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      travelers: travelers || [],
      user: req.user._id,
    });

    const createdItinerary = await itinerary.save();

    // Notify each traveler added (if they are not the creator)
    if (travelers && travelers.length > 0) {
      // Assuming req.user has the creator's name
      const creatorId = req.user._id;
      const creatorName = req.user.name;
      for (let traveler of travelers) {
        // Only notify if the traveler is not the creator
        if (traveler.userId.toString() !== creatorId.toString()) {
          await createItineraryInviteNotification(
            creatorId,
            creatorName,
            createdItinerary._id,
            createdItinerary.name,
            traveler.userId,
            traveler.role
          );
        }
      }
    }

    return res.status(201).json(createdItinerary);
  } catch (error) {
    next(error);
  }
};

const getAllItineraries = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find()
      .populate("boards.favorites")
      .populate("user")
      .populate("travelers.userId"); // populate traveler info
    return res.status(200).json(itineraries);
  } catch (error) {
    next(error);
  }
};

const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate("user")
      .populate("travelers.userId");
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }

    const boardsWithFavorites = await Promise.all(
      itinerary.boards.map(async (board) => {
        const favoritesWithDetails = await Promise.all(
          board.favorites.map(async (favoriteId) => {
            const favorite = await Favorite.findById(favoriteId).populate(
              "experienceId"
            );
            if (!favorite || !favorite.experienceId) {
              console.error(
                `Invalid Favorite or missing experienceId: ${favoriteId}`
              );
              return null;
            }
            return {
              favoriteId: favorite._id,
              experience: favorite.experienceId,
            };
          })
        );
        return {
          ...board.toObject(),
          favorites: favoritesWithDetails.filter(Boolean),
        };
      })
    );

    return res
      .status(200)
      .json({ ...itinerary.toObject(), boards: boardsWithFavorites });
  } catch (error) {
    console.error("Error en getItinerary:", error);
    return next(error);
  }
};

const getItineraryForEdit = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate({
        path: "boards.favorites",
        populate: {
          path: "experienceId",
          model: "Experience",
        },
      })
      .populate("user")
      .populate("travelers.userId");
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Error en getItineraryForEdit:", error);
    return next(error);
  }
};

const updateItinerary = async (req, res, next) => {
  try {
    const {
      name,
      travelDays,
      totalBudget,
      boards,
      notes,
      isPrivate,
      travelers,
    } = req.body;
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }

    // Update itinerary fields
    itinerary.name = name || itinerary.name;
    itinerary.travelDays = travelDays || itinerary.travelDays;
    itinerary.totalBudget = totalBudget || itinerary.totalBudget;
    itinerary.boards = boards || itinerary.boards;
    itinerary.notes = notes || itinerary.notes;
    itinerary.isPrivate =
      isPrivate !== undefined ? isPrivate : itinerary.isPrivate;
    itinerary.travelers = travelers || itinerary.travelers;

    const updatedItinerary = await itinerary.save();

    // Notify all travelers (except the updater) about the update.
    // Assume req.user contains the updater's info.
    const updaterId = req.user._id;
    const updaterName = req.user.name;

    // Loop through the current travelers array (if any)
    if (updatedItinerary.travelers && updatedItinerary.travelers.length > 0) {
      for (let traveler of updatedItinerary.travelers) {
        // traveler.userId can be an ObjectId, so convert to string
        if (traveler.userId.toString() !== updaterId.toString()) {
          await createItineraryUpdateNotification(
            updaterId,
            updaterName,
            updatedItinerary._id,
            updatedItinerary.name,
            traveler.userId
          );
        }
      }
    }

    // Optionally, re-populate boards and favorites as in your original code before sending response.

    return res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error("Error en updateItinerary:", error);
    next(error);
  }
};

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    return res.status(200).json({ message: "Itinerario eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};

const getUserItineraries = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const itineraries = await Itinerary.find({ user: userId })
      .populate("boards.favorites")
      .populate("user")
      .populate("travelers.userId");
    return res.status(200).json(itineraries);
  } catch (error) {
    next(error);
  }
};

export {
  createItinerary,
  getAllItineraries,
  getItinerary,
  getItineraryForEdit,
  updateItinerary,
  deleteItinerary,
  getUserItineraries,
};

import Itinerary from "../models/Itinerary.js";
import Favorite from "../models/Favorite.js";
import Experience from "../models/Experience.js";
import {
  createItineraryUpdateNotification,
  createItineraryInviteNotification,
  createItineraryLeaveNotification,
  createTravelerRemovedNotification,
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
// In your itinerary controller
export const getInvitedItineraries = async (req, res, next) => {
  try {
    // Assuming the logged-in user's ID is available on req.user._id
    const userId = req.user._id;
    // Find itineraries where the travelers array contains this user.
    const itineraries = await Itinerary.find({ "travelers.userId": userId })
      .populate("user")
      .populate("travelers.userId");
    return res.status(200).json(itineraries);
  } catch (error) {
    next(error);
  }
};

export const leaveItinerary = async (req, res, next) => {
  try {
    // Get the itinerary by its ID and populate the owner field.
    const itinerary = await Itinerary.findById(req.params.id).populate("user");
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    // Get the logged-in user's ID and name from req.user.
    const userId = req.user._id;
    const userName = req.user.name;

    // Remove the current user from the travelers array.
    itinerary.travelers = itinerary.travelers.filter(
      (traveler) => traveler.userId.toString() !== userId.toString()
    );

    // Save the updated itinerary.
    await itinerary.save();

    // Create a notification for the itinerary's owner using the service.
    // This will notify the owner that userName left their itinerary.
    await createItineraryLeaveNotification({
      leavingUserId: userId,
      leavingUserName: userName,
      itineraryId: itinerary._id,
      itineraryName: itinerary.name,
      recipient: itinerary.user._id, // The owner of the itinerary.
    });

    res.status(200).json({ message: "Has salido del itinerario" });
  } catch (error) {
    console.error("Error leaving itinerary:", error);
    next(error);
  }
};

export const addTraveler = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const { userId, role } = req.body; // traveler is added by their id and assigned a role
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    // Check if traveler is already added
    if (itinerary.travelers.some((t) => t.userId.toString() === userId)) {
      return res
        .status(400)
        .json({ message: "El viajero ya ha sido agregado" });
    }
    // Add the traveler
    itinerary.travelers.push({ userId, role });
    await itinerary.save();

    // Send notification to the added traveler (if they're not the creator)
    if (userId !== req.user._id.toString()) {
      await createItineraryInviteNotification(
        req.user._id,
        req.user.name,
        itinerary._id,
        itinerary.name,
        userId,
        role
      );
    }

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
};

// Update a traveler's role
export const updateTravelerRole = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const { travelerId, role } = req.body; // travelerId is the id of the traveler object (or user id)
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    // Find the traveler and update their role
    const traveler = itinerary.travelers.find(
      (t) => t.userId.toString() === travelerId
    );
    if (!traveler) {
      return res.status(404).json({ message: "Viajero no encontrado" });
    }
    traveler.role = role;
    await itinerary.save();

    // Send notification to the traveler about the role update
    await createItineraryUpdateNotification(
      req.user._id,
      req.user.name,
      itinerary._id,
      itinerary.name,
      travelerId
    );

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
};

// Remove a traveler from an itinerary
export const removeTraveler = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const { travelerId } = req.body; // travelerId: the user id to remove
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }
    // Filter out the traveler
    const originalCount = itinerary.travelers.length;
    itinerary.travelers = itinerary.travelers.filter(
      (t) => t.userId.toString() !== travelerId
    );
    if (itinerary.travelers.length === originalCount) {
      return res
        .status(400)
        .json({ message: "El viajero no se encuentra en el itinerario" });
    }
    await itinerary.save();

    // Optionally, send a notification to the traveler that they were removed (if desired)
    (await createTravelerRemovedNotification) &&
      createTravelerRemovedNotification(
        req.user._id,
        req.user.name,
        itinerary._id,
        itinerary.name,
        travelerId
      );

    res.status(200).json(itinerary);
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

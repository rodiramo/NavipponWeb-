import Itinerary from "../models/Itinerary.js";
import Favorite from "../models/Favorite.js";
import Experience from "../models/Experience.js";
import {
  createItineraryUpdateNotification,
  createItineraryInviteNotification,
  createItineraryLeaveNotification,
  createTravelerRemovedNotification,
} from "../services/notificationService.js";
import asyncHandler from "express-async-handler";

const createItinerary = async (req, res, next) => {
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

    const itinerary = new Itinerary({
      name,
      travelDays,
      totalBudget: "",
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

    // Validate inputs
    if (!travelerId) {
      return res.status(400).json({ message: "ID del viajero es requerido" });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerario no encontrado" });
    }

    // Check if the user has permission to remove travelers
    const isOwner =
      itinerary.ownerId &&
      itinerary.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.admin; // Assuming you have admin field

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar viajeros" });
    }

    // Find the traveler before removing (to get their info for notification)
    const travelerToRemove = itinerary.travelers.find(
      (t) => t.userId.toString() === travelerId
    );

    if (!travelerToRemove) {
      return res.status(400).json({
        message: "El viajero no se encuentra en el itinerario",
      });
    }

    // Filter out the traveler
    const originalCount = itinerary.travelers.length;
    itinerary.travelers = itinerary.travelers.filter(
      (t) => t.userId.toString() !== travelerId
    );

    // Double-check removal worked
    if (itinerary.travelers.length === originalCount) {
      return res.status(400).json({
        message: "Error al eliminar el viajero del itinerario",
      });
    }

    await itinerary.save();

    // Create notification safely with proper error handling
    try {
      await createTravelerRemovedNotificationSafely({
        removedBy: req.user._id,
        removedByName: req.user.name,
        itineraryId: itinerary._id,
        itineraryName: itinerary.name,
        removedTravelerId: travelerId,
        travelerToRemove: travelerToRemove,
      });
    } catch (notificationError) {
      console.error(
        "Error creating traveler removed notification:",
        notificationError
      );
      // Don't fail the whole operation just because notification failed
    }

    res.status(200).json({
      message: "Viajero eliminado exitosamente",
      itinerary: itinerary,
    });
  } catch (error) {
    console.error("Error removing traveler:", error);
    next(error);
  }
};

// Helper function to safely create the notification
const createTravelerRemovedNotificationSafely = async (data) => {
  const {
    removedBy,
    removedByName,
    itineraryId,
    itineraryName,
    removedTravelerId,
    travelerToRemove,
  } = data;

  try {
    // Validate that we have a recipient
    if (!removedTravelerId) {
      console.error(
        "Cannot create notification: no recipient (removedTravelerId)"
      );
      return;
    }

    // Don't notify if user removed themselves
    if (removedBy.toString() === removedTravelerId.toString()) {
      console.log("User removed themselves, skipping notification");
      return;
    }

    // Create the notification with required recipient field
    const notificationData = {
      recipient: removedTravelerId, // ✅ This is the required field
      type: "traveler_removed",
      message: `Has sido eliminado del itinerario "${itineraryName}" por ${removedByName}`,
      itinerary: itineraryId,
      user: removedBy,
      read: false,
      createdAt: new Date(),
    };

    // Validate notification data before creating
    if (!notificationData.recipient) {
      throw new Error("Recipient is required for notification");
    }

    const notification = await Notification.create(notificationData);
    console.log(
      `Notification created successfully for traveler removal: ${notification._id}`
    );

    return notification;
  } catch (error) {
    console.error("Error in createTravelerRemovedNotificationSafely:", error);
    throw error;
  }
};

// Alternative: If you want to use your existing function, fix the call like this:
export const removeTravelerAlternative = async (req, res, next) => {
  try {
    const itineraryId = req.params.id;
    const { travelerId } = req.body;

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
      return res.status(400).json({
        message: "El viajero no se encuentra en el itinerario",
      });
    }

    await itinerary.save();

    // ✅ FIXED: Proper notification creation
    try {
      // Check if the function exists and call it properly
      if (typeof createTravelerRemovedNotification === "function") {
        await createTravelerRemovedNotification(
          req.user._id, // removedBy
          req.user.name, // removedByName
          itinerary._id, // itineraryId
          itinerary.name, // itineraryName
          travelerId // recipient (the removed traveler)
        );
      } else {
        console.warn(
          "createTravelerRemovedNotification function not available"
        );
      }
    } catch (notificationError) {
      console.error("Notification creation failed:", notificationError);
      // Continue with success response even if notification fails
    }

    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
};

const addExperienceToItinerary = asyncHandler(async (req, res) => {
  const { experienceId, boardDate } = req.body; // boardDate is optional, defaults to first board
  const itineraryId = req.params.id;
  const userId = req.user._id;

  try {
    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found");
    }

    // Check if user has permission to modify this itinerary
    const isOwner = itinerary.user.toString() === userId.toString();
    const isEditor = itinerary.travelers.some(
      (traveler) =>
        traveler.userId.toString() === userId.toString() &&
        traveler.role === "editor"
    );

    if (!isOwner && !isEditor) {
      res.status(403);
      throw new Error("Not authorized to modify this itinerary");
    }

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      res.status(404);
      throw new Error("Experience not found");
    }

    // Check if a favorite already exists for this experience and user
    let favorite = await Favorite.findOne({
      userId: userId,
      experienceId: experienceId,
    });

    // If no favorite exists, create one
    if (!favorite) {
      favorite = await Favorite.create({
        userId: userId,
        experienceId: experienceId,
      });
    }

    // Determine which board to add to
    let targetBoard;
    if (boardDate) {
      targetBoard = itinerary.boards.find((board) => board.date === boardDate);
      if (!targetBoard) {
        res.status(404);
        throw new Error("Board with specified date not found");
      }
    } else {
      // Use the first board if no date specified
      targetBoard = itinerary.boards[0];
      if (!targetBoard) {
        res.status(400);
        throw new Error("No boards found in itinerary");
      }
    }

    // Check if favorite is already in the board
    const favoriteExists = targetBoard.favorites.some(
      (fav) => fav.toString() === favorite._id.toString()
    );

    if (favoriteExists) {
      res.status(400);
      throw new Error("Experience already exists in this itinerary board");
    }

    // Add favorite to the board
    targetBoard.favorites.push(favorite._id);
    await itinerary.save();

    // Populate the itinerary for response
    await itinerary.populate({
      path: "boards.favorites",
      populate: {
        path: "experienceId",
        select: "title photo slug price",
      },
    });

    res.status(200).json({
      message: "Experience added to itinerary successfully",
      itinerary,
      boardDate: targetBoard.date,
      favoriteId: favorite._id,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeExperienceFromItinerary = asyncHandler(async (req, res) => {
  const { id: itineraryId, experienceId } = req.params;
  const { boardDate } = req.query; // Optional query parameter
  const userId = req.user._id;

  try {
    // Find the itinerary
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found");
    }

    // Check if user has permission to modify this itinerary
    const isOwner = itinerary.user.toString() === userId.toString();
    const isEditor = itinerary.travelers.some(
      (traveler) =>
        traveler.userId.toString() === userId.toString() &&
        traveler.role === "editor"
    );

    if (!isOwner && !isEditor) {
      res.status(403);
      throw new Error("Not authorized to modify this itinerary");
    }

    // Find the favorite for this experience and user
    const favorite = await Favorite.findOne({
      userId: userId,
      experienceId: experienceId,
    });

    if (!favorite) {
      res.status(404);
      throw new Error("Favorite not found");
    }

    let removedFromBoards = 0;

    // Remove from specific board if boardDate provided, otherwise remove from all boards
    if (boardDate) {
      const targetBoard = itinerary.boards.find(
        (board) => board.date === boardDate
      );
      if (!targetBoard) {
        res.status(404);
        throw new Error("Board with specified date not found");
      }

      const favoriteIndex = targetBoard.favorites.findIndex(
        (fav) => fav.toString() === favorite._id.toString()
      );

      if (favoriteIndex !== -1) {
        targetBoard.favorites.splice(favoriteIndex, 1);
        removedFromBoards = 1;
      }
    } else {
      // Remove from all boards
      itinerary.boards.forEach((board) => {
        const favoriteIndex = board.favorites.findIndex(
          (fav) => fav.toString() === favorite._id.toString()
        );
        if (favoriteIndex !== -1) {
          board.favorites.splice(favoriteIndex, 1);
          removedFromBoards++;
        }
      });
    }

    if (removedFromBoards === 0) {
      res.status(404);
      throw new Error("Experience not found in specified itinerary board(s)");
    }

    await itinerary.save();

    res.status(200).json({
      message: "Experience removed from itinerary successfully",
      removedFromBoards,
      boardDate: boardDate || "all boards",
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Check if experience exists in itinerary
// @route   GET /api/itineraries/:id/experiences/:experienceId/check
// @access  Private
const checkExperienceInItinerary = asyncHandler(async (req, res) => {
  const { id: itineraryId, experienceId } = req.params;
  const userId = req.user._id;

  try {
    // Find the itinerary and populate favorites with their experience details
    const itinerary = await Itinerary.findById(itineraryId).populate({
      path: "boards.favorites",
      populate: {
        path: "experienceId",
        select: "_id",
      },
    });

    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found");
    }

    // Check if user has access to this itinerary
    const isOwner = itinerary.user.toString() === userId.toString();
    const isTraveler = itinerary.travelers.some(
      (traveler) => traveler.userId.toString() === userId.toString()
    );

    if (!isOwner && !isTraveler) {
      res.status(403);
      throw new Error("Not authorized to access this itinerary");
    }

    let exists = false;
    let boards = [];
    let favoriteId = null;

    // Check each board for the experience
    itinerary.boards.forEach((board) => {
      board.favorites.forEach((favorite) => {
        // Check if this favorite's experience matches our target experience
        if (
          favorite.experienceId &&
          favorite.experienceId._id.toString() === experienceId.toString()
        ) {
          exists = true;
          boards.push(board.date);
          favoriteId = favorite._id;
        }
      });
    });

    console.log(
      `Check result for experience ${experienceId} in itinerary ${itineraryId}:`,
      {
        exists,
        boards,
        totalBoards: itinerary.boards.length,
      }
    );

    res.status(200).json({
      exists,
      boards,
      itineraryId,
      experienceId,
      favoriteId,
    });
  } catch (error) {
    console.error("Error in checkExperienceInItinerary:", error);
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get all experiences in itinerary (from all boards)
// @route   GET /api/itineraries/:id/experiences
// @access  Private
const getItineraryExperiences = asyncHandler(async (req, res) => {
  const itineraryId = req.params.id;
  const userId = req.user._id;

  try {
    // Find the itinerary and populate favorites with experience details
    const itinerary = await Itinerary.findById(itineraryId).populate({
      path: "boards.favorites",
      populate: {
        path: "experienceId",
        select:
          "title description photo price categories region prefecture slug ratings numReviews",
      },
    });

    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found");
    }

    // Check if user has access to this itinerary
    const isOwner = itinerary.user.toString() === userId.toString();
    const isTraveler = itinerary.travelers.some(
      (traveler) => traveler.userId.toString() === userId.toString()
    );

    if (!isOwner && !isTraveler) {
      res.status(403);
      throw new Error("Not authorized to access this itinerary");
    }

    // Collect all unique experiences from all boards
    const experienceMap = new Map();
    const boardExperiences = [];

    itinerary.boards.forEach((board) => {
      const boardData = {
        date: board.date,
        dailyBudget: board.dailyBudget,
        experiences: [],
      };

      board.favorites.forEach((favorite) => {
        if (favorite.experienceId) {
          const experience = favorite.experienceId;
          experienceMap.set(experience._id.toString(), experience);
          boardData.experiences.push({
            favoriteId: favorite._id,
            experience: experience,
          });
        }
      });

      boardExperiences.push(boardData);
    });

    const allExperiences = Array.from(experienceMap.values());

    res.status(200).json({
      boards: boardExperiences,
      allExperiences,
      totalExperiences: allExperiences.length,
      itineraryId,
      itineraryName: itinerary.name,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export {
  createItinerary,
  getAllItineraries,
  getItinerary,
  addExperienceToItinerary,
  removeExperienceFromItinerary,
  checkExperienceInItinerary,
  getItineraryExperiences,
  getItineraryForEdit,
  updateItinerary,
  deleteItinerary,
  getUserItineraries,
};

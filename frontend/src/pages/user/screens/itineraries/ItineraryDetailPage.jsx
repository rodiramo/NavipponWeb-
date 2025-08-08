import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DateChangeDialog from "./components/DateChangeDialog";
import OfflineManager from "./components/OfflineManager";

// DnD Kit imports with better collision detection
import {
  DndContext,
  closestCenter,
  closestCorners,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

// Components
import ExperienceDragPreview from "./components/ExperienceDragPreview";
import ScrollHeader from "../../../../components/ScrollHeader";
import ItineraryHeader from "./components/ItineraryHeader";
import BoardCard from "./components/ItineraryBoardCard";
import AddBoardCard from "./components/AddBoardCard";
import FavoritesDrawer from "./components/FavoritesDrawer";
import NotesModal from "./components/Notes";
import AddExperienceModal from "./components/AddExperienceModal";

// Hooks and Services
import useUser from "../../../../hooks/useUser";
import {
  getSingleItineraryForEdit,
  getUserFavorites,
  updateItinerary,
  addTravelerToItinerary,
  updateTravelerRole,
  removeTravelerFromItinerary,
  addExperienceToItinerary,
  removeExperienceFromItinerary,
} from "../../../../services/index/itinerary";
import { getUserFriends } from "../../../../services/index/users";

const ItineraryDetailPage = () => {
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const theme = useTheme();
  const [userRole, setUserRole] = useState("viewer");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, jwt } = useUser();

  // Enhanced DnD Kit sensors with better activation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slightly higher distance to prevent accidental drags
        tolerance: 5,
        delay: 100, // Small delay to distinguish from clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Enhanced collision detection function - much more aggressive board targeting
  const customCollisionDetection = (args) => {
    const { active, droppableContainers, collisionRect } = args;

    // Get the active item's type
    const activeId = active.id.toString();
    const isDraggingActivity =
      activeId.includes("-") &&
      !activeId.startsWith("board-") &&
      !activeId.startsWith("fav-");
    const isDraggingFavorite = activeId.startsWith("fav-");

    // For activities and favorites, we want to prioritize board-level drops
    if (isDraggingActivity || isDraggingFavorite) {
      const boardCollisions = [];

      // Check each board container for collision
      droppableContainers.forEach((container) => {
        const containerId = container.id.toString();
        if (containerId.startsWith("board-")) {
          const containerRect = container.rect.current;
          if (containerRect) {
            // Check if drag position overlaps with board area
            const isOverlapping =
              collisionRect.left < containerRect.right &&
              collisionRect.right > containerRect.left &&
              collisionRect.top < containerRect.bottom &&
              collisionRect.bottom > containerRect.top;

            if (isOverlapping) {
              // Calculate overlap area to prioritize the board with most overlap
              const overlapArea =
                Math.max(
                  0,
                  Math.min(collisionRect.right, containerRect.right) -
                    Math.max(collisionRect.left, containerRect.left)
                ) *
                Math.max(
                  0,
                  Math.min(collisionRect.bottom, containerRect.bottom) -
                    Math.max(collisionRect.top, containerRect.top)
                );

              boardCollisions.push({
                id: container.id,
                data: container.data,
                overlapArea,
              });
            }
          }
        }
      });

      // If we have board collisions, return the one with the largest overlap
      if (boardCollisions.length > 0) {
        boardCollisions.sort((a, b) => b.overlapArea - a.overlapArea);
        return [boardCollisions[0]];
      }
    }

    // Fallback to default collision detection for other cases
    const intersectionCollisions = rectIntersection(args);
    if (intersectionCollisions.length > 0) {
      return intersectionCollisions;
    }

    const cornerCollisions = closestCorners(args);
    if (cornerCollisions.length > 0) {
      return cornerCollisions;
    }

    return closestCenter(args);
  };

  // State
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
  const [addExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
  const [allExperiences, setAllExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [creator, setCreator] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [drawerFavorites, setDrawerFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [myRole, setMyRole] = useState("Invitado");
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);

  // Enhanced drag state for better visual feedback
  const [dragType, setDragType] = useState(null); // 'activity', 'favorite', 'board'
  const [dragOverBoard, setDragOverBoard] = useState(null);

  const [transportMode, setTransportMode] = useState("walking");
  const [showDistanceIndicators, setShowDistanceIndicators] = useState(true);
  const [showRouteOptimizer, setShowRouteOptimizer] = useState(true);
  const [boardTransportModes, setBoardTransportModes] = useState({});

  // Helper function to safely filter favorites
  const filterValidFavorites = (favoritesArray) => {
    if (!Array.isArray(favoritesArray)) return [];
    return favoritesArray.filter((fav) => {
      return fav && fav._id && fav.experienceId && fav.experienceId._id;
    });
  };

  // Computed values with null safety
  const groupedFavorites = drawerFavorites.reduce((groups, fav) => {
    if (!fav || !fav.experienceId) return groups;
    const cat = fav.experienceId.categories || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(fav);
    return groups;
  }, {});

  const isInvited = creator && user && String(creator._id) !== String(user._id);

  // Helper function to get the correct experience ID from different data structures
  const getExperienceId = (experience) => {
    if (experience.experienceId && experience.experienceId._id) {
      return experience.experienceId._id;
    } else if (experience._id) {
      return experience._id;
    } else {
      console.error("❌ Cannot extract experience ID from:", experience);
      return null;
    }
  };

  // Helper function to get the actual experience object
  const getExperienceObject = (experience) => {
    if (experience.experienceId) {
      return experience.experienceId;
    } else {
      return experience;
    }
  };

  // Check if experience already exists in board
  const isExperienceInBoard = (experience, boardFavorites) => {
    if (!boardFavorites || !Array.isArray(boardFavorites)) return false;

    const targetExperienceId = getExperienceId(experience);
    if (!targetExperienceId) return false;

    return boardFavorites.some((boardFav) => {
      const existingExpId = getExperienceId(boardFav);
      return existingExpId === targetExperienceId;
    });
  };

  // State for managing multiple additions with better concurrency control
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [pendingAdditions, setPendingAdditions] = useState(new Set());

  // Enhanced function to prevent concurrent additions
  const addExperienceWithQueue = async (experience, boardIndex) => {
    const experienceId = getExperienceId(experience);
    const queueKey = `${experienceId}-${boardIndex}`;

    if (pendingAdditions.has(queueKey)) {
      toast.error("Esta experiencia ya se está añadiendo");
      return;
    }

    try {
      setPendingAdditions((prev) => new Set([...prev, queueKey]));
      await new Promise((resolve) => setTimeout(resolve, 100));
      await performExperienceAddition(experience, boardIndex);
    } finally {
      setPendingAdditions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(queueKey);
        return newSet;
      });
    }
  };

  // Actual addition logic separated out
  const performExperienceAddition = async (experience, boardIndex) => {
    const targetBoard = boards[boardIndex];
    const experienceId = getExperienceId(experience);
    const experienceObj = getExperienceObject(experience);

    const toastId = `adding-${experienceId}-${Date.now()}`;
    toast.loading("Añadiendo experiencia...", { id: toastId });

    try {
      console.log("🚀 Adding experience to board:", {
        experienceId,
        experienceTitle: experienceObj.title,
        boardIndex,
        boardDate: targetBoard.date,
        itineraryId: id,
      });

      // OPTIMISTIC UPDATE - Add to UI immediately
      const optimisticFavorite = {
        _id: `temp-${Date.now()}`,
        experienceId: experienceObj,
        uniqueId: `${boardIndex}-${targetBoard.favorites.length}-temp`,
        isOptimistic: true,
      };

      const updatedBoards = [...boards];
      updatedBoards[boardIndex] = {
        ...targetBoard,
        favorites: [...targetBoard.favorites, optimisticFavorite],
      };
      setBoards(updatedBoards);

      console.log(
        "⚡ Optimistic update applied - experience should be visible"
      );

      await testDirectAPICallWithRetry(experience, boardIndex);

      console.log("🔄 Refreshing data from server...");
      await fetchItinerary();

      toast.success(`${experienceObj.title || "Experiencia"} añadida`, {
        id: toastId,
      });
      console.log("✅ Successfully added experience:", experienceObj.title);
    } catch (error) {
      console.error("❌ Error adding experience:", error);

      console.log("⏪ Rolling back optimistic update due to error");
      await fetchItinerary();

      let errorMessage = "Error al añadir experiencia";
      if (error.message) {
        if (error.message.includes("No matching document found")) {
          errorMessage = "Error de concurrencia. Intenta de nuevo.";
        } else if (error.message.includes("version")) {
          errorMessage = "Conflicto de versión. Intenta de nuevo.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage, { id: toastId });
      throw error;
    }
  };

  // Direct API call with retry logic for concurrency conflicts
  const testDirectAPICallWithRetry = async (
    experience,
    boardIndex,
    maxRetries = 3
  ) => {
    const targetBoard = boards[boardIndex];
    const experienceId = getExperienceId(experience);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔄 Attempt ${attempt}/${maxRetries} for experience ${experienceId}`
        );

        const requestBody = {
          experienceId: experienceId,
          boardDate: targetBoard.date,
        };

        const response = await fetch(
          `${API_URL}/api/itineraries/${id}/experiences`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        const responseText = await response.text();

        if (!response.ok) {
          const isVersionConflict =
            responseText.includes("No matching document found") ||
            responseText.includes("version");

          if (isVersionConflict && attempt < maxRetries) {
            console.log(
              `⚠️ Version conflict on attempt ${attempt}, retrying...`
            );
            await new Promise((resolve) => setTimeout(resolve, attempt * 200));
            continue;
          }

          throw new Error(responseText);
        }

        const result = JSON.parse(responseText);
        console.log(`✅ Success on attempt ${attempt}:`, result);
        return result;
      } catch (error) {
        const isVersionConflict =
          error.message.includes("No matching document found") ||
          error.message.includes("version");

        if (isVersionConflict && attempt < maxRetries) {
          console.log(
            `⚠️ Error on attempt ${attempt}, retrying:`,
            error.message
          );
          await new Promise((resolve) => setTimeout(resolve, attempt * 200));
          continue;
        }

        console.log(`❌ Final error on attempt ${attempt}:`, error);
        throw error;
      }
    }
  };

  // Main function to handle adding experience to board
  const handleAddExperienceToBoard = async (
    experience,
    targetBoardIndex = null,
    isFromModal = false
  ) => {
    if (!hasPermission("addExperience")) {
      toast.error("No tienes permisos para añadir experiencias");
      return;
    }

    if (!isEditable) return;

    if (isAddingExperience) {
      toast.error("Espera a que se complete la adición anterior");
      return;
    }

    const boardIndex =
      targetBoardIndex !== null
        ? targetBoardIndex
        : selectedBoardIndex !== null
          ? selectedBoardIndex
          : 0;

    if (!boards[boardIndex]) {
      toast.error("Selecciona un día válido para añadir la experiencia");
      return;
    }

    const experienceId = getExperienceId(experience);
    const experienceObj = getExperienceObject(experience);

    if (!experienceId || !experienceObj) {
      console.error("❌ Invalid experience object:", experience);
      toast.error("Error: experiencia inválida");
      return;
    }

    const targetBoard = boards[boardIndex];
    if (isExperienceInBoard(experience, targetBoard.favorites)) {
      toast.error("Esta experiencia ya está añadida en este día");
      return;
    }

    try {
      setIsAddingExperience(true);

      // Only use optimistic updates for modal additions, not drag & drop
      if (isFromModal) {
        await addExperienceWithOptimisticUpdate(experience, boardIndex);
      } else {
        await addExperienceWithQueue(experience, boardIndex);
      }
    } catch (error) {
      console.error("❌ Error in handleAddExperienceToBoard:", error);
    } finally {
      setIsAddingExperience(false);
    }
  };

  // Optimistic update version for modal additions
  const addExperienceWithOptimisticUpdate = async (experience, boardIndex) => {
    const targetBoard = boards[boardIndex];
    const experienceId = getExperienceId(experience);
    const experienceObj = getExperienceObject(experience);

    const toastId = `adding-${experienceId}-${Date.now()}`;
    toast.loading("Añadiendo experiencia...", { id: toastId });

    // Create optimistic update
    const optimisticFavorite = {
      _id: `temp-${Date.now()}`,
      experienceId: experienceObj,
      uniqueId: `${boardIndex}-${targetBoard.favorites.length}-temp`,
      isOptimistic: true,
    };

    // Apply optimistic update
    const updatedBoards = [...boards];
    updatedBoards[boardIndex] = {
      ...targetBoard,
      favorites: [...targetBoard.favorites, optimisticFavorite],
      dailyBudget: calculateDailyBudget({
        ...targetBoard,
        favorites: [...targetBoard.favorites, optimisticFavorite],
      }),
    };

    // Update total budget
    const newTotalBudget = updatedBoards.reduce(
      (sum, board) => sum + (board.dailyBudget || 0),
      0
    );

    setBoards(updatedBoards);
    setTotalBudget(newTotalBudget);

    try {
      await testDirectAPICallWithRetry(experience, boardIndex);
      await fetchItinerary(); // This will replace optimistic with real data
      toast.success(`${experienceObj.title || "Experiencia"} añadida`, {
        id: toastId,
      });
    } catch (error) {
      console.error("❌ Error adding experience:", error);
      await fetchItinerary(); // Rollback on error
      toast.error("Error al añadir experiencia", { id: toastId });
      throw error;
    }
  };

  const handleMoveBoard = async (fromIndex, toIndex) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para reordenar días");
      return;
    }

    if (toIndex < 0 || toIndex >= boards.length || fromIndex === toIndex) {
      return;
    }

    try {
      const baseDate =
        startDate || (boards[0]?.date ? new Date(boards[0].date) : new Date());
      let newBoards = [...boards];
      newBoards = arrayMove(newBoards, fromIndex, toIndex);

      newBoards = newBoards.map((board, index) => {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + index);
        return {
          ...board,
          date: newDate.toISOString().split("T")[0],
        };
      });

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      await updateItinerary(id, { boards: newBoards }, jwt);
      toast.success("Días reordenados y fechas actualizadas");
    } catch (error) {
      console.error("Error moving board:", error);
      toast.error("Error al reordenar días");
      fetchItinerary();
    }
  };

  // Enhanced handleMoveActivity function for manual up/down buttons
  const handleMoveActivity = async (boardIndex, fromIndex, toIndex) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para reordenar experiencias");
      return;
    }

    if (fromIndex === toIndex || toIndex < 0) return;

    const board = boards[boardIndex];
    if (!board || !board.favorites || toIndex >= board.favorites.length) return;

    try {
      console.log(
        `🔄 Manual move in board ${boardIndex}: ${fromIndex} → ${toIndex}`
      );

      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      const reorderedFavorites = arrayMove(
        targetBoard.favorites,
        fromIndex,
        toIndex
      );

      newBoards[boardIndex] = {
        ...targetBoard,
        favorites: reorderedFavorites.map((fav, index) => ({
          ...fav,
          uniqueId: `${boardIndex}-${index}-${fav._id}`,
        })),
      };

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      await updateItinerary(id, { boards: newBoards }, jwt);
      toast.success("Experiencia reordenada");
    } catch (error) {
      console.error("Error moving activity:", error);
      toast.error("Error al reordenar experiencia");
      fetchItinerary();
    }
  };

  const handlePrivacyToggle = async (newPrivateStatus) => {
    if (userRole !== "owner") {
      toast.error(
        "Solo el propietario puede cambiar la privacidad del itinerario"
      );
      return;
    }

    const previousStatus = isPrivate;
    setIsPrivate(newPrivateStatus);

    try {
      await updateItinerary(id, { isPrivate: newPrivateStatus }, jwt);
      toast.success(
        newPrivateStatus
          ? "Itinerario marcado como privado"
          : "Itinerario marcado como público"
      );
    } catch (error) {
      console.error("Error updating privacy:", error);
      toast.error("Error al cambiar la privacidad del itinerario");
      setIsPrivate(previousStatus);
    }
  };

  // Helper function to calculate daily budget for a board
  const calculateDailyBudget = (board) => {
    if (!board || !Array.isArray(board.favorites)) {
      console.log("💰 No board or favorites found");
      return 0;
    }

    console.log(
      `💰 Calculating budget for board with ${board.favorites.length} experiences`
    );

    return board.favorites.reduce((sum, favorite, index) => {
      const experience = getExperienceObject(favorite);
      const price = experience?.price || 0;
      console.log(
        `💰 Experience ${index + 1}: "${experience?.title}" - Price: ¥${price} (type: ${typeof price})`
      );

      // Handle case where price might be a string
      const numericPrice =
        typeof price === "string" ? parseFloat(price) || 0 : price;

      return sum + numericPrice;
    }, 0);
  };

  // Enhanced function to calculate and update budgets
  const updateTotalBudget = async (boardsArray, shouldSave = false) => {
    if (!Array.isArray(boardsArray)) return;

    // Calculate daily budget for each board and update the boards
    const updatedBoards = boardsArray.map((board, index) => {
      const dailyBudget = calculateDailyBudget(board);
      console.log(`💰 Board ${index + 1} daily budget: ¥${dailyBudget}`);
      return {
        ...board,
        dailyBudget: dailyBudget,
      };
    });

    // Calculate total budget
    const total = updatedBoards.reduce(
      (sum, board) => sum + (board?.dailyBudget || 0),
      0
    );

    console.log(`💰 Total budget calculated: ¥${total}`);

    // Update state with boards that have correct daily budgets
    setBoards(updatedBoards);
    setTotalBudget(total);

    if (shouldSave) {
      try {
        await updateItinerary(
          id,
          {
            boards: updatedBoards,
            totalBudget: total,
          },
          jwt
        );
        console.log("Total budget and boards saved to database:", total);
      } catch (error) {
        console.error("Error saving total budget:", error);
      }
    }

    return total;
  };

  // Handle route optimization/reordering
  const handleReorderExperiences = async (boardIndex, optimizedRoute) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para reordenar experiencias");
      return;
    }

    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      if (!targetBoard) {
        toast.error("Día no encontrado");
        return;
      }

      targetBoard.favorites = optimizedRoute.map((experience, index) => ({
        ...experience,
        uniqueId: `${boardIndex}-${index}-${experience._id}`,
      }));

      targetBoard.dailyBudget = targetBoard.favorites.reduce(
        (sum, fav) => sum + (fav.experienceId?.price || 0),
        0
      );

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      await updateItinerary(id, { boards: newBoards }, jwt);

      toast.success("Ruta optimizada aplicada correctamente");
    } catch (error) {
      console.error("Error optimizing route:", error);
      toast.error("Error al optimizar la ruta");
      fetchItinerary();
    }
  };

  const handleAddBoard = async () => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para añadir días");
      return;
    }

    const newBoard = {
      id: `board-${Date.now()}`,
      date: new Date(Date.now() + boards.length * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      favorites: [],
      dailyBudget: 0,
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);

    try {
      await updateItinerary(
        id,
        {
          boards: updatedBoards,
          travelDays: updatedBoards.length,
        },
        jwt
      );
      toast.success("Nuevo día añadido");
    } catch (error) {
      console.error("Error adding new board", error);
      toast.error("Error al añadir nuevo día");
      setBoards(boards);
      setTravelDays(boards.length);
      updateTotalBudget(boards);
    }
  };

  const handleRemoveBoard = async (index) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para eliminar días");
      return;
    }

    const updatedBoards = boards.filter((_, i) => i !== index);
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);

    try {
      await updateItinerary(
        id,
        {
          boards: updatedBoards,
          travelDays: updatedBoards.length,
        },
        jwt
      );
      toast.success("Día eliminado");
    } catch (error) {
      console.error("Error removing board", error);
      toast.error("Error al eliminar día");
      setBoards(boards);
      setTravelDays(boards.length);
      updateTotalBudget(boards);
    }
  };

  const formatDateForLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleUpdateItineraryDates = async (newStartDate) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para cambiar las fechas");
      return;
    }

    try {
      const baseDate = new Date(newStartDate);
      const updatedBoards = boards.map((board, index) => {
        const boardDate = new Date(baseDate);
        boardDate.setDate(boardDate.getDate() + index);
        const boardDateString = formatDateForLocal(boardDate);

        return {
          ...board,
          date: boardDateString,
        };
      });

      setBoards(updatedBoards);
      setStartDate(baseDate);

      const newTotalBudget = updatedBoards.reduce(
        (sum, board) => sum + (board?.dailyBudget || 0),
        0
      );

      await updateItinerary(
        id,
        {
          date: baseDate.toISOString(),
          boards: updatedBoards,
          totalBudget: newTotalBudget,
        },
        jwt
      );

      toast.success("Fechas del itinerario actualizadas");
      setIsEditingDates(false);
    } catch (error) {
      console.error("Error updating itinerary dates:", error);
      toast.error("Error al actualizar las fechas");
      fetchItinerary();
    }
  };

  const fetchItinerary = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      console.log("🔄 Fetching itinerary data...");
      const data = await getSingleItineraryForEdit(id, jwt);

      console.log("📦 Raw itinerary data:", data);
      console.log("📦 Boards in response:", data.boards);

      setName(data.name || "");
      setTravelDays(data.travelDays || 0);
      setIsPrivate(data.isPrivate || false);

      const boardsWithIds = (data.boards || []).map((board, index) => {
        console.log(`📦 Processing board ${index}:`, board);
        console.log(`📦 Board favorites:`, board.favorites);

        // Calculate the correct daily budget for this board
        const dailyBudget = (board.favorites || []).reduce((sum, favorite) => {
          const experience = favorite.experienceId || favorite;
          const price = experience?.price || 0;
          const numericPrice =
            typeof price === "string" ? parseFloat(price) || 0 : price;
          return sum + numericPrice;
        }, 0);

        return {
          ...board,
          id: board.id || board._id || `board-${index}`,
          date: board.date
            ? board.date.split("T")[0]
            : formatDateForLocal(
                new Date(Date.now() + index * 24 * 60 * 60 * 1000)
              ),
          favorites: Array.isArray(board.favorites) ? board.favorites : [],
          dailyBudget: dailyBudget, // Set the calculated daily budget
        };
      });

      console.log("🎯 Processed boards:", boardsWithIds);

      // Calculate total budget from the processed boards
      const totalBudget = boardsWithIds.reduce(
        (sum, board) => sum + (board.dailyBudget || 0),
        0
      );

      setBoards(boardsWithIds);
      setTotalBudget(totalBudget);

      console.log("💰 Total budget from fetch:", totalBudget);

      setTravelers(data.travelers || []);
      setNotes(data.notes || []);

      const parsedStartDate = data.date
        ? new Date(data.date + "T00:00:00")
        : null;
      setStartDate(parsedStartDate);

      setCreator(data.user || null);

      let role = "viewer";
      if (String(data.user?._id) === String(user._id)) {
        role = "owner";
      } else {
        const traveler = data.travelers?.find(
          (t) => String(t.userId?._id || t.userId) === String(user._id)
        );
        if (traveler) {
          role = traveler.role || "viewer";
        }
      }

      setUserRole(role);
      const editable = role === "owner" || role === "editor";
      setIsEditable(editable);
      setMyRole(
        role === "owner"
          ? "Propietario"
          : role === "editor"
            ? "Editor"
            : "Invitado"
      );

      console.log("✅ Itinerary data updated successfully");
    } catch (error) {
      console.error("Error fetching itinerary", error);
      toast.error("Error loading itinerary");
    }
  }, [id, jwt, user]);

  // Effects
  useEffect(() => {
    if (id && jwt && user?._id) {
      fetchItinerary();
    }
  }, [id, jwt, user?._id, fetchItinerary]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id || !jwt) return;

      try {
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        const validFavorites = filterValidFavorites(data);
        setFavorites(validFavorites);
        setDrawerFavorites(validFavorites);
      } catch (error) {
        console.error("Error fetching favorites", error);
        setFavorites([]);
        setDrawerFavorites([]);
      }
    };

    fetchFavorites();
  }, [user?._id, jwt]);

  // Debug useEffect to monitor board state
  useEffect(() => {
    console.log(
      "🔍 Current boards state:",
      boards.map((board, index) => ({
        boardIndex: index,
        boardId: board._id || board.id,
        favoritesCount: board.favorites?.length || 0,
        dailyBudget: board.dailyBudget || 0,
        activityIds: (board.favorites || []).map(
          (fav, favIndex) => `${index}-${favIndex}-${fav._id}`
        ),
      }))
    );

    // Log total budget for debugging
    const currentTotal = boards.reduce(
      (sum, board) => sum + (board.dailyBudget || 0),
      0
    );
    console.log("💰 Current total budget from boards:", currentTotal);
  }, [boards]);

  const hasPermission = (action) => {
    const permissions = {
      viewer: {
        view: true,
        viewMap: true,
        edit: false,
        delete: false,
        addExperience: false,
        removeExperience: false,
        dragDrop: false,
        manageTravelers: false,
        addNotes: true,
      },
      editor: {
        view: true,
        viewMap: true,
        edit: true,
        delete: false,
        addExperience: true,
        removeExperience: true,
        dragDrop: true,
        manageTravelers: false,
        addNotes: true,
      },
      owner: {
        view: true,
        viewMap: true,
        edit: true,
        delete: true,
        addExperience: true,
        removeExperience: true,
        dragDrop: true,
        manageTravelers: true,
        addNotes: true,
      },
    };

    return permissions[userRole]?.[action] || false;
  };

  const fetchAllExperiences = useCallback(async () => {
    setLoadingExperiences(true);
    try {
      const response = await fetch(`${API_URL}/api/experiences/modal`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch experiences");
      }

      const data = await response.json();
      console.log("Total experiences fetched:", data.length);
      setAllExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Error al cargar experiencias");
      setAllExperiences([]);
    } finally {
      setLoadingExperiences(false);
    }
  }, [jwt, API_URL]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id || !jwt) return;

      try {
        const data = await getUserFriends({ userId: user._id, token: jwt });
        setFriendsList(data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriendsList([]);
      }
    };

    fetchFriends();
  }, [user?._id, jwt]);

  const handleBoardAddExperience = (boardIndex) => {
    setSelectedBoardIndex(boardIndex);
    setAddExperienceModalOpen(true);
  };

  const handleAddExperienceWithBoardSelection = async (experience) => {
    const targetBoardIndex = selectedBoardIndex;

    if (targetBoardIndex !== null) {
      await handleAddExperienceToBoard(experience, targetBoardIndex, true); // true = isFromModal
      return;
    }

    if (boards.length === 1) {
      await handleAddExperienceToBoard(experience, 0, true); // true = isFromModal
    } else if (boards.length > 1) {
      const boardOptions = boards
        .map((board, index) => {
          const date = new Date(board.date).toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          return `Día ${index + 1} (${date})`;
        })
        .join("\n");

      const selection = window.prompt(
        `Selecciona el día para añadir "${experience.title}":\n\n${boardOptions}\n\nIngresa el número del día (1-${boards.length}):`
      );

      if (selection) {
        const boardIndex = parseInt(selection) - 1;
        if (boardIndex >= 0 && boardIndex < boards.length) {
          await handleAddExperienceToBoard(experience, boardIndex, true); // true = isFromModal
        } else {
          toast.error("Selección inválida");
        }
      }
    } else {
      toast.error("Primero crea al menos un día en tu itinerario");
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setIsEditingName(false);
    try {
      await updateItinerary(id, { name }, jwt);
    } catch (error) {
      console.error("Error updating itinerary name", error);
      toast.error("Error updating name");
    }
  };

  const handleRemoveFavorite = async (boardIndex, favoriteIndex) => {
    if (!hasPermission("removeExperience")) {
      toast.error("No tienes permisos para eliminar experiencias");
      return;
    }

    try {
      const board = boards[boardIndex];
      const favorite = board.favorites[favoriteIndex];

      if (!favorite) {
        toast.error("Error: experiencia inválida");
        return;
      }

      const experienceId = getExperienceId(favorite);

      if (!experienceId) {
        console.error("❌ Could not extract experience ID from:", favorite);
        toast.error("Error: ID de experiencia inválido");
        return;
      }

      await removeExperienceFromItinerary({
        itineraryId: id,
        experienceId: experienceId,
        boardDate: board.date,
        token: jwt,
      });

      // Refresh the itinerary data
      await fetchItinerary();
      toast.success("Experiencia eliminada");
    } catch (error) {
      console.error("Error removing experience:", error);
      toast.error("Error al eliminar experiencia");
    }
  };

  const handleAddTraveler = async (friendId, role) => {
    if (!hasPermission("manageTravelers")) {
      toast.error("Solo el propietario puede añadir compañeros");
      return;
    }
    try {
      await addTravelerToItinerary(id, { userId: friendId, role }, jwt);
      toast.success("Compañero añadido");
      fetchItinerary();
    } catch (error) {
      toast.error("Error al añadir compañero");
      console.error(error);
    }
  };

  const handleUpdateTraveler = async (travelerId, newRole) => {
    try {
      await updateTravelerRole(id, travelerId, newRole, jwt);
      toast.success("Rol actualizado");
      fetchItinerary();
    } catch (error) {
      toast.error("Error al actualizar rol");
      console.error(error);
    }
  };

  const handleRemoveTraveler = async (travelerId) => {
    try {
      await removeTravelerFromItinerary(id, travelerId, jwt);
      toast.success("Compañero eliminado");
      fetchItinerary();
    } catch (error) {
      toast.error("Error al eliminar compañero");
      console.error(error);
    }
  };

  const handleTransportModeChange = useCallback(
    (newMode, boardIndex = null) => {
      if (boardIndex !== null) {
        setBoardTransportModes((prev) => ({
          ...prev,
          [boardIndex]: newMode,
        }));
      } else {
        setTransportMode(newMode);
        setBoardTransportModes({});
      }
    },
    []
  );

  const getTransportModeForBoard = useCallback(
    (boardIndex) => {
      return boardTransportModes[boardIndex] || transportMode;
    },
    [boardTransportModes, transportMode]
  );

  const handleToggleChecklistItem = async (itemId) => {
    if (!hasPermission("addNotes")) {
      toast.error("No tienes permisos para modificar la lista");
      return;
    }

    try {
      const updatedNotes = notes.map((note) =>
        note._id === itemId ? { ...note, completed: !note.completed } : note
      );

      setNotes(updatedNotes);
      await updateItinerary(id, { notes: updatedNotes }, jwt);
      toast.success("Tarea actualizada");
    } catch (error) {
      console.error("Error updating checklist item:", error);
      toast.error("Error al actualizar la tarea");
      fetchItinerary();
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    if (!hasPermission("addNotes")) {
      toast.error("No tienes permisos para eliminar tareas");
      return;
    }

    try {
      const updatedNotes = notes.filter((note) => note._id !== itemId);
      await updateItinerary(id, { notes: updatedNotes }, jwt);
      setNotes(updatedNotes);
      toast.success("Tarea eliminada");
    } catch (error) {
      console.error("Error deleting checklist item:", error);
      toast.error("Error al eliminar la tarea");
    }
  };

  const handleEditChecklistItem = async (itemId, newText) => {
    if (!hasPermission("addNotes")) {
      toast.error("No tienes permisos para editar tareas");
      return;
    }

    try {
      const updatedNotes = notes.map((note) =>
        note._id === itemId ? { ...note, text: newText } : note
      );

      await updateItinerary(id, { notes: updatedNotes }, jwt);
      setNotes(updatedNotes);
      toast.success("Tarea actualizada");
    } catch (error) {
      console.error("Error editing checklist item:", error);
      toast.error("Error al editar la tarea");
      fetchItinerary();
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user?._id) return;

    const checklistItem = {
      text: newNote,
      completed: false,
      author: user.name || user._id,
    };

    const updatedNotes = [...notes, checklistItem];
    setNotes(updatedNotes);

    try {
      await updateItinerary(id, { notes: updatedNotes }, jwt);
      toast.success("Tarea añadida");
    } catch (error) {
      console.error("Error adding checklist item:", error);
      toast.error("Error al añadir tarea");
      setNotes(notes);
    }

    setNewNote("");
    setNotesModalOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedPrefecture("All");
    setDrawerFavorites(favorites);
  };

  useEffect(() => {
    if (addExperienceModalOpen && allExperiences.length === 0) {
      fetchAllExperiences();
    }
  }, [addExperienceModalOpen, allExperiences.length, fetchAllExperiences]);

  // ENHANCED: Improved drag start with better type detection
  const handleDragStart = (event) => {
    setActiveId(event.active.id);

    const dragData = event.active.data?.current;
    if (dragData) {
      setActiveData(dragData);
      setDragType(dragData.type);
    } else {
      const activeIdStr = event.active.id.toString();

      if (activeIdStr.startsWith("fav-")) {
        // Dragging from favorites drawer
        const favoriteId = activeIdStr.replace("fav-", "");
        const favorite = drawerFavorites.find((fav) => fav._id === favoriteId);
        if (favorite) {
          setActiveData({ favorite, type: "favorite" });
          setDragType("favorite");
        }
      } else if (activeIdStr.startsWith("board-")) {
        // Dragging a board
        setDragType("board");
        setActiveData({ type: "board" });
      } else if (
        activeIdStr.includes("-") &&
        !activeIdStr.startsWith("board-") &&
        !activeIdStr.startsWith("fav-")
      ) {
        // Enhanced activity parsing - this is dragging an activity/experience
        const parts = activeIdStr.split("-");
        if (parts.length >= 3) {
          const boardIndex = parseInt(parts[0]);
          const favIndex = parseInt(parts[1]);

          if (
            !isNaN(boardIndex) &&
            !isNaN(favIndex) &&
            boards[boardIndex]?.favorites?.[favIndex]
          ) {
            const favorite = boards[boardIndex].favorites[favIndex];
            setActiveData({
              favorite,
              type: "activity",
              boardIndex,
              favIndex,
            });
            setDragType("activity");

            console.log(
              `🎯 Dragging activity from board ${boardIndex}, position ${favIndex}`
            );
          }
        }
      }
    }
  };

  // Enhanced drag over handler - more aggressive board detection
  const handleDragOver = (event) => {
    const { over, activatorEvent } = event;

    if (over) {
      const overId = over.id.toString();

      // Detect which board we're hovering over - prioritize board drop zones
      if (overId.startsWith("board-")) {
        const boardId = overId.replace("board-", "");
        const boardIndex = boards.findIndex(
          (board) => (board.id || board._id) === boardId
        );
        if (boardIndex !== -1) {
          setDragOverBoard(boardIndex);
        }
      } else if (overId.includes("-") && !overId.startsWith("fav-")) {
        // Hovering over an activity - find its board
        const parts = overId.split("-");
        if (parts.length >= 3) {
          const boardIndex = parseInt(parts[0]);
          if (!isNaN(boardIndex)) {
            setDragOverBoard(boardIndex);
          }
        }
      }
    } else {
      // If no specific drop target, try to determine which board we're over by position
      if (activatorEvent && boards.length > 0) {
        // This is a fallback - try to detect board by mouse position
        // Note: This is approximate and may not be 100% accurate
        setDragOverBoard(null);
      } else {
        setDragOverBoard(null);
      }
    }
  };

  // ENHANCED: Complete drag end handler with better collision detection
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveData(null);
    setDragType(null);
    setDragOverBoard(null);

    if (!over || !hasPermission("dragDrop")) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    try {
      // 🆕 NEW: Handle dropping activities onto board areas (empty spaces)
      if (
        activeId.toString().includes("-") &&
        !activeId.toString().startsWith("board-") &&
        !activeId.toString().startsWith("fav-") &&
        overId.toString().startsWith("board-")
      ) {
        const [sourceBoardIndex, sourceFavIndex] = activeId
          .toString()
          .split("-")
          .map(Number);

        const targetBoardId = overId.toString().replace("board-", "");
        const targetBoardIndex = boards.findIndex(
          (board) => (board.id || board._id) === targetBoardId
        );

        if (
          !isNaN(sourceBoardIndex) &&
          !isNaN(sourceFavIndex) &&
          targetBoardIndex !== -1 &&
          sourceBoardIndex !== targetBoardIndex
        ) {
          const sourceBoard = boards[sourceBoardIndex];
          const targetBoard = boards[targetBoardIndex];
          const movedFavorite = sourceBoard.favorites[sourceFavIndex];

          if (!movedFavorite) return;

          const experienceId = getExperienceId(movedFavorite);
          const experienceObj = getExperienceObject(movedFavorite);

          if (!experienceId || !experienceObj) {
            toast.error("Error: experiencia inválida");
            return;
          }

          if (isExperienceInBoard(movedFavorite, targetBoard.favorites)) {
            toast.error("Esta experiencia ya está añadida en este día");
            return;
          }

          toast.loading("Moviendo experiencia...", {
            id: "moving-experience",
          });

          // Remove from source board
          await removeExperienceFromItinerary({
            itineraryId: id,
            experienceId: experienceId,
            boardDate: sourceBoard.date,
            token: jwt,
          });

          // Add to target board
          await addExperienceToItinerary({
            itineraryId: id,
            experienceId: experienceId,
            boardDate: targetBoard.date,
            token: jwt,
          });

          await fetchItinerary();
          toast.success("Experiencia movida", { id: "moving-experience" });
          return;
        }
      }

      // Enhanced reordering activities WITHIN the same board
      if (
        activeId.toString().includes("-") &&
        overId.toString().includes("-") &&
        !overId.toString().startsWith("board-") &&
        !overId.toString().includes("drop-zone")
      ) {
        const [sourceBoardIndex, sourceFavIndex] = activeId
          .split("-")
          .map(Number);
        const [targetBoardIndex, targetFavIndex] = overId
          .split("-")
          .map(Number);

        if (
          !isNaN(sourceBoardIndex) &&
          !isNaN(sourceFavIndex) &&
          !isNaN(targetBoardIndex) &&
          !isNaN(targetFavIndex)
        ) {
          // Same board reordering
          if (
            sourceBoardIndex === targetBoardIndex &&
            sourceFavIndex !== targetFavIndex
          ) {
            console.log(
              `🔄 Reordering within board ${sourceBoardIndex}: ${sourceFavIndex} → ${targetFavIndex}`
            );

            const newBoards = [...boards];
            const board = newBoards[sourceBoardIndex];

            if (board && board.favorites && board.favorites[sourceFavIndex]) {
              const reorderedFavorites = arrayMove(
                board.favorites,
                sourceFavIndex,
                targetFavIndex
              );

              newBoards[sourceBoardIndex] = {
                ...board,
                favorites: reorderedFavorites.map((fav, index) => ({
                  ...fav,
                  uniqueId: `${sourceBoardIndex}-${index}-${fav._id}`,
                })),
              };

              setBoards(newBoards);
              updateTotalBudget(newBoards);

              await updateItinerary(id, { boards: newBoards }, jwt);
              toast.success("Experiencia reordenada");

              return;
            }
          }
          // Different board reordering (move between boards) - when dropping on specific activities
          else if (sourceBoardIndex !== targetBoardIndex) {
            const sourceBoard = boards[sourceBoardIndex];
            const targetBoard = boards[targetBoardIndex];
            const movedFavorite = sourceBoard.favorites[sourceFavIndex];

            if (!movedFavorite) return;

            const experienceId = getExperienceId(movedFavorite);
            const experienceObj = getExperienceObject(movedFavorite);

            if (!experienceId || !experienceObj) {
              toast.error("Error: experiencia inválida");
              return;
            }

            if (isExperienceInBoard(movedFavorite, targetBoard.favorites)) {
              toast.error("Esta experiencia ya está añadida en este día");
              return;
            }

            toast.loading("Moviendo experiencia...", {
              id: "moving-experience",
            });

            await removeExperienceFromItinerary({
              itineraryId: id,
              experienceId: experienceId,
              boardDate: sourceBoard.date,
              token: jwt,
            });

            await addExperienceToItinerary({
              itineraryId: id,
              experienceId: experienceId,
              boardDate: targetBoard.date,
              token: jwt,
            });

            await fetchItinerary();
            toast.success("Experiencia movida", { id: "moving-experience" });
            return;
          }
        }
      }

      // Enhanced handling for moving from favorites drawer to a day
      else if (
        activeId.toString().startsWith("fav-") &&
        (overId.toString().startsWith("board-") ||
          overId.toString().includes("drop-zone"))
      ) {
        const favoriteId = activeId.toString().replace("fav-", "");
        let boardIndex = -1;

        // Determine target board
        if (overId.toString().startsWith("board-")) {
          const boardId = overId.toString().replace("board-", "");
          boardIndex = boards.findIndex(
            (board) => (board.id || board._id) === boardId
          );
        } else if (overId.toString().includes("drop-zone")) {
          // Extract board index from drop zone ID
          const dropZoneParts = overId.toString().split("-");
          if (dropZoneParts.length >= 3) {
            boardIndex = parseInt(dropZoneParts[2]);
          }
        }

        const favoriteIndex = drawerFavorites.findIndex(
          (fav) => fav._id === favoriteId
        );

        if (favoriteIndex === -1 || boardIndex === -1) return;

        const movedFavorite = drawerFavorites[favoriteIndex];
        const targetBoard = boards[boardIndex];
        const experienceId = getExperienceId(movedFavorite);
        const experienceObj = getExperienceObject(movedFavorite);

        if (!experienceId || !experienceObj) {
          toast.error("Error: experiencia inválida");
          return;
        }

        if (isExperienceInBoard(movedFavorite, targetBoard.favorites)) {
          toast.error("Esta experiencia ya está añadida en este día");
          return;
        }

        toast.loading("Añadiendo experiencia...", { id: "adding-from-fav" });

        await addExperienceToItinerary({
          itineraryId: id,
          experienceId: experienceId,
          boardDate: targetBoard.date,
          token: jwt,
        });

        await fetchItinerary();
        toast.success("Experiencia añadida", { id: "adding-from-fav" });
      }

      // Enhanced board reordering
      else if (
        activeId.toString().startsWith("board-") &&
        overId.toString().startsWith("board-") &&
        activeId !== overId
      ) {
        const oldIndex = boards.findIndex(
          (board) => (board.id || board._id) === activeId.replace("board-", "")
        );
        const newIndex = boards.findIndex(
          (board) => (board.id || board._id) === overId.replace("board-", "")
        );

        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          await handleMoveBoard(oldIndex, newIndex);
        }
      }
    } catch (error) {
      console.error("Error in drag handler:", error);
      toast.error("Error al procesar el movimiento");
      fetchItinerary();
    }
  };

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <ScrollHeader />

      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={userRole !== "viewer" ? handleDragStart : undefined}
        onDragOver={userRole !== "viewer" ? handleDragOver : undefined}
        onDragEnd={userRole !== "viewer" ? handleDragEnd : undefined}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            overflow: "hidden",
            zIndex: 1,
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(rgba(2,2,20,0.54), rgba(4,4,28,0.53)), url('/assets/bg-home1.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(1px)",
              zIndex: -1,
            },
          }}
        >
          <Box
            sx={{
              transition: "margin 0.3s ease-in-out",
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ItineraryHeader
              name={name}
              setName={setName}
              isEditingName={isEditingName && hasPermission("edit")}
              setIsEditingName={setIsEditingName}
              handleSaveName={handleSaveName}
              creator={creator}
              isInvited={isInvited}
              myRole={myRole}
              travelDays={travelDays}
              totalBudget={totalBudget}
              onOfflineClick={() => setOfflineModalOpen(true)}
              hasOfflinePermission={hasPermission("view")}
              travelers={travelers}
              friendsList={friendsList}
              startDate={startDate}
              boards={boards}
              onEditDates={() => setIsEditingDates(true)}
              canEditDates={hasPermission("edit")}
              onBackClick={() => navigate(-1)}
              onNotesClick={() => setNotesModalOpen(true)}
              onAddTraveler={
                hasPermission("manageTravelers") ? handleAddTraveler : undefined
              }
              onUpdateTraveler={
                hasPermission("manageTravelers")
                  ? handleUpdateTraveler
                  : undefined
              }
              onRemoveTraveler={
                hasPermission("manageTravelers")
                  ? handleRemoveTraveler
                  : undefined
              }
              userRole={userRole}
              currentUserId={user?._id}
              isPrivate={isPrivate}
              onPrivacyToggle={handlePrivacyToggle}
              transportMode={transportMode}
              onTransportModeChange={handleTransportModeChange}
              showDistanceIndicators={showDistanceIndicators}
              onToggleDistanceIndicators={setShowDistanceIndicators}
              showRouteOptimizer={showRouteOptimizer}
              onToggleRouteOptimizer={setShowRouteOptimizer}
            />

            <SortableContext
              items={boards.map(
                (board) => `board-${board.id || board._id || "temp"}`
              )}
              strategy={horizontalListSortingStrategy}
              disabled={userRole === "viewer"}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  gap: { xs: 0.75, sm: 1, md: 1.25 },
                  overflowX: "auto",
                  overflowY: "visible",
                  px: { xs: 0.5, sm: 0.75, md: 1 },
                  py: { xs: 0.5, sm: 0.75 },
                  alignItems: "flex-start",
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "thin",

                  // Enhanced visual feedback during drag operations
                  "& > *": {
                    minWidth: {
                      xs: "240px",
                      sm: "260px",
                      md: "280px",
                      lg: "300px",
                    },
                    maxWidth: {
                      xs: "240px",
                      sm: "260px",
                      md: "280px",
                      lg: "300px",
                    },
                    height: {
                      xs: "calc(100vh - 140px)",
                      sm: "calc(100vh - 150px)",
                      md: "calc(100vh - 160px)",
                    },
                    flexShrink: 0,
                    position: "relative",
                  },

                  "&::-webkit-scrollbar": {
                    height: { xs: "3px", sm: "4px", md: "5px" },
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: "2px",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {boards.map((board, boardIndex) => {
                  const boardWithUniqueIds = {
                    ...board,
                    favorites: (board.favorites || []).map((fav, favIndex) => ({
                      ...fav,
                      uniqueId: `${boardIndex}-${favIndex}-${fav._id}`,
                    })),
                  };

                  console.log(`🎨 Rendering board ${boardIndex}:`, {
                    boardId: board._id || board.id,
                    date: board.date,
                    favoritesCount: board.favorites?.length || 0,
                  });

                  return (
                    <Box
                      key={board._id || board.id || `board-${boardIndex}`}
                      sx={{ position: "relative" }}
                    >
                      <BoardCard
                        board={boardWithUniqueIds}
                        boardIndex={boardIndex}
                        totalBoards={boards.length}
                        onMoveBoard={
                          hasPermission("edit") ? handleMoveBoard : undefined
                        }
                        onRemoveBoard={
                          hasPermission("edit") ? handleRemoveBoard : undefined
                        }
                        onRemoveFavorite={
                          hasPermission("removeExperience")
                            ? handleRemoveFavorite
                            : undefined
                        }
                        onAddExperience={
                          hasPermission("addExperience")
                            ? handleBoardAddExperience
                            : undefined
                        }
                        onReorderExperiences={
                          hasPermission("edit")
                            ? handleReorderExperiences
                            : undefined
                        }
                        onMoveActivity={
                          hasPermission("edit") ? handleMoveActivity : undefined
                        }
                        isDragDisabled={
                          !hasPermission("dragDrop") ||
                          (activeId &&
                            !activeId.toString().startsWith("board-"))
                        }
                        userRole={userRole}
                        transportMode={transportMode}
                        showDistanceIndicators={showDistanceIndicators}
                        showRouteOptimizer={showRouteOptimizer}
                        compact={true}
                        dense={true}
                        // Enhanced visual feedback props
                        showDropHighlight={dragOverBoard === boardIndex}
                        isDragOver={dragOverBoard === boardIndex}
                      />
                    </Box>
                  );
                })}

                {hasPermission("edit") && (
                  <Box sx={{ display: "flex" }}>
                    <AddBoardCard onAddBoard={handleAddBoard} />
                  </Box>
                )}
              </Box>
            </SortableContext>

            {hasPermission("edit") && !isMobile && (
              <FavoritesDrawer
                isOpen={isDrawerOpen}
                onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                groupedFavorites={groupedFavorites}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedPrefecture={selectedPrefecture}
                setSelectedPrefecture={setSelectedPrefecture}
                onClearFilters={handleClearFilters}
                userRole={userRole}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: { sm: 280, md: 320 },
                  },
                }}
              />
            )}
          </Box>
        </Box>

        {userRole !== "viewer" && (
          <DragOverlay dropAnimation={null}>
            {activeId && activeData && activeData.favorite ? (
              <Box
                sx={{
                  transform: "rotate(5deg)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <ExperienceDragPreview
                  experience={getExperienceObject(activeData.favorite)}
                  category={
                    getExperienceObject(activeData.favorite)?.categories ||
                    "Other"
                  }
                />
              </Box>
            ) : null}
          </DragOverlay>
        )}
      </DndContext>

      <OfflineManager
        itinerary={{
          _id: id,
          name,
          totalBudget,
          travelDays,
          isPrivate,
          creator,
          travelers,
        }}
        boards={boards}
        startDate={startDate}
        open={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
      />

      {userRole !== "viewer" && (
        <DateChangeDialog
          open={isEditingDates}
          onClose={() => setIsEditingDates(false)}
          currentStartDate={startDate || new Date()}
          boardCount={boards.length}
          onConfirm={handleUpdateItineraryDates}
        />
      )}

      {hasPermission("addExperience") && (
        <AddExperienceModal
          open={addExperienceModalOpen}
          onClose={() => {
            setAddExperienceModalOpen(false);
            setSelectedBoardIndex(null);
          }}
          onAddExperience={handleAddExperienceWithBoardSelection}
          allExperiences={allExperiences}
          loading={loadingExperiences}
        />
      )}

      {hasPermission("addNotes") && (
        <NotesModal
          open={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          notes={notes}
          newNote={newNote}
          setNewNote={setNewNote}
          onAddNote={handleAddNote}
          onToggleCheck={handleToggleChecklistItem}
          onDeleteItem={handleDeleteChecklistItem}
          onEditItem={handleEditChecklistItem}
          currentUser={user}
        />
      )}
    </Box>
  );
};

export default ItineraryDetailPage;

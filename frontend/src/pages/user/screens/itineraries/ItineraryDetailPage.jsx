import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DateChangeDialog from "./components/DateChangeDialog";
import OfflineManager from "./components/OfflineManager";
import RouteSettings from "./components/RouteSettings"; // NEW: Import route settings

// DnD Kit imports
import {
  DndContext,
  closestCenter,
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

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // NEW: State for transport mode and route features
  const [transportMode, setTransportMode] = useState("walking");
  const [showDistanceIndicators, setShowDistanceIndicators] = useState(true);
  const [showRouteOptimizer, setShowRouteOptimizer] = useState(true);

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
    // Handle different data structures:
    // 1. Direct experience object: { _id: "...", title: "...", ... }
    // 2. Favorite object: { _id: "favorite_id", experienceId: { _id: "...", title: "..." } }

    if (experience.experienceId && experience.experienceId._id) {
      // This is a favorite object with nested experience
      return experience.experienceId._id;
    } else if (experience._id) {
      // This is a direct experience object
      return experience._id;
    } else {
      console.error("❌ Cannot extract experience ID from:", experience);
      return null;
    }
  };

  // Helper function to get the actual experience object
  const getExperienceObject = (experience) => {
    if (experience.experienceId) {
      // This is a favorite object with nested experience
      return experience.experienceId;
    } else {
      // This is a direct experience object
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

    // Check if this exact addition is already in progress
    if (pendingAdditions.has(queueKey)) {
      toast.error("Esta experiencia ya se está añadiendo");
      return;
    }

    try {
      // Add to pending set
      setPendingAdditions((prev) => new Set([...prev, queueKey]));

      // Small delay to prevent rapid-fire requests
      await new Promise((resolve) => setTimeout(resolve, 100));

      await performExperienceAddition(experience, boardIndex);
    } finally {
      // Remove from pending set
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
        isOptimistic: true, // Flag to identify optimistic updates
      };

      // Update the boards state immediately for instant feedback
      const updatedBoards = [...boards];
      updatedBoards[boardIndex] = {
        ...targetBoard,
        favorites: [...targetBoard.favorites, optimisticFavorite],
      };
      setBoards(updatedBoards);

      console.log(
        "⚡ Optimistic update applied - experience should be visible"
      );

      // Use direct API call with retry logic
      await testDirectAPICallWithRetry(experience, boardIndex);

      // After successful API call, refresh from server to get real data
      console.log("🔄 Refreshing data from server...");
      await fetchItinerary();

      toast.success(`${experienceObj.title || "Experiencia"} añadida`, {
        id: toastId,
      });
      console.log("✅ Successfully added experience:", experienceObj.title);
    } catch (error) {
      console.error("❌ Error adding experience:", error);

      // ROLLBACK OPTIMISTIC UPDATE on error
      console.log("⏪ Rolling back optimistic update due to error");
      await fetchItinerary(); // Refresh to remove the optimistic update

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
      throw error; // Re-throw to be caught by caller
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
            // Wait before retry with exponential backoff
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
    targetBoardIndex = null
  ) => {
    if (!hasPermission("addExperience")) {
      toast.error("No tienes permisos para añadir experiencias");
      return;
    }

    if (!isEditable) return;

    // Global check to prevent too many simultaneous requests
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

    // Extract the correct experience ID and object
    const experienceId = getExperienceId(experience);
    const experienceObj = getExperienceObject(experience);

    if (!experienceId || !experienceObj) {
      console.error("❌ Invalid experience object:", experience);
      toast.error("Error: experiencia inválida");
      return;
    }

    // Check for duplicates using current state
    const targetBoard = boards[boardIndex];
    if (isExperienceInBoard(experience, targetBoard.favorites)) {
      toast.error("Esta experiencia ya está añadida en este día");
      return;
    }

    try {
      setIsAddingExperience(true);

      // Use the queued addition approach to prevent concurrency conflicts
      await addExperienceWithQueue(experience, boardIndex);
    } catch (error) {
      // Error handling is done in addExperienceWithQueue
      console.error("❌ Error in handleAddExperienceToBoard:", error);
    } finally {
      setIsAddingExperience(false);
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

  const updateTotalBudget = async (boardsArray, shouldSave = false) => {
    if (!Array.isArray(boardsArray)) return;

    const total = boardsArray.reduce(
      (sum, board) => sum + (board?.dailyBudget || 0),
      0
    );

    setTotalBudget(total);

    if (shouldSave) {
      try {
        await updateItinerary(id, { totalBudget: total }, jwt);
        console.log("Total budget saved to database:", total);
      } catch (error) {
        console.error("Error saving total budget:", error);
      }
    }

    return total;
  };

  // NEW: Handle route optimization/reordering
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

      // Update the board with the optimized route
      targetBoard.favorites = optimizedRoute.map((experience, index) => ({
        ...experience,
        uniqueId: `${boardIndex}-${index}-${experience._id}`,
      }));

      // Recalculate daily budget
      targetBoard.dailyBudget = targetBoard.favorites.reduce(
        (sum, fav) => sum + (fav.experienceId?.price || 0),
        0
      );

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      // Save to backend
      await updateItinerary(id, { boards: newBoards }, jwt);

      toast.success("Ruta optimizada aplicada correctamente");
    } catch (error) {
      console.error("Error optimizing route:", error);
      toast.error("Error al optimizar la ruta");
      // Refresh data on error
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
      setTotalBudget(data.totalBudget || 0);
      setIsPrivate(data.isPrivate || false);

      const boardsWithIds = (data.boards || []).map((board, index) => {
        console.log(`📦 Processing board ${index}:`, board);
        console.log(`📦 Board favorites:`, board.favorites);

        return {
          ...board,
          id: board.id || board._id || `board-${index}`,
          date: board.date
            ? board.date.split("T")[0]
            : formatDateForLocal(
                new Date(Date.now() + index * 24 * 60 * 60 * 1000)
              ),
          // Ensure favorites is always an array
          favorites: Array.isArray(board.favorites) ? board.favorites : [],
        };
      });

      console.log("🎯 Processed boards:", boardsWithIds);
      setBoards(boardsWithIds);
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
    // Don't close the modal immediately - let user add multiple experiences
    const targetBoardIndex = selectedBoardIndex;

    if (targetBoardIndex !== null) {
      await handleAddExperienceToBoard(experience, targetBoardIndex);
      return;
    }

    if (boards.length === 1) {
      await handleAddExperienceToBoard(experience, 0);
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
          await handleAddExperienceToBoard(experience, boardIndex);
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

      // FIXED: Don't send userId - backend gets it from JWT
      await removeExperienceFromItinerary({
        itineraryId: id,
        experienceId: experienceId,
        boardDate: board.date,
        token: jwt,
        // userId removed - backend gets it from req.user._id
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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);

    const dragData = event.active.data?.current;
    if (dragData) {
      setActiveData(dragData);
    } else {
      const activeIdStr = event.active.id.toString();

      if (activeIdStr.startsWith("fav-")) {
        // Dragging from favorites drawer
        const favoriteId = activeIdStr.replace("fav-", "");
        const favorite = drawerFavorites.find((fav) => fav._id === favoriteId);
        if (favorite) {
          setActiveData({ favorite, type: "favorite" });
        }
      } else if (activeIdStr.includes("-")) {
        // Dragging from a board (day)
        const [boardIndex, favIndex] = activeIdStr.split("-").map(Number);
        if (
          !isNaN(boardIndex) &&
          !isNaN(favIndex) &&
          boards[boardIndex]?.favorites?.[favIndex]
        ) {
          const favorite = boards[boardIndex].favorites[favIndex];
          setActiveData({ favorite, type: "activity", boardIndex, favIndex });
        }
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveData(null);

    if (!over || !hasPermission("dragDrop")) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    try {
      // Handle moving experience from one day to another day
      if (
        activeId.toString().includes("-") &&
        overId.toString().startsWith("board-")
      ) {
        const [sourceBoardIndex, sourceFavIndex] = activeId
          .split("-")
          .map(Number);
        const targetBoardId = overId.toString().replace("board-", "");
        const targetBoardIndex = boards.findIndex(
          (board) => (board.id || board._id) === targetBoardId
        );

        if (
          isNaN(sourceBoardIndex) ||
          isNaN(sourceFavIndex) ||
          targetBoardIndex === -1
        )
          return;

        // If moving to the same board, handle reordering
        if (sourceBoardIndex === targetBoardIndex) return;

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

        // Check for duplicates
        if (isExperienceInBoard(movedFavorite, targetBoard.favorites)) {
          toast.error("Esta experiencia ya está añadida en este día");
          return;
        }

        // Confirm prefecture mismatch if needed
        if (targetBoard.favorites?.length > 0) {
          const boardPrefecture = getExperienceObject(
            targetBoard.favorites[0]
          )?.prefecture;
          if (experienceObj?.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "La prefectura de esta experiencia no coincide con las otras de este día. ¿Quieres moverla de todos modos?"
            );
            if (!confirmMismatch) return;
          }
        }

        toast.loading("Moviendo experiencia...", { id: "moving-experience" });

        // FIXED: Don't send userId - backend gets it from JWT
        // Remove from source day
        await removeExperienceFromItinerary({
          itineraryId: id,
          experienceId: experienceId,
          boardDate: sourceBoard.date,
          token: jwt,
        });

        // Add to target day
        await addExperienceToItinerary({
          itineraryId: id,
          experienceId: experienceId,
          boardDate: targetBoard.date,
          token: jwt,
        });

        // Refresh the itinerary data
        await fetchItinerary();

        toast.success("Experiencia movida", { id: "moving-experience" });
      }

      // Handle moving from favorites drawer to a day
      else if (
        activeId.toString().startsWith("fav-") &&
        overId.toString().startsWith("board-")
      ) {
        const favoriteId = activeId.toString().replace("fav-", "");
        const boardId = overId.toString().replace("board-", "");

        const favoriteIndex = drawerFavorites.findIndex(
          (fav) => fav._id === favoriteId
        );
        if (favoriteIndex === -1) return;

        const movedFavorite = drawerFavorites[favoriteIndex];
        const boardIndex = boards.findIndex(
          (board) => (board.id || board._id) === boardId
        );
        if (boardIndex === -1) return;

        const targetBoard = boards[boardIndex];
        const experienceId = getExperienceId(movedFavorite);
        const experienceObj = getExperienceObject(movedFavorite);

        if (!experienceId || !experienceObj) {
          toast.error("Error: experiencia inválida");
          return;
        }

        // Check for duplicates
        if (isExperienceInBoard(movedFavorite, targetBoard.favorites)) {
          toast.error("Esta experiencia ya está añadida en este día");
          return;
        }

        // Confirm prefecture mismatch if needed
        if (targetBoard.favorites?.length > 0) {
          const boardPrefecture = getExperienceObject(
            targetBoard.favorites[0]
          )?.prefecture;
          if (experienceObj?.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "La prefectura de esta experiencia no coincide con las otras de este día. ¿Quieres añadirla de todos modos?"
            );
            if (!confirmMismatch) return;
          }
        }

        toast.loading("Añadiendo experiencia...", { id: "adding-from-fav" });

        // FIXED: Don't send userId - backend gets it from JWT
        // Add to target day
        await addExperienceToItinerary({
          itineraryId: id,
          experienceId: experienceId,
          boardDate: targetBoard.date,
          token: jwt,
        });

        // Refresh the itinerary data
        await fetchItinerary();

        toast.success("Experiencia añadida", { id: "adding-from-fav" });
      }

      // Handle reordering boards (days)
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
      // Refresh data on error to ensure UI is in sync
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
        collisionDetection={closestCenter}
        onDragStart={userRole !== "viewer" ? handleDragStart : undefined}
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
          <Box sx={{ transition: "margin 0.3s ease-in-out", width: "100%" }}>
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
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  p: 1,
                  paddingBottom: "20px",
                  height: "min-content",
                  whiteSpace: "nowrap",
                  "&::-webkit-scrollbar": {
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.secondary.dark,
                    borderRadius: "4px",
                  },
                }}
              >
                {boards.map((board, boardIndex) => {
                  // Debug each board being rendered
                  console.log(`🎨 Rendering board ${boardIndex}:`, {
                    boardId: board._id || board.id,
                    date: board.date,
                    favoritesCount: board.favorites?.length || 0,
                    favorites: board.favorites,
                  });

                  return (
                    <BoardCard
                      key={board._id || board.id || `board-${boardIndex}`}
                      board={board}
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
                      isDragDisabled={
                        !hasPermission("dragDrop") ||
                        (activeId && !activeId.toString().startsWith("board-"))
                      }
                      userRole={userRole}
                      transportMode={transportMode}
                      showDistanceIndicators={showDistanceIndicators}
                      showRouteOptimizer={showRouteOptimizer}
                    />
                  );
                })}
                {hasPermission("edit") && (
                  <AddBoardCard onAddBoard={handleAddBoard} />
                )}
              </Box>
            </SortableContext>
          </Box>

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
            />
          )}
        </Box>

        {/* NEW: Route Settings Component */}
        <RouteSettings
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          showDistanceIndicators={showDistanceIndicators}
          onToggleDistanceIndicators={setShowDistanceIndicators}
          showRouteOptimizer={showRouteOptimizer}
          onToggleRouteOptimizer={setShowRouteOptimizer}
          userRole={userRole}
        />

        {userRole !== "viewer" && (
          <DragOverlay dropAnimation={null}>
            {activeId && activeData && activeData.favorite ? (
              <ExperienceDragPreview
                experience={getExperienceObject(activeData.favorite)}
                category={
                  getExperienceObject(activeData.favorite)?.categories ||
                  "Other"
                }
              />
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
            setSelectedBoardIndex(null); // Reset board selection when manually closing
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

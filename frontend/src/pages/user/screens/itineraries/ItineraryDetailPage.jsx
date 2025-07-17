// Complete Fixed ItineraryDetailPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DateChangeDialog from "./components/DateChangeDialog";
import OfflineManager from "./components/OfflineManager";
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

  // API Detection State
  const [apiConfig, setApiConfig] = useState(null);
  const [apiDetectionComplete, setApiDetectionComplete] = useState(false);

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

  // FIXED: Enhanced duplicate detection helper
  const isExperienceInBoard = (experience, boardFavorites) => {
    if (!boardFavorites || !Array.isArray(boardFavorites)) return false;

    return boardFavorites.some((boardFav) => {
      const existingExpId = boardFav.experienceId?._id || boardFav.experienceId;
      const newExpId = experience._id;
      return existingExpId === newExpId;
    });
  };

  const deleteFavorite = useCallback(
    async (favoriteId) => {
      const deleteEndpoints = [
        `${API_URL}/api/favorites/${favoriteId}`,
        `${API_URL}/api/users/${user._id}/favorites/${favoriteId}`,
        `${API_URL}/api/user/favorites/${favoriteId}`,
      ];

      for (const endpoint of deleteEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwt}` },
          });
          if (response.ok) {
            console.log(`✅ Cleaned up test favorite via ${endpoint}`);
            return;
          }
        } catch (error) {
          // Continue to next endpoint
        }
      }
    },
    [jwt, user._id, API_URL]
  );

  // Test different API patterns to find the working one
  const testAPIPatterns = useCallback(async () => {
    const patterns = [
      {
        name: "Standard Pattern",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id, userId: usr._id }),
      },
      {
        name: "User-specific Pattern",
        endpoint: `${API_URL}/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id }),
      },
      {
        name: "Alternative Field Names",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experience: exp._id, user: usr._id }),
      },
      {
        name: "Snake Case Pattern",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({
          experience_id: exp._id,
          user_id: usr._id,
        }),
      },
      {
        name: "Experience-centric Pattern",
        endpoint: `${API_URL}/api/experiences/favorite`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id, userId: usr._id }),
      },
      {
        name: "Singular User Pattern",
        endpoint: `${API_URL}/api/user/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id }),
      },
    ];

    for (const pattern of patterns) {
      try {
        console.log(`🧪 Testing ${pattern.name}...`);

        const testExperience = allExperiences[0] || {
          _id: "test-experience-id",
          title: "Test Experience",
        };
        const testBody = pattern.bodyFormat(testExperience, user);

        const response = await fetch(pattern.endpoint, {
          method: pattern.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(testBody),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${pattern.name} works! Response:`, result);

          if (testExperience._id !== "test-experience-id" && result._id) {
            try {
              await deleteFavorite(result._id);
            } catch (cleanupError) {
              console.warn("Could not clean up test favorite:", cleanupError);
            }
          }

          return { working: pattern };
        }
      } catch (error) {
        console.log(`${pattern.name} failed:`, error.message);
      }
    }

    return { working: null };
  }, [allExperiences, deleteFavorite, jwt, user, API_URL]);

  // API Configuration Detection
  useEffect(() => {
    const detectFavoritesAPI = async () => {
      if (!user?._id || !jwt || apiDetectionComplete) return;

      console.log("🔍 Detecting favorites API configuration...");

      try {
        const apiPatterns = await testAPIPatterns();

        if (apiPatterns.working) {
          setApiConfig(apiPatterns.working);
          console.log("✅ API configuration detected:", apiPatterns.working);
        } else {
          console.warn(
            "⚠️ No working API pattern found, will use manual favorites only"
          );
          setApiConfig({ manual: true });
        }
      } catch (error) {
        console.error("❌ Error detecting API:", error);
        setApiConfig({ manual: true });
      } finally {
        setApiDetectionComplete(true);
      }
    };

    detectFavoritesAPI();
  }, [user?._id, jwt, allExperiences, apiDetectionComplete, testAPIPatterns]);

  // FIXED: Try creating favorite with detected API configuration
  const tryCreateFavoriteWithConfig = async (experience, config) => {
    try {
      const requestBody = config.bodyFormat(experience, user);

      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const newFavorite = await response.json();
        console.log("✅ Created favorite with detected API:", newFavorite);
        return { success: true, favorite: newFavorite };
      } else {
        const errorText = await response.text();
        console.warn(`Detected API failed: ${response.status} - ${errorText}`);
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.warn("Detected API threw error:", error);
      return { success: false, error: error.message };
    }
  };

  // FIXED: Try all possible API patterns
  const tryAllAPIPatterns = async (experience) => {
    const patterns = [
      {
        name: "Standard",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "User-specific",
        endpoint: `${API_URL}/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id }),
      },
      {
        name: "Alternative fields",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: () => ({ experience: experience._id, user: user._id }),
      },
      {
        name: "Snake case",
        endpoint: `${API_URL}/api/favorites`,
        method: "POST",
        bodyFormat: () => ({
          experience_id: experience._id,
          user_id: user._id,
        }),
      },
      {
        name: "Experience-centric",
        endpoint: `${API_URL}/api/experiences/favorite`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "Singular user",
        endpoint: `${API_URL}/api/user/favorites`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id }),
      },
    ];

    console.log(`🧪 Trying ${patterns.length} API patterns...`);

    for (const pattern of patterns) {
      try {
        const requestBody = pattern.bodyFormat();
        const response = await fetch(pattern.endpoint, {
          method: pattern.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ SUCCESS with ${pattern.name}:`, result);

          // Update API config for future use
          setApiConfig(pattern);
          return { success: true, favorite: result };
        }
      } catch (error) {
        console.log(`❌ ${pattern.name} threw error:`, error.message);
      }
    }

    console.warn("⚠️ All API patterns failed");
    return { success: false };
  };

  // FIXED: Create local favorite with better structure
  const createLocalFavorite = (experience) => {
    console.log("📱 Creating local-only favorite for:", experience.title);

    const localFavorite = {
      _id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      experienceId: experience,
      userId: user._id,
      createdAt: new Date().toISOString(),
      isLocal: true,
    };

    // Save to localStorage for persistence
    try {
      const localFavorites = JSON.parse(
        localStorage.getItem(`localFavorites_${user._id}`) || "[]"
      );
      localFavorites.push(localFavorite);
      localStorage.setItem(
        `localFavorites_${user._id}`,
        JSON.stringify(localFavorites)
      );
      console.log("💾 Saved local favorite to localStorage");
    } catch (storageError) {
      console.warn("Could not save to localStorage:", storageError);
    }

    return localFavorite;
  };

  // FIXED: Enhanced auto-creation function
  const createFavoriteAndAddToBoard = async (experience, boardIndex) => {
    try {
      toast.loading("Añadiendo experiencia...", { id: "adding-experience" });

      let newFavorite = null;
      let createdSuccessfully = false;

      // Strategy 1: Use detected API if available
      if (apiConfig && !apiConfig.manual) {
        const result = await tryCreateFavoriteWithConfig(experience, apiConfig);
        if (result.success) {
          newFavorite = result.favorite;
          createdSuccessfully = true;
          console.log("✅ Created with detected API");
        }
      }

      // Strategy 2: Try all known API patterns if detected API failed
      if (!createdSuccessfully) {
        const result = await tryAllAPIPatterns(experience);
        if (result.success) {
          newFavorite = result.favorite;
          createdSuccessfully = true;
          console.log("✅ Created with fallback API pattern");
        }
      }

      // Strategy 3: Create local favorite as last resort
      if (!createdSuccessfully) {
        console.log("📱 Creating local-only favorite as fallback...");
        newFavorite = createLocalFavorite(experience);
      }

      if (!newFavorite) {
        throw new Error("Failed to create favorite");
      }

      // FIXED: Update favorites state immediately
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      setDrawerFavorites(updatedFavorites);

      // Add to board
      await addExistingFavoriteToBoard(newFavorite, experience, boardIndex);

      toast.success("Experiencia añadida", { id: "adding-experience" });
    } catch (error) {
      console.error("❌ All strategies failed:", error);
      toast.error("Error al añadir experiencia", { id: "adding-experience" });
    }
  };

  // FIXED: Main function to handle adding experience to board
  const handleAddExperienceToBoard = async (
    experience,
    targetBoardIndex = null
  ) => {
    if (!hasPermission("addExperience")) {
      toast.error("No tienes permisos para añadir experiencias");
      return;
    }

    if (!isEditable) return;

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

    if (!experience || !experience._id) {
      console.error("Invalid experience object:", experience);
      toast.error("Error: experiencia inválida");
      return;
    }

    // FIXED: Better duplicate checking logic
    const targetBoard = boards[boardIndex];
    if (isExperienceInBoard(experience, targetBoard.favorites)) {
      toast.error("Esta experiencia ya está añadida en este día");
      return;
    }

    // Check if favorite already exists in user's favorites
    const existingFavorite = favorites.find(
      (fav) => fav.experienceId?._id === experience._id
    );

    if (existingFavorite) {
      // Use existing favorite
      console.log("✅ Using existing favorite:", existingFavorite._id);
      await addExistingFavoriteToBoard(
        existingFavorite,
        experience,
        boardIndex
      );
    } else {
      // Create new favorite and add to board
      console.log("🚀 Creating new favorite for:", experience.title);
      await createFavoriteAndAddToBoard(experience, boardIndex);
    }
  };

  // FIXED: Improved addExistingFavoriteToBoard function
  const addExistingFavoriteToBoard = async (
    favoriteDoc,
    experience,
    boardIndex
  ) => {
    console.log("🎯 Adding favorite to board:", {
      favoriteId: favoriteDoc._id,
      experienceTitle: experience.title,
      boardIndex,
    });

    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      // FIXED: Better duplicate checking
      if (isExperienceInBoard(experience, targetBoard.favorites)) {
        console.log("❌ Duplicate found, aborting");
        toast.error("Esta experiencia ya está añadida en este día");
        return;
      }

      // Initialize favorites array if needed
      if (!targetBoard.favorites) {
        targetBoard.favorites = [];
      }

      // Create board favorite object
      const boardFavorite = {
        _id: favoriteDoc._id,
        experienceId: experience,
        uniqueId: `${boardIndex}-${targetBoard.favorites.length}-${favoriteDoc._id}`,
        isLocal: favoriteDoc.isLocal || false,
      };

      // Add to board
      targetBoard.favorites.push(boardFavorite);

      // Update budget
      targetBoard.dailyBudget = targetBoard.favorites.reduce(
        (sum, fav) => sum + (fav.experienceId?.price || 0),
        0
      );

      // Update state
      setBoards(newBoards);
      updateTotalBudget(newBoards);

      // Save to backend
      await saveBoardChanges(newBoards);

      console.log("✅ Successfully added to board");
    } catch (error) {
      console.error("❌ Error in addExistingFavoriteToBoard:", error);
      toast.error("Error al añadir la experiencia al día");

      // Revert changes on error
      fetchItinerary();
    }
  };

  // FIXED: Enhanced saveBoardChanges with better local favorite handling
  const saveBoardChanges = async (boardsToSave) => {
    try {
      const cleanBoards = boardsToSave.map((board, index) => {
        const cleanBoard = {
          date:
            board.date ||
            new Date(Date.now() + index * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          dailyBudget: 0,
          favorites: [],
        };

        // Keep existing board ID if it's valid
        if (
          board._id &&
          !board._id.toString().startsWith("board-") &&
          !board._id.toString().startsWith("temp-")
        ) {
          cleanBoard._id = board._id;
        }

        if (board.favorites && Array.isArray(board.favorites)) {
          // FIXED: Only filter out temp IDs and invalid favorites, keep real favorites
          const validFavorites = board.favorites
            .filter((fav) => fav && fav._id)
            .filter((fav) => !fav._id.toString().startsWith("temp-"))
            .filter((fav) => {
              // Keep real API-created favorites, filter only local-only ones
              const isLocalOnly =
                fav._id.toString().startsWith("local-") && fav.isLocal === true;
              return !isLocalOnly;
            });

          cleanBoard.favorites = validFavorites.map((fav) => fav._id);

          // Calculate budget from all favorites (including local ones in UI)
          cleanBoard.dailyBudget = board.favorites.reduce(
            (sum, fav) => sum + (fav.experienceId?.price || 0),
            0
          );
        }

        return cleanBoard;
      });

      const calculatedTotalBudget = cleanBoards.reduce(
        (sum, board) => sum + (board.dailyBudget || 0),
        0
      );

      console.log("💾 Saving boards:", cleanBoards);

      await updateItinerary(
        id,
        {
          boards: cleanBoards,
          totalBudget: calculatedTotalBudget,
        },
        jwt
      );

      console.log("✅ Successfully saved to backend");
    } catch (error) {
      console.error("❌ Error saving boards:", error);
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

      await saveBoardChanges(newBoards);

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
      await saveBoardChanges(updatedBoards);
      await updateItinerary(id, { travelDays: updatedBoards.length }, jwt);
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
      await saveBoardChanges(updatedBoards);
      await updateItinerary(id, { travelDays: updatedBoards.length }, jwt);
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
      const startDateString = formatDateForLocal(baseDate);

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

      const updatePayload = {
        date: baseDate.toISOString(),
        boards: updatedBoards.map((board) => ({
          ...board,
          date: board.date,
        })),
        totalBudget: newTotalBudget,
      };

      await updateItinerary(id, updatePayload, jwt);

      toast.success("Fechas del itinerario actualizadas");
      setIsEditingDates(false);
    } catch (error) {
      console.error("❌ Error updating itinerary dates:", error);
      toast.error("Error al actualizar las fechas");
      fetchItinerary();
    }
  };

  const fetchItinerary = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const data = await getSingleItineraryForEdit(id, jwt);
      setName(data.name || "");
      setTravelDays(data.travelDays || 0);
      setTotalBudget(data.totalBudget || 0);
      setIsPrivate(data.isPrivate || false);

      const boardsWithIds = (data.boards || []).map((board, index) => ({
        ...board,
        id: board.id || board._id || `board-${index}`,
        date: board.date
          ? board.date.split("T")[0]
          : formatDateForLocal(
              new Date(Date.now() + index * 24 * 60 * 60 * 1000)
            ),
      }));

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
    } catch (error) {
      console.error("Error fetching itinerary", error);
      toast.error("Error loading itinerary");
    }
  }, [id, jwt, user]);

  // Load local favorites with user-specific key
  useEffect(() => {
    const loadLocalFavorites = () => {
      if (!user?._id || favorites.length === 0) return;

      try {
        const localFavorites = JSON.parse(
          localStorage.getItem(`localFavorites_${user._id}`) || "[]"
        );

        if (localFavorites.length > 0) {
          console.log(
            `📱 Loaded ${localFavorites.length} local favorites for user ${user._id}`
          );

          // Filter out any that might already be in the real favorites
          const newLocalFavorites = localFavorites.filter(
            (localFav) =>
              !favorites.some(
                (realFav) =>
                  realFav.experienceId?._id === localFav.experienceId?._id
              )
          );

          if (newLocalFavorites.length > 0) {
            setFavorites((prev) => [...prev, ...newLocalFavorites]);
            setDrawerFavorites((prev) => [...prev, ...newLocalFavorites]);
          }
        }
      } catch (error) {
        console.warn("Could not load local favorites:", error);
      }
    };

    // Only load local favorites after real favorites are loaded
    if (user?._id && favorites.length > 0) {
      loadLocalFavorites();
    }
  }, [user?._id, favorites.length]);

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
      console.log("🔍 Total experiences fetched:", data.length);

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

  // FIXED: Enhanced experience modal handler
  const handleAddExperienceWithBoardSelection = async (experience) => {
    // Close the modal immediately for better UX
    setAddExperienceModalOpen(false);

    const targetBoardIndex = selectedBoardIndex;
    setSelectedBoardIndex(null);

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
    const newBoards = [...boards];
    if (newBoards[boardIndex]?.favorites) {
      newBoards[boardIndex].favorites.splice(favoriteIndex, 1);
      newBoards[boardIndex].dailyBudget = newBoards[
        boardIndex
      ].favorites.reduce((sum, fav) => sum + (fav.experienceId?.price || 0), 0);
      setBoards(newBoards);
      updateTotalBudget(newBoards);

      try {
        await saveBoardChanges(newBoards);
        toast.success("Experiencia eliminada");
      } catch (error) {
        console.error("Error saving changes:", error);
        toast.error("Error al eliminar experiencia");
        fetchItinerary();
      }
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
        const favoriteId = activeIdStr.replace("fav-", "");
        const favorite = drawerFavorites.find((fav) => fav._id === favoriteId);
        if (favorite) {
          setActiveData({ favorite, type: "favorite" });
        }
      } else if (activeIdStr.includes("-")) {
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

  const handleMoveActivity = async (boardIndex, fromIndex, toIndex) => {
    if (userRole === "viewer") {
      toast.error("No tienes permisos para reordenar actividades");
      return;
    }

    if (toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      if (!targetBoard?.favorites || toIndex >= targetBoard.favorites.length) {
        return;
      }

      const reorderedActivities = arrayMove(
        targetBoard.favorites,
        fromIndex,
        toIndex
      );

      targetBoard.favorites = reorderedActivities.map((fav, idx) => ({
        ...fav,
        uniqueId: `${boardIndex}-${idx}-${fav._id}`,
      }));

      setBoards(newBoards);
      await saveBoardChanges(newBoards);
      toast.success("Actividades reordenadas");
    } catch (error) {
      console.error("Error moving activity:", error);
      toast.error("Error al reordenar actividades");
      fetchItinerary();
    }
  };

  // FIXED: Enhanced drag end handler with better duplicate detection
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
      let shouldSave = false;
      let newBoards = [...boards];

      if (
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
          const baseDate =
            startDate ||
            (boards[0]?.date ? new Date(boards[0].date) : new Date());

          newBoards = arrayMove(boards, oldIndex, newIndex);

          newBoards = newBoards.map((board, index) => {
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + index);

            return {
              ...board,
              date: newDate.toISOString().split("T")[0],
            };
          });

          setBoards(newBoards);
          shouldSave = true;
          toast.success("Días reordenados y fechas actualizadas");
        }
      } else if (
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
        const boardIndex = newBoards.findIndex(
          (board) => (board.id || board._id) === boardId
        );
        if (boardIndex === -1) return;

        const targetBoard = newBoards[boardIndex];

        // FIXED: Better duplicate checking for drag and drop
        if (
          isExperienceInBoard(movedFavorite.experienceId, targetBoard.favorites)
        ) {
          toast.error("Esta experiencia ya está añadida en este día");
          return;
        }

        if (targetBoard.favorites?.length > 0) {
          const boardPrefecture =
            targetBoard.favorites[0].experienceId?.prefecture;
          if (movedFavorite.experienceId?.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "La prefectura de esta experiencia no coincide con las otras de este día. ¿Quieres añadirla de todos modos?"
            );
            if (!confirmMismatch) return;
          }
        }

        if (!targetBoard.favorites) targetBoard.favorites = [];
        const newFavWithId = {
          _id: movedFavorite._id,
          experienceId: movedFavorite.experienceId,
          uniqueId: `${boardIndex}-${targetBoard.favorites.length}-${movedFavorite._id}`,
          isLocal: movedFavorite.isLocal || false,
        };
        targetBoard.favorites.push(newFavWithId);
        targetBoard.dailyBudget = targetBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );

        setBoards(newBoards);
        updateTotalBudget(newBoards);
        shouldSave = true;
        toast.success("Experiencia añadida");
      } else if (activeId.toString().includes("-") && overId === "drawer") {
        const [boardIndex, favIndex] = activeId.split("-").map(Number);

        if (isNaN(boardIndex) || isNaN(favIndex)) return;

        const sourceBoard = newBoards[boardIndex];
        if (!sourceBoard?.favorites?.[favIndex]) return;

        const removedFavorite = sourceBoard.favorites.splice(favIndex, 1)[0];

        const { uniqueId, ...cleanFavorite } = removedFavorite;
        sourceBoard.favorites = sourceBoard.favorites.map((fav, idx) => ({
          ...fav,
          uniqueId: `${boardIndex}-${idx}-${fav._id}`,
        }));

        sourceBoard.dailyBudget = sourceBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );

        const newDrawerFavorites = [...drawerFavorites, cleanFavorite];

        setBoards(newBoards);
        setDrawerFavorites(newDrawerFavorites);
        updateTotalBudget(newBoards);
        shouldSave = true;
        toast.success("Experiencia movida a favoritos");
      } else if (
        activeId.toString().includes("-") &&
        overId.toString().startsWith("board-")
      ) {
        const [sourceBoardIndex, sourceFavIndex] = activeId
          .split("-")
          .map(Number);
        const targetBoardId = overId.toString().replace("board-", "");
        const targetBoardIndex = newBoards.findIndex(
          (board) => (board.id || board._id) === targetBoardId
        );

        if (
          isNaN(sourceBoardIndex) ||
          isNaN(sourceFavIndex) ||
          targetBoardIndex === -1
        )
          return;
        if (sourceBoardIndex === targetBoardIndex) return;

        const sourceBoard = newBoards[sourceBoardIndex];
        const targetBoard = newBoards[targetBoardIndex];

        if (!sourceBoard?.favorites?.[sourceFavIndex]) return;

        const movedFavorite = sourceBoard.favorites[sourceFavIndex];

        // FIXED: Better duplicate checking
        if (
          isExperienceInBoard(movedFavorite.experienceId, targetBoard.favorites)
        ) {
          toast.error("Esta experiencia ya está añadida en este día");
          return;
        }

        if (targetBoard.favorites?.length > 0) {
          const boardPrefecture =
            targetBoard.favorites[0].experienceId?.prefecture;
          if (movedFavorite.experienceId?.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "La prefectura de esta experiencia no coincide con las otras de este día. ¿Quieres añadirla de todos modos?"
            );
            if (!confirmMismatch) return;
          }
        }

        sourceBoard.favorites.splice(sourceFavIndex, 1);
        sourceBoard.favorites = sourceBoard.favorites.map((fav, idx) => ({
          ...fav,
          uniqueId: `${sourceBoardIndex}-${idx}-${fav._id}`,
        }));
        sourceBoard.dailyBudget = sourceBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );

        if (!targetBoard.favorites) targetBoard.favorites = [];
        const newFavWithId = {
          ...movedFavorite,
          uniqueId: `${targetBoardIndex}-${targetBoard.favorites.length}-${movedFavorite._id}`,
        };
        targetBoard.favorites.push(newFavWithId);
        targetBoard.dailyBudget = targetBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );

        setBoards(newBoards);
        updateTotalBudget(newBoards);
        shouldSave = true;
        toast.success("Experiencia movida");
      } else if (
        activeId.toString().includes("-") &&
        overId.toString().includes("-")
      ) {
        const [activeBoardIndex, activeFavIndex] = activeId
          .split("-")
          .map(Number);
        const [overBoardIndex, overFavIndex] = overId.split("-").map(Number);

        if (
          activeBoardIndex === overBoardIndex &&
          activeFavIndex !== overFavIndex
        ) {
          const board = newBoards[activeBoardIndex];

          if (board?.favorites) {
            board.favorites = arrayMove(
              board.favorites,
              activeFavIndex,
              overFavIndex
            );
            board.favorites = board.favorites.map((fav, idx) => ({
              ...fav,
              uniqueId: `${activeBoardIndex}-${idx}-${fav._id}`,
            }));

            setBoards(newBoards);
            shouldSave = true;
            toast.success("Experiencias reordenadas");
          }
        }
      }

      if (shouldSave) {
        try {
          await saveBoardChanges(newBoards);
        } catch (error) {
          console.error("Error saving to database:", error);
          toast.error("Error al guardar cambios");
          fetchItinerary();
        }
      }
    } catch (error) {
      console.error("Error in drag handler:", error);
      toast.error("Error al procesar el movimiento");
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
                {boards.map((board, boardIndex) => (
                  <BoardCard
                    key={board._id || board.id || `board-${boardIndex}`}
                    board={board}
                    boardIndex={boardIndex}
                    totalBoards={boards.length}
                    onMoveBoard={
                      hasPermission("edit") ? handleMoveBoard : undefined
                    }
                    onMoveActivity={
                      hasPermission("edit") ? handleMoveActivity : undefined
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
                    isDragDisabled={
                      !hasPermission("dragDrop") ||
                      (activeId && !activeId.toString().startsWith("board-"))
                    }
                    userRole={userRole}
                  />
                ))}
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

        {userRole !== "viewer" && (
          <DragOverlay dropAnimation={null}>
            {activeId && activeData ? (
              <ExperienceDragPreview
                experience={activeData.favorite?.experienceId}
                category={
                  activeData.favorite?.experienceId?.categories || "Other"
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

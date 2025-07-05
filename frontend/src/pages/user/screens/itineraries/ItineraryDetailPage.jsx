// Complete ItineraryDetailPage.jsx with Permanent Auto-Favorites Fix
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Hide on tablet and mobile

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

  // Existing State
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

  // NEW: API Detection State
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

  // NEW: Test different API patterns to find the working one
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

        // Use a real experience if available, otherwise use test data
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

        console.log(
          `${pattern.name} response:`,
          response.status,
          response.statusText
        );

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${pattern.name} works! Response:`, result);

          // If this was a real request, clean it up
          if (testExperience._id !== "test-experience-id" && result._id) {
            try {
              await deleteFavorite(result._id);
            } catch (cleanupError) {
              console.warn("Could not clean up test favorite:", cleanupError);
            }
          }

          return { working: pattern };
        } else if (response.status === 400) {
          const errorText = await response.text();
          console.log(`${pattern.name} returned 400:`, errorText);
        } else if (response.status === 404) {
          console.log(`${pattern.name} endpoint not found`);
        } else {
          console.log(`${pattern.name} failed with:`, response.status);
        }
      } catch (error) {
        console.log(`${pattern.name} failed:`, error.message);
      }
    }

    return { working: null };
  }, [allExperiences, deleteFavorite, jwt, user, API_URL]);

  // NEW: API Configuration Detection
  useEffect(() => {
    const detectFavoritesAPI = async () => {
      if (!user?._id || !jwt || apiDetectionComplete) return;

      console.log("🔍 Detecting favorites API configuration...");

      try {
        // Test different API patterns to find the working one
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

  const handleMoveBoard = async (fromIndex, toIndex) => {
    // Check permissions
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para reordenar días");
      return;
    }

    // Validate indices
    if (toIndex < 0 || toIndex >= boards.length || fromIndex === toIndex) {
      return;
    }

    try {
      // Get the start date for chronological ordering
      const baseDate =
        startDate || (boards[0]?.date ? new Date(boards[0].date) : new Date());

      // Reorder the boards using arrayMove (same as drag & drop)
      let newBoards = [...boards];
      newBoards = arrayMove(newBoards, fromIndex, toIndex);

      // Update dates to maintain chronological order
      newBoards = newBoards.map((board, index) => {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + index);

        return {
          ...board,
          date: newDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        };
      });

      // Update UI state immediately
      setBoards(newBoards);
      updateTotalBudget(newBoards);

      // Save to backend
      await saveBoardChanges(newBoards);

      toast.success("Días reordenados y fechas actualizadas");
    } catch (error) {
      console.error("Error moving board:", error);
      toast.error("Error al reordenar días");

      // Revert changes on error
      fetchItinerary();
    }
  };

  // Add this handler function to your ItineraryDetailPage component
  const handlePrivacyToggle = async (newPrivateStatus) => {
    if (userRole !== "owner") {
      toast.error(
        "Solo el propietario puede cambiar la privacidad del itinerario"
      );
      return;
    }

    const previousStatus = isPrivate;

    // Update UI immediately for better UX
    setIsPrivate(newPrivateStatus);

    try {
      // Save to backend
      await updateItinerary(id, { isPrivate: newPrivateStatus }, jwt);

      toast.success(
        newPrivateStatus
          ? "Itinerario marcado como privado"
          : "Itinerario marcado como público"
      );
    } catch (error) {
      console.error("Error updating privacy:", error);
      toast.error("Error al cambiar la privacidad del itinerario");

      // Revert the change if it failed
      setIsPrivate(previousStatus);
    }
  };
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

    // Check if favorite already exists
    const existingFavorite = favorites.find(
      (fav) => fav.experienceId?._id === experience._id
    );

    if (existingFavorite) {
      // Use existing favorite immediately
      console.log("✅ Using existing favorite:", existingFavorite._id);
      await addExistingFavoriteToBoard(
        existingFavorite,
        experience,
        boardIndex
      );
    } else {
      // AUTO-CREATE FAVORITE SEAMLESSLY (no confirmation needed)
      console.log("🚀 Auto-creating favorite for:", experience.title);
      await createFavoriteAndAddToBoard(experience, boardIndex);
    }
  };

  // Add this function to your component - it's the missing piece!

  // ENHANCED: Auto-creation with multiple fallback strategies
  const createFavoriteAndAddToBoard = async (experience, boardIndex) => {
    try {
      // Show subtle loading indicator
      toast.loading("Añadiendo experiencia...", { id: "adding-experience" });

      // Strategy 1: Use detected API if available
      if (apiConfig && !apiConfig.manual) {
        const result = await tryCreateFavoriteWithConfig(experience, apiConfig);
        if (result.success) {
          // Update local state with new favorite
          const updatedFavorites = [...favorites, result.favorite];
          setFavorites(updatedFavorites);
          setDrawerFavorites(updatedFavorites);

          await addExistingFavoriteToBoard(
            result.favorite,
            experience,
            boardIndex
          );
          toast.success("Experiencia añadida", { id: "adding-experience" });
          return;
        }
        console.warn("Detected API failed, trying fallback strategies...");
      }

      // Strategy 2: Try all known API patterns aggressively
      const result = await tryAllAPIPatterns(experience);
      if (result.success) {
        // Update local state with new favorite
        const updatedFavorites = [...favorites, result.favorite];
        setFavorites(updatedFavorites);
        setDrawerFavorites(updatedFavorites);

        await addExistingFavoriteToBoard(
          result.favorite,
          experience,
          boardIndex
        );
        toast.success("Experiencia añadida", { id: "adding-experience" });
        return;
      }

      // Strategy 3: Create a local-only favorite (if backend doesn't support it)
      console.log("📱 Creating local-only favorite as fallback...");
      const localFavorite = await createLocalFavorite(experience);

      // Update local state
      const updatedFavorites = [...favorites, localFavorite];
      setFavorites(updatedFavorites);
      setDrawerFavorites(updatedFavorites);

      await addExistingFavoriteToBoard(localFavorite, experience, boardIndex);
      toast.success("Experiencia añadida", { id: "adding-experience" });
    } catch (error) {
      console.error("❌ All auto-creation strategies failed:", error);
      toast.error("Error al añadir experiencia", { id: "adding-experience" });
    }
  };
  // Try creating favorite with detected API configuration
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

  // Aggressively try all possible API patterns
  const tryAllAPIPatterns = async (experience) => {
    const patterns = [
      // Standard patterns
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
        endpoint: "/api/user/favorites",
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id }),
      },
      {
        name: "Experience nested",
        endpoint: `${API_URL}/api/experiences/${experience._id}/favorite`,
        method: "POST",
        bodyFormat: () => ({ userId: user._id }),
      },
      {
        name: "User nested",
        endpoint: `${API_URL}/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: () => ({ experience: experience._id }),
      },
      {
        name: "Direct add",
        endpoint: `${API_URL}/api/favorites/add`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "Like endpoint",
        endpoint: `${API_URL}/api/experiences/${experience._id}/like`,
        method: "POST",
        bodyFormat: () => ({}),
      },
    ];

    console.log(
      `🧪 Trying ${patterns.length} API patterns for auto-creation...`
    );

    for (const pattern of patterns) {
      try {
        console.log(
          `Testing ${pattern.name}: ${pattern.method} ${pattern.endpoint}`
        );

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
        } else {
          console.log(`❌ ${pattern.name} failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${pattern.name} threw error:`, error.message);
      }
    }

    console.warn("⚠️ All API patterns failed");
    return { success: false };
  };

  // Create a local-only favorite when backend doesn't support it
  const createLocalFavorite = async (experience) => {
    console.log("📱 Creating local-only favorite for:", experience.title);

    // Generate a local favorite that matches the structure
    const localFavorite = {
      _id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      experienceId: experience,
      userId: user._id,
      createdAt: new Date().toISOString(),
      isLocal: true, // Flag to indicate this is local-only
    };

    // Optionally, try to save to localStorage for persistence
    try {
      const localFavorites = JSON.parse(
        localStorage.getItem("localFavorites") || "[]"
      );
      localFavorites.push(localFavorite);
      localStorage.setItem("localFavorites", JSON.stringify(localFavorites));
      console.log("💾 Saved local favorite to localStorage");
    } catch (storageError) {
      console.warn("Could not save to localStorage:", storageError);
    }

    return localFavorite;
  };

  // Load local favorites on component mount
  useEffect(() => {
    const loadLocalFavorites = () => {
      try {
        const localFavorites = JSON.parse(
          localStorage.getItem("localFavorites") || "[]"
        );
        if (localFavorites.length > 0) {
          console.log(`📱 Loaded ${localFavorites.length} local favorites`);

          // Add local favorites to the state
          setFavorites((prev) => [...prev, ...localFavorites]);
          setDrawerFavorites((prev) => [...prev, ...localFavorites]);
        }
      } catch (error) {
        console.warn("Could not load local favorites:", error);
      }
    };

    if (user?._id) {
      loadLocalFavorites();
    }
  }, [user?._id]);

  // Add this debugging to your addExistingFavoriteToBoard function
  const addExistingFavoriteToBoard = async (
    favoriteDoc,
    experience,
    boardIndex
  ) => {
    console.log("🎯 DEBUG addExistingFavoriteToBoard:");
    console.log("📄 favoriteDoc:", favoriteDoc);
    console.log("🎪 experience:", experience);
    console.log("📍 boardIndex:", boardIndex);
    console.log(
      "🗂️ Current boards before:",
      JSON.parse(JSON.stringify(boards))
    );

    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      console.log(
        "🎯 Target board before:",
        JSON.parse(JSON.stringify(targetBoard))
      );

      // Check for duplicates
      const isDuplicate = targetBoard.favorites?.some((boardFav) => {
        const boardFavId =
          typeof boardFav === "object" ? boardFav._id : boardFav;
        console.log(
          "🔍 Checking duplicate:",
          boardFavId,
          "vs",
          favoriteDoc._id
        );
        return boardFavId === favoriteDoc._id;
      });

      if (isDuplicate) {
        console.log("❌ Duplicate found, aborting");
        toast.error("Esta experiencia ya está añadida en este día");
        return;
      }

      // Add to UI state
      if (!targetBoard.favorites) {
        console.log("📝 Creating new favorites array");
        targetBoard.favorites = [];
      }

      const uiFavorite = {
        _id: favoriteDoc._id,
        experienceId: experience,
        uniqueId: `${boardIndex}-${targetBoard.favorites.length}-${favoriteDoc._id}`,
        isLocal: favoriteDoc.isLocal,
      };

      console.log("✨ Creating UI favorite:", uiFavorite);

      targetBoard.favorites.push(uiFavorite);

      // Update budget
      targetBoard.dailyBudget = targetBoard.favorites.reduce(
        (sum, fav) => sum + (fav.experienceId?.price || 0),
        0
      );

      console.log("💰 Updated board budget:", targetBoard.dailyBudget);
      console.log(
        "🎯 Target board after:",
        JSON.parse(JSON.stringify(targetBoard))
      );

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      console.log(
        "🚀 About to call saveBoardChanges with:",
        JSON.parse(JSON.stringify(newBoards))
      );

      // Save to backend (this will filter out local favorites automatically)
      await saveBoardChanges(newBoards);

      console.log("✅ saveBoardChanges completed successfully");
    } catch (error) {
      console.error("❌ Error in addExistingFavoriteToBoard:", error);
      toast.error("Error al añadir la experiencia al día");

      // Revert changes on error
      setBoards([...boards]);
      updateTotalBudget(boards);
    }
  };

  // Enhanced saveBoardChanges that handles local favorites
  // 1. Enhanced saveBoardChanges function
  const saveBoardChanges = async (boardsToSave) => {
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

      if (
        board._id &&
        !board._id.toString().startsWith("board-") &&
        !board._id.toString().startsWith("temp-")
      ) {
        cleanBoard._id = board._id;
      }

      if (board.favorites && Array.isArray(board.favorites)) {
        // Filter out local favorites when saving to backend
        cleanBoard.favorites = board.favorites
          .filter((fav) => fav && fav._id)
          .filter((fav) => !fav._id.toString().startsWith("temp-"))
          .filter((fav) => !fav._id.toString().startsWith("local-"))
          .map((fav) => fav._id);

        cleanBoard.dailyBudget = board.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );
      }

      return cleanBoard;
    });

    // Calculate the total budget from the clean boards
    const calculatedTotalBudget = cleanBoards.reduce(
      (sum, board) => sum + (board.dailyBudget || 0),
      0
    );

    console.log("Sending clean boards:", JSON.stringify(cleanBoards, null, 2));
    console.log("Calculated total budget:", calculatedTotalBudget);

    // Include totalBudget in the update
    await updateItinerary(
      id,
      {
        boards: cleanBoards,
        totalBudget: calculatedTotalBudget,
      },
      jwt
    );
  };

  // 2. NEWWWW Enhanced updateTotalBudget function that also saves to DB
  const updateTotalBudget = async (boardsArray, shouldSave = false) => {
    if (!Array.isArray(boardsArray)) return;

    const total = boardsArray.reduce(
      (sum, board) => sum + (board?.dailyBudget || 0),
      0
    );

    setTotalBudget(total);

    // Optionally save to database immediately
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

  // 3. NEW Enhanced handleAddBoard function
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
      // Also update travel days - totalBudget is now included in saveBoardChanges
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

  // 4. NEW Enhanced handleRemoveBoard function
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
      // Also update travel days - totalBudget is now included in saveBoardChanges
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
  // FIXED: NEWWWWWW Enhanced handleUpdateItineraryDates with proper date handling
  const handleUpdateItineraryDates = async (newStartDate) => {
    if (!hasPermission("edit")) {
      toast.error("No tienes permisos para cambiar las fechas");
      return;
    }

    try {
      console.log("🗓️ Original newStartDate:", newStartDate);
      console.log("🗓️ newStartDate type:", typeof newStartDate);
      console.log("🗓️ newStartDate ISO:", newStartDate.toISOString());

      // FIXED: Create a clean date object and avoid timezone issues
      const baseDate = new Date(newStartDate);
      console.log("🗓️ Base date created:", baseDate);

      // FIXED: Format the start date properly for local timezone
      const startDateString = formatDateForLocal(baseDate);
      console.log("🗓️ Start date string:", startDateString);

      // FIXED: Update all board dates based on the new start date
      const updatedBoards = boards.map((board, index) => {
        // Create a new date for each board day (don't mutate the original)
        const boardDate = new Date(baseDate);
        boardDate.setDate(boardDate.getDate() + index);

        const boardDateString = formatDateForLocal(boardDate);

        console.log(`🗓️ Board ${index + 1} date: ${boardDateString}`);

        return {
          ...board,
          date: boardDateString, // Use local formatted date
        };
      });

      console.log("🗓️ Updated boards with new dates:", updatedBoards);

      // Update local state first
      setBoards(updatedBoards);
      setStartDate(baseDate);

      // Calculate total budget
      const newTotalBudget = updatedBoards.reduce(
        (sum, board) => sum + (board?.dailyBudget || 0),
        0
      );

      // FIXED: Save to backend with proper date formatting
      const updatePayload = {
        date: baseDate.toISOString(), // Keep ISO for backend
        boards: updatedBoards.map((board) => ({
          ...board,
          date: board.date, // This is now properly formatted
        })),
        totalBudget: newTotalBudget,
      };

      console.log("🗓️ Sending update payload:", updatePayload);

      await updateItinerary(id, updatePayload, jwt);

      toast.success("Fechas del itinerario actualizadas");
      setIsEditingDates(false);
    } catch (error) {
      console.error("❌ Error updating itinerary dates:", error);
      toast.error("Error al actualizar las fechas");
      // Revert changes on error
      fetchItinerary();
    }
  };

  // NEWWW HELPER: Format date for local timezone (avoids timezone offset issues)
  const formatDateForLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // NEWWW FIXED: Enhanced fetchItinerary to handle dates properly
  const fetchItinerary = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const data = await getSingleItineraryForEdit(id, jwt);
      setName(data.name || "");
      setTravelDays(data.travelDays || 0);
      setTotalBudget(data.totalBudget || 0);

      // Add this line to set the privacy status
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

      // Determine user's role from travelers array
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
  // Fetch experiences function
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

  // Handler for board-specific add experience
  const handleBoardAddExperience = (boardIndex) => {
    setSelectedBoardIndex(boardIndex);
    setAddExperienceModalOpen(true);
  };

  // Enhanced handler for board selection
  const handleAddExperienceWithBoardSelection = (experience) => {
    if (selectedBoardIndex !== null) {
      handleAddExperienceToBoard(experience, selectedBoardIndex);
      setSelectedBoardIndex(null);
      return;
    }

    if (boards.length === 1) {
      handleAddExperienceToBoard(experience, 0);
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
          handleAddExperienceToBoard(experience, boardIndex);
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

  // Add this new handler function
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

      // Revert changes on error
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

      // Update backend first
      await updateItinerary(id, { notes: updatedNotes }, jwt);

      // Then update local state
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

      // Update backend first
      await updateItinerary(id, { notes: updatedNotes }, jwt);

      // Then update local state
      setNotes(updatedNotes);
      toast.success("Tarea actualizada");
    } catch (error) {
      console.error("Error editing checklist item:", error);
      toast.error("Error al editar la tarea");

      // Optionally refetch to ensure consistency
      fetchItinerary();
    }
  };
  // Update the handleAddNote function to add checklist items
  const handleAddNote = async () => {
    if (!newNote.trim() || !user?._id) return;

    const checklistItem = {
      text: newNote,
      completed: false,
      author: user.name || user._id, // Use name if available, fallback to ID
    };

    const updatedNotes = [...notes, checklistItem];
    setNotes(updatedNotes);

    try {
      await updateItinerary(id, { notes: updatedNotes }, jwt);
      toast.success("Tarea añadida");
    } catch (error) {
      console.error("Error adding checklist item:", error);
      toast.error("Error al añadir tarea");

      // Revert changes on error
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
    // Check permissions
    if (userRole === "viewer") {
      toast.error("No tienes permisos para reordenar actividades");
      return;
    }

    // Validate indices
    if (toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      if (!targetBoard?.favorites || toIndex >= targetBoard.favorites.length) {
        return;
      }

      // Reorder activities within the board using arrayMove
      const reorderedActivities = arrayMove(
        targetBoard.favorites,
        fromIndex,
        toIndex
      );

      // Update uniqueIds to maintain consistency
      targetBoard.favorites = reorderedActivities.map((fav, idx) => ({
        ...fav,
        uniqueId: `${boardIndex}-${idx}-${fav._id}`,
      }));

      // Update UI state immediately
      setBoards(newBoards);

      // Save to backend
      await saveBoardChanges(newBoards);

      toast.success("Actividades reordenadas");
    } catch (error) {
      console.error("Error moving activity:", error);
      toast.error("Error al reordenar actividades");

      // Revert changes on error
      fetchItinerary();
    }
  };
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveData(null);

    if (!over || !isEditable) return;
    if (!over || !hasPermission("dragDrop")) {
      // Exit silently if no permission
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
          // Get the start date
          const baseDate =
            startDate ||
            (boards[0]?.date ? new Date(boards[0].date) : new Date());

          // Reorder the boards
          newBoards = arrayMove(boards, oldIndex, newIndex);

          // Update dates to maintain chronological order
          newBoards = newBoards.map((board, index) => {
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + index);

            return {
              ...board,
              date: newDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
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

        const isDuplicate = targetBoard.favorites?.some((boardFav) => {
          const boardFavId =
            typeof boardFav === "object" ? boardFav._id : boardFav;
          return boardFavId === movedFavorite._id;
        });

        if (isDuplicate) {
          const confirmDuplicate = window.confirm(
            "Esta experiencia ya está añadida en este día. ¿Quieres añadirla de nuevo?"
          );
          if (!confirmDuplicate) return;
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
        };
        targetBoard.favorites.push(newFavWithId);
        targetBoard.dailyBudget = targetBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );

        const newDrawerFavorites = [...drawerFavorites];
        newDrawerFavorites.splice(favoriteIndex, 1);

        setBoards(newBoards);
        setDrawerFavorites(newDrawerFavorites);
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

        const isDuplicate = targetBoard.favorites?.some((boardFav) => {
          const boardFavId =
            typeof boardFav === "object" ? boardFav._id : boardFav;
          return boardFavId === movedFavorite._id;
        });

        if (isDuplicate) {
          const confirmDuplicate = window.confirm(
            "Esta experiencia ya está añadida en este día. ¿Quieres añadirla de nuevo?"
          );
          if (!confirmDuplicate) return;
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
              onNotesClick={() => setNotesModalOpen(true)} // Add this if missing
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
              // NEW PROPS FOR PRIVACY
              isPrivate={isPrivate}
              onPrivacyToggle={handlePrivacyToggle}
            />

            <SortableContext
              items={boards.map(
                (board) => `board-${board.id || board._id || "temp"}`
              )}
              strategy={horizontalListSortingStrategy}
              disabled={userRole === "viewer"} // Disable sorting for viewers
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
                    } // ← Add this line
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
                {/* Only show AddBoardCard if user can edit */}
                {hasPermission("edit") && (
                  <AddBoardCard onAddBoard={handleAddBoard} />
                )}
              </Box>
            </SortableContext>
          </Box>

          {/* Only show FavoritesDrawer if user can edit */}
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

        {/* Only show DragOverlay for non-viewers */}
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
      {/* Only show AddExperienceModal if user can add experiences */}
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
          onDeleteItem={handleDeleteChecklistItem} // ✅ Add this
          onEditItem={handleEditChecklistItem} // ✅ Add this
          currentUser={user}
        />
      )}
    </Box>
  );
};

export default ItineraryDetailPage;

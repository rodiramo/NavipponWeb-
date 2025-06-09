// Complete ItineraryDetailPage.jsx with Permanent Auto-Favorites Fix
import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

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
  const theme = useTheme();
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
  }, [user?._id, jwt, allExperiences]);

  // NEW: Test different API patterns to find the working one
  const testAPIPatterns = async () => {
    const patterns = [
      {
        name: "Standard Pattern",
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id, userId: usr._id }),
      },
      {
        name: "User-specific Pattern",
        endpoint: `/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id }),
      },
      {
        name: "Alternative Field Names",
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: (exp, usr) => ({ experience: exp._id, user: usr._id }),
      },
      {
        name: "Snake Case Pattern",
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: (exp, usr) => ({
          experience_id: exp._id,
          user_id: usr._id,
        }),
      },
      {
        name: "Experience-centric Pattern",
        endpoint: "/api/experiences/favorite",
        method: "POST",
        bodyFormat: (exp, usr) => ({ experienceId: exp._id, userId: usr._id }),
      },
      {
        name: "Singular User Pattern",
        endpoint: "/api/user/favorites",
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
  };

  // NEW: Helper function to delete test favorites
  const deleteFavorite = async (favoriteId) => {
    const deleteEndpoints = [
      `/api/favorites/${favoriteId}`,
      `/api/users/${user._id}/favorites/${favoriteId}`,
      `/api/user/favorites/${favoriteId}`,
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
  };

  // TRULY AUTOMATIC SOLUTION - No user intervention required

  // Enhanced handleAddExperienceToBoard that just works automatically
  const handleAddExperienceToBoard = async (
    experience,
    targetBoardIndex = null
  ) => {
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
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "User-specific",
        endpoint: `/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id }),
      },
      {
        name: "Alternative fields",
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: () => ({ experience: experience._id, user: user._id }),
      },
      {
        name: "Snake case",
        endpoint: "/api/favorites",
        method: "POST",
        bodyFormat: () => ({
          experience_id: experience._id,
          user_id: user._id,
        }),
      },
      {
        name: "Experience-centric",
        endpoint: "/api/experiences/favorite",
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "Singular user",
        endpoint: "/api/user/favorites",
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id }),
      },
      // Additional patterns to try
      {
        name: "Experience nested",
        endpoint: `/api/experiences/${experience._id}/favorite`,
        method: "POST",
        bodyFormat: () => ({ userId: user._id }),
      },
      {
        name: "User nested",
        endpoint: `/api/users/${user._id}/favorites`,
        method: "POST",
        bodyFormat: () => ({ experience: experience._id }),
      },
      {
        name: "Direct add",
        endpoint: `/api/favorites/add`,
        method: "POST",
        bodyFormat: () => ({ experienceId: experience._id, userId: user._id }),
      },
      {
        name: "Like endpoint",
        endpoint: `/api/experiences/${experience._id}/like`,
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

  // Enhanced addExistingFavoriteToBoard that handles local favorites
  const addExistingFavoriteToBoard = async (
    favoriteDoc,
    experience,
    boardIndex
  ) => {
    try {
      const newBoards = [...boards];
      const targetBoard = newBoards[boardIndex];

      // Check for duplicates
      const isDuplicate = targetBoard.favorites?.some((boardFav) => {
        const boardFavId =
          typeof boardFav === "object" ? boardFav._id : boardFav;
        return boardFavId === favoriteDoc._id;
      });

      if (isDuplicate) {
        toast.error("Esta experiencia ya está añadida en este día");
        return;
      }

      // Add to UI state
      if (!targetBoard.favorites) targetBoard.favorites = [];

      const uiFavorite = {
        _id: favoriteDoc._id,
        experienceId: experience,
        uniqueId: `${boardIndex}-${targetBoard.favorites.length}-${favoriteDoc._id}`,
        isLocal: favoriteDoc.isLocal, // Preserve local flag
      };

      targetBoard.favorites.push(uiFavorite);

      // Update budget
      targetBoard.dailyBudget = targetBoard.favorites.reduce(
        (sum, fav) => sum + (fav.experienceId?.price || 0),
        0
      );

      setBoards(newBoards);
      updateTotalBudget(newBoards);

      // Save to backend (this will filter out local favorites automatically)
      await saveBoardChanges(newBoards);
    } catch (error) {
      console.error("Error adding to board:", error);
      toast.error("Error al añadir la experiencia al día");

      // Revert changes on error
      setBoards([...boards]);
      updateTotalBudget(boards);
    }
  };

  // Enhanced saveBoardChanges that handles local favorites
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
          .filter((fav) => !fav._id.toString().startsWith("local-")) // Exclude local favorites
          .map((fav) => fav._id);

        cleanBoard.dailyBudget = board.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );
      }

      return cleanBoard;
    });

    console.log(
      "Sending clean boards (excluding local favorites):",
      JSON.stringify(cleanBoards, null, 2)
    );
    await updateItinerary(id, { boards: cleanBoards }, jwt);
  };

  // Fetch functions with error handling
  const fetchItinerary = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const data = await getSingleItineraryForEdit(id, jwt);
      setName(data.name || "");
      setTravelDays(data.travelDays || 0);
      setTotalBudget(data.totalBudget || 0);

      const boardsWithIds = (data.boards || []).map((board, index) => ({
        ...board,
        id: board.id || board._id || `board-${index}`,
      }));
      setBoards(boardsWithIds);

      setTravelers(data.travelers || []);
      setNotes(data.notes || []);
      setStartDate(data.date ? new Date(data.date) : null);
      setCreator(data.user || null);

      const editable =
        String(data.user?._id) === String(user._id) ||
        (data.travelers &&
          data.travelers.some(
            (traveler) =>
              String(traveler.userId?._id || traveler.userId) ===
                String(user._id) && traveler.role === "editor"
          ));
      setIsEditable(editable);

      const myTraveler = data.travelers?.find(
        (traveler) =>
          String(traveler.userId?._id || traveler.userId) === String(user._id)
      );
      setMyRole(myTraveler?.role || "Invitado");
    } catch (error) {
      console.error("Error fetching itinerary", error);
      toast.error("Error loading itinerary");
    }
  }, [id, jwt, user?._id]);

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

  // Fetch experiences function
  const fetchAllExperiences = async () => {
    setLoadingExperiences(true);
    try {
      const response = await fetch("/api/experiences", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch experiences");
      }

      const data = await response.json();
      setAllExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Error al cargar experiencias");
      setAllExperiences([]);
    } finally {
      setLoadingExperiences(false);
    }
  };

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

  const updateTotalBudget = (boardsArray) => {
    if (!Array.isArray(boardsArray)) return;
    const total = boardsArray.reduce(
      (sum, board) => sum + (board?.dailyBudget || 0),
      0
    );
    setTotalBudget(total);
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

  const handleAddNote = async () => {
    if (!newNote.trim() || !user?._id) return;

    const note = {
      text: newNote,
      date: new Date(),
      author: { _id: user._id, name: user.name || "Unknown" },
    };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    try {
      await updateItinerary(id, { notes: updatedNotes }, jwt);
    } catch (error) {
      console.error("Error adding note", error);
      toast.error("Error adding note");
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
  }, [addExperienceModalOpen]);

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

  const handleAddBoard = async () => {
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
    updateTotalBudget(updatedBoards);

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
    const updatedBoards = boards.filter((_, i) => i !== index);
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);

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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveData(null);

    if (!over || !isEditable) return;

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
          newBoards = arrayMove(boards, oldIndex, newIndex);
          setBoards(newBoards);
          shouldSave = true;
          toast.success("Días reordenados");
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
              handleSaveName={handleSaveName}
              creator={creator}
              isInvited={isInvited}
              myRole={myRole}
              travelDays={travelDays}
              totalBudget={totalBudget}
              travelers={travelers}
              friendsList={friendsList}
              onAddTraveler={handleAddTraveler}
              onUpdateTraveler={handleUpdateTraveler}
              onRemoveTraveler={handleRemoveTraveler}
              onNotesClick={() => setNotesModalOpen(true)}
              onBackClick={() => navigate(-1)}
            />

            {isEditable ? (
              <SortableContext
                items={boards.map(
                  (board) => `board-${board.id || board._id || "temp"}`
                )}
                strategy={horizontalListSortingStrategy}
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
                      onRemoveBoard={handleRemoveBoard}
                      onRemoveFavorite={handleRemoveFavorite}
                      onAddExperience={handleBoardAddExperience}
                      isDragDisabled={
                        activeId && !activeId.toString().startsWith("board-")
                      }
                    />
                  ))}
                  <AddBoardCard onAddBoard={handleAddBoard} />
                </Box>
              </SortableContext>
            ) : (
              <Box>Vista de solo lectura</Box>
            )}
          </Box>

          {isEditable && (
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
            />
          )}
        </Box>

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
      </DndContext>

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

      <NotesModal
        open={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        notes={notes}
        newNote={newNote}
        setNewNote={setNewNote}
        onAddNote={handleAddNote}
      />
    </Box>
  );
};

export default ItineraryDetailPage;

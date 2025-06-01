// Updated ItineraryDetailPage.jsx - Fixed drag conflicts
import React, { useState, useEffect, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Updated @dnd-kit imports
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
import ScrollHeader from "../../../../components/ScrollHeader";
import ItineraryHeader from "./components/ItineraryHeader";
import BoardCard from "./components/ItineraryBoardCard";
import AddBoardCard from "./components/AddBoardCard";
import FavoritesDrawer from "./components/FavoritesDrawer";
import NotesModal from "./components/Notes";

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

  // DnD Kit sensors - Updated with more specific configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // State
  const [friendsList, setFriendsList] = useState([]);
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
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

  // Drag state
  const [activeId, setActiveId] = useState(null);

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

  // Fetch functions with error handling
  const fetchItinerary = useCallback(async () => {
    if (!user || !user._id) return;

    try {
      const data = await getSingleItineraryForEdit(id, jwt);
      setName(data.name || "");
      setTravelDays(data.travelDays || 0);
      setTotalBudget(data.totalBudget || 0);

      // Ensure boards have unique IDs
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

  // Handler functions
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

  const handleRemoveFavorite = (boardIndex, favoriteIndex) => {
    const newBoards = [...boards];
    if (newBoards[boardIndex]?.favorites) {
      newBoards[boardIndex].favorites.splice(favoriteIndex, 1);
      newBoards[boardIndex].dailyBudget = newBoards[
        boardIndex
      ].favorites.reduce((sum, fav) => sum + (fav.experienceId?.price || 0), 0);
      setBoards(newBoards);
      updateTotalBudget(newBoards);
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

  // FIXED: Separate drag start handler
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const cleanBoardsForDatabase = (boards) => {
    return boards.map((board, index) => {
      const cleanBoard = { ...board };

      // Remove UI-only properties
      delete cleanBoard.uniqueId;
      delete cleanBoard.id; // Remove temporary id, let backend generate _id

      // Clean favorites array
      if (cleanBoard.favorites && Array.isArray(cleanBoard.favorites)) {
        cleanBoard.favorites = cleanBoard.favorites.map((fav) => {
          const cleanFav = { ...fav };
          delete cleanFav.uniqueId;
          return cleanFav;
        });

        cleanBoard.dailyBudget = cleanBoard.favorites.reduce(
          (sum, fav) => sum + (fav.experienceId?.price || 0),
          0
        );
      } else {
        cleanBoard.favorites = [];
        cleanBoard.dailyBudget = 0;
      }

      // Ensure date is set
      if (!cleanBoard.date) {
        cleanBoard.date = new Date(Date.now() + index * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
      }

      return cleanBoard;
    });
  };

  // UPDATED: Simpler handleAddBoard that doesn't immediately save to DB
  const handleAddBoard = async () => {
    const newBoard = {
      id: `board-${Date.now()}`, // Temporary ID for UI
      date: new Date(Date.now() + boards.length * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Auto-generate date
      favorites: [],
      dailyBudget: 0,
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);

    // Save to database immediately
    try {
      const cleanBoards = cleanBoardsForDatabase(updatedBoards);
      await updateItinerary(
        id,
        {
          boards: cleanBoards,
          travelDays: updatedBoards.length,
        },
        jwt
      );
      toast.success("Nuevo día añadido");
    } catch (error) {
      console.error("Error adding new board", error);
      toast.error("Error al añadir nuevo día");
      // Revert the state if save failed
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
      const cleanBoards = cleanBoardsForDatabase(updatedBoards);
      await updateItinerary(
        id,
        {
          boards: cleanBoards,
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

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
      }

      // Case 2: Favorite from drawer to board
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
        const boardIndex = newBoards.findIndex(
          (board) => (board.id || board._id) === boardId
        );
        if (boardIndex === -1) return;

        const targetBoard = newBoards[boardIndex];

        // Validation checks
        const isDuplicate = targetBoard.favorites?.some(
          (fav) => fav.experienceId?._id === movedFavorite.experienceId?._id
        );

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

        // Add to board
        if (!targetBoard.favorites) targetBoard.favorites = [];
        const newFavWithId = {
          ...movedFavorite,
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
      }

      // Case 3: Activity from board back to drawer
      else if (activeId.toString().includes("-") && overId === "drawer") {
        const [boardIndex, favIndex] = activeId.split("-").map(Number);

        if (isNaN(boardIndex) || isNaN(favIndex)) return;

        const sourceBoard = newBoards[boardIndex];
        if (!sourceBoard?.favorites?.[favIndex]) return;

        const removedFavorite = sourceBoard.favorites.splice(favIndex, 1)[0];

        // Clean and regenerate unique IDs
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
      }

      // Case 4: Activity between boards
      else if (
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

        // Validation
        const isDuplicate = targetBoard.favorites?.some(
          (fav) => fav.experienceId?._id === movedFavorite.experienceId?._id
        );

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

        // Move from source to target
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
      }

      // Case 5: Reordering within same board
      else if (
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

      // Save to database if changes were made
      if (shouldSave) {
        try {
          const cleanBoards = cleanBoardsForDatabase(newBoards);
          console.log("Saving boards:", cleanBoards); // Debug log
          await updateItinerary(id, { boards: cleanBoards }, jwt);
        } catch (error) {
          console.error("Error saving to database:", error);
          console.error("Data being sent:", cleanBoardsForDatabase(newBoards));
          toast.error("Error al guardar cambios");
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
      {/* FIXED: Added onDragStart and better collision detection */}
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
                      key={board._id || board.id || `board-${boardIndex}`} // Fixed key prop
                      board={board}
                      boardIndex={boardIndex}
                      onRemoveBoard={handleRemoveBoard}
                      onRemoveFavorite={handleRemoveFavorite}
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

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeId ? (
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                p: 1,
                borderRadius: 2,
                opacity: 0.8,
              }}
            >
              Arrastrando...
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

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

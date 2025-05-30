import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  TextField,
  Drawer,
  Tooltip,
  useTheme,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  BedSingle,
  Plus,
  MessagesSquare,
  Map,
  Coins,
  Save,
  Edit,
  Trash2,
  XCircle,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import ScrollHeader from "../../../../components/ScrollHeader";
import FiltersDrawer from "../../components/FiltersDrawer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { stables, images } from "../../../../constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getSingleItineraryForEdit,
  getUserFavorites,
  updateItinerary,
  addTravelerToItinerary,
  updateTravelerRole,
  removeTravelerFromItinerary,
} from "../../../../services/index/itinerary";
import Travelers from "./components/Travelers";
import { getUserFriends } from "../../../../services/index/users"; // Import your friends service

const drawerWidth = 350;

const ItineraryDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, jwt } = useUser();

  // Itinerary fields
  const [friendsList, setFriendsList] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [creator, setCreator] = useState(null);
  const [date, setStartDate] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [drawerFavorites, setDrawerFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Notes modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [newNote, setNewNote] = useState("");

  const [isEditable, setIsEditable] = useState(false);
  const [myRole, setMyRole] = useState("Invitado");

  // Function to fetch the itinerary data
  const fetchItinerary = async () => {
    try {
      const data = await getSingleItineraryForEdit(id, jwt);
      setName(data.name);
      setTravelDays(data.travelDays);
      setTotalBudget(data.totalBudget);
      setBoards(data.boards);
      setTravelers(data.travelers || []);
      setNotes(data.notes || []);
      setStartDate(new Date(data.date));
      setCreator(data.user);

      // Determine if the user is the creator or an editor among travelers
      const editable =
        String(data.user._id) === String(user._id) ||
        (data.travelers &&
          data.travelers.some(
            (traveler) =>
              String(traveler.userId._id || traveler.userId) ===
                String(user._id) && traveler.role === "editor"
          ));
      setIsEditable(editable);

      // Find the current user's traveler info to get their role
      const myTraveler = data.travelers.find(
        (traveler) =>
          String(traveler.userId._id || traveler.userId) === String(user._id)
      );
      setMyRole(myTraveler && myTraveler.role ? myTraveler.role : "Invitado");
    } catch (error) {
      console.error("Error fetching itinerary", error);
    }
  };

  useEffect(() => {
    if (id && jwt) {
      fetchItinerary();
    }
  }, [id, jwt]);
  const groupedFavorites = drawerFavorites.reduce((groups, fav) => {
    const cat = fav.experienceId?.categories || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(fav);
    return groups;
  }, {});
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        const validFavorites = data.filter((fav) => fav.experienceId !== null);
        setFavorites(validFavorites);
        setDrawerFavorites(validFavorites);
      } catch (error) {
        console.error("Error fetching favorites", error);
      }
    };
    if (user && jwt) {
      fetchFavorites();
    }
  }, [user, jwt]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getUserFriends({ userId: user._id, token: jwt });
        setFriendsList(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (user && jwt) {
      fetchFriends();
    }
  }, [user, jwt]);

  const updateTotalBudget = (boardsArray) => {
    const total = boardsArray.reduce(
      (sum, board) => sum + board.dailyBudget,
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
    }
  };
  const getCategoryIcon = (category, theme) => {
    if (category === "Hoteles")
      return <BedSingle color={theme.palette.primary.main} size={24} />;
    if (category === "Atractivos")
      return (
        <MdOutlineTempleBuddhist color={theme.palette.primary.main} size={24} />
      );
    if (category === "Restaurantes")
      return (
        <MdOutlineRamenDining color={theme.palette.primary.main} size={24} />
      );
    return null;
  };
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleRemoveBoard = (index) => {
    const updatedBoards = boards.filter((_, i) => i !== index);
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);
  };

  const shouldPreventScroll = (e) => {
    // Returns true if the event target is inside an element with the class "no-scroll"
    return Boolean(e.target.closest(".no-scroll"));
  };

  const handleMouseDown = (e) => {
    if (shouldPreventScroll(e)) {
      return;
    }
    const slider = e.currentTarget;
    let startX = e.pageX - slider.offsetLeft;
    let scrollLeft = slider.scrollLeft;

    const mouseMoveHandler = (e) => {
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      slider.style.cursor = "grab";
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    slider.style.cursor = "grabbing";
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedPrefecture("All");
    setFilteredFavorites(favorites);
    setDrawerFavorites(favorites);
  };
  const onDragEnd = async (result) => {
    if (!result.destination || !isEditable) return;
    const { source, destination, type } = result;
    let newBoards = [...boards];
    let newDrawerFavorites = [...drawerFavorites];

    if (type === "BOARD") {
      const [removed] = newBoards.splice(source.index, 1);
      newBoards.splice(destination.index, 0, removed);
    } else if (type === "FAVORITE") {
      // Moving from the drawer to a board
      if (
        source.droppableId === "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        const destBoardIndex = parseInt(destination.droppableId);
        const destBoard = { ...newBoards[destBoardIndex] };
        const [movedFavorite] = newDrawerFavorites.splice(source.index, 1);

        // Duplicate Check: Does this board already contain this experience?
        const isDuplicate = destBoard.favorites.some(
          (fav) => fav.experienceId._id === movedFavorite.experienceId._id
        );
        if (isDuplicate) {
          const confirmDuplicate = window.confirm(
            "This experience is already added on this day. Do you want to add it again?"
          );
          if (!confirmDuplicate) {
            // Revert removal from drawer
            newDrawerFavorites.splice(source.index, 0, movedFavorite);
            return;
          }
        }

        // City/Region/Prefecture Check: Ensure the experience's location matches those already on the board
        if (destBoard.favorites.length > 0) {
          const boardPrefecture =
            destBoard.favorites[0].experienceId.prefecture;
          if (movedFavorite.experienceId.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "The experience's prefecture doesn't match the others on this day. Do you want to add it anyway?"
            );
            if (!confirmMismatch) {
              // Revert removal from drawer
              newDrawerFavorites.splice(source.index, 0, movedFavorite);
              return;
            }
          }
        }

        // If validations pass, insert the favorite into the destination board
        const newFavs = Array.from(destBoard.favorites);
        newFavs.splice(destination.index, 0, movedFavorite);
        destBoard.favorites = newFavs;
        newBoards[destBoardIndex] = destBoard;
      }
      // Moving from a board to the drawer (no validations needed here)
      else if (
        source.droppableId !== "drawer" &&
        destination.droppableId === "drawer"
      ) {
        const sourceBoardIndex = parseInt(source.droppableId);
        const sourceBoard = { ...newBoards[sourceBoardIndex] };
        const [movedFavorite] = sourceBoard.favorites.splice(source.index, 1);
        newDrawerFavorites.splice(destination.index, 0, movedFavorite);
        newBoards[sourceBoardIndex] = sourceBoard;
      }
      // Moving from one board to another board
      else if (
        source.droppableId !== "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        const sourceBoardIndex = parseInt(source.droppableId);
        const destinationBoardIndex = parseInt(destination.droppableId);
        const sourceBoard = { ...newBoards[sourceBoardIndex] };
        const destinationBoard = { ...newBoards[destinationBoardIndex] };
        const [movedFavorite] = sourceBoard.favorites.splice(source.index, 1);

        const isDuplicate = destinationBoard.favorites.some(
          (fav) => fav.experienceId._id === movedFavorite.experienceId._id
        );
        if (isDuplicate) {
          const confirmDuplicate = window.confirm(
            "This experience is already added on this day. Do you want to add it again?"
          );
          if (!confirmDuplicate) {
            sourceBoard.favorites.splice(source.index, 0, movedFavorite);
            newBoards[sourceBoardIndex] = sourceBoard;
            return;
          }
        }

        if (destinationBoard.favorites.length > 0) {
          const boardPrefecture =
            destinationBoard.favorites[0].experienceId.prefecture;
          if (movedFavorite.experienceId.prefecture !== boardPrefecture) {
            const confirmMismatch = window.confirm(
              "The experience's prefecture doesn't match the others on this day. Do you want to add it anyway?"
            );
            if (!confirmMismatch) {
              // Revert the removal from the source board
              sourceBoard.favorites.splice(source.index, 0, movedFavorite);
              newBoards[sourceBoardIndex] = sourceBoard;
              return;
            }
          }
        }

        // If validations pass, add the favorite to the destination board
        destinationBoard.favorites.splice(destination.index, 0, movedFavorite);
        newBoards[sourceBoardIndex] = sourceBoard;
        newBoards[destinationBoardIndex] = destinationBoard;
      }
    }

    // Update board dates and daily budgets if there are any boards
    if (newBoards.length > 0) {
      const firstBoardDate = newBoards[0].date;
      const parsedStartDate = new Date(firstBoardDate);
      if (!isNaN(parsedStartDate.getTime())) {
        newBoards = newBoards.map((board, index) => ({
          ...board,
          date: new Date(
            parsedStartDate.getTime() + index * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          dailyBudget: board.favorites.reduce(
            (sum, fav) => sum + (fav.experienceId?.price || 0),
            0
          ),
        }));
      } else {
        console.error("Invalid first board date:", firstBoardDate);
      }
    }

    updateTotalBudget(newBoards);
    setBoards(newBoards);
    setDrawerFavorites(newDrawerFavorites);
    try {
      await updateItinerary(id, { boards: newBoards }, jwt);
    } catch (error) {
      console.error("Error updating itinerary after drag", error);
    }
  };

  const handleAddBoard = () => {
    const newBoard = { date: "", favorites: [], dailyBudget: 0 };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);
  };

  const handleRemoveFavorite = (boardIndex, favoriteIndex) => {
    const newBoards = [...boards];
    newBoards[boardIndex].favorites.splice(favoriteIndex, 1);
    newBoards[boardIndex].dailyBudget = newBoards[boardIndex].favorites.reduce(
      (sum, fav) => sum + fav.experienceId.price,
      0
    );
    setBoards(newBoards);
    updateTotalBudget(newBoards);
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
    if (!newNote.trim()) return;
    const note = {
      text: newNote,
      date: new Date(),
      author: { _id: user._id, name: user.name },
    };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    try {
      await updateItinerary(id, { notes: updatedNotes }, jwt);
      // You may want to show a toast here.
    } catch (error) {
      console.error("Error adding note", error);
    }
    setNewNote("");
    setNotesModalOpen(false);
  };

  // Determine if the current user is not the creator (i.e. invited)
  const isInvited = creator && String(creator._id) !== String(user._id);

  return (
    <Box>
      <ScrollHeader />
      {/* Back Button */}

      <Box>
        {" "}
        <DragDropContext onDragEnd={onDragEnd}>
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
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  backgroundColor: theme.palette.secondary.dark,
                  padding: "1rem",
                  borderRadius: "0 0 30px 30px",
                  color: "#fff",
                  mb: 3,
                }}
              >
                {" "}
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: "30rem", textTransform: "none" }}
                  >
                    Volver
                  </Button>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    mt={2}
                    justifyContent="center"
                  >
                    <Box display="flex">
                      {" "}
                      {isEditingName ? (
                        <TextField
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={handleSaveName}
                          autoFocus
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                        />
                      ) : (
                        <Typography
                          variant="h2"
                          sx={{ fontWeight: "bold", cursor: "pointer" }}
                          onClick={() => setIsEditingName(true)}
                        >
                          {name}
                        </Typography>
                      )}
                      <IconButton
                        onClick={handleSaveName}
                        sx={{ color: "#fff" }}
                      >
                        {isEditingName ? (
                          <Save size={16} />
                        ) : (
                          <Edit size={16} />
                        )}
                      </IconButton>
                    </Box>{" "}
                    {creator && (
                      <>
                        <Typography color="white" sx={{ fontSize: "0.85rem" }}>
                          Creado por: {creator.name}
                        </Typography>
                        {isInvited && (
                          <Typography
                            variant="subtitle2"
                            size={16}
                            color="white"
                          >
                            Tu rol: {myRole}
                          </Typography>
                        )}
                      </>
                    )}{" "}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Chip
                      label={`${travelDays} Días`}
                      icon={<CalendarDays size={16} />}
                      sx={{
                        backgroundColor: "#fff",
                        color: theme.palette.secondary.dark,
                      }}
                    />
                    <Chip
                      label={`€${totalBudget}`}
                      icon={<Wallet size={16} />}
                      sx={{
                        backgroundColor: "#fff",
                        color: theme.palette.secondary.dark,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      marginTop: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    <Travelers
                      travelers={travelers}
                      friendsList={friendsList}
                      onAddTraveler={handleAddTraveler}
                      onUpdateTraveler={handleUpdateTraveler}
                      onRemoveTraveler={handleRemoveTraveler}
                    />
                  </Box>
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <IconButton
                      onClick={() => setNotesModalOpen(true)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        borderRadius: "50%",
                        p: 1,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      {/* Message icon from lucide-react */}
                      <MessagesSquare size={24} />
                    </IconButton>
                  </Box>
                </Box>{" "}
              </Box>

              {/* Boards Section */}
              {isEditable ? (
                <Droppable
                  droppableId="boards"
                  type="BOARD"
                  direction="horizontal"
                >
                  {(providedBoards) => (
                    <Box
                      ref={providedBoards.innerRef}
                      {...providedBoards.droppableProps}
                      onMouseDown={handleMouseDown}
                      sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        p: 1,
                        paddingBottom: "20px",
                        height: "min-content",
                        whiteSpace: "nowrap",
                        "-webkit-user-select": "none",
                        userSelect: "none",
                        cursor: "grab",
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
                        <Draggable
                          key={`board-${boardIndex}`}
                          draggableId={`board-${boardIndex}`}
                          index={boardIndex}
                        >
                          {(providedBoard) => (
                            <Box
                              ref={providedBoard.innerRef}
                              {...providedBoard.draggableProps}
                              {...providedBoard.dragHandleProps}
                              sx={{
                                position: "relative",
                                mb: 3,
                                borderRadius: 5,
                                boxShadow: 2,
                                backgroundColor: theme.palette.primary.white,
                                height: "min-content",
                                maxHeight: "75vh",
                                minWidth: "325px !important",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                              }}
                            >
                              {/* Sticky Header */}
                              <Box
                                sx={{
                                  position: "sticky",
                                  top: 0,
                                  backgroundColor: theme.palette.primary.white,
                                  zIndex: 1,
                                  p: 2,
                                  borderBottom: `1px solid ${theme.palette.secondary.light}`,
                                }}
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Día {boardIndex + 1}
                                    </Typography>
                                    {board.date && (
                                      <Typography
                                        component="span"
                                        sx={{
                                          color: theme.palette.primary.main,
                                        }}
                                      >
                                        -{" "}
                                        {new Date(
                                          board.date
                                        ).toLocaleDateString()}
                                      </Typography>
                                    )}
                                  </Box>
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveBoard(boardIndex)
                                    }
                                    size="small"
                                  >
                                    <Trash2 size={18} color="red" />
                                  </IconButton>
                                </Box>{" "}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  mt={1}
                                  gap={1}
                                >
                                  {" "}
                                  <Coins
                                    size={18}
                                    mr={2}
                                    color={theme.palette.secondary.medium}
                                  />{" "}
                                  <Typography> {board.dailyBudget}€</Typography>
                                </Box>{" "}
                              </Box>

                              {/* Scrollable Activities Container */}
                              <Box
                                sx={{
                                  flex: 1,
                                  overflowY: "auto",
                                  px: 2,
                                  py: 1,
                                  pt: 0,
                                  pb: 50,
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", flexDirection: "row" }}
                                >
                                  {/* Left Timeline Column */}
                                  <Box
                                    sx={{
                                      position: "relative",
                                      width: "25px",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      pt: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        left: "50%",
                                        top: 0,
                                        bottom: 0,
                                        width: "2px",
                                        backgroundColor:
                                          theme.palette.secondary.main,
                                        transform: "translateX(-50%)",
                                        zIndex: 0,
                                      }}
                                    />
                                  </Box>

                                  <Droppable
                                    droppableId={`${boardIndex}`}
                                    type="FAVORITE"
                                  >
                                    {(providedFav) => (
                                      <Box
                                        ref={providedFav.innerRef}
                                        {...providedFav.droppableProps}
                                        sx={{ flex: 1, ml: 2 }}
                                      >
                                        {board.favorites.map(
                                          (fav, favIndex) => {
                                            const category =
                                              fav.experienceId?.categories ||
                                              "Other";
                                            return (
                                              <Draggable
                                                key={`${boardIndex}-${favIndex}`}
                                                draggableId={`${boardIndex}-${favIndex}`}
                                                index={favIndex}
                                              >
                                                {(providedItem) => (
                                                  <Paper
                                                    ref={providedItem.innerRef}
                                                    {...providedItem.draggableProps}
                                                    {...providedItem.dragHandleProps}
                                                    className="no-scroll"
                                                    sx={{
                                                      position: "relative",
                                                      mb: 3,
                                                      mt: 2,
                                                      borderRadius: 2,
                                                      boxShadow: 1,
                                                      overflow: "visible",
                                                      backgroundColor:
                                                        theme.palette.primary
                                                          .white,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          position: "absolute",
                                                          top: "8px",
                                                          marginLeft: "-55px",
                                                          zIndex: 2,
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "flex-start",
                                                          p: 1,
                                                        }}
                                                      >
                                                        <Box
                                                          sx={{
                                                            backgroundColor:
                                                              theme.palette
                                                                .primary.white,
                                                            border: `1.5px solid ${theme.palette.primary.main}`,
                                                            borderRadius: "50%",
                                                            p: 0.5,
                                                            zIndex: 1,
                                                          }}
                                                        >
                                                          {getCategoryIcon(
                                                            category,
                                                            theme
                                                          )}
                                                        </Box>
                                                      </Box>
                                                      <Box
                                                        sx={{
                                                          flex: 1,
                                                          p: 1,
                                                        }}
                                                      >
                                                        <Box
                                                          sx={{
                                                            width: "100%",
                                                            height: 100,
                                                            overflow: "hidden",
                                                            borderRadius: 3,
                                                          }}
                                                        >
                                                          <img
                                                            src={
                                                              fav.experienceId
                                                                ?.photo
                                                                ? stables.UPLOAD_FOLDER_BASE_URL +
                                                                  fav
                                                                    .experienceId
                                                                    .photo
                                                                : images.sampleFavoriteImage
                                                            }
                                                            alt={
                                                              fav.experienceId
                                                                ?.title
                                                            }
                                                            style={{
                                                              width: "100%",
                                                              height: "100%",
                                                              objectFit:
                                                                "cover",
                                                            }}
                                                          />
                                                        </Box>
                                                        <Box sx={{ p: 1 }}>
                                                          <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                              fontWeight:
                                                                "bold",
                                                            }}
                                                          >
                                                            {fav.experienceId
                                                              ?.title ||
                                                              "Actividad sin título"}
                                                          </Typography>
                                                          <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                          >
                                                            {fav.experienceId
                                                              ?.prefecture ||
                                                              "Ubicación desconocida"}
                                                          </Typography>
                                                          <Typography
                                                            variant="body2"
                                                            sx={{
                                                              color:
                                                                theme.palette
                                                                  .primary.main,
                                                              cursor: "pointer",
                                                              mt: 0.5,
                                                            }}
                                                          >
                                                            Agregar detalles
                                                          </Typography>
                                                        </Box>
                                                      </Box>
                                                    </Box>

                                                    <IconButton
                                                      onClick={() =>
                                                        handleRemoveFavorite(
                                                          boardIndex,
                                                          favIndex
                                                        )
                                                      }
                                                      sx={{
                                                        position: "absolute",
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor:
                                                          "rgba(255,255,255,0.8)",
                                                      }}
                                                    >
                                                      <Trash2
                                                        size={16}
                                                        color="red"
                                                      />
                                                    </IconButton>
                                                  </Paper>
                                                )}
                                              </Draggable>
                                            );
                                          }
                                        )}
                                        {providedFav.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </Box>
                              </Box>

                              {/* Sticky Note Button at Bottom */}
                              <Box
                                sx={{
                                  position: "sticky",
                                  bottom: 0,
                                  backgroundColor: theme.palette.primary.white,
                                  p: 2,
                                  textAlign: "center",
                                  boxShadow: `0px 2px 6px ${theme.palette.secondary.main}`,
                                  borderRadius: "4rem 4rem 2rem 2rem",
                                }}
                              >
                                <button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    color: theme.palette.primary.main,
                                    borderRadius: "20px",
                                    textTransform: "none",
                                    p: 2,
                                    display: "flex",
                                  }}
                                  onClick={() => {
                                    // Call your note dialog handler for this board
                                  }}
                                >
                                  {" "}
                                  <Plus size={20} />
                                  Añadir Experiencia
                                </button>{" "}
                                <button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    color: theme.palette.secondary.medium,
                                    borderRadius: "20px",
                                    textTransform: "none",
                                    p: 2,
                                    display: "flex",
                                  }}
                                  onClick={() => {
                                    // Call your note dialog handler for this board
                                  }}
                                >
                                  {" "}
                                  <Map size={20} /> Ver Mapa
                                </button>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {providedBoards.placeholder}
                      <Card
                        sx={{
                          minWidth: 300,
                          maxWidth: 300,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={handleAddBoard}
                      >
                        <CardContent>
                          <IconButton>
                            <Plus size={24} />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Droppable>
              ) : (
                // Non-editable boards view
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    p: 1,
                    paddingBottom: "20px",
                    height: "75vh",
                    whiteSpace: "nowrap",
                  }}
                >
                  {boards.map((board, boardIndex) => (
                    <Card
                      key={`board-${boardIndex}`}
                      sx={{
                        minWidth: 300,
                        maxWidth: 300,
                        borderRadius: "8px",
                        p: 1,
                        flexShrink: 0,
                        whiteSpace: "normal",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">
                          Day {boardIndex + 1}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {board.date || "Sin Fechas Definidas"}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          Budget: €{board.dailyBudget}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
            {isEditable && (
              <>
                {/* Right‑Anchored Drawer for Favorites */}
                <Drawer
                  variant="persistent"
                  anchor="right"
                  open={isDrawerOpen}
                  PaperProps={{
                    sx: {
                      width: drawerWidth,
                      // When open, show normally; when closed, translate right so that only 5px are visible.
                      transform: isDrawerOpen
                        ? "translateX(0)"
                        : `translateX(${drawerWidth - 5}px)`,
                      transition: "transform 0.3s ease-in-out",
                      top: "6rem", // Offset from top (adjust as needed)
                      backgroundColor: theme.palette.background.paper,
                      borderLeft: `2px solid ${theme.palette.secondary.light}`,
                      boxShadow: "none",
                    },
                  }}
                >
                  {/* Header inside the Drawer */}
                  <Box
                    sx={{
                      position: "sticky",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      borderBottom: `1px solid ${theme.palette.secondary.light}`,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Favorites
                    </Typography>
                    <FiltersDrawer
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      selectedRegion={selectedRegion}
                      setSelectedRegion={setSelectedRegion}
                      selectedPrefecture={selectedPrefecture}
                      setSelectedPrefecture={setSelectedPrefecture}
                      handleClearFilters={handleClearFilters}
                    />
                  </Box>

                  {/* Favorites List */}
                  <Droppable droppableId="drawer" type="FAVORITE">
                    {(providedDrawer) => (
                      <Box
                        ref={providedDrawer.innerRef}
                        {...providedDrawer.droppableProps}
                        sx={{
                          overflowY: "auto",
                          flex: 1,
                          p: 2,
                        }}
                      >
                        {Object.entries(groupedFavorites).map(
                          ([category, favs]) => (
                            <Box key={category} sx={{ mb: 2 }}>
                              {/* Category Header */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                {getCategoryIcon(category, theme)}
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    ml: 1,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  {category}
                                </Typography>
                              </Box>
                              {/* List of Favorites */}
                              {favs.map((fav, index) => (
                                <Draggable
                                  key={fav._id}
                                  draggableId={fav._id}
                                  index={index}
                                >
                                  {(providedFav) => (
                                    <Paper
                                      ref={providedFav.innerRef}
                                      {...providedFav.draggableProps}
                                      {...providedFav.dragHandleProps}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 1,
                                        overflow: "visible",
                                        p: 1,
                                        borderRadius: "8px",
                                        boxShadow: 1,
                                        cursor: "grab",
                                        "&:hover": { boxShadow: 3 },
                                      }}
                                    >
                                      <img
                                        src={
                                          fav.experienceId?.photo
                                            ? stables.UPLOAD_FOLDER_BASE_URL +
                                              fav.experienceId.photo
                                            : images.sampleFavoriteImage
                                        }
                                        alt={fav.experienceId?.title}
                                        style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: 8,
                                          objectFit: "cover",
                                        }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                        >
                                          {fav.experienceId?.title}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                        >
                                          {fav.experienceId?.prefecture}
                                        </Typography>
                                      </Box>
                                    </Paper>
                                  )}
                                </Draggable>
                              ))}
                            </Box>
                          )
                        )}
                        {providedDrawer.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Drawer>

                {/* Drawer Toggle Button with a background shape */}
                <div
                  style={{
                    background: theme.palette.primary.white,
                    width: "2rem",
                    // Position the background shape on the right so a small edge is always visible
                    right: isDrawerOpen ? drawerWidth - 40 : 0,
                    bottom: "1.75rem",
                    borderRadius: "2rem 0 0 2rem",
                    height: "3rem",
                    position: "fixed",
                  }}
                ></div>
                <IconButton
                  onClick={toggleDrawer}
                  sx={{
                    position: "fixed",
                    right: isDrawerOpen ? drawerWidth - 40 : 5,
                    bottom: "2rem",
                    zIndex: 1300,
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                    borderLeft: "2px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {isDrawerOpen ? <XCircle size={24} /> : <Plus size={24} />}
                </IconButton>
              </>
            )}
          </Box>
        </DragDropContext>
      </Box>

      {/* Notes Dialog */}
      <Dialog open={notesModalOpen} onClose={() => setNotesModalOpen(false)}>
        <DialogTitle>Notas Generales</DialogTitle>
        <DialogContent>
          {notes.length === 0 ? (
            <Typography>No hay notas aún.</Typography>
          ) : (
            notes.map((note, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2" fontWeight="bold">
                  {note.author?.name || "Anónimo"}
                </Typography>
                <Typography variant="body2">{note.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(note.date).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Añade una nota..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddNote}>
            Guardar Nota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItineraryDetailPage;

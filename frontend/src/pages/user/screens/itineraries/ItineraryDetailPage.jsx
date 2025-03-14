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
import {
  BedSingle,
  Plus,
  MessagesSquare,
  Save,
  Edit,
  Trash2,
  XCircle,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Header from "../../../../components/Header";
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
} from "../../../../services/index/itinerary";

const drawerWidth = 350;

const ItineraryDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, jwt } = useUser();

  // Itinerary fields
  const [filteredFavorites, setFilteredFavorites] = useState([]);

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

  // Determine if the user can edit (drag & drop) the itinerary
  const [isEditable, setIsEditable] = useState(false);
  // Determine the current user's role in the itinerary (if invited)
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
      return <BedSingle color={theme.palette.primary.main} />;
    if (category === "Atractivos")
      return <MdOutlineTempleBuddhist color={theme.palette.primary.main} />;
    if (category === "Restaurantes")
      return <MdOutlineRamenDining color={theme.palette.primary.main} />;
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
  const handleMouseDown = (e) => {
    if (!isEditable) return; // disable drag if not editable
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
      if (
        source.droppableId === "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        const destBoardIndex = parseInt(destination.droppableId);
        const destBoard = { ...newBoards[destBoardIndex] };
        const [movedFavorite] = newDrawerFavorites.splice(source.index, 1);
        const newFavs = Array.from(destBoard.favorites);
        newFavs.splice(destination.index, 0, movedFavorite);
        destBoard.favorites = newFavs;
        newBoards[destBoardIndex] = destBoard;
      } else if (
        source.droppableId !== "drawer" &&
        destination.droppableId === "drawer"
      ) {
        const sourceBoardIndex = parseInt(source.droppableId);
        const sourceBoard = { ...newBoards[sourceBoardIndex] };
        const [movedFavorite] = sourceBoard.favorites.splice(source.index, 1);
        newDrawerFavorites.splice(destination.index, 0, movedFavorite);
        newBoards[sourceBoardIndex] = sourceBoard;
      } else if (
        source.droppableId !== "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        const sourceBoardIndex = parseInt(source.droppableId);
        const destinationBoardIndex = parseInt(destination.droppableId);
        const sourceBoard = { ...newBoards[sourceBoardIndex] };
        const destinationBoard = { ...newBoards[destinationBoardIndex] };
        const [movedFavorite] = sourceBoard.favorites.splice(source.index, 1);
        destinationBoard.favorites.splice(destination.index, 0, movedFavorite);
        newBoards[sourceBoardIndex] = sourceBoard;
        newBoards[destinationBoardIndex] = destinationBoard;
      }
    }
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

  // Notes modal logic
  const [newNote, setNewNote] = useState("");

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
      <Header />
      {/* Back Button */}

      <Box sx={{ mt: "6rem" }}>
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
                marginLeft: isDrawerOpen ? `${drawerWidth}px` : "0",
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
                <Box display="flex" justifyContent="center">
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
                      variant="h5"
                      sx={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => setIsEditingName(true)}
                    >
                      {name}
                    </Typography>
                  )}
                  <IconButton onClick={handleSaveName} sx={{ color: "#fff" }}>
                    {isEditingName ? <Save size={16} /> : <Edit size={16} />}
                  </IconButton>
                </Box>
                {/* Show creator info and, if invited, current user's role */}
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  {creator && (
                    <>
                      <Typography variant="subtitle2" color="white">
                        Creado por: {creator.name}
                      </Typography>
                      {isInvited && (
                        <Typography variant="subtitle2" color="white">
                          Tu rol: {myRole}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>{" "}
                {/* Notes Section */}
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
                  {travelers?.length > 0 ? (
                    travelers.map((friend, index) => (
                      <Tooltip
                        key={index}
                        title={`${friend.role}: ${friend.userId.name}`}
                        arrow
                      >
                        <Chip
                          avatar={
                            <Avatar
                              src={
                                friend.userId.avatar
                                  ? `${stables.UPLOAD_FOLDER_BASE_URL}/${friend.userId.avatar}`
                                  : "/assets/default-avatar.jpg"
                              }
                              alt={friend.userId.name}
                            />
                          }
                          label={friend.userId.name}
                          variant="outlined"
                          sx={{
                            borderRadius: "50px",
                            backgroundColor: "#ffffff22",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#ffffff44",
                              cursor: "pointer",
                            },
                          }}
                        />
                      </Tooltip>
                    ))
                  ) : (
                    <Typography variant="body2" color="gray">
                      Sin compañeros de viaje.
                    </Typography>
                  )}
                </Box>
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
                        height: "75vh",
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
                            <Card
                              ref={providedBoard.innerRef}
                              {...providedBoard.draggableProps}
                              {...providedBoard.dragHandleProps}
                              sx={{
                                minWidth: 300,
                                maxWidth: 300,
                                height: "fit-content",
                                borderRadius: "8px",
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                flexShrink: 0,
                                whiteSpace: "normal",
                              }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="h6">
                                    Day {boardIndex + 1}
                                  </Typography>
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveBoard(boardIndex)
                                    }
                                    size="small"
                                  >
                                    <Trash2 size={18} color="red" />
                                  </IconButton>
                                </Box>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {board.date || "Sin Fechas Definidas"}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  mt={1}
                                >
                                  Budget: €{board.dailyBudget}
                                </Typography>
                                <Droppable
                                  droppableId={`${boardIndex}`}
                                  type="FAVORITE"
                                >
                                  {(providedFav) => (
                                    <Box
                                      ref={providedFav.innerRef}
                                      {...providedFav.droppableProps}
                                      sx={{
                                        mt: 2,
                                        minHeight: "150px",
                                        flexGrow: 1,
                                      }}
                                    >
                                      {board.favorites.map((fav, favIndex) => (
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
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1,
                                                p: 1,
                                                borderRadius: "8px",
                                              }}
                                            >
                                              <Typography variant="body2">
                                                {fav.experienceId?.title}
                                              </Typography>
                                              <IconButton
                                                onClick={() =>
                                                  handleRemoveFavorite(
                                                    boardIndex,
                                                    favIndex
                                                  )
                                                }
                                                sx={{ ml: "auto" }}
                                              >
                                                <Trash2 size={14} color="red" />
                                              </IconButton>
                                            </Paper>
                                          )}
                                        </Draggable>
                                      ))}
                                      {providedFav.placeholder}
                                    </Box>
                                  )}
                                </Droppable>
                              </CardContent>
                            </Card>
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
                {/* Drawer for Favorites */}
                <Drawer
                  variant="persistent"
                  anchor="left"
                  open={isDrawerOpen}
                  PaperProps={{
                    sx: {
                      width: drawerWidth,
                      left: isDrawerOpen ? 0 : `-${drawerWidth - 5}px`, // When closed, leave 5px visible
                      top: "6rem", // Offset from top (adjust as needed)
                      transition: "left 0.3s ease-in-out",
                      backgroundColor: theme.palette.background.paper,
                      borderRight: `2px solid ${theme.palette.secondary.light}`,
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
                      boxShadow: "none",
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
                    left: isDrawerOpen ? drawerWidth - 40 : 0,
                    bottom: "1.75rem",
                    borderRadius: "0 2rem 2rem 0",
                    height: "3rem",
                    position: "fixed",
                  }}
                ></div>
                <IconButton
                  onClick={toggleDrawer}
                  sx={{
                    position: "fixed",
                    left: isDrawerOpen ? drawerWidth - 40 : 5,
                    bottom: "2rem",
                    zIndex: 1300,
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                    borderRight: "2px solid rgba(0,0,0,0.1)",
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

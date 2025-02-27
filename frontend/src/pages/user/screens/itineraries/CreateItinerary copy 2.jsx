import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Button,
  Select,
  MenuItem,
  Tooltip,
  TextField,
  Chip,
  Avatar,
  Drawer,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Plus, Save, Edit } from "lucide-react";
import { Trash2, CalendarDays, Wallet, XCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { stables, images } from "../../../../constants";

// Import drag and drop components
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
    "Tokio",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Ibaraki",
    "Tochigi",
    "Gunma",
  ],
  Chubu: [
    "Aichi",
    "Shizuoka",
    "Gifu",
    "Nagano",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
  ],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: [
    "Fukuoka",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Saga",
  ],
};

const drawerWidth = 350;

const ItineraryDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, jwt } = useUser();

  // Itinerary fields
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]); // Each board represents a day with favorites
  const [notes, setNotes] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // We'll maintain a separate state for the drawer favorites.
  const [drawerFavorites, setDrawerFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Backend API calls
  const getSingleItineraryForEdit = async (itineraryId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `/api/itineraries/${itineraryId}/edit`,
      config
    );
    return data;
  };

  const getUserFavorites = async ({ userId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`/api/favorites/user/${userId}`, config);
    return data;
  };

  const updateItinerary = async (itineraryId, itinerary, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.patch(
      `/api/itineraries/${itineraryId}`,
      itinerary,
      config
    );
    return data;
  };

  // Fetch itinerary details
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const data = await getSingleItineraryForEdit(id, jwt);
        setName(data.name);
        setTravelDays(data.travelDays);
        setTotalBudget(data.totalBudget);
        setBoards(data.boards);
        setTravelers(data.travelers || []);
        setNotes(data.notes || []);
      } catch (error) {
        console.error("Error fetching itinerary", error);
      }
    };
    fetchItinerary();
  }, [id, jwt]);

  // Fetch favorites and initialize both favorites and drawerFavorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        const validFavorites = data.filter((fav) => fav.experienceId !== null);
        setFavorites(validFavorites);
        setFilteredFavorites(validFavorites);
        setDrawerFavorites(validFavorites);
      } catch (error) {
        console.error("Error fetching favorites", error);
      }
    };
    fetchFavorites();
  }, [user, jwt]);

  // Filter favorites based on dropdowns (for the drawer)
  const filterFavorites = () => {
    let filtered = [...favorites];
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (fav) => fav.experienceId.categories === selectedCategory
      );
    }
    if (selectedRegion !== "All") {
      filtered = filtered.filter(
        (fav) => fav.experienceId.region === selectedRegion
      );
    }
    if (selectedPrefecture !== "All") {
      filtered = filtered.filter(
        (fav) => fav.experienceId.prefecture === selectedPrefecture
      );
    }
    setFilteredFavorites(filtered);
    // Also update the drawer favorites accordingly.
    setDrawerFavorites(filtered);
  };

  useEffect(() => {
    filterFavorites();
  }, [selectedCategory, selectedRegion, selectedPrefecture, favorites]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedPrefecture("All");
    setFilteredFavorites(favorites);
    setDrawerFavorites(favorites);
  };

  const handleAddBoard = () => {
    const newBoard = { date: "", favorites: [], dailyBudget: 0 };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);
  };

  const handleRemoveBoard = (index) => {
    const updatedBoards = boards.filter((_, i) => i !== index);
    setBoards(updatedBoards);
    setTravelDays(updatedBoards.length);
    updateTotalBudget(updatedBoards);
  };

  const updateTotalBudget = (boardsArray) => {
    const total = boardsArray.reduce(
      (sum, board) =>
        sum +
        board.favorites.reduce(
          (s, fav) => s + (fav.experienceId?.price || 0),
          0
        ),
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

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Drag and Drop handlers using react-beautiful-dnd
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    let newBoards = [...boards];
    let newDrawerFavorites = [...drawerFavorites];

    if (type === "BOARD") {
      // Reorder boards
      const [removed] = newBoards.splice(source.index, 1);
      newBoards.splice(destination.index, 0, removed);
    } else if (type === "FAVORITE") {
      // Determine if dragging from drawer or from a board
      if (
        source.droppableId === "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        // Drag from drawer into a board
        const destBoardIndex = parseInt(destination.droppableId);
        const destBoard = { ...newBoards[destBoardIndex] };
        // Remove from drawerFavorites
        const [movedFavorite] = newDrawerFavorites.splice(source.index, 1);
        // Insert into destination board favorites at destination index
        const newFavs = Array.from(destBoard.favorites);
        newFavs.splice(destination.index, 0, movedFavorite);
        destBoard.favorites = newFavs;
        newBoards[destBoardIndex] = destBoard;
      } else if (
        source.droppableId !== "drawer" &&
        destination.droppableId === "drawer"
      ) {
        // Optional: dragging back from board to drawer
        const sourceBoardIndex = parseInt(source.droppableId);
        const sourceBoard = { ...newBoards[sourceBoardIndex] };
        const [movedFavorite] = sourceBoard.favorites.splice(source.index, 1);
        newDrawerFavorites.splice(destination.index, 0, movedFavorite);
        newBoards[sourceBoardIndex] = sourceBoard;
      } else if (
        source.droppableId !== "drawer" &&
        destination.droppableId !== "drawer"
      ) {
        // Moving between boards or within the same board
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

    setBoards(newBoards);
    setDrawerFavorites(newDrawerFavorites);
    // Optionally update total budget and backend
    updateTotalBudget(newBoards);
    try {
      await updateItinerary(id, { boards: newBoards }, jwt);
    } catch (error) {
      console.error("Error updating itinerary after drag", error);
    }
  };

  return (
    <Box
      sx={{ padding: "1rem", backgroundColor: "#f4f5f7", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          padding: "2rem",
          borderRadius: "0 0 30px 30px",
          color: "#fff",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
      </Box>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", p: 1 }}>
          {/* Favorites Drawer as a Droppable */}
          <Droppable droppableId="drawer" type="FAVORITE">
            {(providedDrawer) => (
              <Box
                ref={providedDrawer.innerRef}
                {...providedDrawer.droppableProps}
                sx={{
                  minWidth: "250px",
                  maxWidth: "250px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  height: "fit-content",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Favorites
                </Typography>
                {drawerFavorites.map((fav, index) => (
                  <Draggable key={fav._id} draggableId={fav._id} index={index}>
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
                          backgroundColor: "#ebecf0",
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
                          <Typography variant="body2" fontWeight="bold">
                            {fav.experienceId?.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {fav.experienceId?.prefecture}
                          </Typography>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {providedDrawer.placeholder}
              </Box>
            )}
          </Droppable>

          {/* Boards Section */}
          <Droppable droppableId="boards" type="BOARD" direction="horizontal">
            {(providedBoards) => (
              <Box
                ref={providedBoards.innerRef}
                {...providedBoards.droppableProps}
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  p: 1,
                  minHeight: "300px",
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
                          backgroundColor: "#ebecf0",
                          borderRadius: "8px",
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
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
                              onClick={() => handleRemoveBoard(boardIndex)}
                              size="small"
                            >
                              <Trash2 size={18} color="red" />
                            </IconButton>
                          </Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            {board.date || "No date set"}
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
                                sx={{ mt: 2, minHeight: "150px", flexGrow: 1 }}
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
                                          p: 1,
                                          mb: 1,
                                          borderRadius: "8px",
                                          backgroundColor: "#fff",
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
        </Box>
      </DragDropContext>

      {/* Submit Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="success"
          onClick={async () => {
            try {
              const response = await updateItinerary(id, { boards }, jwt);
              navigate(`/user/itineraries/manage/view/${response._id}`);
            } catch (error) {
              console.error("Error updating itinerary", error);
            }
          }}
        >
          Update Itinerary
        </Button>
      </Box>

      {/* Favorites Drawer (Persistent) */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Favorites
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft size={20} />
          </IconButton>
        </Box>
        {/* Filters (unchanged) */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Category:
          </Typography>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="All">All</MenuItem>
            {categoriesEnum.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle2" color="textSecondary">
            Region:
          </Typography>
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="All">All</MenuItem>
            {Object.keys(regions).map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle2" color="textSecondary">
            Prefecture:
          </Typography>
          <Select
            value={selectedPrefecture}
            onChange={(e) => setSelectedPrefecture(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            disabled={selectedRegion === "All"}
          >
            <MenuItem value="All">All</MenuItem>
            {selectedRegion !== "All" &&
              regions[selectedRegion].map((prefecture) => (
                <MenuItem key={prefecture} value={prefecture}>
                  {prefecture}
                </MenuItem>
              ))}
          </Select>
          <IconButton
            onClick={handleClearFilters}
            sx={{ alignSelf: "flex-end", mb: 2, color: "gray" }}
          >
            <XCircle size={20} />
          </IconButton>
        </Box>

        {/* Favorites Drawer List as a Droppable */}
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
              {drawerFavorites.map((fav, index) => (
                <Draggable key={fav._id} draggableId={fav._id} index={index}>
                  {(providedFav) => (
                    <Paper
                      ref={providedFav.innerRef}
                      {...providedFav.draggableProps}
                      {...providedFav.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                        p: 1,
                        borderRadius: "8px",
                        boxShadow: 1,
                        backgroundColor: "#fff",
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
                        <Typography variant="body2" fontWeight="bold">
                          {fav.experienceId?.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {fav.experienceId?.prefecture}
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {providedDrawer.placeholder}
            </Box>
          )}
        </Droppable>
      </Drawer>

      {!isDrawerOpen && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default ItineraryDetailPage;

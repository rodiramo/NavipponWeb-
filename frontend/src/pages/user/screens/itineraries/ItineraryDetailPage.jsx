import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { stables, images } from "../../../../constants";
import { FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Select,
  MenuItem,
  useTheme,
  TextField,
  Drawer,
  Tooltip,
} from "@mui/material";

import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Wallet,
  XCircle,
  Save,
  Edit,
} from "lucide-react";
import { Hotel, Place, Restaurant } from "@mui/icons-material"; // Import relevant icons

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

const ItineraryDetailPage = () => {
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Sidebar State

  const drawerWidth = 350; // Set drawer width

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const getSingleItineraryForEdit = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/itineraries/${id}/edit`, config);
      return data;
    } catch (error) {
      console.error("Error fetching itinerary for edit:", error);
      throw error;
    }
  };

  const getUserFavorites = async ({ userId, token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/favorites/user/${userId}`, config);
      return data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  };

  const updateItinerary = async (id, itinerary, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/itineraries/${id}`,
        itinerary,
        config
      );
      return data;
    } catch (error) {
      console.error("Error updating itinerary:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        setFavorites(data.filter((favorite) => favorite.experienceId !== null));
        setFilteredFavorites(
          data.filter((favorite) => favorite.experienceId !== null)
        );
      } catch (error) {
        toast.error("Error fetching favorites");
      }
    };

    fetchFavorites();
  }, [user, jwt]);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const data = await getSingleItineraryForEdit(id, jwt);
        setName(data.name);
        setTravelDays(data.travelDays);
        setTotalBudget(data.totalBudget);
        setBoards(data.boards);
        setTravelers(data.travelers || []);
        setNotes(data.notes || []); // ✅ Ensure notes is an array
      } catch (error) {
        toast.error("Error fetching itinerary");
      }
    };

    fetchItinerary();
  }, [id, jwt]);

  useEffect(() => {
    filterFavorites();
  }, [selectedCategory, selectedRegion, selectedPrefecture]);

  const filterFavorites = () => {
    let filtered = favorites;
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (favorite) => favorite.experienceId.categories === selectedCategory
      );
    }
    if (selectedRegion && selectedRegion !== "All") {
      filtered = filtered.filter(
        (favorite) => favorite.experienceId.region === selectedRegion
      );
    }
    if (selectedPrefecture && selectedPrefecture !== "All") {
      filtered = filtered.filter(
        (favorite) => favorite.experienceId.prefecture === selectedPrefecture
      );
    }
    setFilteredFavorites(filtered);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All");
    setSelectedPrefecture("All");
    setFilteredFavorites(favorites);
  };

  const handleAddBoard = () => {
    setBoards([...boards, { date: "", favorites: [], dailyBudget: 0 }]);
    setTravelDays(boards.length + 1);
  };

  const handleRemoveBoard = (index) => {
    const newBoards = boards.filter((_, i) => i !== index);
    setBoards(newBoards);
    setTravelDays(newBoards.length);
    updateTotalBudget(newBoards);
  };
  const handleCompleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].completed = true;
    setNotes(updatedNotes);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };
  const handleSaveName = async () => {
    setIsEditingName(false);

    if (!name.trim()) {
      toast.error("The itinerary name cannot be empty.");
      return;
    }

    try {
      await updateItinerary(id, { name }, jwt);
      toast.success("Itinerary name updated successfully!");
    } catch (error) {
      toast.error("Failed to update itinerary name.");
      console.error("Update error:", error);
    }
  };

  const handleDragStart = (e, favorite) => {
    e.dataTransfer.setData("favorite", JSON.stringify(favorite));
  };

  const handleDrop = async (e, boardIndex) => {
    e.preventDefault();

    const favorite = JSON.parse(e.dataTransfer.getData("favorite"));

    if (!favorite || !favorite.experienceId) {
      toast.error("Invalid favorite!");
      return;
    }

    // Create a copy of the boards
    const newBoards = [...boards];

    // Push the dragged favorite
    newBoards[boardIndex].favorites.push(favorite);

    // Update the daily budget for the board
    newBoards[boardIndex].dailyBudget = newBoards[boardIndex].favorites.reduce(
      (sum, fav) => sum + (fav.experienceId?.price || 0),
      0
    );

    // Update state immediately for UI responsiveness
    setBoards(newBoards);
    updateTotalBudget(newBoards);

    try {
      // Send updated boards to backend
      await updateItinerary(id, { boards: newBoards }, jwt);

      // Fetch the updated itinerary from the backend to reflect any changes
      const updatedItinerary = await getSingleItineraryForEdit(id, jwt);
      setBoards(updatedItinerary.boards);
      toast.success("Itinerary updated!");
    } catch (error) {
      toast.error("Failed to update itinerary");
      console.error("Update error:", error);
    }
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

  const updateTotalBudget = (boards) => {
    const total = boards.reduce((sum, board) => sum + board.dailyBudget, 0);
    setTotalBudget(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itinerary = { name, travelDays, totalBudget, boards, notes };
    try {
      const response = await updateItinerary(id, itinerary, jwt);
      toast.success("Itinerary updated successfully");
      navigate(`/user/itineraries/manage/view/${response._id}`);
    } catch (error) {
      toast.error("Error updating itinerary");
    }
  };

  return (
    <div className="edit-itinerary  ">
      <Box
        sx={{
          transition: "margin 0.3s ease-in-out",
          width: "100%",
          marginLeft: isDrawerOpen ? `${drawerWidth}px` : "0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            backgroundColor: theme.palette.secondary.dark, // Trello-like dark purple
            padding: "2rem",
            color: "#fff",
            borderRadius: "0px 0px 30px 30px",
            marginBottom: "16px",
          }}
        >
          {/* Editable Itinerary Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditingName ? (
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSaveName}
                autoFocus
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  input: { padding: "6px 8px" },
                }}
              />
            ) : (
              <Typography
                variant="h6"
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

          {/* Chips for Travel Days and Budget */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#ffffff22",
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              <CalendarDays size={16} />
              <Typography variant="body2">{travelDays} Días</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#ffffff22",
                padding: "6px 12px",
                borderRadius: "20px",
              }}
            >
              <Wallet size={16} />
              <Typography variant="body2">€{totalBudget}</Typography>
            </Box>
          </Box>

          {/* Travelers Section */}
          <Box sx={{ display: "flex", gap: 1, marginTop: "1rem" }}>
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

        {/* Friends Section */}
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              width: "100vh",
              overflowX: "auto",
              gap: 2,

              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: 4,
              },
            }}
          >
            {boards.map((board, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 300,
                  maxWidth: 300,
                  flexShrink: 0,
                }}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">Day {index + 1}</Typography>
                    <IconButton onClick={() => handleRemoveBoard(index)}>
                      <Trash2 size={18} color="red" />
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle2" color="textSecondary">
                    <CalendarDays size={14} style={{ marginRight: 4 }} />
                    {board.date || "No date set"}
                  </Typography>

                  <Typography variant="subtitle2" color="textSecondary" mt={1}>
                    <Wallet size={14} style={{ marginRight: 4 }} />
                    Budget: €{board.dailyBudget}
                  </Typography>

                  <Typography variant="subtitle1" mt={2}>
                    Favorites:
                  </Typography>

                  <Box mt={1} sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {board.favorites.length > 0 ? (
                      board.favorites.map((favorite, favIndex) => (
                        <Box
                          key={`${index}-${favIndex}`}
                          display="flex"
                          alignItems="center"
                          p={1}
                          borderRadius={2}
                          boxShadow={1}
                          mb={1}
                        >
                          <img
                            src={
                              favorite.experienceId?.photo
                                ? stables.UPLOAD_FOLDER_BASE_URL +
                                  favorite.experienceId.photo
                                : images.sampleFavoriteImage
                            }
                            alt={favorite.experienceId?.title}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              marginRight: 8,
                            }}
                          />
                          <Typography variant="body2">
                            {favorite.experienceId?.title}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleRemoveFavorite(index, favIndex)
                            }
                            sx={{ ml: "auto" }}
                          >
                            <Trash2 size={14} color="red" />
                          </IconButton>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        Drag & drop favorites here
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}

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

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Update Itinerary
          </button>
        </form>
      </Box>

      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s ease-in-out",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Favorites
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft size={20} />
          </IconButton>
        </Box>

        {/* Filters */}
        <Box sx={{ padding: "1rem" }}>
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

        {/* Favorites List */}
        <Box sx={{ overflowY: "auto", flex: 1, padding: "1rem" }}>
          {filteredFavorites.map((favorite) => {
            const category = favorite.experienceId?.categories;
            let CategoryIcon;
            if (category === "Hoteles") CategoryIcon = Hotel;
            else if (category === "Atractivos") CategoryIcon = Place;
            else if (category === "Restaurantes") CategoryIcon = Restaurant;

            return (
              <Paper
                key={favorite._id}
                draggable
                onDragStart={(e) => handleDragStart(e, favorite)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  p: 1,
                  borderRadius: "8px",
                  boxShadow: 1,
                  cursor: "grab",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                {CategoryIcon && (
                  <CategoryIcon sx={{ color: "primary.main" }} />
                )}

                <img
                  src={
                    favorite.experienceId?.photo
                      ? stables.UPLOAD_FOLDER_BASE_URL +
                        favorite.experienceId.photo
                      : images.sampleFavoriteImage
                  }
                  alt={favorite.experienceId?.title}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />

                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {favorite.experienceId?.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {favorite.experienceId?.prefecture}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
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
    </div>
  );
};

export default ItineraryDetailPage;

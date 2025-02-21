import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites } from "../../../../services/index/favorites";
import { createItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { stables, images } from "../../../../constants";
import { FaTrash, FaTimes } from "react-icons/fa";
import {
  useTheme,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
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

const CreateItinerary = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const { user, jwt } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites for user:", user);
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        console.log("Favorites data:", data);
        setFavorites(data.filter((favorite) => favorite.experienceId !== null));
        setFilteredFavorites(
          data.filter((favorite) => favorite.experienceId !== null)
        );
      } catch (error) {
        toast.error("Error fetching favorites");
        console.log("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user, jwt]);

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

  const handleDragStart = (e, favorite) => {
    e.dataTransfer.setData("favorite", JSON.stringify(favorite));
  };

  const handleDrop = (e, boardIndex) => {
    const favorite = JSON.parse(e.dataTransfer.getData("favorite"));
    const newBoards = [...boards];
    newBoards[boardIndex].favorites.push(favorite);
    newBoards[boardIndex].dailyBudget = newBoards[boardIndex].favorites.reduce(
      (sum, fav) => sum + fav.experienceId.price,
      0
    );
    setBoards(newBoards);
    updateTotalBudget(newBoards);
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
      const response = await createItinerary(itinerary, jwt);
      toast.success("Itinerary created successfully");
      navigate(`/user/itineraries/manage/view/${response._id}`);
    } catch (error) {
      toast.error("Error creating itinerary");
      console.log("Error creating itinerary:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 5,
        maxWidth: "1100px",
        mx: "auto",
        p: 3,
      }}
    >
      {/* Main Form */}
      <Box flex={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: theme.palette.secondary.main,
            mb: 3,
          }}
        >
          Crear Itinerario
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{
              mb: 3,
              bgcolor: "white",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                borderColor: theme.palette.secondary.light,
                "&:hover fieldset": {
                  borderColor: theme.palette.secondary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.secondary.dark,
                },
              },
            }}
          />

          {/* Read-only fields */}
          <TextField
            label="Días de viaje"
            value={travelDays}
            fullWidth
            disabled
            sx={{ mb: 3 }}
          />
          <TextField
            label="Presupuesto total"
            value={totalBudget}
            fullWidth
            disabled
            sx={{ mb: 3 }}
          />

          {/* Notes */}
          <TextField
            label="Notas"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            sx={{
              mb: 3,
              bgcolor: "white",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                borderColor: theme.palette.secondary.light,
                "&:hover fieldset": {
                  borderColor: theme.palette.secondary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.secondary.dark,
                },
              },
            }}
          />

          {/* Add Day Button */}
          <Button
            onClick={handleAddBoard}
            variant="contained"
            sx={{
              mb: 3,
              borderRadius: "30rem",
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Agregar Día
          </Button>

          {/* Boards */}
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            {boards.map((board, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: `2px solid ${theme.palette.secondary.light}`,
                  borderRadius: "10px",
                  mb: 3,
                  position: "relative",
                }}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  Día {index + 1}
                </Typography>

                {/* Remove Day Button */}
                <Button
                  onClick={() => handleRemoveBoard(index)}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: theme.palette.error.main,
                  }}
                >
                  <FaTrash size={18} />
                </Button>

                {/* Date */}
                <TextField
                  label="Fecha"
                  value={board.date}
                  onChange={(e) => {
                    const newBoards = [...boards];
                    newBoards[index].date = e.target.value;
                    setBoards(newBoards);
                  }}
                  fullWidth
                  sx={{ my: 2 }}
                />

                {/* Daily Budget */}
                <TextField
                  label="Presupuesto diario"
                  value={board.dailyBudget}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />

                {/* Favorites */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Favoritos
                </Typography>
                <Box>
                  {board.favorites.map((favorite, favIndex) => (
                    <Box
                      key={`${index}-${favorite._id}`}
                      display="flex"
                      alignItems="center"
                      mb={2}
                    >
                      <img
                        src={
                          favorite?.experienceId?.photo
                            ? stables.UPLOAD_FOLDER_BASE_URL +
                              favorite?.experienceId?.photo
                            : images.sampleFavoriteImage
                        }
                        alt={favorite.experienceId.title}
                        className="w-10 h-10 object-cover rounded-lg mr-2"
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {favorite.experienceId.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {favorite.experienceId.prefecture}
                        </Typography>
                      </Box>
                      <Button
                        onClick={() => handleRemoveFavorite(index, favIndex)}
                        sx={{ ml: 2, color: theme.palette.error.main }}
                      >
                        <FaTimes />
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              borderRadius: "30rem",
              bgcolor: theme.palette.success.main,
              "&:hover": { bgcolor: theme.palette.success.dark },
            }}
          >
            Crear Itinerario
          </Button>
        </form>
      </Box>

      {/* Sidebar - Favorites */}
      <Box
        sx={{
          width: { xs: "100%", lg: "35%" },
          position: { lg: "sticky" },
          top: 20,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Favoritos
        </Typography>

        {/* Filters */}
        <Select
          fullWidth
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">Todas las Categorías</MenuItem>
          {categoriesEnum.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">Todas las Regiones</MenuItem>
          {Object.keys(regions).map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value={selectedPrefecture}
          onChange={(e) => setSelectedPrefecture(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">Todas las Prefecturas</MenuItem>
          {selectedRegion !== "All" &&
            regions[selectedRegion].map((prefecture) => (
              <MenuItem key={prefecture} value={prefecture}>
                {prefecture}
              </MenuItem>
            ))}
        </Select>

        {/* Clear Filters Button */}
        <Button
          onClick={handleClearFilters}
          fullWidth
          sx={{
            mb: 3,
            bgcolor: theme.palette.grey[500],
            color: "white",
            "&:hover": { bgcolor: theme.palette.grey[700] },
          }}
        >
          Limpiar Filtros
        </Button>

        {/* Favorites List */}
        <Box>
          {filteredFavorites.map((favorite) => (
            <Box
              key={favorite._id}
              display="flex"
              alignItems="center"
              mb={3}
              p={2}
              border={`1px solid ${theme.palette.secondary.light}`}
              borderRadius="10px"
            >
              <img
                src={
                  favorite?.experienceId?.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL +
                      favorite?.experienceId?.photo
                    : images.sampleFavoriteImage
                }
                alt={favorite.experienceId.title}
                className="w-10 h-10 object-cover rounded-lg mr-2"
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {favorite.experienceId.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {favorite.experienceId.prefecture}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateItinerary;

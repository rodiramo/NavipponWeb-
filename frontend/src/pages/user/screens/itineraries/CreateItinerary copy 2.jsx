import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites } from "../../../../services/index/favorites";
import { getUserFriends } from "../../../../services/index/users"; // Import your friends service
import { createItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import BreadcrumbBack from "../../../../components/BreadcrumbBack";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { stables, images } from "../../../../constants";
import { FaTrash, FaTimes } from "react-icons/fa";
import {
  useTheme,
  MenuItem,
  Select,
  Box,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  IconButton,
  Chip,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { format, addDays, differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";

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
  const [name, setName] = useState("");
  const theme = useTheme();
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [notesArray, setNotesArray] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedPrefecture, setSelectedPrefecture] = useState("All");
  const { user, jwt } = useUser();
  const navigate = useNavigate();

  // State for managing friends fetched from API and selected ones
  const [availableFriends, setAvailableFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  // Multi-step state: steps: 0 = Detalles, 1 = Fechas y Boards, 2 = Amigos, 3 = Favorites, 4 = Revisión
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Detalles",
    "Fechas y Boards",
    "Amigos",
    "Favorites",
    "Revisión",
  ];

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: "selection",
    },
  ]);

  const addNote = () => {
    if (noteInput.trim()) {
      setNotesArray([
        ...notesArray,
        { text: noteInput.trim(), completed: false, author: user.name },
      ]);
      setNoteInput("");
    }
  };

  const deleteNote = (index) => {
    setNotesArray(notesArray.filter((_, i) => i !== index));
  };

  const toggleNote = (index) => {
    setNotesArray(
      notesArray.map((note, i) =>
        i === index ? { ...note, completed: !note.completed } : note
      )
    );
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites for user:", user);
        console.log("JWT token:", jwt);

        const data = await getUserFavorites({ userId: user._id, token: jwt });
        const validFavorites = data.filter(
          (favorite) => favorite.experienceId !== null
        );
        setFavorites(validFavorites);
        setFilteredFavorites(validFavorites);
      } catch (error) {
        toast.error("Error fetching favorites");
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user, jwt]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getUserFriends({ userId: user._id, token: jwt });
        setAvailableFriends(data);
      } catch (error) {
        toast.error("Error fetching friends");
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
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
  const handleDateChange = (ranges) => {
    const newRange = ranges.selection;
    setDateRange([newRange]);
    const daysCount =
      differenceInDays(newRange.endDate, newRange.startDate) + 1;
    setTravelDays(daysCount);

    // Create a new boards array with one board per day, setting the date automatically.
    const newBoards = [];
    for (let i = 0; i < daysCount; i++) {
      // You can choose any format; here we use "yyyy-MM-dd"
      const boardDate = format(addDays(newRange.startDate, i), "yyyy-MM-dd");
      newBoards.push({ date: boardDate, favorites: [], dailyBudget: 0 });
    }
    setBoards(newBoards);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map selected friends to travelers (each friend is expected to have an _id)
    const travelers = selectedFriends.map((friend) => ({
      userId: friend._id,
      role: friend.role || "viewer",
    }));

    const itinerary = {
      name,
      travelDays,
      totalBudget,
      boards,
      notes: notesArray,
      travelers,
    };
    try {
      const response = await createItinerary(itinerary, jwt);
      toast.success("Itinerary created successfully");
      navigate(`/user/itineraries/manage/view/${response._id}`);
    } catch (error) {
      toast.error("Error creating itinerary");
      console.error("Error creating itinerary:", error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div
            style={{
              background: theme.palette.primary.white,
              padding: "2rem",
              borderRadius: "16px",
              width: "100%",
            }}
            className={`relative rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] group `}
          >
            {" "}
            <Typography variant="h6" textAlign="center" marginBottom="10px">
              Detalles de Viaje
            </Typography>
            <Box sx={{ mb: 3, mt: 5 }}>
              <Typography color={theme.palette.secondary.medium}>
                Elige un nombre para identificar tu viaje.
              </Typography>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{
                  marginTop: 2,
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
            </Box>
            <Box sx={{ mb: 3 }}>
              {" "}
              <Typography color={theme.palette.secondary.medium}>
                Haz clic en una nota para marcarla como completada y usa el
                icono de eliminación para quitarla.
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  label="Agregar nota"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  variant="outlined"
                  sx={{ mr: 2, width: "100%", marginTop: 2 }}
                />
                <Button
                  onClick={addNote}
                  sx={{
                    textTransform: "none",
                    borderRadius: "30rem",
                  }}
                >
                  Agregar
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {notesArray.map((note, index) => (
                  <Chip
                    key={index}
                    label={note.text}
                    onClick={() => toggleNote(index)}
                    onDelete={() => deleteNote(index)}
                    sx={{
                      textDecoration: note.completed ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              background: theme.palette.primary.white,
              padding: "2rem",
              borderRadius: "16px",
            }}
          >
            <Box mb={3}>
              <Typography variant="h6" textAlign="center" marginBottom="10px">
                Seleccionar Fechas de Viaje
              </Typography>
              <DateRange
                ranges={dateRange}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
                locale={es}
              />
            </Box>
          </div>
        );
      // In case 2:
      case 2:
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: theme.palette.primary.white,
              padding: "2rem",
              borderRadius: "16px",
            }}
          >
            <Typography variant="h6" textAlign="center" marginBottom="10px">
              Agregar Compañeros de Viaje
            </Typography>
            <Typography color={theme.palette.secondary.medium} marginBottom={5}>
              Agrega e invita a tus amigos para que se unan al viaje. Invita a
              tus seres queridos, compañeros y amigos a ser parte de esta
              experiencia única.
            </Typography>

            <Autocomplete
              multiple
              id="friends-autocomplete"
              options={availableFriends}
              getOptionLabel={(option) => option.name}
              value={selectedFriends}
              sx={{ width: "100%" }}
              onChange={(event, newValue) => setSelectedFriends(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Buscar amigos"
                  placeholder="Seleccionar amigos"
                />
              )}
            />

            {/* Display role selection for each selected friend */}
            {selectedFriends.length > 0 && (
              <Box mt={2} width="100%">
                {selectedFriends.map((friend) => (
                  <Box
                    key={friend._id}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={1}
                    sx={{
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: "30rem",
                      padding: "0.5rem",
                    }}
                  >
                    <img
                      src={
                        friend.avatar
                          ? stables.UPLOAD_FOLDER_BASE_URL + friend.avatar
                          : "/assets/default-avatar.jpg"
                      }
                      alt={friend.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <Typography sx={{ flex: 1, mr: 2 }}>
                      {friend.name}
                    </Typography>
                    <Select
                      value={friend.role || "viewer"}
                      onChange={(e) => {
                        setSelectedFriends((prevFriends) =>
                          prevFriends.map((f) =>
                            f._id === friend._id
                              ? { ...f, role: e.target.value }
                              : f
                          )
                        );
                      }}
                      sx={{ borderRadius: 10 }}
                      size="small"
                    >
                      <MenuItem value="viewer">Solo Lectura</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                    </Select>
                  </Box>
                ))}
              </Box>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <Box display="flex" gap={4}>
              {/* Left Column: Days Cards */}
              <Box flex={2}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Agrega actividades a tus días
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {boards.map((board, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: `2px dashed ${theme.palette.secondary.light}`,
                        borderRadius: "10px",
                        minWidth: "250px",
                        flex: "1 1 250px",
                        position: "relative",
                      }}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "medium", mb: 1 }}
                      >
                        Día {index + 1}
                      </Typography>
                      <TextField
                        label="Fecha"
                        value={board.date}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="Presupuesto diario"
                        value={board.dailyBudget}
                        fullWidth
                        disabled
                        sx={{ mb: 2 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Actividades
                      </Typography>
                      {board.favorites.length === 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 2, display: "block" }}
                        >
                          Arrastra y suelta favoritos aquí
                        </Typography>
                      )}
                      <Box>
                        {board.favorites.map((favorite, favIndex) => (
                          <Box
                            key={`${index}-${favorite._id}`}
                            display="flex"
                            alignItems="center"
                            mb={1}
                            sx={{ borderBottom: "1px solid #eee", pb: 1 }}
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
                            <Box flexGrow={1}>
                              <Typography variant="body2" fontWeight="medium">
                                {favorite.experienceId.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {favorite.experienceId.prefecture}
                              </Typography>
                            </Box>
                            <Button
                              onClick={() =>
                                handleRemoveFavorite(index, favIndex)
                              }
                              sx={{ ml: 2, color: theme.palette.error.main }}
                            >
                              <FaTimes />
                            </Button>
                          </Box>
                        ))}
                      </Box>
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
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Right Column: Favorites Aside */}
              <Box flex={1}>
                <Box display="flex" gap={2} mb={3}>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      borderRadius: "30rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      minWidth: "150px",
                    }}
                  >
                    🗓️ Total Días de Viaje: {travelDays}
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      borderRadius: "30rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      minWidth: "180px",
                    }}
                  >
                    💰 Presupuesto: €{totalBudget}
                  </Box>
                </Box>
                <Typography variant="h6" className="text-xl font-bold mb-4">
                  Favorites
                </Typography>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="All">All</option>
                    {categoriesEnum.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Region:
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="All">All</option>
                    {Object.keys(regions).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Prefecture:
                  </label>
                  <select
                    value={selectedPrefecture}
                    onChange={(e) => setSelectedPrefecture(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="All">All</option>
                    {selectedRegion !== "All" &&
                      regions[selectedRegion].map((prefecture) => (
                        <option key={prefecture} value={prefecture}>
                          {prefecture}
                        </option>
                      ))}
                  </select>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Clear Filters
                </button>
                <ul>
                  {filteredFavorites.map((favorite) => (
                    <li
                      key={favorite._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, favorite)}
                      className="flex items-center mb-4 p-2 border border-gray-300 rounded-md"
                    >
                      {favorite.experienceId && (
                        <>
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
                          <div>
                            <p className="text-sm font-medium">
                              {favorite.experienceId.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {favorite.experienceId.prefecture}
                            </p>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </Box>
            </Box>
          </div>
        );
      case 4:
        return (
          <div>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revisa tu Itinerario
            </Typography>
            <Typography>
              <strong>Nombre:</strong> {name}
            </Typography>

            <Typography variant="h6">
              <strong>Notas:</strong>
            </Typography>
            {Array.isArray(notesArray) && notesArray.length > 0 ? (
              notesArray.map((note, index) => (
                <Typography
                  key={index}
                  sx={{
                    textDecoration: note.completed ? "line-through" : "none",
                  }}
                >
                  {note.text}
                </Typography>
              ))
            ) : (
              <Typography>No hay notas agregadas.</Typography>
            )}

            <Typography>
              <strong>Fechas:</strong>{" "}
              {dateRange[0].startDate.toLocaleDateString()} -{" "}
              {dateRange[0].endDate.toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Total Días:</strong> {travelDays}
            </Typography>
            <Typography>
              <strong>Total Presupuesto:</strong> €{totalBudget}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Amigos Agregados:
              </Typography>
              {selectedFriends.length > 0 ? (
                <ul>
                  {selectedFriends.map((friend, index) => (
                    <li key={index}>{friend.name}</li>
                  ))}
                </ul>
              ) : (
                <Typography>Ningún amigo agregado.</Typography>
              )}
            </Box>
            <Box mt={2}>
              {boards.map((board, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1">
                    Día {index + 1}: {board.date}
                  </Typography>
                  <Typography>
                    <strong>Presupuesto diario:</strong> €{board.dailyBudget}
                  </Typography>
                  <Typography variant="body2">Favoritos:</Typography>
                  <ul>
                    {board.favorites.map((favorite, favIndex) => (
                      <li key={favIndex}>
                        {favorite.experienceId.title} - €
                        {favorite.experienceId.price}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <div
      className="create-itinerary container px-5 py-5 flex flex-col lg:flex-row "
      style={{
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Box>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            padding: " 0.5rem 1rem",
            borderRadius: "30rem",
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.primary.main}`,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            },
          }}
        >
          <ArrowLeft size={16} />
        </IconButton>
        <Typography
          variant="h4"
          paddingTop={5}
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: theme.palette.secondary.medium,
            mb: 3,
          }}
        >
          Crear Itinerario
        </Typography>
        {/* Stepper Indicator */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box mt={2} display="flex" width="100%" justifyContent="center">
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{ mr: 2, borderRadius: "30rem", textTransform: "none" }}
              >
                <ArrowLeft size={16} /> Volver
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  borderRadius: "30rem",
                  textTransform: "none",
                  color: theme.palette.secondary.dark,
                  background: theme.palette.secondary.lightBlue,
                }}
              >
                Siguiente <ArrowRight size={16} />
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                type="submit"
                variant="contained"
                sx={{ textTransform: "none", borderRadius: "30rem" }}
              >
                Crear
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default CreateItinerary;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites } from "../../../../services/index/favorites";
import { getUserFriends } from "../../../../services/index/users"; // Import your friends service
import { createItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { stables } from "../../../../constants";
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
  const steps = ["Detalles", "Fechas", "Viajeros", "Revisión"];

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
        toast.error("Error obteniendo favoritos");
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
        toast.error("Error obteniendo amigos.");
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
          <div style={{ width: "100%" }}>
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
      <Box width="100%">
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFriends } from "../../../../services/index/users";
import { createItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Calendar,
  ClipboardList,
  Users,
} from "lucide-react";
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
  Card,
  CardContent,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { format, addDays, differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";

const CreateItinerary = () => {
  const [name, setName] = useState("");
  const theme = useTheme();
  const [travelDays, setTravelDays] = useState(0);
  const [boards, setBoards] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [notesArray, setNotesArray] = useState([]);
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const [availableFriends, setAvailableFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
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

  const handleDateChange = (ranges) => {
    const newRange = ranges.selection;
    setDateRange([newRange]);
    const daysCount =
      differenceInDays(newRange.endDate, newRange.startDate) + 1;
    setTravelDays(daysCount);

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
      boards,
      notes: notesArray,
      travelers,
    };
    try {
      const response = await createItinerary(itinerary, jwt);
      toast.success("Itinerario creado exitosamente");
      navigate(`/user/itineraries/manage/view/${response._id}`);
    } catch (error) {
      toast.error("Error creando itinerario.");
      console.error("Error creando itinerario:", error);
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
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.primary.black,
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
                  "& .MuiInputLabel-root": {
                    color: theme.palette.primary.black,
                    "&.Mui-focused": {
                      color: `${theme.palette.primary.black} !important`,
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
                  sx={{
                    mr: 2,
                    width: "100%",
                    marginTop: 2,
                    "& .MuiInputLabel-root": {
                      color: theme.palette.primary.black,
                      "&.Mui-focused": {
                        color: `${theme.palette.primary.black} !important`,
                      },
                    },
                  }}
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
              sx={{
                width: "100%",
                "& .MuiInputLabel-root": {
                  color: theme.palette.primary.black,
                  "&.Mui-focused": {
                    color: `${theme.palette.primary.black} !important`,
                  },
                },
              }}
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
          <div
            style={{
              width: "100%",
              background: theme.palette.primary.white,
              padding: "2rem",
              borderRadius: "16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                textAlign: "center",
                color: theme.palette.primary.black,
                fontWeight: "bold",
              }}
            >
              Revisa tu Itinerario
            </Typography>

            {/* Itinerary Name Card */}
            <Card
              sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: 2,
                background: theme.palette.background.default,
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <FileText size={20} color={theme.palette.primary.black} />
                  <Typography variant="h6" color={theme.palette.primary.black}>
                    Nombre del Viaje
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                >
                  {name || "Sin nombre"}
                </Typography>
              </CardContent>
            </Card>

            {/* Dates Card */}
            <Card
              sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: 2,
                background: theme.palette.background.default,
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Calendar size={20} color={theme.palette.primary.black} />
                  <Typography variant="h6" color={theme.palette.primary.black}>
                    Fechas de Viaje
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Inicio:</strong>{" "}
                  {dateRange[0].startDate.toLocaleDateString("es-ES")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Fin:</strong>{" "}
                  {dateRange[0].endDate.toLocaleDateString("es-ES")}
                </Typography>
                <Typography variant="body1">
                  <strong>Duración:</strong> {travelDays}{" "}
                  {travelDays === 1 ? "día" : "días"}
                </Typography>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card
              sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: 2,
                background: theme.palette.background.default,
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <ClipboardList
                    size={20}
                    color={theme.palette.primary.black}
                  />
                  <Typography variant="h6" color={theme.palette.primary.black}>
                    Notas del Viaje
                  </Typography>
                </Box>
                {Array.isArray(notesArray) && notesArray.length > 0 ? (
                  <Box>
                    {notesArray.map((note, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 1,
                          p: 1,
                          backgroundColor: note.completed
                            ? theme.palette.grey[100]
                            : theme.palette.background.default,
                          borderRadius: "8px",
                          border: `1px solid ${theme.palette.grey[300]}`,
                        }}
                      >
                        <Typography
                          sx={{
                            textDecoration: note.completed
                              ? "line-through"
                              : "none",
                            color: note.completed
                              ? theme.palette.grey[600]
                              : theme.palette.text.primary,
                          }}
                        >
                          • {note.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>No hay notas agregadas.</Typography>
                )}
              </CardContent>
            </Card>

            {/* Friends Card */}
            <Card
              sx={{
                mb: 2,
                borderRadius: "12px",
                boxShadow: 2,
                background: theme.palette.background.default,
              }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Users size={20} color={theme.palette.primary.black} />
                  <Typography variant="h6" color={theme.palette.primary.black}>
                    Compañeros de Viaje
                  </Typography>
                </Box>
                {selectedFriends.length > 0 ? (
                  <Box>
                    {selectedFriends.map((friend, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                          p: 1,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: "8px",
                          border: `1px solid ${theme.palette.grey[300]}`,
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
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <Typography sx={{ flex: 1 }}>{friend.name}</Typography>
                        <Chip
                          label={
                            friend.role === "editor" ? "Editor" : "Solo Lectura"
                          }
                          size="small"
                          color={
                            friend.role === "editor" ? "primary" : "default"
                          }
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color={theme.palette.grey[600]}>
                    No hay compañeros agregados.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>No hay más pasos.</div>;
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
                  color: theme.palette.primary.white,
                  background: theme.palette.secondary.medium,
                  "&:hover": {
                    background: theme.palette.secondary.main,
                  },
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

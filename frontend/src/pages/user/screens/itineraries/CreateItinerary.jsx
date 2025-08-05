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
  Check,
  X,
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
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Container,
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
      const boardDate = format(addDays(newRange.startDate, i), "yyyy-MM-dd");
      newBoards.push({ date: boardDate, favorites: [], dailyBudget: 0 });
    }
    setBoards(newBoards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <Card
            sx={{
              mx: "auto",
              borderRadius: 3,
              boxShadow: "rgba(7, 65, 210, 0.1) 0px 9px 30px",
              p: 3,
            }}
          >
            <Typography variant="h5" textAlign="center" mb={3} fontWeight="600">
              Detalles de viaje
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography color={theme.palette.secondary.medium} mb={2}>
                Elige un nombre para identificar tu viaje.
              </Typography>
              <TextField
                label="Nombre*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography color={theme.palette.secondary.medium} mb={2}>
                Crea una lista de tareas para tu viaje. Marca las tareas
                completadas usando el checkbox y organiza tus pendientes.
              </Typography>

              <Box display="flex" gap={2} mb={3}>
                <TextField
                  label="Nueva tarea"
                  placeholder="Ej: Reservar hotel, Comprar boletos..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  variant="outlined"
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                />
                <Button
                  onClick={addNote}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: 40,
                    minWidth: 10,
                  }}
                >
                  Agregar tarea
                </Button>
              </Box>

              {notesArray.length > 0 && (
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <List dense>
                    {notesArray.map((note, index) => (
                      <ListItem
                        key={index}
                        divider={index < notesArray.length - 1}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={note.completed}
                            onChange={() => toggleNote(index)}
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.text}
                          sx={{
                            textDecoration: note.completed
                              ? "line-through"
                              : "none",
                            opacity: note.completed ? 0.6 : 1,
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => deleteNote(index)}
                            size="small"
                            color="error"
                          >
                            <X size={16} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              )}
            </Box>
          </Card>
        );

      case 1:
        return (
          <Card
            sx={{
              mx: "auto",
              borderRadius: 3,
              boxShadow: "rgba(7, 65, 210, 0.1) 0px 9px 30px",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" textAlign="center" mb={3} fontWeight="600">
              Seleccionar fechas de viaje
            </Typography>
            <DateRange
              ranges={dateRange}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              minDate={new Date()}
              locale={es}
            />
          </Card>
        );

      case 2:
        return (
          <Card
            sx={{
              mx: "auto",
              borderRadius: 3,
              boxShadow: "rgba(7, 65, 210, 0.1) 0px 9px 30px",
              p: 3,
            }}
          >
            <Typography variant="h5" textAlign="center" mb={2} fontWeight="600">
              Agregar compañeros de viaje
            </Typography>
            <Typography
              color={theme.palette.secondary.medium}
              mb={4}
              textAlign="center"
            >
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

            {selectedFriends.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" mb={2}>
                  Roles asignados
                </Typography>
                {selectedFriends.map((friend) => (
                  <Box
                    key={friend._id}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                    p={2}
                    sx={{
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
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
                    <Typography sx={{ flex: 1 }}>{friend.name}</Typography>
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
                      sx={{ borderRadius: 2, minWidth: 140 }}
                      size="small"
                    >
                      <MenuItem value="viewer">Solo lectura</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                    </Select>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        );

      case 3:
        return (
          <Card
            sx={{
              mx: "auto",
              borderRadius: 3,
              boxShadow: "rgba(7, 65, 210, 0.1) 0px 9px 30px",
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              mb={4}
              fontWeight="600"
              color={theme.palette.primary.main}
            >
              Revisa tu itinerario
            </Typography>

            <Box display="flex" flexDirection="column" gap={3}>
              {/* Name Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <FileText size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" fontWeight="600">
                    Nombre del viaje
                  </Typography>
                </Box>
                <Typography variant="body1" fontSize="1.1rem">
                  {name || "Sin nombre"}
                </Typography>
              </Box>

              {/* Dates Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Calendar size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" fontWeight="600">
                    Fechas de viaje
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body1">
                    <strong>Inicio:</strong>{" "}
                    {dateRange[0].startDate.toLocaleDateString("es-ES")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Fin:</strong>{" "}
                    {dateRange[0].endDate.toLocaleDateString("es-ES")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Duración:</strong> {travelDays}{" "}
                    {travelDays === 1 ? "día" : "días"}
                  </Typography>
                </Box>
              </Box>

              {/* Tasks Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ClipboardList size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" fontWeight="600">
                    Lista de tareas
                  </Typography>
                </Box>
                {Array.isArray(notesArray) && notesArray.length > 0 ? (
                  <List dense>
                    {notesArray.map((note, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check
                            size={16}
                            color={
                              note.completed
                                ? theme.palette.success.main
                                : theme.palette.grey[400]
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.text}
                          sx={{
                            textDecoration: note.completed
                              ? "line-through"
                              : "none",
                            opacity: note.completed ? 0.7 : 1,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color={theme.palette.grey[600]}>
                    No hay tareas agregadas.
                  </Typography>
                )}
              </Box>

              {/* Friends Section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Users size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" fontWeight="600">
                    Compañeros de viaje
                  </Typography>
                </Box>
                {selectedFriends.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {selectedFriends.map((friend, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        sx={{
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.grey[200]}`,
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
                        <Typography sx={{ flex: 1 }} fontWeight="500">
                          {friend.name}
                        </Typography>
                        <Chip
                          label={
                            friend.role === "editor" ? "Editor" : "Solo lectura"
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
              </Box>
            </Box>
          </Card>
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="flex-start" mb={3}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            padding: "0.5rem 1rem",
            borderRadius: "30rem",
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.primary.main}`,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <ArrowLeft size={16} />
        </IconButton>
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color={theme.palette.secondary.medium}
        mb={4}
      >
        Crear itinerario
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderRadius: "30rem",
                textTransform: "none",
                px: 3,
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: 8 }} />
              Volver
            </Button>
          )}

          {activeStep < steps.length - 1 && (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                borderRadius: "30rem",
                textTransform: "none",
                px: 3,
                color: theme.palette.primary.white,
                background: theme.palette.secondary.medium,
                "&:hover": {
                  background: theme.palette.secondary.main,
                },
              }}
            >
              Siguiente
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </Button>
          )}

          {activeStep === steps.length - 1 && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "30rem",
                px: 3,
              }}
            >
              Crear itinerario
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default CreateItinerary;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Avatar,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import FriendsWidget from "../widgets/FriendWidget";
import { useTheme } from "@mui/material/styles";

import {
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  Plus,
  Plane,
  Heart,
  TrendingUp as TrendingUpIcon,
  Star,
  CirclePlus,
  Award,
} from "lucide-react";
import useUser from "../../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getUserItineraries } from "../../../services/index/itinerary";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const theme = useTheme();
  const { user, jwt } = useUser();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Reservar vuelos", checked: false, priority: "high" },
    { id: 2, text: "Buscar alojamiento", checked: false, priority: "high" },
    {
      id: 3,
      text: "Planificar itinerario",
      checked: false,
      priority: "medium",
    },
    { id: 4, text: "Cambiar moneda", checked: false, priority: "low" },
    { id: 5, text: "Revisar documentos", checked: false, priority: "high" },
    { id: 6, text: "Empacar equipaje", checked: false, priority: "low" },
  ]);

  const [newTask, setNewTask] = useState("");

  // Fetch user's itineraries
  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ["userItineraries", user?._id],
    queryFn: () => getUserItineraries(user._id, jwt),
    enabled: !!user && !!jwt,
  });

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addNewTask = () => {
    if (newTask.trim()) {
      const newId = Math.max(...checklist.map((item) => item.id)) + 1;
      setChecklist((prev) => [
        ...prev,
        {
          id: newId,
          text: newTask,
          checked: false,
          priority: "medium",
        },
      ]);
      setNewTask("");
      toast.success("Tarea añadida");
    }
  };

  const removeTask = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
    toast.success("Tarea eliminada");
  };

  const completedTasks = checklist.filter((item) => item.checked).length;
  const completionPercentage = (completedTasks / checklist.length) * 100;

  const getCurrentTrip = () => {
    const now = new Date();
    return itineraries.find((trip) => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return startDate <= now && endDate >= now;
    });
  };

  const getUpcomingTrip = () => {
    const now = new Date();
    return itineraries
      .filter((trip) => new Date(trip.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
  };

  const currentTrip = getCurrentTrip();
  const upcomingTrip = getUpcomingTrip();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getTripImage = (trip) => {
    const images = [
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
    ];
    return images[trip?.name?.length % images.length] || images[0];
  };

  const TripCard = ({ trip, type, isEmpty = false }) => (
    <Card
      sx={{
        height: "280px",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        background: isEmpty
          ? `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.light}08)`
          : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: "white",
        cursor: trip ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": trip
          ? {
              transform: "translateY(-8px)",
              boxShadow: `0 12px 40px ${theme.palette.primary.main}40`,
            }
          : {},
      }}
      onClick={() =>
        trip && navigate(`/user/itineraries/manage/view/${trip._id}`)
      }
    >
      {trip && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "120px",
            backgroundImage: `url(${getTripImage(trip)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.primary.main}90 100%)`,
            },
          }}
        />
      )}

      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            color={theme.palette.secondary.medium}
          >
            <Plane size={20} />
            <Typography variant="h6" fontWeight="bold">
              {type === "current" ? "Viaje actual" : "Próximo viaje"}
            </Typography>
          </Box>

          {trip ? (
            <>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                {trip.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Calendar size={16} />
                <Typography variant="body2">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Users size={16} />
                <Typography variant="body2">
                  {trip.travelers?.length || 1} viajeros
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={16} />
                <Typography variant="body2">{trip.travelDays} días</Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 2, color: theme.palette.text.secondary }}
              >
                {type === "current"
                  ? "No hay viajes activos"
                  : "No hay viajes programados"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => navigate("/user/itineraries/manage/create")}
                sx={{
                  borderRadius: "50px",
                  textTransform: "none",
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                Crear itinerario
              </Button>
            </Box>
          )}
        </Box>

        {trip && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "50px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
            >
              Ver detalles
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          ¡Hola, {user?.name}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Aquí tienes un resumen de tus aventuras
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Trip Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TripCard
                trip={currentTrip}
                type="current"
                isEmpty={!currentTrip}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TripCard
                trip={upcomingTrip}
                type="upcoming"
                isEmpty={!upcomingTrip}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Travel Checklist */}
            <Card sx={{ borderRadius: "20px", overflow: "hidden" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckSquare size={24} color={theme.palette.primary.main} />
                    <Typography variant="h6" fontWeight="bold">
                      Lista de viaje
                    </Typography>
                  </Box>
                  <Chip
                    label={`${completedTasks}/${checklist.length}`}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {Math.round(completionPercentage)}% completado
                  </Typography>
                </Box>

                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {checklist.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        px: 0,
                        borderRadius: "12px",
                        mb: 1,
                        "&:hover": {
                          backgroundColor: theme.palette.grey[50],
                        },
                      }}
                    >
                      <Checkbox
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <ListItemText
                        primary={item.text}
                        sx={{
                          textDecoration: item.checked
                            ? "line-through"
                            : "none",
                          opacity: item.checked ? 0.6 : 1,
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: getPriorityColor(item.priority),
                          mr: 1,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeTask(item.id)}
                        sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
                      ></IconButton>
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <input
                    type="text"
                    placeholder="Nueva tarea..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addNewTask()}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: "8px",
                      outline: "none",
                    }}
                  />
                  <IconButton
                    onClick={addNewTask}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {" "}
                    <CirclePlus />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: "16px", textAlign: "center", p: 2 }}>
                <Award size={32} color={theme.palette.primary.main} />
                <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                  {itineraries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Viajes creados
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: "16px", textAlign: "center", p: 2 }}>
                <MapPin size={32} color={theme.palette.success.main} />
                <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                  {itineraries.reduce(
                    (total, trip) => total + (trip.travelDays || 0),
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Días de viaje
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: "16px", textAlign: "center", p: 2 }}>
                <Users size={32} color={theme.palette.info.main} />
                <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                  {user?.friends?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amigos viajeros
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: "16px", textAlign: "center", p: 2 }}>
                <Star size={32} color={theme.palette.warning.main} />
                <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                  {Math.round(completionPercentage)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tareas completadas
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: "20px" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <TrendingUpIcon size={24} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight="bold">
                  Actividad reciente
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ mb: 1 }}
                    >
                      Últimos logros
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Has completado {completedTasks} tareas de viaje esta
                      semana
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ mb: 1 }}
                    >
                      Próximos eventos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {upcomingTrip
                        ? `Tu viaje a ${upcomingTrip.name} está próximo`
                        : "No hay viajes programados"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

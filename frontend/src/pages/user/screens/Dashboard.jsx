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
  Badge,
} from "@mui/material";
import { MdOutlineWavingHand } from "react-icons/md";

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
  Settings,
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Target,
  Compass,
  Camera,
  Bell,
} from "lucide-react";
import useUser from "../../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getUserItineraries } from "../../../services/index/itinerary";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Widget Components
const WelcomeWidget = ({ user, theme }) => (
  <Card
    sx={{
      borderRadius: "20px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "none",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            ¡Hola, {user?.name}!
            <MdOutlineWavingHand color={theme.palette.primary.main} size={24} />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Listo para tu próxima aventura en Japón
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const StatsWidget = ({ title, value, subtitle, icon, color, trend }) => (
  <Card
    sx={{
      borderRadius: "16px",
      height: "100%",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { size: 24, color })}
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CurrentTripWidget = ({ trip, theme, navigate }) => {
  if (!trip) return null;

  const daysLeft = Math.ceil(
    (new Date(trip.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );
  const progress = ((totalDays - daysLeft) / totalDays) * 100;

  return (
    <Card
      sx={{
        borderRadius: "20px",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="success.main">
            🎯 Viaje Actual
          </Typography>
          <IconButton size="small">
            <MoreVertical size={16} />
          </IconButton>
        </Box>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          {trip.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Calendar size={16} color={theme.palette.text.secondary} />
          <Typography variant="body2" color="text.secondary">
            {daysLeft} días restantes
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.success.main,
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {Math.round(progress)}% completado
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => navigate(`/itinerary/${trip._id}`)}
          sx={{ borderRadius: "12px", textTransform: "none" }}
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );
};

const ChecklistWidget = ({
  checklist,
  setChecklist,
  newTask,
  setNewTask,
  addNewTask,
  removeTask,
  theme,
}) => {
  const completedTasks = checklist.filter((item) => item.checked).length;
  const completionPercentage = (completedTasks / checklist.length) * 100;

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

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

  return (
    <Card sx={{ borderRadius: "20px", height: "fit-content" }}>
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
          <Badge badgeContent={completedTasks} color="primary">
            <Target size={20} color={theme.palette.text.secondary} />
          </Badge>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {Math.round(completionPercentage)}%
            </Typography>
          </Box>
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
        </Box>

        <List sx={{ maxHeight: 280, overflow: "auto", mb: 2 }}>
          {checklist.slice(0, 5).map((item) => (
            <ListItem
              key={item.id}
              sx={{
                px: 0,
                py: 0.5,
                borderRadius: "8px",
                "&:hover": { backgroundColor: theme.palette.grey[50] },
              }}
            >
              <Checkbox
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                size="small"
              />
              <ListItemText
                primary={item.text}
                sx={{
                  textDecoration: item.checked ? "line-through" : "none",
                  opacity: item.checked ? 0.6 : 1,
                  "& .MuiListItemText-primary": {
                    fontSize: "0.875rem",
                  },
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: getPriorityColor(item.priority),
                  mr: 1,
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", gap: 1 }}>
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
              fontSize: "0.875rem",
            }}
          />
          <IconButton
            onClick={addNewTask}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <Plus size={18} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const ActivityWidget = ({
  itineraries,
  completedTasks,
  upcomingTrip,
  theme,
}) => {
  const activities = [
    {
      icon: <CheckCircle2 size={16} color={theme.palette.success.main} />,
      text: `Completaste ${completedTasks} tareas esta semana`,
      time: "Hoy",
    },
    {
      icon: <Star size={16} color={theme.palette.warning.main} />,
      text: `Creaste ${itineraries.length} itinerarios`,
      time: "Este mes",
    },
  ];

  return (
    <Card sx={{ borderRadius: "20px" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Bell size={20} color={theme.palette.primary.main} />
          <Typography variant="h6" fontWeight="bold">
            Actividad reciente
          </Typography>
        </Box>

        <Stack spacing={2}>
          {activities.map((activity, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: "12px",
              }}
            >
              {activity.icon}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{activity.text}</Typography>
                {activity.time && (
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

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

  const addNewTask = () => {
    if (newTask.trim()) {
      const newId = Math.max(...checklist.map((item) => item.id)) + 1;
      setChecklist((prev) => [
        ...prev,
        { id: newId, text: newTask, checked: false, priority: "medium" },
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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={3}>
        {/* Welcome Widget - Full Width */}
        <Grid item xs={12}>
          <WelcomeWidget user={user} theme={theme} />
        </Grid>

        {/* Stats Widgets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsWidget
            title="Viajes creados"
            value={itineraries.length}
            subtitle="Total de itinerarios"
            icon={<Award />}
            color={theme.palette.primary.main}
            trend={12}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsWidget
            title="Días de viaje"
            value={itineraries.reduce(
              (total, trip) => total + (trip.travelDays || 0),
              0
            )}
            subtitle="Días planificados"
            icon={<MapPin />}
            color={theme.palette.success.main}
            trend={8}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsWidget
            title="Amigos viajeros"
            value={user?.friends?.length || 0}
            subtitle="Conexiones"
            icon={<Users />}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsWidget
            title="Tareas completadas"
            value={`${Math.round((completedTasks / checklist.length) * 100)}%`}
            subtitle="Progreso general"
            icon={<CheckCircle2 />}
            color={theme.palette.warning.main}
          />
        </Grid>

        {/* Current Trip Widget */}
        {currentTrip && (
          <Grid item xs={12} md={6}>
            <CurrentTripWidget
              trip={currentTrip}
              theme={theme}
              navigate={navigate}
            />
          </Grid>
        )}

        {/* Checklist Widget */}
        <Grid item xs={12} md={6}>
          <ChecklistWidget
            checklist={checklist}
            setChecklist={setChecklist}
            newTask={newTask}
            setNewTask={setNewTask}
            addNewTask={addNewTask}
            removeTask={removeTask}
            theme={theme}
          />
        </Grid>

        {/* Activity Widget */}
        <Grid item xs={12} md={6}>
          <ActivityWidget
            itineraries={itineraries}
            completedTasks={completedTasks}
            upcomingTrip={upcomingTrip}
            theme={theme}
          />
        </Grid>

        {/* Friends Widget */}
        <Grid item xs={12}>
          <FriendsWidget />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

// Updated Dashboard component with mobile-optimized stats widgets
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Button,
  LinearProgress,
  Grid,
  Stack,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import { MdOutlineWavingHand } from "react-icons/md";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import FriendsWidget from "../widgets/FriendWidget";
import { useTheme } from "@mui/material/styles";

import {
  MapPin,
  Calendar,
  Users,
  CheckSquare,
  Plus,
  Star,
  Award,
  MoreVertical,
  CheckCircle2,
  Target,
  Bell,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Flag,
  BookOpen,
  Plane,
  Package,
  CreditCard,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import useUser from "../../../hooks/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserItineraries } from "../../../services/index/itinerary";
import {
  getUserChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../../../services/index/checklist";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const WelcomeWidget = ({ user, theme, isMobile }) => (
  <Card
    sx={{
      borderRadius: "20px",
      position: "relative",
      background: theme.palette.background.blue,
      overflow: "hidden",
      boxShadow: "none",
    }}
  >
    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            ¡Hola, {user?.name}!
            <MdOutlineWavingHand
              color={theme.palette.primary.main}
              size={isMobile ? 20 : 24}
            />
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
          >
            Listo para tu próxima aventura en Japón
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const StatsWidget = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  theme,
  isMobile,
}) => (
  <Card
    sx={{
      borderRadius: isMobile ? "12px" : "16px",
      height: "100%",
      position: "relative",
      background: theme.palette.background.blue,
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: isMobile ? 1 : 2,
        }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontWeight="bold"
            color={color}
            sx={{ fontSize: isMobile ? "1.25rem" : "2rem" }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            p: isMobile ? 0.75 : 1.5,
            borderRadius: isMobile ? "8px" : "12px",
            backgroundColor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, {
            size: isMobile ? 16 : 24,
            color,
          })}
        </Box>
      </Box>
      {subtitle && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const CurrentTripWidget = ({ trip, theme, navigate, isMobile }) => {
  if (!trip) return null;

  const daysLeft = Math.ceil(
    (new Date(trip.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.ceil(
    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
  );
  const progress = ((totalDays - daysLeft) / totalDays) * 100;

  return (
    <Card sx={{ borderRadius: "20px" }}>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            🎯 Viaje Actual
          </Typography>
          <IconButton size="small">
            <MoreVertical size={16} />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 1,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
          }}
        >
          {trip.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Calendar size={16} color={theme.palette.text.secondary} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
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
            sx={{
              mt: 0.5,
              display: "block",
              fontSize: isMobile ? "0.65rem" : "0.75rem",
            }}
          >
            {Math.round(progress)}% completado
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => navigate(`/itinerary/${trip._id}`)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );
};

// Enhanced Task Form Component (unchanged for brevity)
const TaskFormDialog = ({
  open,
  onClose,
  onSubmit,
  editTask = null,
  theme,
}) => {
  const [formData, setFormData] = useState({
    text: "",
    priority: "medium",
    category: "otros",
    dueDate: null,
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (open) {
      if (editTask) {
        setFormData({
          text: editTask.text || "",
          priority: editTask.priority || "medium",
          category: editTask.category || "otros",
          dueDate: editTask.dueDate ? new Date(editTask.dueDate) : null,
        });
      } else {
        setFormData({
          text: "",
          priority: "medium",
          category: "otros",
          dueDate: null,
        });
      }
      setErrors({});
    }
  }, [open, editTask]);

  const categories = [
    { value: "viaje", label: "Viaje", icon: <Plane size={16} /> },
    { value: "documentos", label: "Documentos", icon: <FileText size={16} /> },
    { value: "equipaje", label: "Equipaje", icon: <Package size={16} /> },
    { value: "reservas", label: "Reservas", icon: <CreditCard size={16} /> },
    {
      value: "planificación",
      label: "Planificación",
      icon: <BookOpen size={16} />,
    },
    { value: "otros", label: "Otros", icon: <MoreHorizontal size={16} /> },
  ];

  const priorities = [
    { value: "high", label: "Alta", color: "#f44336" },
    { value: "medium", label: "Media", color: "#ff9800" },
    { value: "low", label: "Baja", color: "#4caf50" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = "La tarea es requerida";
    } else if (formData.text.length > 200) {
      newErrors.text = "La tarea no puede exceder 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", background: theme.palette.background.blue },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckSquare size={24} color={theme.palette.primary.main} />
          <Typography variant="h6" fontWeight="bold">
            {editTask ? "Editar Tarea" : "Nueva Tarea"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} pt={3}>
          <TextField
            label="Descripción de la tarea"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            error={!!errors.text}
            helperText={errors.text || `${formData.text.length}/200 caracteres`}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{
              "& .MuiInputLabel-root": {
                color: `${theme.palette.primary.black} !important`,
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: `${theme.palette.primary.black} !important`,
                  "&.Mui-focused": {
                    color: `${theme.palette.primary.black} !important`,
                  },
                }}
              >
                Prioridad
              </InputLabel>
              <Select
                value={formData.priority}
                label="Prioridad"
                onChange={(e) => handleInputChange("priority", e.target.value)}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Flag size={16} color={priority.color} />
                      <Typography>{priority.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: `${theme.palette.primary.black} !important`,
                  "&.Mui-focused": {
                    color: `${theme.palette.primary.black} !important`,
                  },
                }}
              >
                Categoría
              </InputLabel>
              <Select
                value={formData.category}
                label="Categoría"
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {category.icon}
                      <Typography>{category.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha límite (opcional)"
              value={formData.dueDate}
              onChange={(date) => handleInputChange("dueDate", date)}
              minDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: {
                    "& .MuiInputLabel-root": {
                      color: `${theme.palette.primary.black} !important`,
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ borderRadius: "30px", textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.text.trim()}
          sx={{ borderRadius: "30px", minWidth: 120, textTransform: "none" }}
        >
          {editTask ? "Actualizar" : "Crear tarea"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced ChecklistWidget with mobile optimizations
const ChecklistWidget = ({ user, jwt, theme, isMobile }) => {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const queryClient = useQueryClient();

  const { data: checklist = [], isLoading } = useQuery({
    queryKey: ["userChecklist", user?._id],
    queryFn: () => getUserChecklist(user._id, jwt),
    enabled: !!user && !!jwt,
  });

  const createMutation = useMutation({
    mutationFn: (itemData) =>
      createChecklistItem({ ...itemData, userId: user._id }, jwt),
    onSuccess: () => {
      queryClient.invalidateQueries(["userChecklist", user._id]);
      toast.success("Tarea creada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear tarea: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, itemData }) =>
      updateChecklistItem(itemId, itemData, jwt),
    onSuccess: () => {
      queryClient.invalidateQueries(["userChecklist", user._id]);
    },
    onError: (error) => {
      toast.error("Error al actualizar tarea: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId) => deleteChecklistItem(itemId, jwt),
    onSuccess: () => {
      queryClient.invalidateQueries(["userChecklist", user._id]);
      toast.success("Tarea eliminada");
    },
    onError: (error) => {
      toast.error("Error al eliminar tarea: " + error.message);
    },
  });

  const completedTasks = checklist.filter((item) => item.checked).length;
  const pendingTasks = checklist.filter((item) => !item.checked);
  const completedTasksList = checklist.filter((item) => item.checked);
  const completionPercentage =
    checklist.length > 0 ? (completedTasks / checklist.length) * 100 : 0;

  const toggleChecklistItem = (item) => {
    updateMutation.mutate({
      itemId: item._id,
      itemData: { checked: !item.checked },
    });
  };

  const handleCreateTask = (formData) => {
    createMutation.mutate(formData);
  };

  const handleEditTask = (formData) => {
    updateMutation.mutate({
      itemId: editingTask._id,
      itemData: formData,
    });
    setEditingTask(null);
  };

  const removeTask = (itemId) => {
    deleteMutation.mutate(itemId);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setFormDialogOpen(true);
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

  const getCategoryIcon = (category) => {
    const iconMap = {
      viaje: <Plane size={14} />,
      documentos: <FileText size={14} />,
      equipaje: <Package size={14} />,
      reservas: <CreditCard size={14} />,
      planificación: <BookOpen size={14} />,
      other: <MoreHorizontal size={14} />,
    };
    return iconMap[category] || iconMap.other;
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: "20px", height: "fit-content" }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography>Cargando lista de tareas...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: "20px",
          height: "fit-content",
          background: theme.palette.background.blue,
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckSquare
                size={isMobile ? 20 : 24}
                color={theme.palette.primary.main}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
              >
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                Progreso
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="primary.main"
                sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
              >
                {Math.round(completionPercentage)}% ({completedTasks}/
                {checklist.length})
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

          <List sx={{ maxHeight: 240, overflow: "auto", mb: 2 }}>
            {pendingTasks.slice(0, 5).map((item) => (
              <ListItem
                key={item._id}
                sx={{
                  px: 0,
                  py: isMobile ? 0.5 : 1,
                  borderRadius: "8px",
                  border: isOverdue(item.dueDate)
                    ? `1px solid ${theme.palette.error.light}`
                    : "none",
                  bgcolor: isOverdue(item.dueDate)
                    ? `${theme.palette.error.main}05`
                    : "transparent",
                  "&:hover": { backgroundColor: theme.palette.secondary.light },
                  mb: 1,
                }}
              >
                <Checkbox
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(item)}
                  size="small"
                  disabled={updateMutation.isLoading}
                />

                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        }}
                      >
                        {item.text}
                      </Typography>
                      {isOverdue(item.dueDate) && (
                        <Tooltip title="Vencida">
                          <AlertCircle
                            size={16}
                            color={theme.palette.error.main}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        size="small"
                        label={item.category}
                        icon={getCategoryIcon(item.category)}
                        variant="outlined"
                        sx={{
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
                          height: isMobile ? 18 : 20,
                        }}
                      />
                      {item.dueDate && (
                        <Chip
                          size="small"
                          label={new Date(item.dueDate).toLocaleDateString(
                            "es-ES"
                          )}
                          icon={<Clock size={12} />}
                          variant="outlined"
                          color={isOverdue(item.dueDate) ? "error" : "default"}
                          sx={{
                            fontSize: isMobile ? "0.6rem" : "0.7rem",
                            height: isMobile ? 18 : 20,
                          }}
                        />
                      )}
                    </Box>
                  }
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: getPriorityColor(item.priority),
                    }}
                  />
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => openEditDialog(item)}
                      sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                    >
                      <Edit size={isMobile ? 12 : 14} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => removeTask(item._id)}
                      disabled={deleteMutation.isLoading}
                      sx={{
                        opacity: 0.7,
                        "&:hover": {
                          opacity: 1,
                          color: theme.palette.error.main,
                        },
                      }}
                    >
                      <Trash2 size={isMobile ? 12 : 14} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))}
          </List>

          {completedTasksList.length > 0 && (
            <Button
              size="small"
              onClick={() => setShowCompleted(!showCompleted)}
              startIcon={
                showCompleted ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )
              }
              sx={{
                mb: 2,
                textTransform: "none",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              {showCompleted ? "Ocultar" : "Mostrar"} completadas (
              {completedTasksList.length})
            </Button>
          )}

          <Collapse in={showCompleted}>
            <List sx={{ maxHeight: 150, overflow: "auto", mb: 2 }}>
              {completedTasksList.map((item) => (
                <ListItem
                  key={item._id}
                  sx={{
                    px: 0,
                    py: 0.5,
                    borderRadius: "8px",
                    opacity: 0.7,
                    "&:hover": {
                      backgroundColor: theme.palette.background.light,
                    },
                  }}
                >
                  <Checkbox
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item)}
                    size="small"
                    disabled={updateMutation.isLoading}
                  />
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textDecoration: "line-through",
                      "& .MuiListItemText-primary": {
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeTask(item._id)}
                    disabled={deleteMutation.isLoading}
                    sx={{
                      opacity: 0.5,
                      "&:hover": {
                        opacity: 1,
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <Trash2 size={12} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Button
            variant="contained"
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "rotate(0deg)",
                  ".MuiButton-root:hover &": {
                    transform: "rotate(180deg) scale(1.1)",
                  },
                }}
              >
                <Plus size={isMobile ? 16 : 18} />
              </Box>
            }
            onClick={() => setFormDialogOpen(true)}
            fullWidth
            disabled={createMutation.isLoading}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              py: isMobile ? 1.5 : 2,
              px: 3,
              fontSize: isMobile ? "0.875rem" : "1rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              color: "white",
              boxShadow: `0 4px 20px ${theme.palette.primary.main}25`,
              border: "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                transition: "left 0.5s ease",
              },
              "&:hover": {
                transform: "translateY(-2px) scale(1.02)",
                boxShadow: `0 8px 30px ${theme.palette.primary.main}35`,
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "translateY(0px) scale(0.98)",
              },
              "&:disabled": {
                background: theme.palette.grey[300],
                color: theme.palette.grey[500],
                boxShadow: "none",
                transform: "none",
              },
            }}
          >
            Agregar nueva tarea
          </Button>
        </CardContent>
      </Card>

      <TaskFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        editTask={editingTask}
        theme={theme}
      />
    </>
  );
};

const ActivityWidget = ({
  itineraries,
  completedTasks,
  upcomingTrip,
  theme,
  isMobile,
}) => {
  const activities = [
    {
      icon: <CheckCircle2 size={16} color={theme.palette.primary.black} />,
      text: ` ${completedTasks} tareas esta semana`,
      time: "Hoy",
    },
    {
      icon: <Star size={16} color={theme.palette.primary.black} />,
      text: `Creaste ${itineraries.length} itinerarios`,
      time: "Este mes",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "20px",
        background: theme.palette.background.blue,
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Bell size={isMobile ? 16 : 20} color={theme.palette.primary.main} />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
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
                p: isMobile ? 1.5 : 2,
                borderRadius: "12px",
              }}
            >
              {activity.icon}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                >
                  {activity.text}
                </Typography>
                {activity.time && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}
                  >
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: itineraries = [] } = useQuery({
    queryKey: ["userItineraries", user?._id],
    queryFn: () => getUserItineraries(user._id, jwt),
    enabled: !!user && !!jwt,
  });

  const { data: checklist = [] } = useQuery({
    queryKey: ["userChecklist", user?._id],
    queryFn: () => getUserChecklist(user._id, jwt),
    enabled: !!user && !!jwt,
  });

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
    <Box sx={{ p: { xs: 1.5, md: 3 }, minHeight: "100vh" }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Welcome Widget - Full Width */}
        <Grid item xs={12}>
          <WelcomeWidget user={user} theme={theme} isMobile={isMobile} />
        </Grid>

        {/* Stats Widgets - 2 per row on mobile, 4 per row on desktop */}
        <Grid item xs={6} sm={6} md={3}>
          <StatsWidget
            theme={theme}
            title="Viajes creados"
            value={itineraries.length}
            subtitle="Total de itinerarios"
            icon={<Award />}
            color={theme.palette.primary.black}
            trend={12}
            isMobile={isMobile}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <StatsWidget
            theme={theme}
            title="Días de viaje"
            value={itineraries.reduce(
              (total, trip) => total + (trip.travelDays || 0),
              0
            )}
            subtitle="Días planificados"
            icon={<MapPin />}
            color={theme.palette.primary.black}
            trend={8}
            isMobile={isMobile}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <StatsWidget
            title="Amigos viajeros"
            theme={theme}
            value={user?.friends?.length || 0}
            subtitle="Conexiones"
            icon={<Users />}
            color={theme.palette.primary.black}
            isMobile={isMobile}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <StatsWidget
            theme={theme}
            title="Tareas completadas"
            value={`${checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0}%`}
            subtitle="Progreso general"
            icon={<CheckCircle2 />}
            color={theme.palette.primary.black}
            isMobile={isMobile}
          />
        </Grid>

        {/* Current Trip Widget */}
        {currentTrip && (
          <Grid item xs={12} md={6}>
            <CurrentTripWidget
              trip={currentTrip}
              theme={theme}
              navigate={navigate}
              isMobile={isMobile}
            />
          </Grid>
        )}

        {/* Enhanced Checklist Widget */}
        <Grid item xs={12} md={6}>
          <ChecklistWidget
            user={user}
            jwt={jwt}
            theme={theme}
            isMobile={isMobile}
          />
        </Grid>

        {/* Activity Widget */}
        <Grid item xs={12} md={6}>
          <ActivityWidget
            itineraries={itineraries}
            completedTasks={completedTasks}
            upcomingTrip={upcomingTrip}
            theme={theme}
            isMobile={isMobile}
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

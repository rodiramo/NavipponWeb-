// Improved ItineraryHeader with better tablet support and interactive elements
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  useTheme,
  Container,
  Tooltip,
  Switch,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Fade,
  MenuList,
  Paper,
  ClickAwayListener,
  Popper,
  Grow,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  Save,
  Edit,
  CalendarDays,
  HandCoins,
  Download,
  Crown,
  Lock,
  Globe,
  ListCheck,
  MoreVertical,
  Home,
  Search,
  Plus,
  BookOpen,
  ArrowLeft,
  Car,
  Train,
  Footprints,
  Bike,
  Navigation,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Travelers from "./Travelers";

const ItineraryHeader = ({
  name,
  setName,
  isEditingName,
  setIsEditingName,
  handleSaveName,
  creator,
  isInvited,
  myRole,
  travelDays,
  totalBudget,
  onOfflineClick,
  hasOfflinePermission = true,
  travelers,
  friendsList,
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
  onNotesClick,
  onBackClick,
  userRole = "viewer",
  currentUserId,
  startDate,
  boards,
  onEditDates,
  canEditDates,
  isPrivate = false,
  onPrivacyToggle,
  transportMode = "walking",
  onTransportModeChange,
  showDistanceIndicators = true,
  onToggleDistanceIndicators,
  showRouteOptimizer = true,
  onToggleRouteOptimizer,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State for different menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [transportMenuOpen, setTransportMenuOpen] = useState(false);
  const [transportMenuAnchor, setTransportMenuAnchor] = useState(null);
  const [privacyMenuOpen, setPrivacyMenuOpen] = useState(false);
  const [privacyMenuAnchor, setPrivacyMenuAnchor] = useState(null);

  const open = Boolean(anchorEl);

  // Prevent website nav from appearing
  useEffect(() => {
    document.body.classList.add("itinerary-page-active");
    return () => {
      document.body.classList.remove("itinerary-page-active");
    };
  }, []);

  const endDate =
    startDate && boards?.length > 0
      ? new Date(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + boards.length - 1
          )
        )
      : null;

  // Check permissions
  const canEdit = userRole === "owner" || userRole === "editor";
  const canManageTravelers = userRole === "owner";
  const canChangePrivacy = userRole === "owner";

  // Navigation menu items
  const navigationItems = [
    {
      icon: <ArrowLeft size={18} />,
      label: "Volver atrás",
      description: "Regresar a la página anterior",
      action: "back",
      color: theme.palette.warning.main,
    },
    null,
    {
      icon: <Home size={18} />,
      label: "Inicio",
      description: "Página principal",
      path: "/",
      color: theme.palette.primary.main,
    },
    {
      icon: <BookOpen size={18} />,
      label: "Mis itinerarios",
      description: "Ver todos mis itinerarios",
      path: "/user/itineraries/manage",
      color: theme.palette.secondary.medium,
    },
    {
      icon: <Search size={18} />,
      label: "Explorar",
      description: "Descubrir experiencias",
      path: "/experience",
      color: theme.palette.info.main,
    },
    {
      icon: <Plus size={18} />,
      label: "Crear itinerario",
      description: "Nuevo viaje",
      path: "/user/itineraries/manage/create",
      color: theme.palette.primary.dark,
    },
  ];

  // Transport mode options
  const transportModes = [
    {
      value: "walking",
      label: "Caminando",
      icon: <Footprints size={16} />,
      speed: "5 km/h",
      color: theme.palette.success.main,
    },
    {
      value: "cycling",
      label: "Bicicleta",
      icon: <Bike size={16} />,
      speed: "15 km/h",
      color: theme.palette.info.main,
    },
    {
      value: "driving",
      label: "Coche",
      icon: <Car size={16} />,
      speed: "30 km/h",
      color: theme.palette.warning.main,
    },
    {
      value: "transit",
      label: "Transporte",
      icon: <Train size={16} />,
      speed: "20 km/h",
      color: theme.palette.secondary.main,
    },
  ];

  const getCurrentTransportMode = () => {
    return (
      transportModes.find((mode) => mode.value === transportMode) ||
      transportModes[0]
    );
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigation menu handlers
  const handleNavMenuClick = (event) => {
    setNavMenuAnchor(event.currentTarget);
    setNavMenuOpen(true);
  };

  const handleNavMenuClose = () => {
    setNavMenuOpen(false);
    setNavMenuAnchor(null);
  };

  // Transport menu handlers
  const handleTransportMenuClick = (event) => {
    setTransportMenuAnchor(event.currentTarget);
    setTransportMenuOpen(true);
  };

  const handleTransportMenuClose = () => {
    setTransportMenuOpen(false);
    setTransportMenuAnchor(null);
  };

  // Privacy menu handlers
  const handlePrivacyMenuClick = (event) => {
    if (canChangePrivacy) {
      setPrivacyMenuAnchor(event.currentTarget);
      setPrivacyMenuOpen(true);
    }
  };

  const handlePrivacyMenuClose = () => {
    setPrivacyMenuOpen(false);
    setPrivacyMenuAnchor(null);
  };

  const handleNavigate = (path, action) => {
    if (action === "back") {
      if (onBackClick) {
        onBackClick();
      } else {
        navigate(-1);
      }
    } else {
      navigate(path);
    }
    handleNavMenuClose();
  };

  const handleNameClick = () => {
    if (canEdit) {
      setIsEditingName(true);
    }
  };

  const handleEditClick = () => {
    if (canEdit) {
      if (isEditingName) {
        handleSaveName();
      } else {
        setIsEditingName(true);
      }
    }
  };

  const handlePrivacyChange = (newPrivateStatus) => {
    if (canChangePrivacy && onPrivacyToggle) {
      onPrivacyToggle(newPrivateStatus);
    }
    handlePrivacyMenuClose();
  };

  const handleOfflineClick = () => {
    onOfflineClick();
    handleMenuClose();
  };

  // 🆕 NEW: Handle date editing from chip click
  const handleDateChipClick = () => {
    if (canEditDates && onEditDates) {
      onEditDates();
    }
  };

  // Transport mode handlers
  const handleTransportModeChange = (mode) => {
    console.log("🚀 Header: Changing transport mode to:", mode);
    if (onTransportModeChange) {
      onTransportModeChange(mode);
    }
    handleTransportMenuClose();
  };

  // Toggle handlers
  const handleToggleDistanceIndicators = (event) => {
    console.log("🚀 Header: Toggle distance indicators:", event.target.checked);
    if (onToggleDistanceIndicators) {
      onToggleDistanceIndicators(event.target.checked);
    }
  };

  const handleToggleRouteOptimizer = (event) => {
    console.log("🚀 Header: Toggle route optimizer:", event.target.checked);
    if (onToggleRouteOptimizer) {
      onToggleRouteOptimizer(event.target.checked);
    }
  };

  // Event handlers to prevent website nav triggering
  const handleMouseEnter = (e) => {
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
  };

  // Debug current values
  useEffect(() => {
    console.log("🔍 Header: Current transport mode:", transportMode);
    console.log("🔍 Header: Show distance indicators:", showDistanceIndicators);
    console.log("🔍 Header: Show route optimizer:", showRouteOptimizer);
  }, [transportMode, showDistanceIndicators, showRouteOptimizer]);

  return (
    <>
      <Box
        sx={{
          background: theme.palette.background.nav,
          position: "relative",
          overflow: "hidden",
          zIndex: 1100,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-40px",
            left: 0,
            right: 0,
            height: "40px",
            backgroundColor: "transparent",
            zIndex: 1101,
            pointerEvents: "auto",
            display: { xs: "block", sm: "block" },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 1099,
            pointerEvents: "none",
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1102 }}>
          <Box sx={{ py: { xs: 3, sm: 2, md: 2.5 }, position: "relative" }}>
            {/* Navigation Menu Button */}
            <Tooltip title="Navegación rápida" arrow>
              <IconButton
                onClick={handleNavMenuClick}
                size="small"
                sx={{
                  position: "absolute",
                  left: 0,
                  top: { xs: 16, sm: 12, md: 16 },
                  zIndex: 1103,
                  width: { xs: 44, sm: 40, md: 42 },
                  height: { xs: 44, sm: 40, md: 42 },
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}E6, ${theme.palette.primary.dark}CC)`,
                  color: "white",
                  backdropFilter: "blur(10px)",
                  border: `2px solid rgba(255,255,255,0.2)`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  pointerEvents: "auto",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}F0, ${theme.palette.primary.main}E6)`,
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
                    zIndex: 1104,
                  },
                  "&:focus": {
                    zIndex: 1104,
                  },
                }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
              >
                <Home size={isMobile ? 20 : 18} />
              </IconButton>
            </Tooltip>

            {/* MOBILE LAYOUT */}
            {isMobile && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  ml: 6,
                  mr: 0,
                  zIndex: 1102,
                  position: "relative",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
              >
                {/* Title Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {/* Title */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      justifyContent: "center",
                      width: "100%",
                      // 🔧 IMPROVED: Modern, clean editing style
                      backgroundColor: isEditingName
                        ? "rgba(255, 255, 255, 0.95)"
                        : "transparent",
                      padding: isEditingName ? "12px 16px" : "0",
                      borderRadius: isEditingName ? "12px" : 0,
                      backdropFilter: isEditingName ? "blur(10px)" : "none",
                      border: isEditingName
                        ? `1px solid ${theme.palette.primary.main}`
                        : "none",
                      position: "relative",
                      zIndex: isEditingName ? 1200 : "auto",
                    }}
                  >
                    {isEditingName && canEdit ? (
                      <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                        autoFocus
                        variant="outlined"
                        placeholder="Nombre del itinerario..."
                        size="small"
                        sx={{
                          flex: 1,
                          maxWidth: "300px",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "transparent",
                            borderRadius: "8px",
                            border: "2px solid transparent",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "8px 0",
                            color: theme.palette.text.primary,
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            textAlign: "center",
                            "&::placeholder": {
                              color: theme.palette.text.secondary,
                              opacity: 0.7,
                            },
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      />
                    ) : (
                      <Tooltip
                        title={canEdit ? "Haz clic para editar el nombre" : ""}
                        arrow
                      >
                        <Typography
                          variant="h4"
                          component="h1"
                          sx={{
                            fontWeight: "bold",
                            color: "white",
                            cursor: canEdit ? "pointer" : "default",
                            fontSize: "1.6rem",
                            lineHeight: 1.2,
                            textAlign: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                            "&:hover": canEdit
                              ? {
                                  opacity: 0.9,
                                }
                              : {},
                          }}
                          onClick={handleNameClick}
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                        >
                          {name || "Nuevo itinerario"}
                        </Typography>
                      </Tooltip>
                    )}

                    {canEdit && (
                      <Tooltip
                        title={
                          isEditingName ? "Guardar cambios" : "Editar nombre"
                        }
                        arrow
                      >
                        <IconButton
                          onClick={handleEditClick}
                          size="small"
                          sx={{
                            width: 40,
                            height: 40,
                            color: isEditingName ? "white" : "white",
                            background: isEditingName
                              ? theme.palette.success.main
                              : "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "50%",
                            zIndex: 1103,
                            "&:hover": {
                              background: isEditingName
                                ? theme.palette.success.dark
                                : "rgba(255, 255, 255, 0.3)",
                            },
                          }}
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                        >
                          {isEditingName ? (
                            <Save size={18} />
                          ) : (
                            <Edit size={18} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Mobile: Badges and Interactive Chips */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                      maxWidth: "100%",
                      borderRadius: 16,
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                  >
                    <Tooltip
                      title={`Duración total del viaje: ${travelDays} día${travelDays !== 1 ? "s" : ""}${canEditDates ? ". Haz clic para cambiar fechas" : ""}`}
                      arrow
                    >
                      <Chip
                        icon={<CalendarDays size={16} />}
                        label={`${travelDays} día${travelDays !== 1 ? "s" : ""}`}
                        size="small"
                        onClick={canEditDates ? handleDateChipClick : undefined}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                          color: "white",
                          fontSize: "0.8rem",
                          height: 32,
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          cursor: canEditDates ? "pointer" : "default",
                          transition: "all 0.2s ease",
                          "&:hover": canEditDates
                            ? {
                                backgroundColor: "rgba(255, 255, 255, 0.35)",
                                transform: "scale(1.02)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                              }
                            : {},
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 16,
                            height: 16,
                          },
                          "& .MuiChip-label": {
                            paddingLeft: "8px",
                            paddingRight: "12px",
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Presupuesto total estimado: ¥${totalBudget.toLocaleString()}`}
                      arrow
                    >
                      <Chip
                        icon={<HandCoins size={16} />}
                        label={`¥${totalBudget.toLocaleString()}`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                          color: "white",
                          fontSize: "0.8rem",
                          height: 32,
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            transform: "scale(1.02)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                          },
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 16,
                            height: 16,
                          },
                          "& .MuiChip-label": {
                            paddingLeft: "8px",
                            paddingRight: "12px",
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Modo de transporte: ${getCurrentTransportMode().label} (${getCurrentTransportMode().speed}). Haz clic para cambiar`}
                      arrow
                    >
                      <Chip
                        icon={getCurrentTransportMode().icon}
                        label={getCurrentTransportMode().label}
                        size="small"
                        onClick={handleTransportMenuClick}
                        sx={{
                          backgroundColor:
                            getCurrentTransportMode().color + "30",
                          color: "white",
                          fontSize: "0.8rem",
                          height: 32,
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${getCurrentTransportMode().color}60`,
                          cursor: "pointer",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              getCurrentTransportMode().color + "50",
                            transform: "scale(1.05)",
                            boxShadow: `0 4px 12px ${getCurrentTransportMode().color}40`,
                          },
                          "&:active": { transform: "scale(0.98)" },
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 16,
                            height: 16,
                          },
                          "& .MuiChip-label": {
                            paddingLeft: "8px",
                            paddingRight: "12px",
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Visibilidad: ${isPrivate ? "Solo tú y tus compañeros pueden ver este itinerario" : "Cualquiera puede ver este itinerario"}${canChangePrivacy ? ". Haz clic para cambiar" : ""}`}
                      arrow
                    >
                      <Chip
                        icon={
                          isPrivate ? <Lock size={14} /> : <Globe size={14} />
                        }
                        label={isPrivate ? "Privado" : "Público"}
                        size="small"
                        onClick={
                          canChangePrivacy ? handlePrivacyMenuClick : undefined
                        }
                        sx={{
                          backgroundColor: isPrivate
                            ? "rgba(255, 152, 0, 0.3)"
                            : "rgba(76, 175, 80, 0.3)",
                          color: "white",
                          fontSize: "0.8rem",
                          height: 32,
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${isPrivate ? "rgba(255, 152, 0, 0.6)" : "rgba(76, 175, 80, 0.6)"}`,
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          transition: "all 0.2s ease",
                          cursor: canChangePrivacy ? "pointer" : "default",
                          "&:hover": canChangePrivacy
                            ? {
                                backgroundColor: isPrivate
                                  ? "rgba(255, 152, 0, 0.5)"
                                  : "rgba(76, 175, 80, 0.5)",
                                transform: "scale(1.02)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                              }
                            : {},
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 14,
                            height: 14,
                          },
                          "& .MuiChip-label": {
                            paddingLeft: "8px",
                            paddingRight: "12px",
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </Box>

                {/* Mobile: Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    zIndex: 1102,
                    position: "relative",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                >
                  <Travelers
                    travelers={travelers}
                    friendsList={friendsList}
                    onAddTraveler={
                      canManageTravelers ? onAddTraveler : undefined
                    }
                    onUpdateTraveler={
                      canManageTravelers ? onUpdateTraveler : undefined
                    }
                    onRemoveTraveler={
                      canManageTravelers ? onRemoveTraveler : undefined
                    }
                    creator={creator}
                    userRole={userRole}
                    currentUserId={currentUserId}
                  />

                  <Tooltip title="Abrir lista de tareas del viaje" arrow>
                    <IconButton
                      onClick={onNotesClick}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: 44,
                        height: 44,
                        zIndex: 1103,
                        position: "relative",
                        pointerEvents: "auto",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                          zIndex: 1104,
                        },
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                    >
                      <ListCheck size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Más opciones y configuración" arrow>
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        width: 44,
                        height: 44,
                        backdropFilter: "blur(10px)",
                        zIndex: 1103,
                        position: "relative",
                        pointerEvents: "auto",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.25)",
                          zIndex: 1104,
                        },
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* IMPROVED TABLET/DESKTOP LAYOUT */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { sm: 1, md: 2, lg: 3 },
                  width: "100%",
                  pl: { sm: 10, md: 12, lg: 14 },
                  pr: { sm: 1, md: 2 },
                  zIndex: 1102,
                  position: "relative",
                  flexWrap: isTablet ? "wrap" : "nowrap",
                  justifyContent: isTablet ? "center" : "flex-start",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
              >
                {/* Title Section with better space management */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { sm: 1, md: 2 },
                    flex: isTablet ? "1 1 100%" : "1 1 auto",
                    minWidth: 0,
                    mb: isTablet ? 1 : 0,
                    justifyContent: isTablet ? "center" : "flex-start",
                  }}
                >
                  {/* Title Container */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      flex: 1,
                      // 🔧 IMPROVED: Modern, clean editing style
                      backgroundColor: isEditingName
                        ? "rgba(255, 255, 255, 0.95)"
                        : "transparent",
                      padding: isEditingName ? "8px 12px" : "0",
                      borderRadius: isEditingName ? "10px" : 0,
                      backdropFilter: isEditingName ? "blur(10px)" : "none",
                      border: isEditingName
                        ? `1px solid ${theme.palette.primary.main}`
                        : "none",
                      position: "relative",
                      zIndex: isEditingName ? 1200 : "auto",
                    }}
                  >
                    {isEditingName && canEdit ? (
                      <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                        autoFocus
                        variant="outlined"
                        placeholder="Nombre del itinerario..."
                        size="small"
                        sx={{
                          flex: 1,
                          maxWidth: { sm: "250px", md: "320px", lg: "400px" },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "transparent",
                            borderRadius: "6px",
                            border: "2px solid transparent",
                            fontSize: { sm: "1rem", md: "1.1rem" },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            "& fieldset": { border: "none" },
                            "&:hover fieldset": { border: "none" },
                            "&.Mui-focused fieldset": { border: "none" },
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: { sm: "6px 0", md: "8px 0" },
                            color: theme.palette.text.primary,
                            fontSize: { sm: "1rem", md: "1.1rem" },
                            fontWeight: 600,
                            textAlign: isTablet ? "center" : "left",
                            "&::placeholder": {
                              color: theme.palette.text.secondary,
                            },
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      />
                    ) : (
                      <Tooltip
                        title={
                          canEdit
                            ? "Haz clic para editar el nombre del itinerario"
                            : ""
                        }
                        arrow
                      >
                        <Typography
                          variant="h3"
                          component="h1"
                          sx={{
                            fontWeight: "bold",
                            color: "white",
                            cursor: canEdit ? "pointer" : "default",
                            fontSize: {
                              sm: "1.25rem",
                              md: "1.5rem",
                              lg: "1.75rem",
                            },
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                            flex: 1,
                            textAlign: isTablet ? "center" : "left",
                            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                            "&:hover": canEdit
                              ? {
                                  opacity: 0.9,
                                }
                              : {},
                          }}
                          onClick={handleNameClick}
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                        >
                          {name || "Nuevo itinerario"}
                        </Typography>
                      </Tooltip>
                    )}

                    {canEdit && (
                      <Tooltip
                        title={
                          isEditingName ? "Guardar cambios" : "Editar nombre"
                        }
                        arrow
                      >
                        <IconButton
                          onClick={handleEditClick}
                          size="small"
                          sx={{
                            width: { sm: 32, md: 36 },
                            height: { sm: 32, md: 36 },
                            color: isEditingName ? "white" : "white",
                            background: isEditingName
                              ? theme.palette.success.main
                              : "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "50%",
                            zIndex: 1103,
                            flexShrink: 0,
                            "&:hover": {
                              background: isEditingName
                                ? theme.palette.success.dark
                                : "rgba(255, 255, 255, 0.3)",
                            },
                          }}
                          onMouseEnter={handleMouseEnter}
                          onMouseMove={handleMouseMove}
                        >
                          {isEditingName ? (
                            <Save size={isTablet ? 14 : 16} />
                          ) : (
                            <Edit size={isTablet ? 14 : 16} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Chips Section with better spacing */}
                  {!isTablet && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { md: 0.75, lg: 1 },
                        flexShrink: 0,
                        ml: 1,
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                    >
                      <Tooltip
                        title={`Duración: ${travelDays} día${travelDays !== 1 ? "s" : ""}${canEditDates ? ". Clic para cambiar fechas" : ""}`}
                        arrow
                      >
                        <Chip
                          icon={<CalendarDays size={12} />}
                          label={`${travelDays} día${travelDays !== 1 ? "s" : ""}`}
                          size="small"
                          onClick={
                            canEditDates ? handleDateChipClick : undefined
                          }
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            fontSize: "0.65rem",
                            height: 22,
                            backdropFilter: "blur(10px)",
                            cursor: canEditDates ? "pointer" : "default",
                            "&:hover": canEditDates
                              ? {
                                  backgroundColor: "rgba(255,255,255,0.3)",
                                }
                              : {},
                            "& .MuiChip-icon": {
                              color: "white",
                              width: 12,
                              height: 12,
                            },
                          }}
                        />
                      </Tooltip>

                      <Tooltip
                        title={`Presupuesto: ¥${totalBudget.toLocaleString()}`}
                        arrow
                      >
                        <Chip
                          icon={<HandCoins size={12} />}
                          label={`¥${totalBudget.toLocaleString()}`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            fontSize: "0.65rem",
                            height: 22,
                            backdropFilter: "blur(10px)",
                            "& .MuiChip-icon": {
                              color: "white",
                              width: 12,
                              height: 12,
                            },
                          }}
                        />
                      </Tooltip>

                      <Tooltip
                        title={`Transporte: ${getCurrentTransportMode().label}. Clic para cambiar`}
                        arrow
                      >
                        <Chip
                          icon={getCurrentTransportMode().icon}
                          label={getCurrentTransportMode().label}
                          size="small"
                          onClick={handleTransportMenuClick}
                          sx={{
                            backgroundColor:
                              getCurrentTransportMode().color + "40",
                            color: "white",
                            fontSize: "0.65rem",
                            height: 22,
                            backdropFilter: "blur(10px)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor:
                                getCurrentTransportMode().color + "60",
                              transform: "scale(1.05)",
                            },
                            "& .MuiChip-icon": {
                              color: "white",
                              width: 12,
                              height: 12,
                            },
                          }}
                        />
                      </Tooltip>

                      <Tooltip
                        title={`${isPrivate ? "Privado" : "Público"}${canChangePrivacy ? ". Clic para cambiar" : ""}`}
                        arrow
                      >
                        <Chip
                          icon={
                            isPrivate ? <Lock size={10} /> : <Globe size={10} />
                          }
                          label={isPrivate ? "Privado" : "Público"}
                          size="small"
                          onClick={
                            canChangePrivacy
                              ? handlePrivacyMenuClick
                              : undefined
                          }
                          sx={{
                            backgroundColor: isPrivate
                              ? "rgba(255, 152, 0, 0.8)"
                              : "rgba(76, 175, 80, 0.8)",
                            color: "white",
                            fontSize: "0.65rem",
                            height: 22,
                            backdropFilter: "blur(10px)",
                            cursor: canChangePrivacy ? "pointer" : "default",
                            transition: "all 0.2s ease",
                            "&:hover": canChangePrivacy
                              ? {
                                  transform: "scale(1.05)",
                                }
                              : {},
                            "& .MuiChip-icon": {
                              color: "white",
                              width: 10,
                              height: 10,
                            },
                          }}
                        />
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons with better spacing */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { sm: 1, md: 1.5 },
                    flexShrink: 0,
                    zIndex: 1102,
                    position: "relative",
                    order: isTablet ? -1 : 0,
                    width: isTablet ? "100%" : "auto",
                    justifyContent: isTablet ? "center" : "flex-end",
                    mb: isTablet ? 1 : 0,
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                >
                  <Travelers
                    travelers={travelers}
                    friendsList={friendsList}
                    onAddTraveler={
                      canManageTravelers ? onAddTraveler : undefined
                    }
                    onUpdateTraveler={
                      canManageTravelers ? onUpdateTraveler : undefined
                    }
                    onRemoveTraveler={
                      canManageTravelers ? onRemoveTraveler : undefined
                    }
                    creator={creator}
                    userRole={userRole}
                    currentUserId={currentUserId}
                  />

                  <Tooltip title="Lista de tareas del viaje" arrow>
                    <IconButton
                      onClick={onNotesClick}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: { sm: 32, md: 36 },
                        height: { sm: 32, md: 36 },
                        zIndex: 1103,
                        position: "relative",
                        pointerEvents: "auto",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                          zIndex: 1104,
                        },
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                    >
                      <ListCheck size={isTablet ? 14 : 16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Más opciones" arrow>
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        width: { sm: 32, md: 36 },
                        height: { sm: 32, md: 36 },
                        backdropFilter: "blur(10px)",
                        zIndex: 1103,
                        position: "relative",
                        pointerEvents: "auto",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.25)",
                          zIndex: 1104,
                        },
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                    >
                      <MoreVertical size={isTablet ? 14 : 16} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* TABLET: Show chips in a separate row */}
                {isTablet && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      flexWrap: "wrap",
                      width: "100%",
                      mt: 1,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                  >
                    <Tooltip
                      title={`Duración: ${travelDays} día${travelDays !== 1 ? "s" : ""}${canEditDates ? ". Clic para cambiar fechas" : ""}`}
                      arrow
                    >
                      <Chip
                        icon={<CalendarDays size={14} />}
                        label={`${travelDays} día${travelDays !== 1 ? "s" : ""}`}
                        size="small"
                        onClick={canEditDates ? handleDateChipClick : undefined}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontSize: "0.7rem",
                          height: 26,
                          backdropFilter: "blur(10px)",
                          cursor: canEditDates ? "pointer" : "default",
                          "&:hover": canEditDates
                            ? {
                                backgroundColor: "rgba(255,255,255,0.3)",
                              }
                            : {},
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 14,
                            height: 14,
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Presupuesto: ¥${totalBudget.toLocaleString()}`}
                      arrow
                    >
                      <Chip
                        icon={<HandCoins size={14} />}
                        label={`¥${totalBudget.toLocaleString()}`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontSize: "0.7rem",
                          height: 26,
                          backdropFilter: "blur(10px)",
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 14,
                            height: 14,
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Transporte: ${getCurrentTransportMode().label} (${getCurrentTransportMode().speed}). Clic para cambiar`}
                      arrow
                    >
                      <Chip
                        icon={getCurrentTransportMode().icon}
                        label={getCurrentTransportMode().label}
                        size="small"
                        onClick={handleTransportMenuClick}
                        sx={{
                          backgroundColor:
                            getCurrentTransportMode().color + "40",
                          color: "white",
                          fontSize: "0.7rem",
                          height: 26,
                          backdropFilter: "blur(10px)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              getCurrentTransportMode().color + "60",
                            transform: "scale(1.05)",
                          },
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 14,
                            height: 14,
                          },
                        }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={`Visibilidad: ${isPrivate ? "Solo tú y tus compañeros pueden ver este itinerario" : "Cualquiera puede ver este itinerario"}${canChangePrivacy ? ". Clic para cambiar" : ""}`}
                      arrow
                    >
                      <Chip
                        icon={
                          isPrivate ? <Lock size={12} /> : <Globe size={12} />
                        }
                        label={isPrivate ? "Privado" : "Público"}
                        size="small"
                        onClick={
                          canChangePrivacy ? handlePrivacyMenuClick : undefined
                        }
                        sx={{
                          backgroundColor: isPrivate
                            ? "rgba(255, 152, 0, 0.8)"
                            : "rgba(76, 175, 80, 0.8)",
                          color: "white",
                          fontSize: "0.7rem",
                          height: 26,
                          backdropFilter: "blur(10px)",
                          cursor: canChangePrivacy ? "pointer" : "default",
                          transition: "all 0.2s ease",
                          "&:hover": canChangePrivacy
                            ? {
                                transform: "scale(1.05)",
                              }
                            : {},
                          "& .MuiChip-icon": {
                            color: "white",
                            width: 12,
                            height: 12,
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Navigation Menu */}
      <Popper
        open={navMenuOpen}
        anchorEl={navMenuAnchor}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1105 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                backgroundColor: theme.palette.background.paper,
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: theme.shadows[12],
                border: `1px solid ${theme.palette.divider}`,
                minWidth: { xs: 280, sm: 320 },
                maxWidth: "90vw",
                mt: 1,
                overflow: "hidden",
              }}
            >
              <ClickAwayListener onClickAway={handleNavMenuClose}>
                <MenuList
                  autoFocusItem={navMenuOpen}
                  id="navigation-menu"
                  sx={{ p: 1 }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      NAVEGACIÓN RÁPIDA
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      Accede rápidamente a otras secciones
                    </Typography>
                  </Box>

                  {navigationItems.map((item, index) => {
                    if (item === null) {
                      return <Divider key={index} sx={{ my: 1 }} />;
                    }

                    return (
                      <MenuItem
                        key={index}
                        onClick={() => handleNavigate(item.path, item.action)}
                        sx={{
                          borderRadius: 2,
                          mx: 0.5,
                          mb: 0.5,
                          py: 1.5,
                          px: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: `${item.color}15`,
                            "& .nav-icon": {
                              color: item.color,
                              transform: "scale(1.1)",
                            },
                            "& .nav-label": {
                              color: item.color,
                              fontWeight: 600,
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          className="nav-icon"
                          sx={{
                            minWidth: 36,
                            color: theme.palette.text.secondary,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText>
                          <Typography
                            className="nav-label"
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.875rem",
                              lineHeight: 1.2,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.75rem",
                              lineHeight: 1.1,
                              mt: 0.25,
                              display: "block",
                            }}
                          >
                            {item.description}
                          </Typography>
                        </ListItemText>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Transport Mode Menu */}
      <Popper
        open={transportMenuOpen}
        anchorEl={transportMenuAnchor}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1105 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                backgroundColor: theme.palette.background.paper,
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: theme.shadows[12],
                border: `1px solid ${theme.palette.divider}`,
                minWidth: { xs: 280, sm: 300 },
                maxWidth: "90vw",
                mt: 1,
                overflow: "hidden",
              }}
            >
              <ClickAwayListener onClickAway={handleTransportMenuClose}>
                <MenuList
                  autoFocusItem={transportMenuOpen}
                  id="transport-menu"
                  sx={{ p: 1 }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      MODO DE TRANSPORTE
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      Selecciona cómo calcular distancias y tiempos
                    </Typography>
                  </Box>

                  {transportModes.map((mode) => (
                    <MenuItem
                      key={mode.value}
                      onClick={() => handleTransportModeChange(mode.value)}
                      selected={transportMode === mode.value}
                      sx={{
                        borderRadius: 2,
                        mx: 0.5,
                        mb: 0.5,
                        py: 1.5,
                        px: 2,
                        transition: "all 0.2s ease",
                        backgroundColor:
                          transportMode === mode.value
                            ? `${mode.color}20`
                            : "transparent",
                        "&:hover": {
                          backgroundColor: `${mode.color}15`,
                          "& .transport-icon": {
                            color: mode.color,
                            transform: "scale(1.1)",
                          },
                          "& .transport-label": {
                            color: mode.color,
                            fontWeight: 600,
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        className="transport-icon"
                        sx={{
                          minWidth: 36,
                          color:
                            transportMode === mode.value
                              ? mode.color
                              : theme.palette.text.secondary,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {mode.icon}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          className="transport-label"
                          variant="body2"
                          sx={{
                            fontWeight:
                              transportMode === mode.value ? 600 : 500,
                            fontSize: "0.875rem",
                            lineHeight: 1.2,
                            transition: "all 0.2s ease",
                            color:
                              transportMode === mode.value
                                ? mode.color
                                : "inherit",
                          }}
                        >
                          {mode.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.75rem",
                            lineHeight: 1.1,
                            mt: 0.25,
                            display: "block",
                          }}
                        >
                          Velocidad promedio: {mode.speed}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ px: 2, py: 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showDistanceIndicators}
                            onChange={handleToggleDistanceIndicators}
                            size="small"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Navigation size={14} />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              Mostrar distancias
                            </Typography>
                          </Box>
                        }
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showRouteOptimizer}
                            onChange={handleToggleRouteOptimizer}
                            size="small"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Zap size={14} />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              Optimizador de rutas
                            </Typography>
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Privacy Menu */}
      <Popper
        open={privacyMenuOpen}
        anchorEl={privacyMenuAnchor}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1105 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                backgroundColor: theme.palette.background.paper,
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: theme.shadows[12],
                border: `1px solid ${theme.palette.divider}`,
                minWidth: { xs: 280, sm: 300 },
                maxWidth: "90vw",
                mt: 1,
                overflow: "hidden",
              }}
            >
              <ClickAwayListener onClickAway={handlePrivacyMenuClose}>
                <MenuList
                  autoFocusItem={privacyMenuOpen}
                  id="privacy-menu"
                  sx={{ p: 1 }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      CONFIGURACIÓN DE PRIVACIDAD
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      Controla quién puede ver tu itinerario
                    </Typography>
                  </Box>

                  <MenuItem
                    onClick={() => handlePrivacyChange(false)}
                    selected={!isPrivate}
                    sx={{
                      borderRadius: 2,
                      mx: 0.5,
                      mb: 0.5,
                      py: 1.5,
                      px: 2,
                      transition: "all 0.2s ease",
                      backgroundColor: !isPrivate
                        ? `${theme.palette.success.main}20`
                        : "transparent",
                      "&:hover": {
                        backgroundColor: `${theme.palette.success.main}15`,
                        "& .privacy-icon": {
                          color: theme.palette.success.main,
                          transform: "scale(1.1)",
                        },
                        "& .privacy-label": {
                          color: theme.palette.success.main,
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      className="privacy-icon"
                      sx={{
                        minWidth: 36,
                        color: !isPrivate
                          ? theme.palette.success.main
                          : theme.palette.text.secondary,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Globe size={18} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        className="privacy-label"
                        variant="body2"
                        sx={{
                          fontWeight: !isPrivate ? 600 : 500,
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          transition: "all 0.2s ease",
                          color: !isPrivate
                            ? theme.palette.success.main
                            : "inherit",
                        }}
                      >
                        Público
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          lineHeight: 1.1,
                          mt: 0.25,
                          display: "block",
                        }}
                      >
                        Cualquiera puede ver este itinerario
                      </Typography>
                    </ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => handlePrivacyChange(true)}
                    selected={isPrivate}
                    sx={{
                      borderRadius: 2,
                      mx: 0.5,
                      mb: 0.5,
                      py: 1.5,
                      px: 2,
                      transition: "all 0.2s ease",
                      backgroundColor: isPrivate
                        ? `${theme.palette.warning.main}20`
                        : "transparent",
                      "&:hover": {
                        backgroundColor: `${theme.palette.warning.main}15`,
                        "& .privacy-icon": {
                          color: theme.palette.warning.main,
                          transform: "scale(1.1)",
                        },
                        "& .privacy-label": {
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      className="privacy-icon"
                      sx={{
                        minWidth: 36,
                        color: isPrivate
                          ? theme.palette.warning.main
                          : theme.palette.text.secondary,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Lock size={18} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        className="privacy-label"
                        variant="body2"
                        sx={{
                          fontWeight: isPrivate ? 600 : 500,
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          transition: "all 0.2s ease",
                          color: isPrivate
                            ? theme.palette.warning.main
                            : "inherit",
                        }}
                      >
                        Privado
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          lineHeight: 1.1,
                          mt: 0.25,
                          display: "block",
                        }}
                      >
                        Solo tú y tus compañeros pueden verlo
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Original More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        sx={{
          zIndex: 1105,
          "& .MuiPaper-root": {
            backgroundColor: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            minWidth: { xs: 300, sm: 280 },
            maxWidth: "90vw",
            zIndex: 1105,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Información del viaje
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Crown size={16} color="gold" />
            <Typography variant="body2">
              Creado por: {creator?.name || "Desconocido"}
            </Typography>
          </Box>
          <Chip
            label={`Tu rol: ${myRole}`}
            size="small"
            color={userRole === "owner" ? "primary" : "default"}
            sx={{ fontSize: "0.75rem" }}
          />
        </Box>

        <MenuItem onClick={onEditDates} disabled={!canEditDates}>
          <ListItemIcon>
            <CalendarDays size={18} />
          </ListItemIcon>
          <ListItemText>
            <Box>
              <Typography variant="body2">Fechas del viaje</Typography>
              <Typography variant="caption" color="text.secondary">
                {startDate ? startDate.toLocaleDateString() : "Sin fecha"} -{" "}
                {endDate ? endDate.toLocaleDateString() : "Sin fecha"}
              </Typography>
            </Box>
          </ListItemText>
        </MenuItem>

        <Divider />

        {hasOfflinePermission && (
          <MenuItem onClick={handleOfflineClick}>
            <ListItemIcon>
              <Download size={18} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Descargar PDF</Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {travelDays} días • ¥{totalBudget.toLocaleString()} presupuesto
          </Typography>
        </Box>
      </Menu>

      {/* GLOBAL STYLES TO PREVENT WEBSITE NAV */}
      <style jsx global>{`
        body.itinerary-page-active .main-nav,
        body.itinerary-page-active .site-header,
        body.itinerary-page-active .website-nav,
        body.itinerary-page-active [class*="main-nav"],
        body.itinerary-page-active
          [class*="site-nav"]:not([class*="itinerary"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        body.itinerary-page-active .nav-trigger,
        body.ititerary-page-active [data-nav-trigger] {
          pointer-events: none !important;
        }
      `}</style>
    </>
  );
};

export default ItineraryHeader;

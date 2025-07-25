// ItineraryHeader with Quick Navigation Menu instead of simple back button
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Button,
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
  Avatar,
  MenuList,
  Paper,
  ClickAwayListener,
  Popper,
  Grow,
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
  Menu as MenuIcon,
  Home,
  MapPin,
  Heart,
  Users,
  Settings,
  Search,
  Plus,
  BookOpen,
  Compass,
  Camera,
  Star,
  LogOut,
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
  onBackClick, // Keep for backwards compatibility but won't use
  userRole = "viewer",
  currentUserId,
  startDate,
  boards,
  onEditDates,
  canEditDates,
  isPrivate = false,
  onPrivacyToggle,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State for different menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);

  const open = Boolean(anchorEl);

  // NEW: Prevent website nav from appearing
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
      icon: <Home size={18} />,
      label: "Inicio",
      description: "Página principal",
      path: "/",
      color: theme.palette.primary.main,
    },
    {
      icon: <BookOpen size={18} />,
      label: "Mis Itinerarios",
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
      label: "Crear Itinerario",
      description: "Nuevo viaje",
      path: "/user/itineraries/manage/create",
      color: theme.palette.primary.dark,
    },
  ];

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

  const handleNavigate = (path) => {
    navigate(path);
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

  const handlePrivacyChange = (event) => {
    if (canChangePrivacy && onPrivacyToggle) {
      onPrivacyToggle(event.target.checked);
    }
    handleMenuClose();
  };

  const handleOfflineClick = () => {
    onOfflineClick();
    handleMenuClose();
  };

  // Event handlers to prevent website nav triggering
  const handleMouseEnter = (e) => {
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <Box
        sx={{
          background: theme.palette.background.nav,
          position: "relative",
          overflow: "hidden",
          zIndex: 1100,

          // Buffer Zone - Invisible area above header
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
          <Box sx={{ py: { xs: 3, sm: 2 }, position: "relative" }}>
            {/* 🆕 ENHANCED NAVIGATION MENU BUTTON */}
            <Tooltip title="Navegación rápida">
              <IconButton
                onClick={handleNavMenuClick}
                size="small"
                sx={{
                  position: "absolute",
                  left: 0,
                  top: { xs: 16, sm: 12 },
                  zIndex: 1103,
                  width: { xs: 44, sm: 40 },
                  height: { xs: 44, sm: 40 },
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
                    gap: 1.5,
                    width: "100%",
                  }}
                >
                  {/* Title */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "center",
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
                          maxWidth: "240px",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 16,
                            border: `2px solid rgba(255,255,255,0.3)`,
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            "& fieldset": { border: "none" },
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid rgba(255,255,255,0.5)`,
                            },
                            "&.Mui-focused": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid ${theme.palette.primary.main}`,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "12px 16px",
                            "&::placeholder": {
                              color: theme.palette.text.secondary,
                              opacity: 0.7,
                              fontStyle: "italic",
                            },
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      />
                    ) : (
                      <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          cursor: canEdit ? "pointer" : "default",
                          fontSize: "1.5rem",
                          lineHeight: 1.2,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                          "&:hover": canEdit ? { opacity: 0.8 } : {},
                        }}
                        onClick={handleNameClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      >
                        {name || "Nuevo Itinerario"}
                      </Typography>
                    )}

                    {canEdit && (
                      <IconButton
                        onClick={handleEditClick}
                        size="small"
                        sx={{
                          width: 36,
                          height: 36,
                          color: isEditingName
                            ? theme.palette.success.main
                            : "white",
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                          zIndex: 1103,
                          "&:hover": {
                            background: "rgba(255,255,255,0.25)",
                            zIndex: 1104,
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      >
                        {isEditingName ? (
                          <Save size={16} />
                        ) : (
                          <Edit size={16} />
                        )}
                      </IconButton>
                    )}
                  </Box>

                  {/* Mobile: Badges */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                  >
                    <Chip
                      icon={<CalendarDays size={14} />}
                      label={`${travelDays} días`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.75rem",
                        height: 28,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 14,
                          height: 14,
                        },
                      }}
                    />
                    <Chip
                      icon={<HandCoins size={14} />}
                      label={`¥ ${totalBudget.toLocaleString()}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.75rem",
                        height: 28,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 14,
                          height: 14,
                        },
                      }}
                    />
                    <Chip
                      icon={
                        isPrivate ? <Lock size={12} /> : <Globe size={12} />
                      }
                      label={isPrivate ? "Privado" : "Público"}
                      size="small"
                      sx={{
                        backgroundColor: isPrivate
                          ? "rgba(255, 152, 0, 0.8)"
                          : "rgba(76, 175, 80, 0.8)",
                        color: "white",
                        fontSize: "0.75rem",
                        height: 28,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 12,
                          height: 12,
                        },
                      }}
                    />
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

                  <Tooltip title="Lista del viaje">
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

                  <Tooltip title="Más opciones">
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

            {/* DESKTOP/TABLET LAYOUT */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { sm: 2, md: 3 },
                  width: "100%",
                  pl: { sm: 12, md: 14 },
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
                    alignItems: "center",
                    gap: { sm: 2, md: 3 },
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Title */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
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
                          maxWidth: { sm: "280px", md: "350px" },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 20,
                            border: `2px solid rgba(255,255,255,0.3)`,
                            fontSize: { sm: "1.125rem", md: "1.25rem" },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            "& fieldset": { border: "none" },
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid rgba(255,255,255,0.5)`,
                            },
                            "&.Mui-focused": {
                              backgroundColor: "rgba(255,255,255,1)",
                              border: `2px solid ${theme.palette.primary.main}`,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "8px 12px",
                            "&::placeholder": {
                              color: theme.palette.text.secondary,
                              opacity: 0.7,
                              fontStyle: "italic",
                            },
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      />
                    ) : (
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          cursor: canEdit ? "pointer" : "default",
                          fontSize: { sm: "1.5rem", md: "2rem", lg: "2.25rem" },
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          minWidth: 0,
                          "&:hover": canEdit ? { opacity: 0.8 } : {},
                        }}
                        onClick={handleNameClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      >
                        {name || "Nuevo Itinerario"}
                      </Typography>
                    )}

                    {canEdit && (
                      <IconButton
                        onClick={handleEditClick}
                        size="small"
                        sx={{
                          width: 32,
                          height: 32,
                          color: isEditingName
                            ? theme.palette.success.main
                            : "white",
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                          flexShrink: 0,
                          zIndex: 1103,
                          "&:hover": {
                            background: "rgba(255,255,255,0.25)",
                            zIndex: 1104,
                          },
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                      >
                        {isEditingName ? (
                          <Save size={16} />
                        ) : (
                          <Edit size={16} />
                        )}
                      </IconButton>
                    )}
                  </Box>

                  {/* Desktop: Badges */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                  >
                    <Chip
                      icon={<CalendarDays size={14} />}
                      label={`${travelDays} días`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.7rem",
                        height: 24,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 14,
                          height: 14,
                        },
                      }}
                    />
                    <Chip
                      icon={<HandCoins size={14} />}
                      label={`¥ ${totalBudget.toLocaleString()}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.7rem",
                        height: 24,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 14,
                          height: 14,
                        },
                      }}
                    />
                    <Chip
                      icon={
                        isPrivate ? <Lock size={12} /> : <Globe size={12} />
                      }
                      label={isPrivate ? "Privado" : "Público"}
                      size="small"
                      sx={{
                        backgroundColor: isPrivate
                          ? "rgba(255, 152, 0, 0.8)"
                          : "rgba(76, 175, 80, 0.8)",
                        color: "white",
                        fontSize: "0.7rem",
                        height: 24,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": {
                          color: "white",
                          width: 12,
                          height: 12,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Desktop: Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
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

                  <Tooltip title="Lista del viaje">
                    <IconButton
                      onClick={onNotesClick}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        width: 36,
                        height: 36,
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
                      <ListCheck size={16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Más opciones">
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        width: 36,
                        height: 36,
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
                      <MoreVertical size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* 🆕 ENHANCED NAVIGATION MENU */}
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
                  {/* Header */}
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
                        onClick={() => handleNavigate(item.path)}
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

      {/* Original Dropdown Menu (More Options) */}
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
            Información del Viaje
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

        {canChangePrivacy && (
          <MenuItem>
            <ListItemIcon>
              {isPrivate ? <Lock size={18} /> : <Globe size={18} />}
            </ListItemIcon>
            <ListItemText>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  {isPrivate ? "Itinerario Privado" : "Itinerario Público"}
                </Typography>
                <Switch
                  checked={isPrivate}
                  onChange={handlePrivacyChange}
                  size="small"
                />
              </Box>
            </ListItemText>
          </MenuItem>
        )}

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

// OPTION 2: Enhanced BoardCard with individual transport mode controls
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Button,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  Coins,
  Map,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Route,
  Sparkles,
  Navigation,
  Clock,
  TrendingDown,
  CheckCircle,
  Settings,
  Car,
  Train,
  Footprints,
  Bike,
  ChevronDown,
} from "lucide-react";
import ActivityCard from "./ItineraryActivity";
import MapModal from "./MapModal";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getExperienceCoordinates = (experience) => {
  const coords =
    experience?.experienceId?.location?.coordinates ||
    experience?.location?.coordinates;
  if (!coords || coords.length !== 2) return null;
  return { lat: coords[1], lng: coords[0] };
};

const calculateExperienceDistance = (exp1, exp2) => {
  const coords1 = getExperienceCoordinates(exp1);
  const coords2 = getExperienceCoordinates(exp2);
  if (!coords1 || !coords2) return null;
  return calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
};

const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) return "N/A";
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else {
    return `${distanceKm.toFixed(1)}km`;
  }
};

const estimateTravelTime = (distanceKm, mode = "walking") => {
  if (distanceKm === null || distanceKm === undefined) return null;
  const speeds = { walking: 5, cycling: 15, driving: 30, transit: 20 };
  const timeHours = distanceKm / speeds[mode];
  const timeMinutes = Math.round(timeHours * 60);
  if (timeMinutes < 60) {
    return `${timeMinutes}min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
};

const calculateTotalDistance = (experiences) => {
  if (!experiences || experiences.length < 2) return 0;
  let totalDistance = 0;
  for (let i = 0; i < experiences.length - 1; i++) {
    const distance = calculateExperienceDistance(
      experiences[i],
      experiences[i + 1]
    );
    if (distance !== null) {
      totalDistance += distance;
    }
  }
  return totalDistance;
};

const optimizeRoute = (experiences) => {
  if (!experiences || experiences.length <= 2) return experiences;
  const validExperiences = experiences.filter((exp) =>
    getExperienceCoordinates(exp)
  );
  if (validExperiences.length <= 2) return experiences;

  const optimized = [];
  const remaining = [...validExperiences];
  let current = remaining.splice(0, 1)[0];
  optimized.push(current);

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateExperienceDistance(current, remaining[i]);
      if (distance !== null && distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    current = remaining.splice(nearestIndex, 1)[0];
    optimized.push(current);
  }

  return optimized;
};

// 🆕 NEW: Transport Mode Selector Component
const TransportModeSelector = ({
  transportMode,
  onTransportModeChange,
  size = "small",
  showLabel = true,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const transportModes = [
    {
      value: "walking",
      label: "Caminando",
      icon: <Footprints size={14} />,
      speed: "5 km/h",
      color: theme.palette.success.main,
    },
    {
      value: "cycling",
      label: "Bicicleta",
      icon: <Bike size={14} />,
      speed: "15 km/h",
      color: theme.palette.info.main,
    },
    {
      value: "driving",
      label: "Coche",
      icon: <Car size={14} />,
      speed: "30 km/h",
      color: theme.palette.warning.main,
    },
    {
      value: "transit",
      label: "Transporte",
      icon: <Train size={14} />,
      speed: "20 km/h",
      color: theme.palette.secondary.main,
    },
  ];

  const currentMode =
    transportModes.find((mode) => mode.value === transportMode) ||
    transportModes[0];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (mode) => {
    onTransportModeChange && onTransportModeChange(mode);
    handleClose();
  };

  return (
    <>
      <Chip
        icon={currentMode.icon}
        label={showLabel ? currentMode.label : ""}
        size={size}
        onClick={handleClick}
        deleteIcon={<ChevronDown size={12} />}
        onDelete={handleClick} // Hack to show dropdown icon
        sx={{
          backgroundColor: currentMode.color + "20",
          color: currentMode.color,
          fontSize: size === "small" ? "0.65rem" : "0.75rem",
          height: size === "small" ? 20 : 24,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: currentMode.color + "30",
            transform: "scale(1.02)",
          },
          "& .MuiChip-icon": {
            color: currentMode.color,
            width: 12,
            height: 12,
          },
          "& .MuiChip-deleteIcon": {
            color: currentMode.color,
            width: 12,
            height: 12,
            "&:hover": {
              color: currentMode.color,
            },
          },
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {transportModes.map((mode) => (
          <MenuItem
            key={mode.value}
            onClick={() => handleModeSelect(mode.value)}
            selected={transportMode === mode.value}
            sx={{
              py: 1,
              "&:hover": {
                backgroundColor: mode.color + "15",
              },
              "&.Mui-selected": {
                backgroundColor: mode.color + "20",
                "&:hover": {
                  backgroundColor: mode.color + "25",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: mode.color, minWidth: 32 }}>
              {mode.icon}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {mode.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mode.speed}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Updated Distance Indicator Component
const DistanceIndicator = ({
  fromExperience,
  toExperience,
  transportMode = "walking",
}) => {
  const theme = useTheme();
  const distance = calculateExperienceDistance(fromExperience, toExperience);
  const travelTime = estimateTravelTime(distance, transportMode);

  if (distance === null) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 0.25,
          my: 0.25,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 0.5,
          fontSize: "0.65rem",
        }}
      >
        <Navigation size={8} color={theme.palette.grey[500]} />
        <Typography
          variant="caption"
          sx={{ ml: 0.25, fontSize: "0.55rem", color: theme.palette.grey[600] }}
        >
          Sin ubicación
        </Typography>
      </Box>
    );
  }

  const getDistanceColor = (distanceKm) => {
    if (distanceKm < 0.5) return theme.palette.success.main;
    if (distanceKm < 2) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 0.25,
        my: 0.25,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0.5,
        border: `1px solid ${getDistanceColor(distance)}`,
        opacity: 0.8,
      }}
    >
      <Navigation
        size={8}
        color={getDistanceColor(distance)}
        style={{ transform: "rotate(45deg)" }}
      />
      <Typography
        variant="caption"
        sx={{
          ml: 0.25,
          fontSize: "0.55rem",
          fontWeight: 600,
          color: getDistanceColor(distance),
        }}
      >
        {formatDistance(distance)}
      </Typography>
      {travelTime && (
        <>
          <Clock
            size={6}
            color={theme.palette.grey[600]}
            style={{ marginLeft: 2 }}
          />
          <Typography
            variant="caption"
            sx={{
              ml: 0.2,
              fontSize: "0.55rem",
              color: theme.palette.grey[700],
            }}
          >
            {travelTime}
          </Typography>
        </>
      )}
    </Box>
  );
};

// Updated Route Optimizer Component
const RouteOptimizerPanel = ({
  experiences,
  onApplyOptimization,
  transportMode = "walking",
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  if (!experiences || experiences.length < 2) return null;

  const validExperiences = experiences.filter((exp) =>
    getExperienceCoordinates(exp)
  );
  if (validExperiences.length < 2) return null;

  const originalDistance = calculateTotalDistance(validExperiences);
  const optimizedRoute = optimizeRoute(validExperiences);
  const optimizedDistance = calculateTotalDistance(optimizedRoute);
  const distanceSaved = originalDistance - optimizedDistance;
  const percentageImprovement = (distanceSaved / originalDistance) * 100;

  const isWorthOptimizing = distanceSaved > 0.1 && percentageImprovement > 5;

  if (!isWorthOptimizing) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0.5,
          backgroundColor: theme.palette.success.light + "20",
          borderRadius: 0.5,
          border: `1px solid ${theme.palette.success.light}`,
          my: 0.5,
        }}
      >
        <CheckCircle size={12} color={theme.palette.success.main} />
        <Typography
          variant="caption"
          sx={{
            ml: 0.5,
            fontSize: "0.6rem",
            color: theme.palette.success.dark,
          }}
        >
          Ruta optimizada ✨
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.light + "15",
        border: `1px solid ${theme.palette.primary.light}`,
        borderRadius: 1,
        p: 0.75,
        my: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Route size={12} color={theme.palette.primary.main} />
          <Typography
            variant="subtitle2"
            sx={{ ml: 0.5, fontSize: "0.7rem", fontWeight: 600 }}
          >
            Optimización
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setShowDetails(!showDetails)}
          sx={{ p: 0.25 }}
        >
          <Settings size={10} />
        </IconButton>
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0.5,
          p: 0.5,
          mb: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: "0.6rem", color: theme.palette.text.secondary }}
          >
            Mejora:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingDown size={10} color={theme.palette.success.main} />
            <Typography
              variant="caption"
              sx={{
                ml: 0.25,
                fontSize: "0.6rem",
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {formatDistance(distanceSaved)} (
              {percentageImprovement.toFixed(1)}%)
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0.5,
            fontSize: "0.55rem",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.55rem", color: theme.palette.text.secondary }}
            >
              Actual: {formatDistance(originalDistance)}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.55rem",
                fontWeight: 500,
                color: theme.palette.success.main,
              }}
            >
              Optimizada: {formatDistance(optimizedDistance)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="small"
        startIcon={<Route size={10} />}
        onClick={() =>
          onApplyOptimization && onApplyOptimization(optimizedRoute)
        }
        sx={{
          textTransform: "none",
          fontSize: "0.6rem",
          py: 0.25,
          borderRadius: 1,
        }}
      >
        Aplicar Optimizada
      </Button>
    </Box>
  );
};
const BoardCard = ({
  board,
  boardIndex,
  onRemoveBoard,
  onAddExperience,
  onRemoveFavorite,
  onMoveActivity,
  onMoveBoard,
  onReorderExperiences,
  totalBoards = 1,
  userRole = "viewer",
  isDragDisabled = false,
  transportMode = "walking",
  showDistanceIndicators = true,
  showRouteOptimizer = true,
  onTransportModeChange,
  compact = false,
  dense = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Existing sortable and droppable logic
  const {
    attributes: boardAttributes,
    listeners: boardListeners,
    setNodeRef: setBoardRef,
    transform: boardTransform,
    transition: boardTransition,
    isDragging: isBoardDragging,
  } = useSortable({
    id: `board-${board.id}`,
    disabled: isDragDisabled || userRole === "viewer",
    activationConstraint: isMobile
      ? {
          delay: 200,
          tolerance: 5,
        }
      : undefined,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `board-${board.id}`,
  });

  const handleMapClick = (e) => {
    e.stopPropagation();
    setMapModalOpen(true);
  };

  const handleCloseMap = () => {
    setMapModalOpen(false);
  };

  const handleMoveLeft = () => {
    if (onMoveBoard && boardIndex > 0) {
      onMoveBoard(boardIndex, boardIndex - 1);
    }
  };

  const handleMoveRight = () => {
    if (onMoveBoard && boardIndex < totalBoards - 1) {
      onMoveBoard(boardIndex, boardIndex + 1);
    }
  };

  const getDayTitle = () => {
    const date = new Date(board.date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return `Día ${boardIndex + 1} - ${date}`;
  };

  const boardStyle = {
    transform: CSS.Transform.toString(boardTransform),
    transition: boardTransition,
    opacity: isBoardDragging ? 0.5 : 1,
  };

  const activityIds =
    board.favorites?.map(
      (fav, index) => fav.uniqueId || `${boardIndex}-${index}-${fav._id}`
    ) || [];

  // Calculate route statistics with current transport mode
  const routeStats =
    board.favorites?.length > 1
      ? {
          totalDistance: calculateTotalDistance(board.favorites),
          totalTime: estimateTravelTime(
            calculateTotalDistance(board.favorites),
            transportMode
          ),
        }
      : null;

  return (
    <Box
      ref={setDropRef}
      sx={{
        position: "relative",
        mb: { xs: 1.5, sm: 2 },
        borderRadius: { xs: 4, sm: 4 },
        boxShadow: "none",
        backgroundColor: theme.palette.primary.white,
        minHeight: "fit-content",
        height: "auto",
        minWidth: {
          xs: compact ? "260px" : "280px",
          sm: compact ? "280px" : "320px",
          md: compact ? "300px" : "350px",
        },
        maxWidth: {
          xs: compact ? "260px" : "280px",
          sm: compact ? "280px" : "320px",
          md: compact ? "300px" : "350px",
        },
        display: "flex",
        flexDirection: "column",
        border: isOver
          ? `2px dashed ${theme.palette.primary.main}`
          : isBoardDragging
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
        transform: isOver ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
        touchAction: isMobile ? "manipulation" : "auto",
      }}
    >
      <Box
        ref={setBoardRef}
        style={boardStyle}
        sx={{
          display: "flex",
          borderRadius: { xs: 4, sm: 4 },
          flexDirection: "column",
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
            display: "flex",
            borderRadius: { xs: 4, sm: 4 },
            flexDirection: "column",
            gap: { xs: 0.75, sm: 1 },
            p: { xs: 1, sm: 1.25 },
            flexShrink: 0,
          }}
        >
          {/* Top Row: Move buttons, Title, Remove button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            {/* Move buttons */}
            {userRole !== "viewer" && (
              <>
                {isMobile ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "row", gap: 0.25 }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleMoveLeft}
                      disabled={boardIndex === 0}
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor:
                          boardIndex === 0
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          boardIndex === 0
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                      }}
                    >
                      <ChevronLeft size={14} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleMoveRight}
                      disabled={boardIndex === totalBoards - 1}
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor:
                          boardIndex === totalBoards - 1
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          boardIndex === totalBoards - 1
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                      }}
                    >
                      <ChevronRight size={14} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    {...boardAttributes}
                    {...boardListeners}
                    sx={{
                      cursor: isBoardDragging ? "grabbing" : "grab",
                      display: "flex",
                      alignItems: "center",
                      p: 0.25,
                      borderRadius: 0.5,
                      "&:hover": {
                        backgroundColor: theme.palette.grey[100],
                      },
                    }}
                  >
                    <GripVertical size={16} color={theme.palette.grey[600]} />
                  </Box>
                )}
              </>
            )}

            {/* Title Section */}
            <Box sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  variant={isMobile ? "subtitle2" : "subtitle1"}
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Día {boardIndex + 1}
                </Typography>
                {board.date && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    }}
                  >
                    -{" "}
                    {new Date(board.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })}
                  </Typography>
                )}
              </Box>

              {/* Compact Budget and Route Stats */}
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Coins size={10} color={theme.palette.secondary.medium} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                  >
                    ¥ {board.dailyBudget || 0}
                  </Typography>
                </Box>

                {routeStats && (
                  <>
                    <Typography
                      variant="caption"
                      sx={{
                        mx: 0.25,
                        color: theme.palette.grey[400],
                        fontSize: "0.6rem",
                      }}
                    >
                      •
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Route size={9} color={theme.palette.info.main} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: "0.55rem", sm: "0.65rem" },
                          color: theme.palette.info.main,
                        }}
                      >
                        {formatDistance(routeStats.totalDistance)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.25}>
                      <Clock size={8} color={theme.palette.info.dark} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: "0.55rem", sm: "0.65rem" },
                          color: theme.palette.info.dark,
                        }}
                      >
                        {routeStats.totalTime}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            {/* Remove button */}
            {userRole !== "viewer" && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBoard(boardIndex);
                }}
                size="small"
                sx={{
                  pointerEvents: "auto",
                  color: theme.palette.error.main,
                  width: 28,
                  height: 28,
                  "&:hover": {
                    backgroundColor: theme.palette.error.light,
                  },
                }}
              >
                <Trash2 size={14} />
              </IconButton>
            )}
          </Box>

          {/* 🆕 NEW: Transport Mode and Action Buttons Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 0.75 },
            }}
          >
            {/* 🆕 Individual Transport Mode Selector */}
            {onTransportModeChange && (
              <TransportModeSelector
                transportMode={transportMode}
                onTransportModeChange={onTransportModeChange}
                size="small"
                showLabel={!isMobile}
              />
            )}

            {userRole !== "viewer" && (
              <Button
                variant="contained"
                startIcon={<Sparkles size={10} />}
                onClick={() => onAddExperience?.(boardIndex)}
                size="small"
                sx={{
                  flex: 1,
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}E6, ${theme.palette.primary.dark}CC)`,
                  color: "white",
                  py: { xs: 0.25, sm: 0.35 },
                  px: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  letterSpacing: "0.02em",
                  boxShadow: `0 1px 4px ${theme.palette.primary.main}25`,
                  border: `1px solid ${theme.palette.primary.light}40`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  minHeight: { xs: "24px", sm: "28px" },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}F0, ${theme.palette.primary.main}E6)`,
                    boxShadow: `0 2px 6px ${theme.palette.primary.main}35`,
                    transform: "translateY(-0.5px)",
                    borderColor: theme.palette.primary.main,
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                    boxShadow: `0 1px 3px ${theme.palette.primary.main}50`,
                  },
                }}
              >
                {isMobile ? "Añadir" : " Añadir Experiencia"}
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<Map size={10} />}
              onClick={handleMapClick}
              size="small"
              disabled={
                !board.favorites?.some(
                  (fav) =>
                    fav?.experienceId?.location?.coordinates?.length === 2
                )
              }
              sx={{
                flex: userRole === "viewer" ? 1 : 0.75,
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
                py: { xs: 0.25, sm: 0.35 },
                px: { xs: 0.75, sm: 1 },
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                letterSpacing: "0.02em",
                background: `linear-gradient(135deg, ${theme.palette.background.paper}F8, ${theme.palette.grey[50]}F0)`,
                borderColor: `${theme.palette.secondary.main}60`,
                color: theme.palette.secondary.dark,
                backdropFilter: "blur(6px)",
                boxShadow: `0 1px 3px ${theme.palette.secondary.main}10`,
                minHeight: { xs: "24px", sm: "28px" },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.secondary.main}10)`,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.dark,
                  boxShadow: `0 2px 6px ${theme.palette.secondary.main}20`,
                  transform: "translateY(-0.5px)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                  background: `${theme.palette.grey[100]}60`,
                  borderColor: `${theme.palette.grey[300]}40`,
                  color: theme.palette.grey[500],
                  "&:hover": {
                    transform: "none",
                    boxShadow: "none",
                  },
                },
                "&:active": {
                  transform: "translateY(0px)",
                  boxShadow: `0 1px 3px ${theme.palette.secondary.main}25`,
                },
              }}
            >
              Ver mapa
            </Button>
          </Box>
        </Box>

        {/* DYNAMIC Content Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "200px",
          }}
        >
          {/* Route Optimizer */}
          {showRouteOptimizer &&
            userRole !== "viewer" &&
            board.favorites?.length > 2 && (
              <Box sx={{ px: { xs: 1, sm: 1.25 }, pt: 0.5 }}>
                <RouteOptimizerPanel
                  experiences={board.favorites}
                  onApplyOptimization={(optimizedRoute) =>
                    onReorderExperiences &&
                    onReorderExperiences(boardIndex, optimizedRoute)
                  }
                  transportMode={transportMode}
                />
              </Box>
            )}

          {/* Activities List */}
          <Box
            sx={{
              px: { xs: 1, sm: 1.25 },
              py: 0.5,
              pb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {/* Timeline */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "16px", sm: "20px" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pt: 1,
                  pb: 1,
                  flexShrink: 0,
                }}
              >
                {board.favorites?.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: 8,
                      bottom: 8,
                      width: "1px",
                      backgroundColor: theme.palette.secondary.main,
                      transform: "translateX(-50%)",
                      zIndex: 0,
                    }}
                  />
                )}
              </Box>

              <SortableContext
                items={activityIds}
                strategy={verticalListSortingStrategy}
              >
                <Box sx={{ flex: 1, ml: { xs: 1, sm: 1.5 }, pb: 2 }}>
                  {board.favorites?.length > 0 ? (
                    board.favorites.map((fav, favIndex) => (
                      <Box
                        key={
                          fav.uniqueId || `${boardIndex}-${favIndex}-${fav._id}`
                        }
                      >
                        <ActivityCard
                          fav={fav}
                          boardIndex={boardIndex}
                          favIndex={favIndex}
                          userRole={userRole}
                          onRemove={onRemoveFavorite}
                          sortableId={
                            fav.uniqueId ||
                            `${boardIndex}-${favIndex}-${fav._id}`
                          }
                          onMoveActivity={onMoveActivity}
                          totalActivities={board.favorites.length}
                          compact={compact}
                          dense={dense}
                        />

                        {showDistanceIndicators &&
                          favIndex < board.favorites.length - 1 && (
                            <DistanceIndicator
                              fromExperience={fav}
                              toExperience={board.favorites[favIndex + 1]}
                              transportMode={transportMode}
                            />
                          )}
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 4,
                        textAlign: "center",
                        color: theme.palette.text.secondary,
                        minHeight: "120px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 0.5,
                          fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        }}
                      >
                        No hay experiencias
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                      >
                        {isMobile
                          ? "Toca 'Añadir' arriba"
                          : "Arrastra desde favoritos o usa 'Añadir'"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </SortableContext>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drop zone indicator */}
      {isOver && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.palette.primary.main + "10",
            borderRadius: { xs: 3, sm: 4 },
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            border: `2px dashed ${theme.palette.primary.main}`,
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              px: { xs: 1.5, sm: 2 },
              py: 0.5,
              borderRadius: 15,
              boxShadow: 2,
            }}
          >
            <Typography variant={isMobile ? "body2" : "body1"}>
              Soltar aquí
            </Typography>
          </Box>
        </Box>
      )}

      <MapModal
        open={mapModalOpen}
        onClose={handleCloseMap}
        experiences={board.favorites || []}
        dayTitle={getDayTitle()}
      />
    </Box>
  );
};

export default BoardCard;

// Enhanced BoardCard.jsx with Distance Indicators and Route Optimization

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Button,
  useMediaQuery,
  Collapse,
  Chip,
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
  Plus,
  Map,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Route,
  Navigation,
  Clock,
  TrendingDown,
  CheckCircle,
  Settings,
} from "lucide-react";
import ActivityCard from "./ItineraryActivity";
import MapModal from "./MapModal";

// Distance calculation utilities
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

// Distance Indicator Component
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
          py: 0.5,
          my: 0.5,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 1,
          fontSize: "0.7rem",
        }}
      >
        <Navigation size={10} color={theme.palette.grey[500]} />
        <Typography
          variant="caption"
          sx={{ ml: 0.5, fontSize: "0.6rem", color: theme.palette.grey[600] }}
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
        py: 0.5,
        my: 0.5,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        border: `1px solid ${getDistanceColor(distance)}`,
        opacity: 0.8,
      }}
    >
      <Navigation
        size={10}
        color={getDistanceColor(distance)}
        style={{ transform: "rotate(45deg)" }}
      />
      <Typography
        variant="caption"
        sx={{
          ml: 0.5,
          fontSize: "0.6rem",
          fontWeight: 600,
          color: getDistanceColor(distance),
        }}
      >
        {formatDistance(distance)}
      </Typography>
      {travelTime && (
        <>
          <Clock
            size={8}
            color={theme.palette.grey[600]}
            style={{ marginLeft: 4 }}
          />
          <Typography
            variant="caption"
            sx={{
              ml: 0.3,
              fontSize: "0.6rem",
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

// Route Optimizer Component
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
          p: 1,
          backgroundColor: theme.palette.success.light + "20",
          borderRadius: 1,
          border: `1px solid ${theme.palette.success.light}`,
          my: 1,
        }}
      >
        <CheckCircle size={16} color={theme.palette.success.main} />
        <Typography
          variant="caption"
          sx={{ ml: 1, fontSize: "0.7rem", color: theme.palette.success.dark }}
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
        borderRadius: 2,
        p: 1.5,
        my: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Route size={16} color={theme.palette.primary.main} />
          <Typography
            variant="subtitle2"
            sx={{ ml: 1, fontSize: "0.8rem", fontWeight: 600 }}
          >
            Optimización de Ruta
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setShowDetails(!showDetails)}
          sx={{ p: 0.5 }}
        >
          <Settings size={14} />
        </IconButton>
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          p: 1,
          mb: 1,
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
          <Typography
            variant="caption"
            sx={{ fontSize: "0.7rem", color: theme.palette.text.secondary }}
          >
            Mejora posible:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingDown size={12} color={theme.palette.success.main} />
            <Typography
              variant="caption"
              sx={{
                ml: 0.5,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {formatDistance(distanceSaved)} menos (
              {percentageImprovement.toFixed(1)}%)
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            fontSize: "0.65rem",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.6rem", color: theme.palette.text.secondary }}
            >
              Actual:
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", fontWeight: 500, fontSize: "0.65rem" }}
            >
              {formatDistance(originalDistance)}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.6rem", color: theme.palette.text.secondary }}
            >
              Optimizada:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 500,
                fontSize: "0.65rem",
                color: theme.palette.success.main,
              }}
            >
              {formatDistance(optimizedDistance)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Collapse in={showDetails}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              mb: 1,
              display: "block",
            }}
          >
            Ruta optimizada:
          </Typography>
          {optimizedRoute.map((exp, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
            >
              <Chip
                label={index + 1}
                size="small"
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: "0.6rem",
                  mr: 1,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: "0.65rem", flex: 1 }}
              >
                {exp.experienceId?.title?.substring(0, 25) || "Sin nombre"}
                {(exp.experienceId?.title?.length || 0) > 25 && "..."}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>

      <Button
        fullWidth
        variant="contained"
        size="small"
        startIcon={<Route size={14} />}
        onClick={() =>
          onApplyOptimization && onApplyOptimization(optimizedRoute)
        }
        sx={{
          textTransform: "none",
          fontSize: "0.7rem",
          py: 0.5,
          borderRadius: 1.5,
        }}
      >
        Aplicar Ruta Optimizada
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
  onReorderExperiences, // New prop for handling route optimization
  totalBoards = 1,
  userRole = "viewer",
  isDragDisabled = false,
  transportMode = "walking", // New prop for transport mode
  showDistanceIndicators = true, // New prop to toggle distance indicators
  showRouteOptimizer = true, // New prop to toggle route optimizer
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // ... (keep all the existing sortable and droppable logic from original BoardCard)
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

  // Calculate route statistics
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
        mb: 3,
        borderRadius: 5,
        boxShadow: 2,
        backgroundColor: theme.palette.primary.white,
        height: "80vh",
        minWidth: { xs: "300px", sm: "350px" },
        maxWidth: { xs: "300px", sm: "350px" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Header with route statistics */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: { xs: 1.5, sm: 2 },
            minHeight: { xs: "90px", sm: "100px" }, // Increased height for route stats
            flexShrink: 0,
          }}
        >
          {/* Existing header content (move buttons, title, remove button) */}
          {userRole !== "viewer" && (
            <>
              {isMobile ? (
                <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={handleMoveLeft}
                    disabled={boardIndex === 0}
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor:
                        boardIndex === 0
                          ? theme.palette.grey[200]
                          : theme.palette.primary.light,
                      color:
                        boardIndex === 0
                          ? theme.palette.grey[400]
                          : theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor:
                          boardIndex === 0
                            ? theme.palette.grey[200]
                            : theme.palette.primary.main,
                        color:
                          boardIndex === 0 ? theme.palette.grey[400] : "white",
                      },
                    }}
                  >
                    <ChevronLeft size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleMoveRight}
                    disabled={boardIndex === totalBoards - 1}
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor:
                        boardIndex === totalBoards - 1
                          ? theme.palette.grey[200]
                          : theme.palette.primary.light,
                      color:
                        boardIndex === totalBoards - 1
                          ? theme.palette.grey[400]
                          : theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor:
                          boardIndex === totalBoards - 1
                            ? theme.palette.grey[200]
                            : theme.palette.primary.main,
                        color:
                          boardIndex === totalBoards - 1
                            ? theme.palette.grey[400]
                            : "white",
                      },
                    }}
                  >
                    <ChevronRight size={16} />
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
                    p: 0.5,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: theme.palette.grey[100],
                    },
                  }}
                >
                  <GripVertical size={20} color={theme.palette.grey[600]} />
                </Box>
              )}
            </>
          )}

          <Box sx={{ flex: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{ fontWeight: "bold" }}
                >
                  Día {boardIndex + 1}
                </Typography>
                {board.date && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    - {new Date(board.date).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
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
                    "&:hover": {
                      backgroundColor: theme.palette.error.light,
                    },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              )}
            </Box>

            <Box display="flex" alignItems="center" mt={1} gap={1}>
              <Coins size={16} color={theme.palette.secondary.medium} />
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Presupuesto: ¥ {board.dailyBudget || 0}
              </Typography>
            </Box>

            {/* NEW: Route statistics */}
            {routeStats && (
              <Box display="flex" alignItems="center" mt={0.5} gap={1}>
                <Route size={14} color={theme.palette.info.main} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    color: theme.palette.info.main,
                  }}
                >
                  Distancia total: {formatDistance(routeStats.totalDistance)} •{" "}
                  {routeStats.totalTime}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* NEW: Route Optimizer (if enabled and has edit permissions) */}
          {showRouteOptimizer &&
            userRole !== "viewer" &&
            board.favorites?.length > 2 && (
              <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 1 }}>
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

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 1.5, sm: 2 },
              py: 1,
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                width: isMobile ? "4px" : "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: theme.palette.grey[100],
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.grey[400],
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: theme.palette.grey[600],
                },
              },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "row", minHeight: "100%" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "20px", sm: "25px" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pt: 2,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    backgroundColor: theme.palette.secondary.main,
                    transform: "translateX(-50%)",
                    zIndex: 0,
                    minHeight: "100px",
                  }}
                />
              </Box>

              <SortableContext
                items={activityIds}
                strategy={verticalListSortingStrategy}
              >
                <Box sx={{ flex: 1, ml: { xs: 1.5, sm: 2 }, pb: 2 }}>
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
                        />

                        {/* NEW: Distance indicator between consecutive experiences */}
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
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        No hay experiencias programadas
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        {isMobile
                          ? "Usa los botones para añadir experiencias"
                          : "Arrastra experiencias desde favoritos"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </SortableContext>
            </Box>
          </Box>
        </Box>

        {/* Bottom Buttons - keep existing layout */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            p: { xs: 1.5, sm: 2 },
            textAlign: "center",
            boxShadow: `0px -2px 6px ${theme.palette.secondary.main}20`,
            borderTop: `1px solid ${theme.palette.secondary.light}`,
            borderRadius: "0 0 20px 20px",
            flexShrink: 0,
            minHeight: { xs: "80px", sm: "100px" },
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
              backdropFilter: "blur(20px)",
              p: { xs: 2, sm: 3 },
              borderTop: `1px solid ${theme.palette.divider}40`,
              borderRadius: "0 0 16px 16px",
              flexShrink: 0,
              minHeight: { xs: "100px", sm: "120px" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {userRole !== "viewer" && (
                <Button
                  variant="contained"
                  startIcon={<Plus size={isMobile ? 16 : 18} />}
                  onClick={() => onAddExperience?.(boardIndex)}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: 30,
                    textTransform: "none",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                    color: "white",
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}50`,
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  Añadir Experiencia
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<Map size={isMobile ? 16 : 18} />}
                onClick={handleMapClick}
                size={isMobile ? "small" : "medium"}
                disabled={
                  !board.favorites?.some(
                    (fav) =>
                      fav?.experienceId?.location?.coordinates?.length === 2
                  )
                }
                sx={{
                  borderRadius: 30,
                  textTransform: "none",
                  fontWeight: 600,
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  background: `${theme.palette.secondary.medium}10`,
                  borderColor: `${theme.palette.secondary.medium}`,
                  color: theme.palette.secondary.medium,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `${theme.palette.secondary.main}20`,
                    borderColor: theme.palette.secondary.main,
                  },
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                Ver en Mapa
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Drop zone indicator */}
      {isOver && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.palette.primary.main + "10",
            borderRadius: 5,
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
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: 30,
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

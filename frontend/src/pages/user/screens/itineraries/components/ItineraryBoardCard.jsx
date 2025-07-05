import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Button,
  useMediaQuery,
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
} from "lucide-react";
import ActivityCard from "./ItineraryActivity";
import MapModal from "./MapModal";

const BoardCard = ({
  board,
  boardIndex,
  onRemoveBoard,
  onAddExperience,
  onRemoveFavorite,
  onMoveActivity,
  onMoveBoard, // New prop for mobile move functionality
  totalBoards = 1, // New prop to know total number of boards
  userRole = "viewer",
  isDragDisabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mapModalOpen, setMapModalOpen] = useState(false);

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
    // Enhanced touch configuration for mobile
    activationConstraint: isMobile
      ? {
          delay: 200, // 200ms delay before drag starts on mobile
          tolerance: 5, // 5px tolerance for movement
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
        // Enhanced mobile touch styles
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
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: { xs: 1.5, sm: 2 },
            minHeight: { xs: "70px", sm: "80px" },
            flexShrink: 0,
          }}
        >
          {/* Mobile Move Buttons OR Desktop Drag Handle */}
          {userRole !== "viewer" && (
            <>
              {isMobile ? (
                // Mobile: Left/Right buttons
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
                // Desktop: Traditional drag handle
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

          {/* Board info */}
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
                Presupuesto del día: ¥ {board.dailyBudget || 0}
              </Typography>
            </Box>
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
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 1.5, sm: 2 },
              py: 1,
              // Enhanced mobile scrolling
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
              {/* Left Timeline Column */}
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

              {/* Sortable Activities List */}
              <SortableContext
                items={activityIds}
                strategy={verticalListSortingStrategy}
              >
                <Box sx={{ flex: 1, ml: { xs: 1.5, sm: 2 }, pb: 2 }}>
                  {board.favorites?.length > 0 ? (
                    board.favorites.map((fav, favIndex) => (
                      <ActivityCard
                        key={
                          fav.uniqueId || `${boardIndex}-${favIndex}-${fav._id}`
                        }
                        fav={fav}
                        boardIndex={boardIndex}
                        favIndex={favIndex}
                        userRole={userRole}
                        onRemove={onRemoveFavorite}
                        sortableId={
                          fav.uniqueId || `${boardIndex}-${favIndex}-${fav._id}`
                        }
                        onMoveActivity={onMoveActivity} // ← Add this line
                        totalActivities={board.favorites.length} // ← Add this line
                      />
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

        {/* Bottom Buttons - Mobile optimized */}
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
              {/* Add Experience Button */}
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

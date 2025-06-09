import React, { useState } from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Coins, Plus, Map, GripVertical } from "lucide-react";
import ActivityCard from "./ItineraryActivity";
import MapModal from "./MapModal";

const BoardCard = ({
  board,
  boardIndex,
  onRemoveBoard,
  onAddExperience,
  onRemoveFavorite,
  isDragDisabled = false,
}) => {
  const theme = useTheme();
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
    disabled: isDragDisabled,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `board-${board.id}`,
  });
  const handleMapClick = (e) => {
    e.stopPropagation(); // Prevent any parent click handlers
    setMapModalOpen(true);
  };

  // ADD: Close map modal handler
  const handleCloseMap = () => {
    setMapModalOpen(false);
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
        height: "calc(75vh)",
        minWidth: "350px !important",
        maxWidth: "350px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: isOver
          ? `2px dashed ${theme.palette.primary.main}`
          : "2px solid transparent",
        transform: isOver ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
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
            p: 2,
            minHeight: "80px", // Fixed height for header
            flexShrink: 0, // Prevent shrinking
          }}
        >
          {/* Drag handle */}
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

          {/* Board info */}
          <Box sx={{ flex: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Día {boardIndex + 1}
                </Typography>
                {board.date && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "0.875rem",
                    }}
                  >
                    - {new Date(board.date).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBoard(boardIndex);
                }}
                size="small"
                sx={{ pointerEvents: "auto" }}
              >
                <Trash2 size={18} color="red" />
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center" mt={1} gap={1}>
              <Coins size={18} color={theme.palette.secondary.medium} />
              <Typography variant="body2">{board.dailyBudget || 0}€</Typography>
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
              px: 2,
              py: 1,
              // Custom scrollbar styling
              "&::-webkit-scrollbar": {
                width: "6px",
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
                  width: "25px",
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
                    minHeight: "100px", // Ensure line is always visible
                  }}
                />
              </Box>

              {/* Sortable Activities List */}
              <SortableContext
                items={activityIds}
                strategy={verticalListSortingStrategy}
              >
                <Box sx={{ flex: 1, ml: 2, pb: 2 }}>
                  {" "}
                  {/* Added bottom padding */}
                  {board.favorites?.length > 0 ? (
                    board.favorites.map((fav, favIndex) => (
                      <ActivityCard
                        key={
                          fav.uniqueId || `${boardIndex}-${favIndex}-${fav._id}`
                        }
                        fav={fav}
                        boardIndex={boardIndex}
                        favIndex={favIndex}
                        onRemove={onRemoveFavorite}
                        sortableId={
                          fav.uniqueId || `${boardIndex}-${favIndex}-${fav._id}`
                        }
                      />
                    ))
                  ) : (
                    // Empty state for when no activities
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
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        No hay experiencias programadas
                      </Typography>
                      <Typography variant="caption">
                        Arrastra experiencias desde favoritos
                      </Typography>
                    </Box>
                  )}
                </Box>
              </SortableContext>
            </Box>
          </Box>
        </Box>

        {/* FIXED HEIGHT Bottom Buttons - Always visible */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.white,
            p: 2,
            textAlign: "center",
            boxShadow: `0px -2px 6px ${theme.palette.secondary.main}20`,
            borderTop: `1px solid ${theme.palette.secondary.light}`,
            borderRadius: "0 0 20px 20px",
            flexShrink: 0,
            minHeight: "100px",
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
              backdropFilter: "blur(20px)",
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}40`,
              borderRadius: "0 0 16px 16px",
              flexShrink: 0,
              minHeight: "120px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Add Experience Button */}
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => onAddExperience?.(boardIndex)}
                sx={{
                  borderRadius: 30,
                  textTransform: "none",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                  color: "white",
                  py: 1.5,
                  boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,

                    boxShadow: `0 8px 24px ${theme.palette.primary.main}50`,
                  },
                }}
              >
                Añadir Experiencia
              </Button>

              <Button
                variant="outlined"
                startIcon={<Map size={18} />}
                onClick={handleMapClick} // ADD: Click handler
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
                  py: 1.5,
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
                }}
              >
                Ver en Mapa
              </Button>
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
              px: 3,
              py: 1,
              borderRadius: 30,
              boxShadow: 2,
            }}
          >
            <Typography variant="body1">Soltar aquí</Typography>
          </Box>{" "}
        </Box>
      )}{" "}
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

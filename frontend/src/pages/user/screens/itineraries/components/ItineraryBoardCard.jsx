// Updated BoardCard.jsx - Fixed scrollable activities container
import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Coins, Plus, Map, GripVertical } from "lucide-react";
import ActivityCard from "./ItineraryActivity";

const BoardCard = ({
  board,
  boardIndex,
  onRemoveBoard,
  onRemoveFavorite,
  isDragDisabled = false,
}) => {
  const theme = useTheme();

  // Board dragging functionality
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

  // Drop zone for activities from drawer or other boards
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `board-${board.id}`,
  });

  const boardStyle = {
    transform: CSS.Transform.toString(boardTransform),
    transition: boardTransition,
    opacity: isBoardDragging ? 0.5 : 1,
  };

  // Generate sortable IDs for activities
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
        height: "calc(75vh)", // Fixed height for the entire card
        minWidth: "325px !important",
        maxWidth: "325px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // Drop zone highlighting
        border: isOver
          ? `2px dashed ${theme.palette.primary.main}`
          : "2px solid transparent",
        transform: isOver ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Board Container for dragging */}
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
        {/* FIXED HEIGHT Header - Always visible */}
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

        {/* SCROLLABLE Activities Container - Takes remaining space */}
        <Box
          sx={{
            flex: 1, // Takes all remaining space
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Prevent outer overflow
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto", // Enable vertical scrolling
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
            flexShrink: 0, // Prevent shrinking
            minHeight: "100px", // Fixed height for footer
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                color: theme.palette.primary.main,
                borderRadius: "20px",
                textTransform: "none",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: `1px solid ${theme.palette.primary.main}20`,
                background: `${theme.palette.primary.main}10`,
                cursor: "pointer",
                pointerEvents: "auto",
                width: "100%",
                fontSize: "0.875rem",
              }}
            >
              <Plus size={16} />
              Añadir Experiencia
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                color: theme.palette.secondary.medium,
                borderRadius: "20px",
                textTransform: "none",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: `1px solid ${theme.palette.secondary.medium}20`,
                background: `${theme.palette.secondary.medium}10`,
                cursor: "pointer",
                pointerEvents: "auto",
                width: "100%",
                fontSize: "0.875rem",
              }}
            >
              <Map size={16} />
              Ver Mapa
            </button>
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
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
              }}
            >
              Soltar aquí
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BoardCard;

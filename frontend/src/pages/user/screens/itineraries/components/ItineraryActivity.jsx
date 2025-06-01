// Updated ActivityCard.jsx - Sortable with cross-board dragging
import React from "react";
import { Box, Paper, Typography, IconButton, useTheme } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, BedSingle } from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

const ActivityCard = ({ fav, boardIndex, favIndex, onRemove, sortableId }) => {
  const theme = useTheme();

  // Use sortable for both reordering within board and dragging between boards
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId || `${boardIndex}-${favIndex}-${fav?._id}`,
    data: {
      type: "activity",
      boardIndex,
      favIndex,
      favorite: fav,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const getCategoryIcon = (category) => {
    if (category === "Hoteles")
      return <BedSingle color={theme.palette.primary.main} size={24} />;
    if (category === "Atractivos")
      return (
        <MdOutlineTempleBuddhist color={theme.palette.primary.main} size={24} />
      );
    if (category === "Restaurantes")
      return (
        <MdOutlineRamenDining color={theme.palette.primary.main} size={24} />
      );
    return null;
  };

  const category = fav?.experienceId?.categories || "Other";

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="no-scroll"
      sx={{
        position: "relative",
        mb: 3,
        mt: 2,
        borderRadius: 2,
        boxShadow: 1,
        overflow: "visible",
        backgroundColor: theme.palette.primary.white,
        cursor: isDragging ? "grabbing" : "grab",
        "&:hover": {
          boxShadow: 3,
        },
        // Enhanced visual feedback when dragging
        ...(isDragging && {
          transform: "rotate(2deg)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          border: `2px solid ${theme.palette.primary.main}`,
        }),
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            marginLeft: "-55px",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 1,
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.white,
              border: `1.5px solid ${theme.palette.primary.main}`,
              borderRadius: "50%",
              p: 0.5,
              zIndex: 1,
            }}
          >
            {getCategoryIcon(category)}
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: 1 }}>
          <Box
            sx={{
              width: "100%",
              height: 100,
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <img
              src={
                fav?.experienceId?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + fav.experienceId.photo
                  : images.sampleFavoriteImage
              }
              alt={fav?.experienceId?.title || "Experience"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src = images.sampleFavoriteImage;
              }}
            />
          </Box>

          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {fav?.experienceId?.title || "Actividad sin título"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fav?.experienceId?.prefecture || "Ubicación desconocida"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                mt: 0.5,
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle details
              }}
            >
              Agregar detalles
            </Typography>

            {/* Show price if available */}
            {fav?.experienceId?.price && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: "bold",
                  mt: 0.5,
                  display: "block",
                }}
              >
                €{fav.experienceId.price}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onRemove(boardIndex, favIndex);
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
          pointerEvents: "auto",
          zIndex: 10,
        }}
      >
        <Trash2 size={16} color="red" />
      </IconButton>

      {/* Drag indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          opacity: isDragging ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 20,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box sx={{ flex: 1, backgroundColor: "white", borderRadius: 0.5 }} />
          <Box sx={{ flex: 1, backgroundColor: "white", borderRadius: 0.5 }} />
          <Box sx={{ flex: 1, backgroundColor: "white", borderRadius: 0.5 }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ActivityCard;

import React from "react";
import {
  Box,
  Drawer,
  Typography,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { XCircle, Plus, BedSingle } from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";
import FiltersDrawer from "./FiltersDrawer";

// Draggable Favorite Item Component
const DraggableFavorite = ({ fav, index }) => {
  const theme = useTheme();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `fav-${fav._id}`,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
        overflow: "visible",
        p: 1,
        borderRadius: "8px",
        boxShadow: 1,
        cursor: isDragging ? "grabbing" : "grab",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <img
        src={
          fav.experienceId?.photo
            ? stables.UPLOAD_FOLDER_BASE_URL + fav.experienceId.photo
            : images.sampleFavoriteImage
        }
        alt={fav.experienceId?.title || "Experience"}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.src = images.sampleFavoriteImage;
        }}
      />
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {fav.experienceId?.title || "Untitled Experience"}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {fav.experienceId?.prefecture || "Unknown Location"}
        </Typography>
      </Box>
    </Paper>
  );
};

// Droppable Drawer Container Component
const DroppableDrawer = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: "drawer",
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        overflowY: "auto",
        flex: 1,
        p: 2,
      }}
    >
      {children}
    </Box>
  );
};

const FavoritesDrawer = ({
  isOpen,
  onToggle,
  groupedFavorites = {},
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedPrefecture,
  setSelectedPrefecture,
  onClearFilters,
  drawerWidth = 350,
}) => {
  const theme = useTheme();

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

  // Safely handle groupedFavorites
  const safeGroupedFavorites = groupedFavorites || {};
  const favoriteEntries = Object.entries(safeGroupedFavorites);

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={isOpen}
        PaperProps={{
          sx: {
            width: drawerWidth,
            transform: isOpen
              ? "translateX(0)"
              : `translateX(${drawerWidth - 5}px)`,
            transition: "transform 0.3s ease-in-out",
            top: "6rem",
            backgroundColor: theme.palette.background.paper,
            borderLeft: `2px solid ${theme.palette.secondary.light}`,
            boxShadow: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "sticky",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Favorites
          </Typography>
          <FiltersDrawer
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedPrefecture={selectedPrefecture}
            setSelectedPrefecture={setSelectedPrefecture}
            handleClearFilters={onClearFilters}
          />
        </Box>

        {/* Favorites List - Only render if we have favorites */}
        {favoriteEntries.length > 0 ? (
          <DroppableDrawer>
            {favoriteEntries.map(([category, favs]) => (
              <Box key={category} sx={{ mb: 2 }}>
                {/* Category Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {getCategoryIcon(category)}
                  <Typography
                    variant="subtitle2"
                    sx={{ ml: 1, color: theme.palette.primary.main }}
                  >
                    {category}
                  </Typography>
                </Box>

                {/* List of Favorites */}
                {Array.isArray(favs) &&
                  favs.map((fav, index) => {
                    // Check if fav and experienceId exist
                    if (!fav || !fav.experienceId || !fav._id) {
                      return null;
                    }

                    return (
                      <DraggableFavorite
                        key={fav._id}
                        fav={fav}
                        index={index}
                      />
                    );
                  })}
              </Box>
            ))}
          </DroppableDrawer>
        ) : (
          // Empty state when no favorites
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              No favorites found
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              textAlign="center"
            >
              Add some experiences to your favorites to see them here
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Toggle Button */}
      <div
        style={{
          background: theme.palette.primary.white,
          width: "2rem",
          right: isOpen ? drawerWidth - 40 : 0,
          bottom: "1.75rem",
          borderRadius: "2rem 0 0 2rem",
          height: "3rem",
          position: "fixed",
        }}
      />
      <IconButton
        onClick={onToggle}
        sx={{
          position: "fixed",
          right: isOpen ? drawerWidth - 40 : 5,
          bottom: "2rem",
          zIndex: 1300,
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
          borderLeft: "2px solid rgba(0,0,0,0.1)",
        }}
      >
        {isOpen ? <XCircle size={24} /> : <Plus size={24} />}
      </IconButton>
    </>
  );
};

export default FavoritesDrawer;

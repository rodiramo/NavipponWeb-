import React, { useState, useMemo } from "react";
import {
  Box,
  Drawer,
  Typography,
  Paper,
  IconButton,
  useTheme,
  Chip,
  Avatar,
  Badge,
  Collapse,
  Tooltip,
  Button,
  Fade,
  Zoom,
} from "@mui/material";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  XCircle,
  Plus,
  BedSingle,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Heart,
  Grip,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

// Enhanced Draggable Favorite Item Component
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
        zIndex: isDragging ? 1000 : 1,
      }
    : undefined;

  return (
    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
      <Paper
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          boxShadow: isDragging
            ? "0 20px 40px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          cursor: isDragging ? "grabbing" : "grab",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
            borderColor: theme.palette.primary.main,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
            transform: "translateX(-100%)",
            transition: "transform 0.6s ease",
          },
          "&:hover::before": {
            transform: "translateX(100%)",
          },
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 40,
            color: theme.palette.text.secondary,
            opacity: 0.5,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Grip size={16} />
        </Box>

        {/* Experience Image */}
        <Box
          sx={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = images.sampleFavoriteImage;
            }}
          />
          {/* Favorite Heart Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart
              size={12}
              fill={theme.palette.error.main}
              color={theme.palette.error.main}
            />
          </Box>
        </Box>

        {/* Experience Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fav.experienceId?.title || "Untitled Experience"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MapPin size={12} color={theme.palette.text.secondary} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fav.experienceId?.prefecture || "Unknown Location"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

// Enhanced Droppable Drawer Container Component
const DroppableDrawer = ({ children }) => {
  const theme = useTheme();
  const { setNodeRef, isOver } = useDroppable({
    id: "drawer",
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        overflowY: "auto",
        flex: 1,
        p: 3,
        background: isOver ? `${theme.palette.primary.main}10` : "transparent",
        borderRadius: isOver ? 2 : 0,
        transition: "all 0.3s ease",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.divider,
          borderRadius: 3,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: theme.palette.text.secondary,
        },
      }}
    >
      {children}
    </Box>
  );
};

// Enhanced Filters Component
const EnhancedFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedPrefecture,
  setSelectedPrefecture,
  onClearFilters,
  totalFavorites,
  filteredCount,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
  const regions = {
    Hokkaido: ["Hokkaido"],
    Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
    Kanto: [
      "Tokio",
      "Kanagawa",
      "Chiba",
      "Saitama",
      "Ibaraki",
      "Tochigi",
      "Gunma",
    ],
    Chubu: [
      "Aichi",
      "Shizuoka",
      "Gifu",
      "Nagano",
      "Niigata",
      "Toyama",
      "Ishikawa",
      "Fukui",
    ],
    Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
    Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
    Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
    Kyushu: [
      "Fukuoka",
      "Nagasaki",
      "Kumamoto",
      "Oita",
      "Miyazaki",
      "Kagoshima",
      "Saga",
    ],
  };

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    if (newRegion === "All" || !regions[newRegion]) {
      setSelectedPrefecture("All");
    }
  };

  const availablePrefectures =
    selectedRegion && selectedRegion !== "All"
      ? regions[selectedRegion] || []
      : [];

  const activeFiltersCount = [
    selectedCategory,
    selectedRegion,
    selectedPrefecture,
  ].filter((f) => f && f !== "All").length;

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper}90, ${theme.palette.background.paper}70)`,
        backdropFilter: "blur(20px)",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}40`,
        overflow: "hidden",
      }}
    >
      {/* Filter Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            background: `${theme.palette.primary.main}10`,
          },
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge badgeContent={activeFiltersCount} color="primary">
            <Filter size={20} color={theme.palette.primary.main} />
          </Badge>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Filtros
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filteredCount} de {totalFavorites} favoritos
            </Typography>
          </Box>
        </Box>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Box>

      {/* Filter Content */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2, pt: 0 }}>
          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, mb: 1, display: "block" }}
            >
              Categoría
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="Todos"
                variant={
                  !selectedCategory || selectedCategory === "All"
                    ? "filled"
                    : "outlined"
                }
                onClick={() => setSelectedCategory("All")}
                size="small"
                sx={{
                  background:
                    !selectedCategory || selectedCategory === "All"
                      ? `linear-gradient(135deg, ${theme.palette.primary.main})`
                      : "transparent",
                  color:
                    !selectedCategory || selectedCategory === "All"
                      ? "white"
                      : theme.palette.text.primary,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  "&:hover": {
                    background:
                      !selectedCategory || selectedCategory === "All"
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark})`
                        : `${theme.palette.primary.main}10`,
                  },
                }}
              />
              {categoriesEnum.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant={
                    selectedCategory === category ? "filled" : "outlined"
                  }
                  onClick={() => setSelectedCategory(category)}
                  size="small"
                  sx={{
                    background:
                      selectedCategory === category
                        ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                        : "transparent",
                    color:
                      selectedCategory === category
                        ? "white"
                        : theme.palette.text.primary,
                    border: `1px solid ${theme.palette.primary.main}30`,
                    "&:hover": {
                      background:
                        selectedCategory === category
                          ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                          : `${theme.palette.primary.main}10`,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Region Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, mb: 1, display: "block" }}
            >
              Región
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="Todas"
                variant={
                  !selectedRegion || selectedRegion === "All"
                    ? "filled"
                    : "outlined"
                }
                onClick={() => handleRegionChange("All")}
                size="small"
                sx={{
                  background:
                    !selectedRegion || selectedRegion === "All"
                      ? `linear-gradient(135deg, ${theme.palette.secondary.medium})`
                      : "transparent",
                  color:
                    !selectedRegion || selectedRegion === "All"
                      ? "white"
                      : theme.palette.text.primary,
                  border: `1px solid ${theme.palette.secondary.main}30`,
                  "&:hover": {
                    background:
                      !selectedRegion || selectedRegion === "All"
                        ? `linear-gradient(135deg, ${theme.palette.secondary.dark})`
                        : `${theme.palette.secondary.main}10`,
                  },
                }}
              />
              {Object.keys(regions)
                .slice(0, 4)
                .map((region) => (
                  <Chip
                    key={region}
                    label={region}
                    variant={selectedRegion === region ? "filled" : "outlined"}
                    onClick={() => handleRegionChange(region)}
                    size="small"
                    sx={{
                      background:
                        selectedRegion === region
                          ? `linear-gradient(135deg, ${theme.palette.secondary.medium})`
                          : "transparent",
                      color:
                        selectedRegion === region
                          ? "white"
                          : theme.palette.text.primary,
                      border: `1px solid ${theme.palette.secondary.main}30`,
                      "&:hover": {
                        background:
                          selectedRegion === region
                            ? `linear-gradient(135deg, ${theme.palette.secondary.dark})`
                            : `${theme.palette.secondary.main}10`,
                      },
                    }}
                  />
                ))}
            </Box>
          </Box>

          {/* Prefecture Filter */}
          {availablePrefectures.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, mb: 1, display: "block" }}
              >
                Prefectura
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label="Todas"
                  variant={
                    !selectedPrefecture || selectedPrefecture === "All"
                      ? "filled"
                      : "outlined"
                  }
                  onClick={() => setSelectedPrefecture("All")}
                  size="small"
                  sx={{
                    background:
                      !selectedPrefecture || selectedPrefecture === "All"
                        ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                        : "transparent",
                    color:
                      !selectedPrefecture || selectedPrefecture === "All"
                        ? "white"
                        : theme.palette.text.primary,
                    border: `1px solid ${theme.palette.warning.main}30`,
                  }}
                />
                {availablePrefectures.slice(0, 3).map((prefecture) => (
                  <Chip
                    key={prefecture}
                    label={prefecture}
                    variant={
                      selectedPrefecture === prefecture ? "filled" : "outlined"
                    }
                    onClick={() => setSelectedPrefecture(prefecture)}
                    size="small"
                    sx={{
                      background:
                        selectedPrefecture === prefecture
                          ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                          : "transparent",
                      color:
                        selectedPrefecture === prefecture
                          ? "white"
                          : theme.palette.text.primary,
                      border: `1px solid ${theme.palette.warning.main}30`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              onClick={onClearFilters}
              variant="outlined"
              size="small"
              startIcon={<XCircle size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                "&:hover": {
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                },
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </Box>
      </Collapse>
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
  drawerWidth = 400,
}) => {
  const theme = useTheme();

  const getCategoryIcon = (category) => {
    const iconProps = { size: 24 };
    if (category === "Hoteles")
      return <BedSingle color={theme.palette.primary.main} {...iconProps} />;
    if (category === "Atractivos")
      return (
        <MdOutlineTempleBuddhist
          color={theme.palette.primary.main}
          {...iconProps}
        />
      );
    if (category === "Restaurantes")
      return (
        <MdOutlineRamenDining
          color={theme.palette.primary.main}
          {...iconProps}
        />
      );
    return <Sparkles color={theme.palette.primary.main} {...iconProps} />;
  };

  // Enhanced filtering logic
  const filteredFavorites = useMemo(() => {
    const safeGroupedFavorites = groupedFavorites || {};
    let filtered = { ...safeGroupedFavorites };

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = { [selectedCategory]: filtered[selectedCategory] || [] };
    }

    // Filter by region and prefecture
    Object.keys(filtered).forEach((category) => {
      if (filtered[category]) {
        filtered[category] = filtered[category].filter((fav) => {
          if (!fav || !fav.experienceId) return false;

          const prefecture = fav.experienceId.prefecture;

          // Filter by region
          if (selectedRegion && selectedRegion !== "All") {
            const regions = {
              Hokkaido: ["Hokkaido"],
              Tohoku: [
                "Aomori",
                "Iwate",
                "Miyagi",
                "Akita",
                "Yamagata",
                "Fukushima",
              ],
              Kanto: [
                "Tokio",
                "Kanagawa",
                "Chiba",
                "Saitama",
                "Ibaraki",
                "Tochigi",
                "Gunma",
              ],
              Chubu: [
                "Aichi",
                "Shizuoka",
                "Gifu",
                "Nagano",
                "Niigata",
                "Toyama",
                "Ishikawa",
                "Fukui",
              ],
              Kansai: [
                "Osaka",
                "Kyoto",
                "Hyogo",
                "Nara",
                "Wakayama",
                "Shiga",
                "Mie",
              ],
              Chugoku: [
                "Hiroshima",
                "Okayama",
                "Shimane",
                "Tottori",
                "Yamaguchi",
              ],
              Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
              Kyushu: [
                "Fukuoka",
                "Nagasaki",
                "Kumamoto",
                "Oita",
                "Miyazaki",
                "Kagoshima",
                "Saga",
              ],
            };

            const regionPrefectures = regions[selectedRegion] || [];
            if (!regionPrefectures.includes(prefecture)) return false;
          }

          // Filter by prefecture
          if (selectedPrefecture && selectedPrefecture !== "All") {
            if (prefecture !== selectedPrefecture) return false;
          }

          return true;
        });
      }
    });

    // Remove empty categories
    Object.keys(filtered).forEach((category) => {
      if (!filtered[category] || filtered[category].length === 0) {
        delete filtered[category];
      }
    });

    return filtered;
  }, [groupedFavorites, selectedCategory, selectedRegion, selectedPrefecture]);

  // Calculate totals
  const totalFavorites = Object.values(groupedFavorites).flat().length;
  const filteredCount = Object.values(filteredFavorites).flat().length;
  const favoriteEntries = Object.entries(filteredFavorites);

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={isOpen}
        PaperProps={{
          sx: {
            width: drawerWidth,
            border: "none",
            transform: isOpen
              ? "translateX(0)"
              : `translateX(${drawerWidth - 5}px)`,
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            top: "0rem",
            background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
            backdropFilter: "blur(20px)",
          },
        }}
      >
        {/* Enhanced Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
            color: "white",
            p: 3,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              color: theme.palette.primary.white,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <Heart size={24} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Mis Favoritos
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Organiza tus lugares especiales
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Filters */}
        <Box sx={{ p: 3, pb: 2 }}>
          <EnhancedFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedPrefecture={selectedPrefecture}
            setSelectedPrefecture={setSelectedPrefecture}
            onClearFilters={onClearFilters}
            totalFavorites={totalFavorites}
            filteredCount={filteredCount}
          />
        </Box>

        {/* Enhanced Favorites List */}
        {favoriteEntries.length > 0 ? (
          <DroppableDrawer>
            {favoriteEntries.map(([category, favs]) => (
              <Box key={category} sx={{ mb: 4 }}>
                {/* Enhanced Category Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15)`,
                    border: `1px solid ${theme.palette.primary.main}30`,
                  }}
                >
                  {getCategoryIcon(category)}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      flex: 1,
                    }}
                  >
                    {category}
                  </Typography>
                  <Chip
                    label={favs.length}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* List of Favorites */}
                {Array.isArray(favs) &&
                  favs.map((fav, index) => {
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
          // Enhanced Empty State
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              p: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.8, transform: "scale(1.05)" },
                },
              }}
            >
              <Heart size={48} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {totalFavorites === 0
                ? "No tienes favoritos aún"
                : "No se encontraron favoritos"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 280, lineHeight: 1.5 }}
            >
              {totalFavorites === 0
                ? "Empieza a guardar tus lugares favoritos para verlos aquí organizados por categoría"
                : "Intenta ajustar los filtros para encontrar lo que buscas"}
            </Typography>
            {filteredCount === 0 && totalFavorites > 0 && (
              <Button
                onClick={onClearFilters}
                variant="outlined"
                sx={{ mt: 2, borderRadius: 3 }}
              >
                Limpiar filtros
              </Button>
            )}
          </Box>
        )}
      </Drawer>

      <Box
        sx={{
          position: "fixed",
          right: isOpen ? drawerWidth - 30 : 20,
          bottom: "2rem",
          zIndex: 1300,
          transition: "right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Tooltip title={isOpen ? "Cerrar favoritos" : "Ver favoritos"} arrow>
          <IconButton
            onClick={onToggle}
            sx={{
              width: 60,
              height: 60,
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              color: "white",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {isOpen ? <XCircle size={28} /> : <Heart size={28} />}
          </IconButton>
        </Tooltip>

        {/* Badge for favorites count */}
        {totalFavorites > 0 && !isOpen && (
          <Badge
            badgeContent={totalFavorites}
            color="error"
            sx={{
              position: "absolute",
              top: -5,
              right: 2,
              "& .MuiBadge-badge": {
                background: `linear-gradient(135deg, ${theme.palette.error.main})`,
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                minWidth: 24,
                height: 24,
                borderRadius: "50%",
                border: "2px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              },
            }}
          />
        )}
      </Box>
    </>
  );
};

export default FavoritesDrawer;

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  InputAdornment,
  CircularProgress,
  useTheme,
  Avatar,
  IconButton,
  Fade,
  Zoom,
  Pagination,
} from "@mui/material";
import {
  Search,
  MapPin,
  Euro,
  Star,
  Filter,
  X,
  Plus,
  BedSingle,
  Sparkles,
  Heart,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

// Experience Card Component
const ExperienceCard = ({ experience, onSelect, isSelected, theme }) => {
  const getCategoryIcon = (category) => {
    if (category === "Hoteles") return <BedSingle size={16} />;
    if (category === "Atractivos") return <MdOutlineTempleBuddhist size={16} />;
    if (category === "Restaurantes") return <MdOutlineRamenDining size={16} />;
    return <Sparkles size={16} />;
  };

  const getCategoryColor = (category) => {
    if (category === "Hoteles") return theme.palette.primary.main;
    if (category === "Atractivos") return theme.palette.primary.main;
    if (category === "Restaurantes") return theme.palette.primary.main;
    return theme.palette.primary.main;
  };

  return (
    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
      <Card
        onClick={() => onSelect(experience)}
        sx={{
          height: "100%",
          cursor: "pointer",
          borderRadius: 5,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(10px)",
          border: isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}40`,

          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: `0 12px 40px ${getCategoryColor(
              experience.categories || "Other"
            )}20`,
            borderColor: getCategoryColor(experience.categories || "Other"),
          },
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: "relative", height: 200 }}>
          <CardMedia
            component="img"
            image={(() => {
              const photo = experience?.photo;

              // If has photo, handle URL type
              if (photo) {
                return photo.startsWith("http")
                  ? photo
                  : `${stables.UPLOAD_FOLDER_BASE_URL}${photo}`;
              }

              // Category-based fallback
              switch (experience?.categories) {
                case "Hoteles":
                  return images.sampleHotelImage;
                case "Restaurantes":
                  return images.sampleRestaurantImage;
                case "Atractivos":
                  return images.sampleAttractionImage;
                default:
                  return images.sampleFavoriteImage;
              }
            })()}
            alt={experience.title}
            sx={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onError={(e) => {
              // Final fallback to category-specific or default sample
              const categoryImages = {
                Hoteles: images.sampleHotelImage,
                Restaurantes: images.sampleRestaurantImage,
                Atractivos: images.sampleAttractionImage,
              };
              e.target.src =
                categoryImages[experience?.categories] ||
                images.sampleFavoriteImage;
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              borderRadius: 30,
              px: 2,
              py: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {getCategoryIcon(experience.categories)}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {experience.categories}
            </Typography>
          </Box>

          {/* Rating Badge */}
          {experience.rating && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                background: "rgba(0,0,0,0.8)",
                borderRadius: 30,
                px: 1.5,
                py: 0.5,
                backdropFilter: "blur(10px)",
              }}
            >
              <Star
                size={14}
                fill={theme.palette.secondary.main}
                color={theme.palette.secondary.main}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {experience.rating}
              </Typography>
            </Box>
          )}

          {/* Price Badge */}
          {experience.price && (
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                borderRadius: 30,
                px: 2,
                py: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <Euro size={14} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.8rem",
                }}
              >
                {experience.price}
              </Typography>
            </Box>
          )}

          {/* Selection Indicator */}
          {/* Hover Overlay - "Agregar al itinerario" */}
          {!isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                opacity: 0,
                transition: "opacity 0.3s ease",
                backdropFilter: "blur(5px)",
                ".MuiCard-root:hover &": {
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                }}
              >
                <Plus size={20} color="white" />
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Agregar al itinerario
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.palette.text.primary,
            }}
          >
            {experience.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <MapPin size={14} color={theme.palette.text.secondary} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {experience.prefecture}
            </Typography>
          </Box>

          {experience.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.4,
                height: "2.8em",
              }}
            >
              {experience.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

// Main Modal Component
const AddExperienceModal = ({
  open,
  onClose,
  onAddExperience,
  allExperiences = [],
  loading = false,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 12;

  // Filter experiences based on search and category
  const filteredExperiences = useMemo(() => {
    let filtered = allExperiences;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.title?.toLowerCase().includes(query) ||
          exp.prefecture?.toLowerCase().includes(query) ||
          exp.description?.toLowerCase().includes(query) ||
          exp.categories?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((exp) => exp.categories === selectedCategory);
    }

    return filtered;
  }, [allExperiences, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);
  const startIndex = (currentPage - 1) * experiencesPerPage;
  const paginatedExperiences = filteredExperiences.slice(
    startIndex,
    startIndex + experiencesPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleSelectExperience = (experience) => {
    setSelectedExperiences((prev) => {
      const isSelected = prev.find((exp) => exp._id === experience._id);
      if (isSelected) {
        return prev.filter((exp) => exp._id !== experience._id);
      } else {
        return [...prev, experience];
      }
    });
  };

  const handleAddSelected = () => {
    selectedExperiences.forEach((experience) => {
      onAddExperience(experience);
    });
    setSelectedExperiences([]);
    onClose();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  const categories = ["All", "Hoteles", "Atractivos", "Restaurantes"];
  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "All" ? selectedCategory : null,
  ].filter(Boolean).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
          color: theme.palette.primary.white,
          p: 3,
          position: "relative",
          overflow: "hidden",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <Plus size={24} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                Añadir Experiencia
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Busca y selecciona experiencias para tu itinerario
              </Typography>
            </Box>
          </Box>

          {selectedExperiences.length > 0 && (
            <Chip
              label={`${selectedExperiences.length} seleccionadas`}
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </DialogTitle>

      {/* Search and Filters */}
      <Box sx={{ p: 3, pb: 0 }}>
        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Buscar experiencias por nombre, ubicación o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")} size="small">
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 30,
              background: `${theme.palette.background.paper}95`,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.background.paper,
              },
              "&.Mui-focused": {
                background: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
              },
            },
          }}
        />

        {/* Category Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Filter size={20} color={theme.palette.primary.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Categorías:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category === "All" ? "Todas" : category}
                variant={selectedCategory === category ? "filled" : "outlined"}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 30,
                  background:
                    selectedCategory === category
                      ? `linear-gradient(135deg, ${theme.palette.primary.main})`
                      : "transparent",
                  color:
                    selectedCategory === category
                      ? "white"
                      : theme.palette.text.primary,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      selectedCategory === category
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark})`
                        : `${theme.palette.primary.main}10`,
                  },
                }}
              />
            ))}
          </Box>
          {activeFiltersCount > 0 && (
            <Button
              onClick={handleClearFilters}
              variant="outlined"
              size="small"
              startIcon={<X size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Limpiar
            </Button>
          )}
        </Box>

        {/* Results Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Cargando..."
              : `${filteredExperiences.length} experiencias encontradas`}
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              size="small"
              color="primary"
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 1 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : paginatedExperiences.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
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
              }}
            >
              <Search size={48} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              No se encontraron experiencias
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 300 }}
            >
              {searchQuery || selectedCategory !== "All"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay experiencias disponibles en este momento"}
            </Typography>
            {activeFiltersCount > 0 && (
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                sx={{ mt: 2, borderRadius: 3 }}
              >
                Limpiar filtros
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {paginatedExperiences.map((experience) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={experience._id}>
                <ExperienceCard
                  experience={experience}
                  onSelect={handleSelectExperience}
                  isSelected={selectedExperiences.some(
                    (exp) => exp._id === experience._id
                  )}
                  theme={theme}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 30,
            textTransform: "none",
            px: 4,
            fontWeight: 600,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddSelected}
          variant="contained"
          disabled={selectedExperiences.length === 0}
          startIcon={<Plus size={16} />}
          sx={{
            borderRadius: 30,
            px: 4,
            fontWeight: 700,
            textTransform: "none",
            background:
              selectedExperiences.length > 0
                ? `linear-gradient(135deg, ${theme.palette.primary.main})`
                : undefined,

            "&:disabled": {
              background: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Añadir{" "}
          {selectedExperiences.length > 0 && `(${selectedExperiences.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExperienceModal;

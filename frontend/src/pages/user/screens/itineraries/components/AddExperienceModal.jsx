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
  IconButton,
  Fade,
  Zoom,
  Pagination,
  useMediaQuery,
  Slide,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import {
  Search,
  MapPin,
  Star,
  Filter,
  X,
  Plus,
  BedSingle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExperienceCard = ({
  experience,
  onSelect,
  isSelected,
  theme,
  isMobile,
}) => {
  const getCategoryIcon = (category) => {
    if (category === "Hoteles") return <BedSingle size={isMobile ? 14 : 16} />;
    if (category === "Atractivos")
      return <MdOutlineTempleBuddhist size={isMobile ? 14 : 16} />;
    if (category === "Restaurantes")
      return <MdOutlineRamenDining size={isMobile ? 14 : 16} />;
    return <Sparkles size={isMobile ? 14 : 16} />;
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
          borderRadius: { xs: 3, sm: 4, md: 5 },
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(10px)",
          border: isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}40`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: `0 ${isMobile ? "8px 24px" : "12px 40px"} ${getCategoryColor(
              experience.categories || "Other"
            )}20`,
            borderColor: getCategoryColor(experience.categories || "Other"),
            transform: isMobile ? "translateY(-2px)" : "translateY(-4px)",
          },
        }}
      >
        {/* Image Section */}
        <Box
          sx={{ position: "relative", height: { xs: 160, sm: 180, md: 200 } }}
        >
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
              height: "100%",
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
              top: { xs: 8, sm: 10, md: 12 },
              left: { xs: 8, sm: 10, md: 12 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 0.75, md: 1 },
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              borderRadius: { xs: 20, sm: 25, md: 30 },
              px: { xs: 1, sm: 1.5, md: 2 },
              py: { xs: 0.5, sm: 0.75, md: 1 },
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {getCategoryIcon(experience.categories)}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: { xs: "none", sm: "block" },
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
                top: { xs: 8, sm: 10, md: 12 },
                right: { xs: 8, sm: 10, md: 12 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.25, sm: 0.5 },
                background: "rgba(0,0,0,0.8)",
                borderRadius: { xs: 20, sm: 25, md: 30 },
                px: { xs: 1, sm: 1.25, md: 1.5 },
                py: { xs: 0.25, sm: 0.5 },
                backdropFilter: "blur(10px)",
              }}
            >
              <Star
                size={isMobile ? 12 : 14}
                fill={theme.palette.secondary.main}
                color={theme.palette.secondary.main}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
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
                bottom: { xs: 8, sm: 10, md: 12 },
                right: { xs: 8, sm: 10, md: 12 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 0.75, md: 1 },
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                borderRadius: { xs: 20, sm: 25, md: 30 },
                px: { xs: 1, sm: 1.5, md: 2 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              ¥
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                }}
              >
                {experience.price}
              </Typography>
            </Box>
          )}

          {/* Hover Overlay - "Agregar al itinerario" */}
          {!isSelected && !isMobile && (
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
                  width: { sm: 40, md: 50 },
                  height: { sm: 40, md: 50 },
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                }}
              >
                <Plus size={isMobile ? 16 : 20} color="white" />
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  fontSize: { sm: "0.75rem", md: "0.875rem" },
                  px: 1,
                }}
              >
                Agregar al itinerario
              </Typography>
            </Box>
          )}

          {/* Selection Indicator for mobile */}
          {isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(5px)",
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                  border: "3px solid white",
                }}
              >
                <Plus
                  size={isMobile ? 16 : 20}
                  color="white"
                  style={{ transform: "rotate(45deg)" }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: { xs: 0.5, sm: 1 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: theme.palette.text.primary,
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            }}
          >
            {experience.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: { xs: 1, sm: 2 },
            }}
          >
            <MapPin
              size={isMobile ? 12 : 14}
              color={theme.palette.text.secondary}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                WebkitLineClamp: { xs: 1, sm: 2 },
                WebkitBoxOrient: "vertical",
                lineHeight: 1.4,
                height: { xs: "1.4em", sm: "2.8em" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = isMobile ? 6 : isTablet ? 9 : 12;

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

  // Mobile fullscreen dialog
  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            background: theme.palette.background.default,
          },
        }}
      >
        {/* Mobile Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
            borderBottom: `1px solid ${theme.palette.divider}40`,
          }}
        >
          <Toolbar sx={{ px: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              sx={{ mr: 2 }}
            >
              <ArrowLeft />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Añadir Experiencia
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {filteredExperiences.length} experiencias
              </Typography>
            </Box>
            {selectedExperiences.length > 0 && (
              <Chip
                label={selectedExperiences.length}
                size="small"
                sx={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Content */}
        <Container
          maxWidth="lg"
          sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
        >
          {/* Search and Filters */}
          <Box sx={{ p: 2, pb: 1, background: theme.palette.background.paper }}>
            {/* Search Field */}
            <TextField
              fullWidth
              placeholder="Buscar experiencias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery("")} size="small">
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                },
              }}
            />

            {/* Category Filters - Horizontal scroll on mobile */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Filter size={16} color={theme.palette.primary.main} />
                Categorías
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  pb: 1,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category === "All" ? "Todas" : category}
                    variant={
                      selectedCategory === category ? "filled" : "outlined"
                    }
                    onClick={() => setSelectedCategory(category)}
                    size="small"
                    sx={{
                      borderRadius: 20,
                      minWidth: "fit-content",
                      whiteSpace: "nowrap",
                      background:
                        selectedCategory === category
                          ? theme.palette.primary.main
                          : "transparent",
                      color:
                        selectedCategory === category
                          ? "white"
                          : theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Clear filters and pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {activeFiltersCount > 0 && (
                <Button
                  onClick={handleClearFilters}
                  variant="text"
                  size="small"
                  startIcon={<X size={14} />}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Limpiar
                </Button>
              )}
              <Box sx={{ flex: 1 }} />
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  size="small"
                  color="primary"
                  siblingCount={0}
                  boundaryCount={1}
                />
              )}
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2, pt: 1 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 8,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : paginatedExperiences.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `${theme.palette.primary.main}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Search size={32} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  No se encontraron experiencias
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 250, mb: 2 }}
                >
                  {searchQuery || selectedCategory !== "All"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay experiencias disponibles"}
                </Typography>
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 20 }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {paginatedExperiences.map((experience) => (
                  <Grid item xs={6} key={experience._id}>
                    <ExperienceCard
                      experience={experience}
                      onSelect={handleSelectExperience}
                      isSelected={selectedExperiences.some(
                        (exp) => exp._id === experience._id
                      )}
                      theme={theme}
                      isMobile={isMobile}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Mobile Actions - Fixed bottom */}
          {selectedExperiences.length > 0 && (
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                background: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
                p: 2,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Button
                onClick={handleAddSelected}
                variant="contained"
                fullWidth
                startIcon={<Plus size={18} />}
                sx={{
                  borderRadius: 25,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                }}
              >
                Añadir {selectedExperiences.length} experiencia
                {selectedExperiences.length > 1 ? "s" : ""}
              </Button>
            </Box>
          )}
        </Container>
      </Dialog>
    );
  }

  // Desktop/Tablet version
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3, md: 4 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
          m: { xs: 0, sm: 2 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
          color: theme.palette.primary.white,
          p: { xs: 2, sm: 3 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Plus size={isTablet ? 20 : 24} />
            </Box>
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant={isTablet ? "h5" : "h4"}
                sx={{ fontWeight: 800, mb: 0.5 }}
              >
                Añadir Experiencia
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
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
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Buscar experiencias por nombre, ubicación o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size={isTablet ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  size={isTablet ? 18 : 20}
                  color={theme.palette.text.secondary}
                />
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
            mb: { xs: 2, sm: 3 },
            "& .MuiOutlinedInput-root": {
              borderRadius: { xs: 25, sm: 30 },
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: { xs: 2, sm: 3 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: "fit-content",
            }}
          >
            <Filter
              size={isTablet ? 18 : 20}
              color={theme.palette.primary.main}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Categorías:
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flex: 1,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category === "All" ? "Todas" : category}
                variant={selectedCategory === category ? "filled" : "outlined"}
                onClick={() => setSelectedCategory(category)}
                size={isTablet ? "small" : "medium"}
                sx={{
                  borderRadius: { xs: 20, sm: 30 },
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
              startIcon={<X size={14} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                minWidth: "fit-content",
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
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
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
              siblingCount={isTablet ? 0 : 1}
              boundaryCount={1}
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
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
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Search
                size={isTablet ? 40 : 48}
                color={theme.palette.primary.main}
              />
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
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {paginatedExperiences.map((experience) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={experience._id}>
                <ExperienceCard
                  experience={experience}
                  onSelect={handleSelectExperience}
                  isSelected={selectedExperiences.some(
                    (exp) => exp._id === experience._id
                  )}
                  theme={theme}
                  isMobile={isMobile}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 2,
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            borderRadius: { xs: 25, sm: 30 },
            textTransform: "none",
            px: 4,
            fontWeight: 600,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            order: { xs: 2, sm: 1 },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddSelected}
          variant="contained"
          disabled={selectedExperiences.length === 0}
          startIcon={<Plus size={16} />}
          fullWidth={isMobile}
          sx={{
            borderRadius: { xs: 25, sm: 30 },
            px: 4,
            fontWeight: 700,
            textTransform: "none",
            background:
              selectedExperiences.length > 0
                ? `linear-gradient(135deg, ${theme.palette.primary.main})`
                : undefined,
            order: { xs: 1, sm: 2 },
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

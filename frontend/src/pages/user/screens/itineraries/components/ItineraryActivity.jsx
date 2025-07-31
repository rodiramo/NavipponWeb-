// Enhanced ActivityCard with improved style and functional experience details
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Rating,
  Divider,
  Fade,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  BedSingle,
  Info,
  MapPin,
  Clock,
  Map,
  Phone,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Globe,
  Star,
  Navigation,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";
const ExperienceDetailsModal = ({ open, onClose, experience, category }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!experience) return null;

  const getCategoryIcon = (cat) => {
    const iconSize = isMobile ? 14 : 16;
    if (cat === "Hoteles")
      return (
        <BedSingle size={iconSize} color={theme.palette.secondary.light} />
      );
    if (cat === "Atractivos")
      return (
        <MdOutlineTempleBuddhist
          size={iconSize}
          color={theme.palette.secondary.light}
        />
      );
    if (cat === "Restaurantes")
      return (
        <MdOutlineRamenDining
          size={iconSize}
          color={theme.palette.secondary.light}
        />
      );
    return <Sparkles size={iconSize} />;
  };

  const getCategoryColor = (cat) => {
    if (cat === "Hoteles") return theme.palette.secondary.dark;
    if (cat === "Atractivos") return theme.palette.secondary.dark;
    if (cat === "Restaurantes") return theme.palette.secondary.dark;
    return theme.palette.primary.main;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // 🔧 IMPROVED: Larger modal for better content display
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: theme.palette.background.default,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          overflow: "hidden",
          m: isMobile ? 0 : 1,
          maxHeight: isMobile ? "100vh" : "90vh", // 🔧 IMPROVED: Better height management
        },
      }}
    >
      {/* 🎨 ENHANCED: Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, sm: 250, md: 300 },
          background: `linear-gradient(135deg, ${getCategoryColor(category)}20)`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${(() => {
              const photo = experience?.photo;
              if (photo) {
                return photo.startsWith("http")
                  ? photo
                  : `${stables.UPLOAD_FOLDER_BASE_URL}${photo}`;
              }
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
            })()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${getCategoryColor(category)}60, ${getCategoryColor(category)}40)`,
              backdropFilter: "blur(2px)",
            },
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            fontSize: "1rem",
            right: 16,
            p: "0.5rem 0.80rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            zIndex: 2,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          ✕
        </IconButton>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 2, sm: 3, md: 4 },
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip
              icon={getCategoryIcon(category)}
              label={category}
              size="small"
              sx={{
                background: theme.palette.secondary.medium,
                color: theme.palette.primary.white,
                fontWeight: 600,
                backdropFilter: "blur(10px)",
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                height: { xs: 24, sm: 28 },
              }}
            />
          </Box>

          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" },
              lineHeight: 1.2,
            }}
          >
            {experience.title || "Experiencia sin título"}
          </Typography>

          {experience.rating && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <Rating
                value={experience.rating}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#FFD700",
                  },
                  "& .MuiRating-icon": {
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                {experience.rating} / 5
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MapPin size={isMobile ? 14 : 16} color="white" />
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                {experience.prefecture || "Ubicación desconocida"}
              </Typography>
            </Box>

            {experience.price !== null && experience.price !== undefined ? (
              <Box
                sx={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  px: 2,
                  py: 0.5,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color:
                      experience.price === 0
                        ? theme.palette.success.main
                        : theme.palette.primary.main,
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  }}
                >
                  {experience.price === 0
                    ? "Gratis"
                    : `¥${experience.price.toLocaleString()}`}
                </Typography>
              </Box>
            ) : (
              <Chip
                label="Precio a consultar"
                size="small"
                sx={{
                  background: "rgba(255, 193, 7, 0.9)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* 🔧 FIXED: Proper DialogContent with real experience details */}
      <DialogContent
        sx={{ p: { xs: 2, sm: 3, md: 4 }, maxHeight: "50vh", overflow: "auto" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Description */}
          {experience.description && (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: theme.palette.primary.main }}
              >
                📋 Descripción
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {experience.description}
              </Typography>
            </Box>
          )}

          {/* 🆕 NEW: Details List */}
          <Box>
            <List dense>
              {experience.caption && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText>
                    <Typography variant="body2">
                      {experience.caption}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {/* Location Details */}
              {experience.region && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Navigation
                      size={18}
                      color={theme.palette.secondary.main}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Región:</strong> {experience.region}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {experience.prefecture && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <MapPin size={18} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Prefectura:</strong> {experience.prefecture}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {/* Address */}
              {experience.address && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Map size={18} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Dirección:</strong> {experience.address}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {/* Phone */}
              {experience.phone && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone size={18} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Teléfono:</strong> {experience.phone}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {/* Website */}
              {experience.website && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Globe size={18} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Sitio web:</strong>{" "}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          window.open(experience.website, "_blank")
                        }
                        sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                      >
                        {experience.website}
                      </Button>
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}

              {/* Opening Hours */}
              {experience.openingHours && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Clock size={18} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">
                      <strong>Horarios:</strong> {experience.openingHours}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Box>

          {/* 🆕 NEW: Additional Information */}
          {(experience.tags ||
            experience.duration ||
            experience.difficulty) && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  🏷️ Información Adicional
                </Typography>

                {experience.duration && (
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      icon={<Clock size={14} />}
                      label={`Duración: ${experience.duration}`}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                )}

                {experience.difficulty && (
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      icon={<Star size={14} />}
                      label={`Dificultad: ${experience.difficulty}`}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                )}

                {experience.tags &&
                  Array.isArray(experience.tags) &&
                  experience.tags.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Etiquetas:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {experience.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.75rem",
                              backgroundColor:
                                theme.palette.primary.main + "10",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      {/* 🔧 ENHANCED: Better action buttons */}
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1, gap: 1 }}>
        {experience.website && (
          <Button
            variant="outlined"
            startIcon={<ExternalLink size={16} />}
            onClick={() => window.open(experience.website, "_blank")}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            Visitar sitio web
          </Button>
        )}

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 20,
            textTransform: "none",
            px: 4,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 🔧 IMPROVED: Enhanced ActivityCard with better styling
const ActivityCard = ({
  fav,
  boardIndex,
  favIndex,
  onRemove,
  sortableId,
  userRole,
  onMoveActivity,
  totalActivities = 1,
  compact = false,
  dense = false,
}) => {
  const theme = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isDragHovered, setIsDragHovered] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Enhanced sortable configuration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    setActivatorNodeRef,
  } = useSortable({
    id: sortableId || `${boardIndex}-${favIndex}-${fav?._id}`,
    data: {
      type: "activity",
      boardIndex,
      favIndex,
      favorite: fav,
      sortable: {
        containerId: `board-${boardIndex}`,
        index: favIndex,
        items: [sortableId || `${boardIndex}-${favIndex}-${fav?._id}`],
      },
    },
    disabled: userRole === "viewer",
  });

  // 🔧 IMPROVED: Better drag styling
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : isOver ? 500 : 1,
    scale: isDragging ? 1.03 : 1,
  };

  const getCategoryIcon = (category) => {
    const iconSize = compact ? (isMobile ? 16 : 18) : isMobile ? 18 : 22;

    if (category === "Hoteles")
      return <BedSingle color={theme.palette.primary.main} size={iconSize} />;
    if (category === "Atractivos")
      return (
        <MdOutlineTempleBuddhist
          color={theme.palette.primary.main}
          size={iconSize}
        />
      );
    if (category === "Restaurantes")
      return (
        <MdOutlineRamenDining
          color={theme.palette.primary.main}
          size={iconSize}
        />
      );
    return <Sparkles color={theme.palette.primary.main} size={iconSize} />;
  };

  const category = fav?.experienceId?.categories || "Other";

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    console.log("🔍 Opening details for experience:", fav?.experienceId); // Debug log
    setDetailsOpen(true);
  };

  const handleMoveUp = (e) => {
    e.stopPropagation();
    if (onMoveActivity && favIndex > 0) {
      onMoveActivity(boardIndex, favIndex, favIndex - 1);
    }
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    if (onMoveActivity && favIndex < totalActivities - 1) {
      onMoveActivity(boardIndex, favIndex, favIndex + 1);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(boardIndex, favIndex);
  };

  return (
    <>
      <Paper
        ref={setNodeRef}
        style={style}
        sx={{
          position: "relative",
          mb: compact ? { xs: 1, sm: 1.5 } : { xs: 2, sm: 3 },
          mt: compact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
          borderRadius: { xs: 2, sm: 3 }, // 🔧 IMPROVED: Better border radius
          boxShadow: isDragging
            ? "0 12px 36px rgba(0,0,0,0.25)"
            : isOver
              ? "0 6px 20px rgba(0,0,0,0.15)"
              : {
                  xs: "0 2px 8px rgba(0,0,0,0.08)", // 🔧 IMPROVED: Better shadows
                  sm: "0 4px 16px rgba(0,0,0,0.08)",
                },
          overflow: "visible",
          background: isDragging
            ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.background.default}95)`
            : theme.palette.background.paper, // 🔧 IMPROVED: Cleaner background
          backdropFilter: "blur(10px)",
          border: isDragging
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
          cursor: isDragging
            ? "grabbing"
            : userRole === "viewer"
              ? "default"
              : "grab",
          transition: isDragging
            ? "none"
            : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": !isDragging && {
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)", // 🔧 IMPROVED: Better hover shadow
            transform: "translateY(-3px)", // 🔧 IMPROVED: Subtle lift
            borderColor: theme.palette.primary.main + "60",
          },
          ...(isDragging && {
            transform: `${CSS.Transform.toString(transform)} rotate(2deg)`, // 🔧 IMPROVED: More rotation
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }),
          ...(isOver &&
            !isDragging && {
              borderColor: theme.palette.primary.main,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.background.default}95)`,
            }),
        }}
        {...(userRole !== "viewer" ? attributes : {})}
      >
        <Box
          sx={{ display: "flex", flexDirection: "row", position: "relative" }}
        >
          {/* 🔧 IMPROVED: Better positioned category icon */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 12 },
              left: { xs: -30, sm: -38 },
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.primary.main}`, // 🔧 IMPROVED: Thicker border
                borderRadius: "50%",
                p: compact ? { xs: 0.5, sm: 0.7 } : { xs: 0.7, sm: 0.9 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // 🔧 IMPROVED: Better shadow
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              {getCategoryIcon(category)}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: compact ? { xs: 1, sm: 1.25 } : { xs: 1.25, sm: 1.75 }, // 🔧 IMPROVED: Better padding
            }}
          >
            {/* 🔧 IMPROVED: Better image styling */}
            <Box
              sx={{
                width: "100%",
                height: compact ? { xs: 60, sm: 70 } : { xs: 70, sm: 85 }, // 🔧 IMPROVED: Better heights
                overflow: "hidden",
                borderRadius: { xs: 2, sm: 3 }, // 🔧 IMPROVED: Better border radius
                position: "relative",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // 🔧 NEW: Image shadow
              }}
            >
              <img
                src={(() => {
                  const experience = fav?.experienceId;
                  const photo = experience?.photo;

                  if (photo) {
                    return photo.startsWith("http")
                      ? photo
                      : `${stables.UPLOAD_FOLDER_BASE_URL}${photo}`;
                  }

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
                alt={fav?.experienceId?.title || "Experience"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onError={(e) => {
                  e.target.src = images.sampleFavoriteImage;
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
                  borderRadius: { xs: "0 0 8px 8px", sm: "0 0 12px 12px" },
                }}
              />
            </Box>

            {/* Content */}
            <Box
              sx={{ pt: compact ? { xs: 0.75, sm: 1 } : { xs: 1, sm: 1.25 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: compact ? { xs: 0.5, sm: 0.75 } : { xs: 0.75, sm: 1 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    maxWidth: { xs: "120px", sm: "160px" }, // 🔧 IMPROVED: Better max width
                    width: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: compact ? 1 : 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    fontSize: compact
                      ? { xs: "0.8rem", sm: "0.9rem" }
                      : { xs: "0.85rem", sm: "1rem" }, // 🔧 IMPROVED: Better font sizes
                  }}
                >
                  {fav?.experienceId?.title || "Actividad sin título"}
                </Typography>

                {/* Move Buttons for Mobile/Tablet */}
                {(isMobile || isTablet) && userRole !== "viewer" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.25, // 🔧 IMPROVED: Better gap
                      ml: 0.75,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleMoveUp}
                      disabled={favIndex === 0}
                      sx={{
                        width: compact
                          ? { xs: 22, sm: 26 }
                          : { xs: 24, sm: 28 },
                        height: compact
                          ? { xs: 22, sm: 26 }
                          : { xs: 24, sm: 28 },
                        backgroundColor:
                          favIndex === 0
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          favIndex === 0
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                        transition: "all 0.2s ease", // 🔧 IMPROVED: Smoother transition
                        "&:hover": {
                          backgroundColor:
                            favIndex === 0
                              ? theme.palette.grey[200]
                              : theme.palette.primary.main,
                          color:
                            favIndex === 0 ? theme.palette.grey[400] : "white",
                          transform: favIndex === 0 ? "none" : "scale(1.05)", // 🔧 NEW: Hover scale
                        },
                      }}
                    >
                      <ChevronUp size={compact ? 11 : 13} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleMoveDown}
                      disabled={favIndex === totalActivities - 1}
                      sx={{
                        width: compact
                          ? { xs: 22, sm: 26 }
                          : { xs: 24, sm: 28 },
                        height: compact
                          ? { xs: 22, sm: 26 }
                          : { xs: 24, sm: 28 },
                        backgroundColor:
                          favIndex === totalActivities - 1
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          favIndex === totalActivities - 1
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor:
                            favIndex === totalActivities - 1
                              ? theme.palette.grey[200]
                              : theme.palette.primary.main,
                          color:
                            favIndex === totalActivities - 1
                              ? theme.palette.grey[400]
                              : "white",
                          transform:
                            favIndex === totalActivities - 1
                              ? "none"
                              : "scale(1.05)",
                        },
                      }}
                    >
                      <ChevronDown size={compact ? 11 : 13} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4, // 🔧 IMPROVED: Better gap
                  mb: compact ? { xs: 0.75, sm: 1 } : { xs: 1, sm: 1.25 },
                }}
              >
                <MapPin
                  size={compact ? 11 : 13} // 🔧 IMPROVED: Better icon size
                  color={theme.palette.text.secondary}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: compact
                      ? { xs: "0.65rem", sm: "0.75rem" }
                      : { xs: "0.7rem", sm: "0.85rem" }, // 🔧 IMPROVED: Better font sizes
                    fontWeight: 500, // 🔧 NEW: Medium weight
                  }}
                >
                  {fav?.experienceId?.prefecture || "Ubicación desconocida"}
                </Typography>
              </Box>

              {/* Action Row */}
              <Box display="flex" alignItems="center" gap={1}>
                {" "}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDetailsClick}
                  sx={{
                    borderRadius: compact ? 16 : 20,
                    textTransform: "none",
                    fontWeight: 600,
                    width: "fit-content",
                    background: `linear-gradient(135deg, ${theme.palette.secondary.light})`, // 🔧 IMPROVED: Gradient
                    color: theme.palette.secondary.dark,
                    transition: "all 0.3s ease",
                    boxShadow: "none",
                    fontSize: compact
                      ? { xs: "0.65rem", sm: "0.75rem" }
                      : { xs: "0.7rem", sm: "0.85rem" },
                    py: compact ? { xs: 0.3, sm: 0.4 } : { xs: 0.4, sm: 0.5 },
                    px: compact ? { xs: 0.8, sm: 1 } : { xs: 1, sm: 1.3 },
                    minHeight: compact
                      ? { xs: "24px", sm: "28px" }
                      : { xs: "28px", sm: "32px" },
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.dark})`,
                      color: "white",
                      transform: "translateY(-2px) scale(1.02)", // 🔧 IMPROVED: Better hover effect
                      boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                    },
                  }}
                >
                  <Info size={compact ? 11 : 13} style={{ marginRight: 4 }} />
                  Detalles
                </Button>
                {/* Price */}
                {fav?.experienceId?.price != null &&
                  fav.experienceId.price !== "" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        width: "fit-content",
                        py: compact
                          ? { xs: 0.3, sm: 0.4 }
                          : { xs: 0.4, sm: 0.5 },
                        px: compact ? { xs: 0.8, sm: 1 } : { xs: 1, sm: 1.2 },
                        borderRadius: compact ? 12 : 16,
                        backgroundColor: theme.palette.success.main + "15", // 🔧 NEW: Background color
                        border: `1px solid ${theme.palette.success.main}30`, // 🔧 NEW: Border
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.success.dark, // 🔧 IMPROVED: Better color
                          fontWeight: 700,
                          fontSize: compact
                            ? { xs: "0.65rem", sm: "0.75rem" }
                            : { xs: "0.7rem", sm: "0.9rem" },
                        }}
                      >
                        {fav?.experienceId?.price === 0
                          ? "Gratis"
                          : `¥${fav?.experienceId?.price.toLocaleString()}`}
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Remove Button */}
        {userRole !== "viewer" && (
          <IconButton
            onClick={handleRemove}
            size="small"
            sx={{
              position: "absolute",
              top: compact ? { xs: 6, sm: 8 } : { xs: 8, sm: 10 },
              right: compact ? { xs: 6, sm: 8 } : { xs: 8, sm: 10 },
              width: compact ? { xs: 22, sm: 26 } : { xs: 24, sm: 30 },
              height: compact ? { xs: 22, sm: 26 } : { xs: 24, sm: 30 },
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              border: `2px solid ${theme.palette.error.main}`, // 🔧 IMPROVED: Thicker border
              color: theme.palette.error.main,
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.error.main,
                color: "white",
                transform: "scale(1.1)", // 🔧 IMPROVED: Better scale
                boxShadow: `0 4px 12px ${theme.palette.error.main}40`,
              },
              pointerEvents: "auto",
              zIndex: 10,
            }}
          >
            <Trash2 size={compact ? 24 : 24} />
          </IconButton>
        )}

        {/* Enhanced Drag Indicator */}
        {userRole !== "viewer" && (
          <Box
            ref={setActivatorNodeRef}
            {...(userRole !== "viewer" ? listeners : {})}
            sx={{
              position: "absolute",
              top: compact ? 12 : 14,
              left: compact ? 12 : 14,
              opacity: isDragging ? 1 : isDragHovered ? 0.9 : 0.6, // 🔧 IMPROVED: Better opacity
              transition: "all 0.2s ease",
              cursor: isDragging ? "grabbing" : "grab",
              "&:hover": {
                opacity: 1,
                transform: "scale(1.15)", // 🔧 IMPROVED: Better scale
              },
            }}
            onMouseEnter={() => setIsDragHovered(true)}
            onMouseLeave={() => setIsDragHovered(false)}
          >
            <Box
              sx={{
                width: compact ? 20 : 24, // 🔧 IMPROVED: Better size
                height: compact ? 20 : 24,
                borderRadius: 2, // 🔧 IMPROVED: Better border radius
                background: isDragging
                  ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                  : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: compact ? "10px" : "12px",
                fontWeight: 600,
                boxShadow: isDragging
                  ? "0 6px 16px rgba(0,0,0,0.3)"
                  : "0 3px 10px rgba(0,0,0,0.2)", // 🔧 IMPROVED: Better shadows
                "&:active": {
                  cursor: "grabbing",
                },
              }}
            >
              <GripVertical size={compact ? 11 : 13} />
            </Box>
          </Box>
        )}

        {/* Drop indicator overlay when being dragged over */}
        {isOver && !isDragging && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: { xs: 2, sm: 3 },
              background: `${theme.palette.primary.main}08`, // 🔧 IMPROVED: More subtle background
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
      </Paper>

      {/* Experience Details Modal */}
      <ExperienceDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        experience={fav?.experienceId}
        category={category}
      />
    </>
  );
};

export default ActivityCard;

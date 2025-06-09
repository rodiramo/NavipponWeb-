// Enhanced ActivityCard.jsx with Details Modal
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
  Zoom,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  BedSingle,
  Info,
  MapPin,
  Star,
  Clock,
  Users,
  Euro,
  Map,
  Phone,
  Calendar,
  Sparkles,
  ExternalLink,
  Heart,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

const ExperienceDetailsModal = ({ open, onClose, experience, category }) => {
  const theme = useTheme();

  if (!experience) return null;

  const getCategoryIcon = (cat) => {
    if (cat === "Hoteles")
      return <BedSingle size={20} color={theme.palette.secondary.light} />;
    if (cat === "Atractivos")
      return (
        <MdOutlineTempleBuddhist
          size={20}
          color={theme.palette.secondary.light}
        />
      );
    if (cat === "Restaurantes")
      return (
        <MdOutlineRamenDining size={20} color={theme.palette.secondary.light} />
      );
    return <Sparkles size={20} />;
  };

  const getCategoryColor = (cat) => {
    if (cat === "Hoteles") return theme.palette.secondary.medium;
    if (cat === "Atractivos") return theme.palette.primary.main;
    if (cat === "Restaurantes") return theme.palette.secondary.dark;
    return theme.palette.primary.main;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          overflow: "hidden",
        },
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: 300,
          background: `linear-gradient(135deg, ${getCategoryColor(
            category
          )}20)`,
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${
              experience.photo
                ? stables.UPLOAD_FOLDER_BASE_URL + experience.photo
                : images.sampleFavoriteImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${getCategoryColor(
                category
              )}60, ${getCategoryColor(category)}40)`,
              backdropFilter: "blur(2px)",
            },
          }}
        />

        {/* Content Overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 4,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              icon={getCategoryIcon(category)}
              label={category}
              sx={{
                background: theme.palette.secondary.medium,
                color: theme.palette.primary.white,
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {experience.title || "Experiencia sin título"}
          </Typography>
          {experience.rating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating
                value={experience.rating}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: 600 }}
              >
                ({experience.rating})
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MapPin size={16} color="white" />
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: 500 }}
              >
                {experience.prefecture || "Ubicación desconocida"}
              </Typography>
            </Box>
            {experience.price && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: theme.palette.primary.light,
                  px: 1,
                  py: 1,
                  borderRadius: 30,
                }}
              >
                <Euro size={16} color={theme.palette.primary.main} />
                <Typography
                  variant="p"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {experience.price}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Details Content */}
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Description */}
          {experience.description && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Info size={20} color={theme.palette.primary.main} />
                Descripción
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                }}
              >
                {experience.description}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {/* Duration */}
            {experience.duration && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `${theme.palette.info.main}15`,
                  border: `1px solid ${theme.palette.info.main}30`,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Clock size={18} color={theme.palette.info.main} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Duración
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {experience.duration}
                </Typography>
              </Box>
            )}

            {/* Capacity */}
            {experience.caption && (
              <Box
                sx={{
                  borderRadius: 3,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Descripción
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {experience.caption}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Contact Information */}
          {(experience.website || experience.phone || experience.address) && (
            <>
              <Divider sx={{ opacity: 0.3 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Información de Contacto
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {experience.website && (
                    <Button
                      variant="outlined"
                      startIcon={<ExternalLink size={16} />}
                      href={experience.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Visitar sitio web
                    </Button>
                  )}
                  {experience.phone && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Phone size={20} color={theme.palette.primary.main} />{" "}
                      {experience.phone}
                    </Typography>
                  )}
                  {experience.address && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Map size={20} color={theme.palette.primary.main} />{" "}
                      {experience.address}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 4, pt: 0 }}>
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
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ActivityCard = ({ fav, boardIndex, favIndex, onRemove, sortableId }) => {
  const theme = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setDetailsOpen(true);
  };

  return (
    <>
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
          borderRadius: 3,
          boxShadow: isDragging
            ? "0 12px 40px rgba(0,0,0,0.25)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "visible",
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}40`,
          cursor: isDragging ? "grabbing" : "grab",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            borderColor: theme.palette.primary.main,
          },
          ...(isDragging && {
            transform: `${CSS.Transform.toString(transform)} rotate(3deg)`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            border: `2px solid ${theme.palette.primary.main}`,
          }),
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box
            sx={{
              position: "absolute",
              top: "12px",
              marginLeft: "-50px",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "50%",
                p: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              {getCategoryIcon(category)}
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: 2 }}>
            {/* Enhanced Image */}
            <Box
              sx={{
                width: "100%",
                height: 120,
                overflow: "hidden",
                borderRadius: 4,
                position: "relative",
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
                  transition: "transform 0.3s ease",
                }}
                onError={(e) => {
                  e.target.src = images.sampleFavoriteImage;
                }}
              />
              {/* Overlay gradient */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  borderRadius: "0 0 12px 12px",
                }}
              />
            </Box>

            {/* Enhanced Content */}
            <Box sx={{ p: 2, pt: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                  maxWidth: "200px", // Use maxWidth instead of fixed width
                  width: "100%",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                  wordBreak: "break-word", // Handle very long words
                }}
              >
                {fav?.experienceId?.title || "Actividad sin título"}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <MapPin size={14} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary">
                  {fav?.experienceId?.prefecture || "Ubicación desconocida"}
                </Typography>
              </Box>
              {/* Enhanced Details Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Info size={16} />}
                onClick={handleDetailsClick}
                sx={{
                  borderRadius: 30,
                  textTransform: "none",
                  fontWeight: 600,
                  width: "fit-content",
                  mb: 1,
                  background: `${theme.palette.primary.main}10`,
                  borderColor: `${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `${theme.palette.primary.main}20`,
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Ver detalles
              </Button>
              {fav?.experienceId?.price != null &&
                fav.experienceId.price !== "" &&
                fav.experienceId.price !== 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "fit-content",
                      py: 1,
                      px: 2,
                      borderRadius: 30,
                      background: `${theme.palette.secondary.medium}15`,
                      border: `1px solid ${theme.palette.secondary.medium}30`,
                    }}
                  >
                    <Euro size={16} color={theme.palette.secondary.medium} />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.secondary.medium,
                        fontWeight: 700,
                      }}
                    >
                      {fav?.experienceId?.price}
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        </Box>

        {/* Enhanced Remove Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onRemove(boardIndex, favIndex);
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${theme.palette.error.main}30`,
            color: theme.palette.error.main,
            transition: "all 0.3s ease",
            "&:hover": {
              background: theme.palette.error.main,
              color: "white",
              transform: "scale(1.1)",
              boxShadow: `0 4px 16px ${theme.palette.error.main}40`,
            },
            pointerEvents: "auto",
            zIndex: 10,
          }}
        >
          <Trash2 size={18} />
        </IconButton>

        {/* Enhanced Drag Indicator */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            opacity: isDragging ? 1 : 0.3,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ⋮⋮
          </Box>
        </Box>
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

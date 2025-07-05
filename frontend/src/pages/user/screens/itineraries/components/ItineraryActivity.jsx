// Enhanced ActivityCard.jsx with Mobile Responsive Design
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
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

const ExperienceDetailsModal = ({ open, onClose, experience, category }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!experience) return null;

  const getCategoryIcon = (cat) => {
    const iconSize = isMobile ? 16 : 20;
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
      fullScreen={isMobile}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          overflow: "hidden",
          m: isMobile ? 0 : 2,
        },
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 250, sm: 300 },
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

        {/* Content Overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 3, sm: 4 },
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              icon={getCategoryIcon(category)}
              label={category}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: theme.palette.secondary.medium,
                color: theme.palette.primary.white,
                fontWeight: 600,
                backdropFilter: "blur(10px)",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
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
              fontSize: { xs: "1.5rem", sm: "2rem" },
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
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                ({experience.rating})
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MapPin size={isMobile ? 14 : 16} color="white" />
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {experience.prefecture || "Ubicación desconocida"}
              </Typography>
            </Box>
            {experience.price !== null && experience.price !== undefined ? (
              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color:
                      experience.price === 0
                        ? theme.palette.success.main
                        : theme.palette.primary.main,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  ¥ {experience.price}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  background: `${theme.palette.warning.main}15`,
                  fontStyle: "italic",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Precio a consultar
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Details Content */}
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
          }}
        >
          {/* Description */}
          {experience.description && (
            <Box>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Info
                  size={isMobile ? 18 : 20}
                  color={theme.palette.primary.main}
                />
                Descripción
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {experience.description}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fit, minmax(200px, 1fr))",
              },
              gap: 2,
            }}
          >
            {/* Duration */}
            {experience.duration && (
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2, sm: 3 },
                  background: `${theme.palette.info.main}15`,
                  border: `1px solid ${theme.palette.info.main}30`,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Clock
                    size={isMobile ? 16 : 18}
                    color={theme.palette.info.main}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    Duración
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {experience.duration}
                </Typography>
              </Box>
            )}

            {/* Caption */}
            {experience.caption && (
              <Box
                sx={{
                  borderRadius: { xs: 2, sm: 3 },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Descripción
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
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
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  Información de Contacto
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {experience.website && (
                    <Button
                      variant="outlined"
                      startIcon={<ExternalLink size={14} />}
                      href={experience.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      Visitar sitio web
                    </Button>
                  )}
                  {experience.phone && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      <Phone
                        size={isMobile ? 16 : 20}
                        color={theme.palette.primary.main}
                      />{" "}
                      {experience.phone}
                    </Typography>
                  )}
                  {experience.address && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      <Map
                        size={isMobile ? 16 : 20}
                        color={theme.palette.primary.main}
                      />{" "}
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
      <DialogActions sx={{ p: { xs: 3, sm: 4 }, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          sx={{
            borderRadius: 30,
            textTransform: "none",
            px: { xs: 3, sm: 4 },
            fontWeight: 600,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ActivityCard = ({
  fav,
  boardIndex,
  favIndex,
  onRemove,
  sortableId,
  userRole,
  onMoveActivity, // New prop for mobile move functionality
  totalActivities = 1, // New prop for total activities count
}) => {
  const theme = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    disabled: isMobile, // Disable drag on mobile
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const getCategoryIcon = (category) => {
    const iconSize = isMobile ? 18 : 24;
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
    return null;
  };

  const category = fav?.experienceId?.categories || "Other";

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setDetailsOpen(true);
  };

  const handleMoveUp = () => {
    if (onMoveActivity && favIndex > 0) {
      onMoveActivity(boardIndex, favIndex, favIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (onMoveActivity && favIndex < totalActivities - 1) {
      onMoveActivity(boardIndex, favIndex, favIndex + 1);
    }
  };

  return (
    <>
      <Paper
        ref={setNodeRef}
        style={style}
        {...(!isMobile ? attributes : {})}
        {...(!isMobile ? listeners : {})}
        className="no-scroll"
        sx={{
          position: "relative",
          mb: { xs: 2, sm: 3 },
          mt: { xs: 1.5, sm: 2 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: isDragging
            ? "0 12px 40px rgba(0,0,0,0.25)"
            : {
                xs: "0 2px 12px rgba(0,0,0,0.08)",
                sm: "0 4px 20px rgba(0,0,0,0.08)",
              },
          overflow: "visible",
          background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}40`,
          cursor: isDragging ? "grabbing" : isMobile ? "default" : "grab",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isMobile
              ? "0 4px 16px rgba(0,0,0,0.12)"
              : "0 8px 32px rgba(0,0,0,0.15)",
            transform: isMobile ? "none" : "translateY(-4px)",
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
          {/* Category Icon - Always visible */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: "8px", sm: "12px" },
              marginLeft: { xs: "-36px", sm: "-50px" },
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
                p: { xs: 0.5, sm: 1 },
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

          <Box sx={{ flex: 1, p: { xs: 1, sm: 2 } }}>
            {/* Enhanced Image */}
            <Box
              sx={{
                width: "100%",
                height: { xs: 70, sm: 120 },
                overflow: "hidden",
                borderRadius: { xs: 2, sm: 4 },
                position: "relative",
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
              {/* Overlay gradient */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  borderRadius: { xs: "0 0 6px 6px", sm: "0 0 12px 12px" },
                }}
              />
            </Box>

            {/* Enhanced Content */}
            <Box sx={{ p: { xs: 1, sm: 2 }, pt: { xs: 1, sm: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                <Typography
                  variant={isMobile ? "body2" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    maxWidth: { xs: "120px", sm: "180px" },
                    width: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    fontSize: { xs: "0.8rem", sm: "1.25rem" },
                  }}
                >
                  {fav?.experienceId?.title || "Actividad sin título"}
                </Typography>

                {/* Mobile Up/Down Arrows - Inside card */}
                {isMobile && userRole !== "viewer" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.25,
                      ml: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleMoveUp}
                      disabled={favIndex === 0}
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor:
                          favIndex === 0
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          favIndex === 0
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor:
                            favIndex === 0
                              ? theme.palette.grey[200]
                              : theme.palette.primary.main,
                          color:
                            favIndex === 0 ? theme.palette.grey[400] : "white",
                        },
                      }}
                    >
                      <ChevronUp size={12} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleMoveDown}
                      disabled={favIndex === totalActivities - 1}
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor:
                          favIndex === totalActivities - 1
                            ? theme.palette.grey[200]
                            : theme.palette.primary.light,
                        color:
                          favIndex === totalActivities - 1
                            ? theme.palette.grey[400]
                            : theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor:
                            favIndex === totalActivities - 1
                              ? theme.palette.grey[200]
                              : theme.palette.primary.main,
                          color:
                            favIndex === totalActivities - 1
                              ? theme.palette.grey[400]
                              : "white",
                        },
                      }}
                    >
                      <ChevronDown size={12} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <MapPin
                  size={isMobile ? 10 : 14}
                  color={theme.palette.text.secondary}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.65rem", sm: "0.875rem" } }}
                >
                  {fav?.experienceId?.prefecture || "Ubicación desconocida"}
                </Typography>
              </Box>

              {/* Enhanced Details Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Info size={isMobile ? 12 : 16} />}
                onClick={handleDetailsClick}
                sx={{
                  borderRadius: { xs: 15, sm: 30 },
                  textTransform: "none",
                  fontWeight: 600,
                  width: "fit-content",
                  mb: { xs: 0.5, sm: 1 },
                  background: `${theme.palette.primary.main}10`,
                  borderColor: `${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  fontSize: { xs: "0.65rem", sm: "0.875rem" },
                  py: { xs: 0.25, sm: 1 },
                  px: { xs: 1, sm: 2 },
                  minHeight: { xs: "24px", sm: "auto" },
                  "&:hover": {
                    background: `${theme.palette.primary.main}20`,
                    borderColor: theme.palette.primary.main,
                    transform: isMobile ? "none" : "translateY(-1px)",
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
                      py: { xs: 0.25, sm: 1 },
                      px: { xs: 1, sm: 2 },
                      borderRadius: { xs: 15, sm: 30 },
                      background: `${theme.palette.secondary.medium}15`,
                      border: `1px solid ${theme.palette.secondary.medium}30`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.secondary.medium,
                        fontWeight: 700,
                        fontSize: { xs: "0.65rem", sm: "0.875rem" },
                      }}
                    >
                      ¥ {fav?.experienceId?.price}
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        </Box>

        {/* Enhanced Remove Button */}
        {userRole !== "viewer" && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRemove(boardIndex, favIndex);
            }}
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 12 },
              right: { xs: 6, sm: 12 },
              width: { xs: 24, sm: 36 },
              height: { xs: 24, sm: 36 },
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.error.main}30`,
              color: theme.palette.error.main,
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.error.main,
                color: "white",
                transform: isMobile ? "none" : "scale(1.1)",
                boxShadow: `0 4px 16px ${theme.palette.error.main}40`,
              },
              pointerEvents: "auto",
              zIndex: 10,
            }}
          >
            <Trash2 size={isMobile ? 12 : 18} />
          </IconButton>
        )}

        {/* Enhanced Drag Indicator - Hidden on mobile */}
        {!isMobile && (
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

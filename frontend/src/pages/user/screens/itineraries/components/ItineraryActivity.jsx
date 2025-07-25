// Enhanced ActivityCard with improved drag and drop functionality
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
  GripVertical,
  Move,
} from "lucide-react";
import { MdOutlineTempleBuddhist, MdOutlineRamenDining } from "react-icons/md";
import { stables, images } from "../../../../../constants";

// ExperienceDetailsModal component (unchanged from original)
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
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: `linear-gradient(135deg, ${theme.palette.background.default})`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.palette.divider}40`,
          overflow: "hidden",
          m: isMobile ? 0 : 1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: 180, sm: 220 },
          background: `linear-gradient(135deg, ${getCategoryColor(
            category
          )}20)`,
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
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 2, sm: 3 },
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
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                height: { xs: 20, sm: 24 },
              }}
            />
          </Box>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 0.5,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              lineHeight: 1.2,
            }}
          >
            {experience.title || "Experiencia sin título"}
          </Typography>
          {experience.rating && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}
            >
              <Rating
                value={experience.rating}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiRating-icon": {
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.7rem" },
                }}
              >
                ({experience.rating})
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MapPin size={isMobile ? 12 : 14} color="white" />
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.9rem" },
                }}
              >
                {experience.prefecture || "Ubicación desconocida"}
              </Typography>
            </Box>
            {experience.price !== null && experience.price !== undefined ? (
              <Box
                sx={{
                  background: theme.palette.background.default,
                  borderRadius: 20,
                  px: 1.5,
                  py: 0.25,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color:
                      experience.price === 0
                        ? theme.palette.success.main
                        : theme.palette.primary.main,
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                >
                  ¥ {experience.price}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  background: `${theme.palette.warning.main}15`,
                  fontStyle: "italic",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                Precio a consultar
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="body2">Experience details...</Typography>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 20,
            textTransform: "none",
            px: { xs: 2.5, sm: 3 },
            fontWeight: 600,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            py: 0.5,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced ActivityCard with improved drag functionality
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

  // Enhanced sortable configuration for better drag experience
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
    disabled: userRole === "viewer", // Disable drag for viewers
  });

  // Enhanced drag styling with better visual feedback
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : isOver ? 500 : 1,
    scale: isDragging ? 1.02 : 1,
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
    return null;
  };

  const category = fav?.experienceId?.categories || "Other";

  const handleDetailsClick = (e) => {
    e.stopPropagation();
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
          borderRadius: { xs: 1.5, sm: 2 },
          boxShadow: isDragging
            ? "0 12px 36px rgba(0,0,0,0.25)"
            : isOver
              ? "0 6px 20px rgba(0,0,0,0.15)"
              : {
                  xs: "0 1px 6px rgba(0,0,0,0.06)",
                  sm: "0 2px 12px rgba(0,0,0,0.06)",
                },
          overflow: "visible",
          background: isDragging
            ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.background.default}95)`
            : `linear-gradient(135deg, ${theme.palette.background.default}95, ${theme.palette.background.default}85)`,
          backdropFilter: "blur(10px)",
          border: isDragging
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}40`,
          cursor: isDragging
            ? "grabbing"
            : userRole === "viewer"
              ? "default"
              : "grab",
          transition: isDragging
            ? "none"
            : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": !isDragging && {
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
            borderColor: theme.palette.primary.main + "60",
          },
          ...(isDragging && {
            transform: `${CSS.Transform.toString(transform)} rotate(1deg)`,
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          }),
          ...(isOver &&
            !isDragging && {
              borderColor: theme.palette.primary.main,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.background.default}95)`,
            }),
        }}
        {...(userRole !== "viewer" ? attributes : {})}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {/* Category Icon */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: "8px", sm: "10px" },
              marginLeft: {
                xs: compact ? "-32px" : "-36px",
                sm: compact ? "-40px" : "-46px",
              },
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "50%",
                p: compact ? { xs: 0.4, sm: 0.6 } : { xs: 0.6, sm: 0.8 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  transform: "scale(1.05)",
                },
              }}
            >
              {getCategoryIcon(category)}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: compact ? { xs: 0.75, sm: 1 } : { xs: 1, sm: 1.5 },
            }}
          >
            {/* Image */}
            <Box
              sx={{
                width: "100%",
                height: compact ? { xs: 55, sm: 65 } : { xs: 65, sm: 75 },
                overflow: "hidden",
                borderRadius: { xs: 1, sm: 2 },
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
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
                  borderRadius: { xs: "0 0 4px 4px", sm: "0 0 8px 8px" },
                }}
              />
            </Box>

            {/* Content */}
            <Box
              sx={{ pt: compact ? { xs: 0.5, sm: 0.75 } : { xs: 0.75, sm: 1 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: compact ? { xs: 0.25, sm: 0.5 } : { xs: 0.5, sm: 0.75 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    maxWidth: { xs: "110px", sm: "150px" },
                    width: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: compact ? 1 : 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.1,
                    wordBreak: "break-word",
                    fontSize: compact
                      ? { xs: "0.75rem", sm: "0.85rem" }
                      : { xs: "0.8rem", sm: "0.95rem" },
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
                      gap: 0.2,
                      ml: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleMoveUp}
                      disabled={favIndex === 0}
                      sx={{
                        width: compact
                          ? { xs: 20, sm: 24 }
                          : { xs: 22, sm: 26 },
                        height: compact
                          ? { xs: 20, sm: 24 }
                          : { xs: 22, sm: 26 },
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
                      <ChevronUp size={compact ? 10 : 12} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleMoveDown}
                      disabled={favIndex === totalActivities - 1}
                      sx={{
                        width: compact
                          ? { xs: 20, sm: 24 }
                          : { xs: 22, sm: 26 },
                        height: compact
                          ? { xs: 20, sm: 24 }
                          : { xs: 22, sm: 26 },
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
                      <ChevronDown size={compact ? 10 : 12} />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.3,
                  mb: compact ? { xs: 0.5, sm: 0.75 } : { xs: 0.75, sm: 1 },
                }}
              >
                <MapPin
                  size={compact ? 10 : 12}
                  color={theme.palette.text.secondary}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: compact
                      ? { xs: "0.6rem", sm: "0.7rem" }
                      : { xs: "0.65rem", sm: "0.8rem" },
                  }}
                >
                  {fav?.experienceId?.prefecture || "Ubicación desconocida"}
                </Typography>
              </Box>

              {/* Action Row */}
              <Box display="flex" alignItems="center" gap={0.75}>
                {/* Details Button */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDetailsClick}
                  sx={{
                    borderRadius: compact ? 12 : 16,
                    textTransform: "none",
                    fontWeight: 600,
                    width: "fit-content",
                    background: `${theme.palette.primary.main}10`,
                    borderColor: `${theme.palette.primary.main}30`,
                    color: theme.palette.primary.main,
                    transition: "all 0.3s ease",
                    fontSize: compact
                      ? { xs: "0.6rem", sm: "0.7rem" }
                      : { xs: "0.65rem", sm: "0.8rem" },
                    py: compact ? { xs: 0.2, sm: 0.3 } : { xs: 0.25, sm: 0.4 },
                    px: compact ? { xs: 0.6, sm: 0.8 } : { xs: 0.8, sm: 1.1 },
                    minHeight: compact
                      ? { xs: "22px", sm: "26px" }
                      : { xs: "26px", sm: "30px" },
                    minWidth: compact
                      ? { xs: "22px", sm: "26px" }
                      : { xs: "26px", sm: "30px" },
                    "&:hover": {
                      background: `${theme.palette.primary.main}20`,
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Info size={compact ? 10 : 12} />
                </Button>

                {/* Price */}
                {fav?.experienceId?.price != null &&
                  fav.experienceId.price !== "" &&
                  fav.experienceId.price !== 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        width: "fit-content",
                        py: compact
                          ? { xs: 0.2, sm: 0.3 }
                          : { xs: 0.25, sm: 0.4 },
                        px: compact ? { xs: 0.6, sm: 0.8 } : { xs: 0.8, sm: 1 },
                        borderRadius: compact ? 10 : 14,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.secondary.medium,
                          fontWeight: 700,
                          fontSize: compact
                            ? { xs: "0.6rem", sm: "0.7rem" }
                            : { xs: "0.65rem", sm: "0.85rem" },
                        }}
                      >
                        ¥ {fav?.experienceId?.price}
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
              top: compact ? { xs: 5, sm: 7 } : { xs: 7, sm: 9 },
              right: compact ? { xs: 5, sm: 7 } : { xs: 7, sm: 9 },
              width: compact ? { xs: 20, sm: 24 } : { xs: 22, sm: 28 },
              height: compact ? { xs: 20, sm: 24 } : { xs: 22, sm: 28 },
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.error.main}30`,
              color: theme.palette.error.main,
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.error.main,
                color: "white",
                transform: "scale(1.05)",
                boxShadow: `0 2px 8px ${theme.palette.error.main}40`,
              },
              pointerEvents: "auto",
              zIndex: 10,
            }}
          >
            <Trash2 size={compact ? 10 : 12} />
          </IconButton>
        )}

        {/* Enhanced Drag Indicator */}
        {userRole !== "viewer" && (
          <Box
            ref={setActivatorNodeRef}
            {...(userRole !== "viewer" ? listeners : {})}
            sx={{
              position: "absolute",
              top: compact ? 10 : 12,
              left: compact ? 10 : 12,
              opacity: isDragging ? 1 : isDragHovered ? 0.9 : 0.5,
              transition: "all 0.2s ease",
              cursor: isDragging ? "grabbing" : "grab",
              "&:hover": {
                opacity: 1,
                transform: "scale(1.1)",
              },
            }}
            onMouseEnter={() => setIsDragHovered(true)}
            onMouseLeave={() => setIsDragHovered(false)}
          >
            <Box
              sx={{
                width: compact ? 18 : 22,
                height: compact ? 18 : 22,
                borderRadius: 1,
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
                  ? "0 4px 12px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.15)",
                "&:active": {
                  cursor: "grabbing",
                },
              }}
            >
              <GripVertical size={compact ? 10 : 12} />
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
              borderRadius: { xs: 1.5, sm: 2 },
              background: `${theme.palette.primary.main}05`,
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

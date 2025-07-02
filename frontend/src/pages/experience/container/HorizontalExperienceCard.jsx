import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  getUserFavorites,
} from "../../../services/index/favorites";
// Add itinerary service imports
import {
  getUserItineraries,
  addExperienceToItinerary,
  checkExperienceInItinerary,
} from "../../../services/index/itinerary";
import { images, stables } from "../../../constants";
import { Eye, Plus, BookOpen, Check, Image as ImageIcon } from "lucide-react";
import {
  IconButton,
  useTheme,
  Typography,
  Box,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import StarRating from "../../../components/Stars";
import { LocationOn, People } from "@mui/icons-material";

const CardImageWithSampleIndicator = ({
  src,
  alt,
  isSample = false,
  category = "",
  style = {},
  theme,
  sx = {},
}) => {
  // Corner indicator for cards (subtle and clean)
  const CornerIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 3, // Higher z-index to appear above category badge
      }}
    ></Box>
  );

  // If not a sample image, render normally
  if (!isSample) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          objectFit: "cover",
          transition: "transform 0.4s ease",
          ...sx,
        }}
      />
    );
  }

  // For sample images, add the indicator
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          objectFit: "cover",
          transition: "transform 0.4s ease",
          filter: "brightness(0.96)", // Slightly dim sample images
          ...sx,
        }}
      />
      <CornerIndicator />
    </Box>
  );
};

const HorizontalExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
  onItineraryAdd, // New callback for itinerary updates
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userItineraries, setUserItineraries] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [experienceInItineraries, setExperienceInItineraries] = useState(
    new Map()
  ); // Map of itineraryId -> boards[]
  const theme = useTheme();

  const isDefaultImage = (photoUrl) => {
    return photoUrl && photoUrl.startsWith("https://images.unsplash.com");
  };

  // Get the full image URL
  const getImageUrl = () => {
    if (!experience?.photo) return images.sampleExperienceImage;
    return experience.photo.startsWith("http")
      ? experience.photo
      : stables.UPLOAD_FOLDER_BASE_URL + experience.photo;
  };

  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        const response = await getFavoritesCountService(experience._id);
        setFavoritesCount(response.favoritesCount);
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    };

    fetchFavoritesCount();
  }, [experience._id]);

  useEffect(() => {
    if (user && token) {
      const fetchFavorites = async () => {
        try {
          const favorites = await getUserFavorites({ userId: user._id, token });
          const isFav = favorites.some(
            (fav) => fav.experienceId && fav.experienceId._id === experience._id
          );
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      };

      const fetchUserItineraries = async () => {
        try {
          const itineraries = await getUserItineraries(user._id, token);
          setUserItineraries(itineraries);

          // Check which itineraries already contain this experience
          const inItineraries = new Map();
          for (const itinerary of itineraries) {
            try {
              const checkResult = await checkExperienceInItinerary({
                itineraryId: itinerary._id,
                experienceId: experience._id,
                token,
              });
              if (checkResult.exists) {
                inItineraries.set(itinerary._id, checkResult.boards || []);
              }
            } catch (error) {
              console.error(
                `Error checking experience in itinerary ${itinerary._id}:`,
                error
              );
            }
          }
          setExperienceInItineraries(inItineraries);
        } catch (error) {
          console.error("Error fetching user itineraries:", error);
        }
      };

      fetchFavorites();
      fetchUserItineraries();
    }
  }, [user, token, experience._id]);

  const handleFavoriteClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user || !token) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    try {
      if (isFavorite) {
        const response = await removeFavoriteService({
          userId: user._id,
          experienceId: experience._id,
          token,
        });
        setIsFavorite(false);
        setFavoritesCount(response.favoritesCount);
        toast.success("Se eliminó de favoritos");
      } else {
        const response = await addFavoriteService({
          userId: user._id,
          experienceId: experience._id,
          token,
        });
        setIsFavorite(true);
        setFavoritesCount(response.favoritesCount);
        toast.success("Se agregó a favoritos");
      }

      onFavoriteToggle && onFavoriteToggle();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("La experiencia ya está en tus favoritos");
      } else {
        toast.error("Error al actualizar favoritos");
      }
      console.error("Error updating favorites:", error);
    }
  };

  const handleItineraryMenuOpen = (event) => {
    if (!user || !token) {
      toast.error("Debes iniciar sesión para agregar a itinerario");
      return;
    }

    if (userItineraries.length === 0) {
      toast.error("No tienes itinerarios creados. Crea uno primero.");
      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleItineraryMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToItinerary = async (itinerary) => {
    try {
      // Add to first board (earliest date) by default
      const boardDate =
        itinerary.boards && itinerary.boards.length > 0
          ? itinerary.boards[0].date
          : null;

      await addExperienceToItinerary({
        itineraryId: itinerary._id,
        experienceId: experience._id,
        boardDate, // Optional - will use first board if not specified
        token,
      });

      // Update the state to show this itinerary now contains the experience
      setExperienceInItineraries((prev) => {
        const newMap = new Map(prev);
        const existingBoards = newMap.get(itinerary._id) || [];
        newMap.set(
          itinerary._id,
          [...existingBoards, boardDate].filter(Boolean)
        );
        return newMap;
      });

      toast.success(`Experiencia agregada a "${itinerary.name}"`);
      onItineraryAdd && onItineraryAdd(itinerary._id, experience._id);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("La experiencia ya está en este itinerario");
      } else {
        toast.error("Error al agregar a itinerario");
      }
      console.error("Error adding to itinerary:", error);
    } finally {
      handleItineraryMenuClose();
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Atractivos: {
        bg: theme.palette.secondary.light,
        text: theme.palette.secondary.dark,
      },
      Hoteles: {
        bg: theme.palette.success.light,
        text: theme.palette.success.dark,
      },
      Restaurantes: {
        bg: theme.palette.primary.light,
        text: theme.palette.primary.dark,
      },
    };
    return (
      colors[category] || { bg: theme.palette.primary.main, text: "white" }
    );
  };

  const categoryColors = getCategoryColor(experience.categories);
  const hasItineraries = user && token && userItineraries.length > 0;

  return (
    <Card
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
        minHeight: { xs: "auto", md: "280px" },
        borderRadius: "24px",
        overflow: "hidden",
        alignItems: "center",
        background: `linear-gradient(135deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.primary.main}03 100%)`,
        border: `2px solid ${theme.palette.primary.main}08`,
        boxShadow: "none",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main}02 0%, 
            ${theme.palette.secondary.main}02 100%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        },
      }}
    >
      {/* Enhanced Image Section with Sample Indicator */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "400px" },
          height: { xs: "240px", md: "335px" },
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Enhanced Image with Sample Indicator */}
        <CardImageWithSampleIndicator
          src={getImageUrl()}
          alt={experience.title}
          isSample={isDefaultImage(experience?.photo)}
          category={experience.categories}
          theme={theme}
        />

        {/* Category Badge - positioned to not conflict with sample indicator */}
        <Chip
          label={experience.categories}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: categoryColors.bg,
            color: categoryColors.text,
            fontSize: "0.75rem",
            fontWeight: 600,
            height: "28px",
            zIndex: 2, // Ensure it's below the sample indicator
            "& .MuiChip-label": {
              paddingX: 1.5,
            },
          }}
        />

        {/* Optional: Additional info for sample images */}
        {isDefaultImage(experience?.photo) && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              width: "fit-content",
              right: 12,
              background: theme.palette.secondary.light,
              backdropFilter: "blur(4px)",
              borderRadius: "30px",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              border: `1px solid ${theme.palette.secondary.dark}30`,
            }}
          >
            <ImageIcon size={12} color={theme.palette.secondary.dark} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.secondary.dark,
                fontWeight: 500,
                fontSize: "0.7rem",
              }}
            >
              Imagen de muestra
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content Section - Unchanged */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: { xs: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Favorite Button - Top Right of Content */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 25,
            right: 40,
            width: 50,
            height: 50,
            "&:hover": {
              backgroundColor: isFavorite
                ? `${theme.palette.primary.main}25`
                : `${theme.palette.primary.main}15`,
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
            border: `2px solid ${
              isFavorite
                ? theme.palette.primary.main
                : theme.palette.primary.main
            }30`,
          }}
        >
          {isFavorite ? (
            <AiFillHeart size={24} color={theme.palette.primary.main} />
          ) : (
            <AiOutlineHeart size={24} color={theme.palette.primary.main} />
          )}
        </IconButton>

        {/* Header Content */}
        <Box sx={{ paddingRight: 6 }}>
          {/* Title */}
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 1.3,
              color: theme.palette.text.primary,
              marginBottom: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {experience.title}
          </Typography>
          {/* Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: `${theme.palette.primary.main}20`,
              padding: "4px 10px",
              width: "fit-content",
              color: theme.palette.primary.main,
              borderRadius: "20px",
              marginBottom: 2,
            }}
          >
            <LocationOn
              sx={{
                fontSize: 18,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
              }}
            >
              {experience.prefecture}, {experience.region}
            </Typography>
          </Box>
          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              marginBottom: 3,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {experience.caption}
          </Typography>
          {/* Rating and Reviews */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginBottom: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StarRating
                rating={experience.ratings || 0}
                isEditable={false}
                size={18}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {experience?.ratings?.toFixed(1) || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <People
                sx={{ fontSize: 16, color: theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {experience?.numReviews || 0} reseñas
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ marginY: 2, opacity: 0.5 }} />

        {/* Action Section - Unchanged */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Left side - Buttons and Favorites Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              flex: 1,
            }}
          >
            {/* Buttons Row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* View Details Button */}
              <Button
                component={Link}
                to={`/experience/${experience.slug}`}
                variant="contained"
                startIcon={<Eye size={16} />}
                sx={{
                  background: theme.palette.secondary.medium,
                  color: theme.palette.primary.white,
                  textTransform: "none",
                  borderRadius: "25px",
                  paddingX: 3,
                  paddingY: 1.5,
                  fontWeight: 600,
                  boxShadow: "none",
                  fontSize: "0.875rem",
                  "&:hover": {
                    boxShadow: "none",
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Ver Detalles
              </Button>

              {/* Add to Itinerary Button */}
              {hasItineraries && (
                <Button
                  onClick={handleItineraryMenuOpen}
                  startIcon={<Plus size={16} />}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                    borderRadius: "25px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    paddingX: 3,
                    paddingY: 1.5,
                    border: `1px solid ${theme.palette.primary.main}30`,
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.white,
                      transform: "translateY(-1px)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Agregar a itinerario
                </Button>
              )}
            </Box>
          </Box>

          {/* Right side - Price Badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  experience.price === 0
                    ? theme.palette.secondary.medium
                    : theme.palette.primary.white,
                color:
                  experience.price === 0
                    ? theme.palette.primary.white
                    : theme.palette.primary.main,
                padding: "8px 16px",
                borderRadius: "30rem",
                fontSize: "1rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              ¥{" "}
              {experience.price === 0 ? <> Gratis</> : <>{experience.price}</>}
            </Box>
          </Box>
        </Box>

        {/* Itinerary Menu - Unchanged */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleItineraryMenuClose}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              mt: 1,
              minWidth: "200px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {userItineraries.map((itinerary) => {
            const boardsWithExperience =
              experienceInItineraries.get(itinerary._id) || [];
            const isInItinerary = boardsWithExperience.length > 0;
            const boardsText = isInItinerary
              ? `En ${boardsWithExperience.length} día${
                  boardsWithExperience.length > 1 ? "s" : ""
                }`
              : `${itinerary.travelDays || 0} días de viaje`;

            return (
              <MenuItem
                key={itinerary._id}
                onClick={() =>
                  !isInItinerary && handleAddToItinerary(itinerary)
                }
                disabled={isInItinerary}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    backgroundColor: !isInItinerary
                      ? theme.palette.primary.light
                      : "transparent",
                  },
                  opacity: isInItinerary ? 0.6 : 1,
                }}
              >
                <ListItemIcon>
                  {isInItinerary ? (
                    <Check size={20} color={theme.palette.success.main} />
                  ) : (
                    <BookOpen size={20} color={theme.palette.primary.main} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={itinerary.name}
                  secondary={boardsText}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.75rem",
                    color: isInItinerary
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                  }}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </CardContent>
    </Card>
  );
};

export default HorizontalExperienceCard;

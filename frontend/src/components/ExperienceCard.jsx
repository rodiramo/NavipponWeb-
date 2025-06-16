import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import StarRating from "../components/Stars";
import { useTheme } from "@mui/material";
import { MapPin, Star, Eye, Plus, BookOpen, Check, People } from "lucide-react";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  getUserFavorites,
} from "../services/index/favorites";
import {
  getUserItineraries,
  addExperienceToItinerary,
  checkExperienceInItinerary,
} from "../services/index/itinerary";
import { images, stables } from "../constants";

const ExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
  onItineraryAdd,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [userItineraries, setUserItineraries] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [experienceInItineraries, setExperienceInItineraries] = useState(
    new Map()
  );
  const theme = useTheme();

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

  const handleFavoriteClick = async () => {
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
      const boardDate =
        itinerary.boards && itinerary.boards.length > 0
          ? itinerary.boards[0].date
          : null;

      await addExperienceToItinerary({
        itineraryId: itinerary._id,
        experienceId: experience._id,
        boardDate,
        token,
      });

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
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        // Apply styling from horizontal card
        background: `linear-gradient(135deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.primary.main}03 100%)`,
        border: `2px solid ${theme.palette.primary.main}08`,
        boxShadow: "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 40px ${theme.palette.primary.main}15`,
          border: `2px solid ${theme.palette.primary.main}12`,
        },
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
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Link to={`/experience/${experience.slug}`}>
          <Box
            component="img"
            src={(() => {
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
                  return images.sampleExperienceImage;
              }
            })()}
            alt={experience.title}
            sx={{
              width: "100%",
              objectFit: "cover",
              objectPosition: "center",
              height: "224px",
              transition: "transform 0.4s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Link>

        {/* Category Badge */}
        <Box
          sx={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 2,
          }}
        >
          <Chip
            label={experience.categories}
            sx={{
              backgroundColor: categoryColors.bg,
              color: categoryColors.text,
              fontSize: "0.75rem",
              fontWeight: 600,
              height: "28px",
              "& .MuiChip-label": {
                paddingX: 1.5,
              },
            }}
          />
        </Box>

        {/* Favorite Button */}
        <Box
          component="button"
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: `${theme.palette.primary.white}`,
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            border: `2px solid ${theme.palette.primary.main}20`,
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}40`,
            },
            "&:focus": {
              outline: "none",
              ring: `2px solid ${theme.palette.primary.main}50`,
            },
          }}
        >
          {isFavorite ? (
            <AiFillHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.25rem" }}
            />
          ) : (
            <AiOutlineHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.25rem" }}
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        {/* Title and Region */}
        <Link
          to={`/experience/${experience.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.125rem",
              lineHeight: 1.3,
              color: theme.palette.text.primary,
              mb: 1,
              transition: "color 0.2s ease",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {experience.title}
          </Typography>
        </Link>

        {/* Location */}
        {experience.region && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: `${theme.palette.primary.main}20`,
              padding: "4px 10px",
              width: "fit-content",
              color: theme.palette.primary.main,
              borderRadius: "20px",
              mb: 2,
            }}
          >
            <MapPin size={14} />
            <Typography
              variant="body2"
              sx={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              {experience.prefecture}, {experience.region}
            </Typography>
          </Box>
        )}

        {/* Rating */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Star
              size={16}
              fill={theme.palette.secondary.main}
              color={theme.palette.secondary.main}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {experience?.ratings || "0"}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.8rem",
            }}
          >
            ({experience?.numReviews || 0} reseñas)
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.5,
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {experience.caption || experience.description}
        </Typography>

        {/* Price and Button Row - Responsive Layout */}
        <Box
          display="flex"
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={hasItineraries ? 2 : 0}
        >
          {/* Price Section */}
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            {experience.price !== null && experience.price !== undefined ? (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color:
                      experience.price === 0
                        ? theme.palette.success.main
                        : theme.palette.primary.main,
                    fontSize: "1.25rem",
                  }}
                >
                  {experience.price === 0
                    ? "Gratis"
                    : `¥${experience.price.toLocaleString()}`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  por persona
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                }}
              >
                A consultar
              </Typography>
            )}
          </Box>

          {/* View Button */}
          <Button
            component={Link}
            to={`/experience/${experience.slug}`}
            sx={{
              background: theme.palette.secondary.medium,
              color: theme.palette.primary.white,
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              py: 1.25,
              px: 3,
              m: { xs: "auto", sm: "0" },

              width: { xs: "fit-content", sm: "fit-content" },
              boxShadow: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                transform: "translateY(-1px)",
                boxShadow: "none",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="center"
            >
              <Eye size={24} />
              <span>Ver detalles</span>
            </Box>
          </Button>
        </Box>

        {/* Add to Itinerary Button */}
        {hasItineraries && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              onClick={handleItineraryMenuOpen}
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                py: 1.25,
                px: 3,
                minWidth: "auto",
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
              <Box display="flex" alignItems="center" gap={1}>
                <Plus size={16} />
                <span>Agregar a itinerario</span>
              </Box>
            </Button>
          </Box>
        )}

        {/* Itinerary Menu */}
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

export default ExperienceCard;

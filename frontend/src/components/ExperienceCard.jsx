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
} from "@mui/material";
import StarRating from "../components/Stars";
import { useTheme } from "@mui/material";
import {
  Landmark,
  Coins,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Eye,
  Plus,
  BookOpen,
  Check,
} from "lucide-react";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  getUserFavorites,
} from "../services/index/favorites";
// Add these itinerary service imports
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
  onItineraryAdd, // New callback for itinerary updates
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [userItineraries, setUserItineraries] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [experienceInItineraries, setExperienceInItineraries] = useState(
    new Map()
  ); // Map of itineraryId -> boards[]
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

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Consultar precio";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasItineraries = user && token && userItineraries.length > 0;

  return (
    <Box
      className={`group/card rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      sx={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image Container */}
      <Box className="relative overflow-hidden">
        <Link to={`/experience/${experience.slug}`}>
          <img
            src={
              experience.photo
                ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
                : images.sampleExperienceImage
            }
            alt={experience.title}
            className="w-full object-cover object-center h-56 "
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
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              fontSize: "0.75rem",
              fontWeight: 600,
              height: "28px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />{" "}
          {/* Tags Row */}
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {experience.generalTags?.budget && (
              <Chip
                icon={<Coins size={14} />}
                label={experience.generalTags.budget}
                size="small"
                sx={{
                  backgroundColor: `${theme.palette.secondary.light}`,
                  color: theme.palette.secondary.dark,
                  fontSize: "0.7rem",
                  height: "24px",
                  fontWeight: 500,
                  border: `1px solid ${theme.palette.secondary.main}30`,
                }}
              />
            )}
            {experience.generalTags?.season && (
              <Chip
                icon={<Calendar size={14} />}
                label={experience.generalTags.season}
                size="small"
                sx={{
                  backgroundColor: `${theme.palette.neutral.light}`,
                  color: theme.palette.neutral.dark,
                  fontSize: "0.7rem",
                  height: "24px",
                  fontWeight: 500,
                  border: `1px solid ${theme.palette.neutral.main}30`,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 group/heart w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {isFavorite ? (
            <AiFillHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.25rem" }}
              className="transition-transform duration-300 group-hover/heart:scale-125"
            />
          ) : (
            <AiOutlineHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.25rem" }}
              className="transition-transform duration-300 group-hover/heart:scale-125"
            />
          )}
        </button>
      </Box>

      {/* Content */}
      <Box className="p-6">
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
              borderRadius: 30,
              px: 1,
              py: 0.5,
              width: "fit-content",
              mb: 2,
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
            }}
          >
            <MapPin size={14} />
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
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

        {/* Price and Button Row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          mb={hasItineraries ? 2 : 0}
        >
          {/* Price Display */}
          <Box>
            {experience.price ? (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: "1.25rem",
                  }}
                >
                  {formatPrice(experience.price)}
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
                Precio a consultar
              </Typography>
            )}
          </Box>

          {/* View Button */}
          <Button
            component={Link}
            to={`/experience/${experience.slug}`}
            className="group/btn relative overflow-hidden"
            sx={{
              backgroundColor: theme.palette.secondary.medium,
              color: theme.palette.primary.white,
              borderRadius: "25px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              py: 1.25,
              px: 3,
              minWidth: "auto",
              boxShadow: `0 4px 12px ${theme.palette.secondary.main}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
                boxShadow: `0 6px 20px ${theme.palette.secondary.main}40`,
                transform: "translateY(-1px)",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Eye size={16} />
              <span>Ver más</span>
            </Box>
          </Button>
        </Box>

        {/* Add to Itinerary Button */}
        {hasItineraries && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              onClick={handleItineraryMenuOpen}
              className="group/itinerary-btn"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                py: 1,
                px: 3,
                minWidth: "auto",
                border: `1px solid ${theme.palette.primary.main}30`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.white,
                  transform: "translateY(-1px)",
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

        {/* Favorites Count */}
        {favoritesCount > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
            mt={2}
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
            }}
          >
            <AiFillHeart size={12} color={theme.palette.primary.main} />
            <Typography variant="caption">
              {favoritesCount} personas lo han marcado como favorito
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExperienceCard;

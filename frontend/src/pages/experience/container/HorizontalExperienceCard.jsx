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
import { images, stables } from "../../../constants";
import { Eye } from "lucide-react";
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
} from "@mui/material";
import StarRating from "../../../components/Stars";
import {
  LocationOn,
  Visibility,
  AttachMoney,
  Schedule,
  People,
} from "@mui/icons-material";

const HorizontalExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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

      fetchFavorites();
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

      onFavoriteToggle();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("La experiencia ya está en tus favoritos");
      } else {
        toast.error("Error al actualizar favoritos");
      }
      console.error("Error updating favorites:", error);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return "Gratis";
    // Convert Japanese Yen to Euros (approximate rate: 1 EUR = 160 JPY)
    const priceInEuros = (price / 160).toFixed(0);
    return `€${parseInt(priceInEuros).toLocaleString()}`;
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

  return (
    <Card
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: { xs: "auto", md: "280px" },
        borderRadius: "24px",
        overflow: "hidden",
        background: `linear-gradient(135deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.primary.main}03 100%)`,
        border: `2px solid ${theme.palette.primary.main}08`,
        boxShadow: "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "400px" },
          height: { xs: "240px", md: "280px" },
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Main Image */}
        <Box
          component="img"
          src={
            experience.photo
              ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
              : images.sampleExperienceImage
          }
          alt={experience.title}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "24px",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Category Badge */}
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
            "& .MuiChip-label": {
              paddingX: 1.5,
            },
          }}
        />
      </Box>

      {/* Content Section */}
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
          {" "}
          {/* Add padding to avoid overlap with favorite button */}
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

        {/* Action Section */}
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
          {/* Left side - View Details Button and Favorites Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              flex: 1,
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

            {/* Favorites Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.text.secondary,
              }}
            >
              <AiFillHeart size={16} color={theme.palette.primary.main} />
              <Typography variant="caption">
                {favoritesCount} popularidad
              </Typography>
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
              {experience.price === 0 ? (
                <> Gratis</>
              ) : (
                <>{formatPrice(experience.price)}</>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HorizontalExperienceCard;

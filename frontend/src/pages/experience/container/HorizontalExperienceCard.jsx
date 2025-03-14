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
import {
  IconButton,
  useTheme,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import StarRating from "../../../components/Stars"; // ⭐ Star Component
import "../../../css/Items/ItemsPage.css";

const HorizontalExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { palette } = useTheme();

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

  return (
    <Box
      className={`horizontal-experience-card flex flex-col md:flex-row  overflow-hidden rounded-xl  shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
      sx={{
        border: `1.75px solid ${palette.secondary.bg}`,
        backgroundColor: palette.background.default,
        borderRadius: "20px",
        padding: "0.5rem",
        gap: "1rem",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      {/* 📷 Image Section */}
      <Box className="w-full md:w-1/2 relative">
        <img
          src={
            experience.photo
              ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
              : images.sampleExperienceImage
          }
          alt={experience.title}
          className=" activity-image"
          style={{
            width: "350px",
            height: "200px",
            borderRadius: "16px",
          }}
        />

        {/* 🏷️ Category Badge */}
        <Chip
          label={experience.categories}
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: palette.secondary.dark,
            color: "white",
            fontSize: "0.75rem",
            height: "24px",
          }}
        />
      </Box>

      {/* 📄 Details Section */}
      <Box className="w-full p-4 flex flex-col justify-between">
        <div>
          {/* 🏷️ Title + 📍 Location */}
          <Typography
            variant="h4"
            sx={{
              color: palette.primary.main,
              fontWeight: "100",
              mt: 1,
              fontFamily: "Poppins !important",
            }}
          >
            {experience.title}{" "}
            <Chip
              label={experience.prefecture || "Sin ubicación"}
              sx={{
                background: palette.primary.light,
                color: palette.primary.main,
                marginLeft: "1rem",
                fontSize: "0.85rem",
              }}
            />
          </Typography>
          {/* 🌟 Rating */}
          <Box display="flex" alignItems="center" gap={0.5} marginTop={2}>
            {/* Smaller Stars */}
            <StarRating
              rating={experience.ratings || 0}
              isEditable={false}
              size={16}
            />

            {/* Smaller Text */}
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              {experience?.ratings?.toFixed(1) || "N/A"} (
              {experience?.numReviews || 0} Reseñas)
            </Typography>
          </Box>
          {/* 📝 Description */}
          <Typography sx={{ color: palette.text.secondary, mt: 1 }}>
            {experience.caption.length > 150
              ? `${experience.caption.substring(0, 150)}...`
              : experience.caption}
          </Typography>
        </div>

        {/* ❤️ Favorite + 🔗 Ver Más Buttons */}
        <Box display="flex" gap={2} alignItems="center" mt={2}>
          <Button
            variant="contained"
            sx={{
              border: `1px solid ${palette.primary.main}`,
              background: palette.primary.white,
              color: palette.primary.main,
              textTransform: "none",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0)",
              borderRadius: "10rem",
            }}
            component={Link}
            to={`/experience/${experience.slug}`}
          >
            Ver Detalles
          </Button>

          <Button
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: isFavorite
                ? palette.secondary.medium
                : palette.primary.main,
              color: palette.primary.white,
              textTransform: "none",
              borderRadius: "10rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isFavorite ? (
              <AiFillHeart size={24} />
            ) : (
              <AiOutlineHeart size={24} />
            )}
            {isFavorite ? "Agregado a Favoritos" : "Agregar a Favoritos"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HorizontalExperienceCard;

import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Box, Typography, Button, Chip } from "@mui/material";
import StarRating from "../components/Stars";
import { useTheme } from "@mui/material";
import { Landmark, Coins, Calendar } from "lucide-react";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  getUserFavorites,
} from "../services/index/favorites";
import { images, stables } from "../constants";

const ExperienceCard = ({
  experience,
  user,
  token,
  className,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
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
      className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
      sx={{
        position: "relative",
        paddingBottom: "20px",
      }}
    >
      {/* 🔹 Badges */}
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          zIndex: 1,
        }}
      >
        <Chip // 🔹 Icon for Category
          label={experience.categories}
          sx={{
            backgroundColor: theme.palette.secondary.medium,
            color: theme.palette.primary.white,
            fontSize: "0.75rem",
            height: "24px",
          }}
        />

        <Chip
          icon={<Coins size={16} color={theme.palette.primary.white} />} // 🔹 Icon for Budget
          label={experience.generalTags.budget}
          sx={{
            backgroundColor: theme.palette.neutral.main,
            color: theme.palette.primary.white,
            fontSize: "0.75rem",
            height: "24px",
          }}
        />
        <Chip
          icon={<Calendar size={16} color={theme.palette.primary.black} />}
          label={experience.generalTags.season}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.primary.black,
            fontSize: "0.75rem",
            height: "24px",
          }}
        ></Chip>
      </Box>

      {/* 🔹 Image */}
      <Box className="relative">
        <Link to={`/experience/${experience.slug}`}>
          <img
            src={
              experience.photo
                ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
                : images.sampleExperienceImage
            }
            alt={experience.title}
            className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
          />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 rounded-full focus:outline-none"
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          {isFavorite ? (
            <AiFillHeart className="text-white text-2xl" />
          ) : (
            <AiOutlineHeart className="text-white text-2xl" />
          )}
        </button>
      </Box>

      {/* 🔹 Content */}
      <Box className="p-5 text-center">
        {/* 🔹 Title */}
        <Link to={`/experience/${experience.slug}`}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {experience.title}{" "}
            <span
              style={{
                background: theme.palette.primary.light,
                color: theme.palette.primary.main,
              }}
              className="text-sm px-2 py-1 rounded-full"
            >
              {experience.region}
            </span>
          </Typography>
        </Link>

        {/* 🔹 Rating */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={2}
          gap={1}
          mb={2}
        >
          <StarRating rating={experience.ratings || 0} isEditable={false} />
          <Typography variant="body2">
            {experience?.ratings || "0"} ({experience?.numReviews} Reseñas)
          </Typography>
        </Box>

        {/* 🔹 Caption */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          {experience.caption}
        </Typography>

        {/* 🔹 "Ver Más" Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.white,
            borderRadius: "20px",
            textTransform: "none",
            marginTop: "15px",
          }}
          component={Link}
          to={`/experience/${experience.slug}`}
        >
          Ver Más
        </Button>
      </Box>
    </Box>
  );
};

export default ExperienceCard;

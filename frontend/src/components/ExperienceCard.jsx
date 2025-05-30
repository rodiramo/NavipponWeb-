import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Box, Typography, Button, Chip } from "@mui/material";
import StarRating from "../components/Stars";
import { useTheme } from "@mui/material";
import { Landmark, Coins, Calendar, MapPin } from "lucide-react";
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
        backgroundColor: theme.palette.background.alt,
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
          className="absolute top-3 right-3 group/heart w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{
            backgroundColor: theme.palette.primary.white,
          }}
        >
          {isFavorite ? (
            <AiFillHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.5rem" }}
              className="text-xl transition-transform duration-300 group-hover/heart:scale-125"
            />
          ) : (
            <AiOutlineHeart
              style={{ color: theme.palette.primary.main, fontSize: "1.5rem" }}
              className="text-white text-xl transition-transform duration-300 group-hover/heart:scale-125"
            />
          )}
        </button>
      </Box>

      {/* 🔹 Content */}
      <Box className="p-5 text-center">
        {/* 🔹 Title */}
        <Link to={`/experience/${experience.slug}`}>
          <Typography
            variant="h5"
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
            {experience.region && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${theme.palette.primary.main}10`,
                  color: theme.palette.primary.main,
                }}
              >
                <MapPin size={14} />
                <span>{experience.region}</span>
              </div>
            )}
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
        <div className="pt-2 mt-8">
          <Button
            component={Link}
            to={`/experience/${experience.slug}`}
            className="group/btn w-full relative overflow-hidden"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.white,
              borderRadius: "30rem",
              textTransform: "none",
              fontWeight: 600,
              width: "fit-content",
              fontSize: "1rem",
              py: 1.5,
              px: 4,
              boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                boxShadow: `0 12px 32px ${theme.palette.primary.main}40`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver Experiencia
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            {/* Button shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </div>
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default ExperienceCard;

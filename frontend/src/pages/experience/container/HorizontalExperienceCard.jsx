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
import { IconButton, useTheme, Typography } from "@mui/material";
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

  const borderColor = "#96C6D9";
  const titleColor = "#FF4A5A";
  const buttonColor = "#96C6D9";
  const likeColor = "#FF4A5A";

  return (
    <div
      className={`horizontal-experience-card flex flex-col md:flex-row bg-white rounded-lg overflow-hidden ${className}`}
      style={{
        border: `1.75px solid ${palette.secondary.light}`,
        backgroundColor: palette.background.default,
      }}
    >
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-2">
        <img
          src={
            experience.photo
              ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}`
              : images.sampleExperienceImage
          }
          alt={experience.title}
          className="object-cover rounded-lg activity-image"
        />
      </div>

      {/* Details Section */}
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
        <div>
          <Typography
            variant="h5"
            className="text-xl font-semibold activity-title"
            style={{ color: palette.primary.main }}
          >
            {experience.title}{" "}
            <span
              className="location-badge"
              style={{
                background: palette.primary.light,
                padding: "0.5rem",
                marginLeft: "1rem",
                borderRadius: "30px",
                fontSize: "1rem",
              }}
            >
              {experience.prefecture || "Sin ubicación"}
            </span>
          </Typography>

          <Typography
            className="text-md my-2 activity-description"
            style={{ color: palette.text.primary }}
          >
            {experience.caption.length > 150
              ? `${experience.caption.substring(0, 150)}...`
              : experience.caption}
          </Typography>

          <Typography
            className="text-sm"
            style={{ color: palette.secondary.main }}
          >
            {experience.categories}
          </Typography>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/experience/${experience.slug}`}
            className="px-4 py-2 rounded-full text-center"
            style={{
              backgroundColor: palette.secondary.main,
              color: palette.primary.white,
              textDecoration: "none",
            }}
          >
            Ver más
          </Link>

          <IconButton
            className="favorite"
            style={{
              backgroundColor: palette.primary.main,
              color: palette.primary.white,
            }}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <AiFillHeart size={24} />
            ) : (
              <AiOutlineHeart size={24} />
            )}
          </IconButton>
        </div>
      </div>

      {/* Price & Favorites */}
      <div className="hidden md:flex w-full md:w-1/5 p-4 flex-col justify-between items-center">
        <Typography
          className="text-xl font-bold"
          style={{ color: palette.primary.main }}
        >
          {experience.price ? `${experience.price} €` : "No disponible"}
        </Typography>
      </div>
    </div>
  );
};

export default HorizontalExperienceCard;

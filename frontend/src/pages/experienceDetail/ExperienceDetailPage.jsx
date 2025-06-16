import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import StarRating from "../../components/Stars";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import "leaflet/dist/leaflet.css"; // ✅ Required for Leaflet
import L from "leaflet";
import BgShape from "../../components/Shapes/BgShape.jsx";
import BreadcrumbBack from "../../components/BreadcrumbBack.jsx";
import ReviewsContainer from "../../components/reviews/ReviewsContainer";
import MainLayout from "../../components/MainLayout";
import { images, stables } from "../../constants";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

import { useQuery } from "@tanstack/react-query";
import {
  getAllExperiences,
  getSingleExperience,
} from "../../services/index/experiences";
import { useTheme } from "@mui/material";
import ExperienceDetailSkeleton from "./components/ExperienceDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import parseJsonToHtml from "../../utils/parseJsonToHtml";
import useUser from "../../hooks/useUser";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getUserFavorites,
} from "../../services/index/favorites";
import { Box, Typography } from "@mui/material";
import Aside from "./container/Aside";
import Hero from "./container/Hero";
import { Tabs, Tab } from "./container/Tabs";
import CarouselExperiences from "./container/CarouselExperiences";
import SuggestedExperiences from "./container/SuggestedExperiences";

// ✅ Fix Map Icons
const markerIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 95],
});

const ExperienceDetailPage = () => {
  const { slug } = useParams();
  const [isMapReady, setIsMapReady] = useState(false);
  const { user, jwt } = useUser();
  const [body, setBody] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = useTheme(true);

  const formatCategory = (category) => {
    const categoryMap = {
      restaurantes: "Restaurante",
      hoteles: "Hotel",
      atractivos: "Atractivo",
    };

    return categoryMap[category.toLowerCase()] || category; // Default to original if not found
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: async (data) => {
      // Debugging: Check what the API returns
      console.log("Raw API Response:", data);

      // Ensure `body` is correctly formatted before parsing
      if (data?.body) {
        try {
          // If `body` is a string, parse it into an object
          const parsedBody =
            typeof data.body === "string" ? JSON.parse(data.body) : data.body;

          console.log("Parsed Body for HTML:", parsedBody); // Debugging output
          setBody(parseJsonToHtml(parsedBody));
        } catch (error) {
          console.error("Error parsing JSON body:", error);
          setBody(null); // Prevent crashes by setting a fallback
        }
      } else {
        console.warn("No body content available.");
        setBody(null);
      }

      setIsMapReady(true); // Enable map after data loads

      if (user && jwt) {
        const favorites = await getUserFavorites({
          userId: user._id,
          token: jwt,
        });

        const isFav = favorites.some(
          (fav) => fav.experienceId && fav.experienceId._id === data._id
        );
        setIsFavorite(isFav);
      }
    },
  });

  const { data: ExperiencesData } = useQuery({
    queryFn: () => getAllExperiences(),
    queryKey: ["experiences"],
  });

  useEffect(() => {
    if (data && user && jwt) {
      getUserFavorites({ userId: user._id, token: jwt })
        .then((favorites) => {
          const isFav = favorites.some(
            (fav) => fav.experienceId && fav.experienceId._id === data._id
          );
          setIsFavorite(isFav);
        })
        .catch((error) =>
          console.error("Error fetching user favorites:", error)
        );
    }
  }, [user, jwt, data]);

  const handleShareClick = () => {
    const shareData = {
      title: "Mira esta experiencia",
      text: "Creo que te puede gustar esta experiencia. ¡Échale un vistazo!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("¡Compartido con éxito!"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("URL copiada al portapapeles"))
        .catch((error) => console.error("Error al copiar la URL:", error));
    }
  };

  const handleFavoriteClick = async () => {
    if (!user || !jwt) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteService({
          userId: user._id,
          experienceId: data._id,
          token: jwt,
        });
        setIsFavorite(false);
        toast.success("Se eliminó de favoritos");
      } else {
        await addFavoriteService({
          userId: user._id,
          experienceId: data._id,
          token: jwt,
        });
        setIsFavorite(true);
        toast.success("Se agregó a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <ExperienceDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <>
          <Hero
            imageUrl={
              data?.photo
                ? data.photo.startsWith("http")
                  ? data.photo
                  : stables.UPLOAD_FOLDER_BASE_URL + data.photo
                : images.sampleExperienceImage
            }
            imageAlt={data?.title}
          />
          <BgShape />
          <section className="container mx-auto px-5  py-5">
            <BreadcrumbBack />
            <div className="mt-4 flex gap-2">
              {Array.isArray(data?.categories) &&
                data.categories.map((category) => (
                  <Link
                    key={category}
                    to={`/experience?category=${category}`}
                    className="text-primary text-sm inline-block md:text-base"
                  >
                    {category}
                  </Link>
                ))}
            </div>
            <Box className="flex justify-between items-center">
              <h1
                className="text-3xl mb-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data?.title}{" "}
                <span
                  style={{
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  }}
                  className="text-sm px-2 py-1 rounded-full"
                >
                  {data?.region}, {data?.prefecture}
                </span>
              </h1>{" "}
              <div className="flex gap-5">
                <button
                  onClick={handleFavoriteClick}
                  style={{
                    background: isFavorite
                      ? theme.palette.secondary.main // ✅ Secondary color when favorited
                      : theme.palette.primary.main, // ✅ Primary color when not favorited
                    color: "white",
                    padding: "0.6rem 1rem",
                  }}
                  className="rounded-full focus:outline-none"
                >
                  <Typography
                    variant="h6"
                    className="text-white text-2xl flex items-center"
                  >
                    {isFavorite
                      ? "Agregado a Favoritos"
                      : "Agregar a Favoritos"}
                    {isFavorite ? (
                      <FavoriteIcon className="text-white text-2xl ml-2" />
                    ) : (
                      <FavoriteBorderOutlinedIcon className="text-white text-2xl ml-2" />
                    )}
                  </Typography>
                </button>{" "}
                <button
                  onClick={handleShareClick}
                  style={{
                    background: theme.palette.primary.main,
                    color: "white",
                    padding: "0.6rem 1rem",
                  }}
                  className="rounded-full focus:outline-none"
                >
                  <Typography
                    variant="h6"
                    className="text-white text-2xl flex items-center"
                  >
                    Compartir
                    <ShareOutlinedIcon className="text-white text-2xl ml-2" />
                  </Typography>
                </button>
              </div>
            </Box>

            {/* ⭐ Add Rating Here */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                {data?.ratings
                  ? `${data.ratings.toFixed(1)} / 5`
                  : "Sin calificaciones"}
              </Typography>
              <StarRating rating={data?.ratings || 0} isEditable={false} />

              {/* Display stars */}
              <Typography variant="body1" color="textSecondary">
                ({data?.numReviews || 0} reseñas)
              </Typography>
            </Box>
            <Tabs className="flex border-b">
              <Tab label="Descripción">
                <Box display="flex" flexDirection="column" minHeight="100vh">
                  <Box width="100%">
                    <Aside info={data} />
                  </Box>

                  <Box mt="auto" pt={5}>
                    <CarouselExperiences
                      header="Experiencias relacionadas"
                      experiences={ExperiencesData?.data}
                      currentExperience={data}
                    />
                  </Box>
                </Box>
              </Tab>

              <Tab
                label="Reseñas"
                className="group py-2 px-4 border-b-2 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:gap-x-5">
                  <div className="flex-1">
                    <ReviewsContainer
                      reviews={data?.reviews}
                      className="mt-10"
                      loggedInUserId={user?._id}
                      experienceSlug={slug}
                      jwt={jwt}
                      onReviewChange={refetch}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </section>
        </>
      )}
    </MainLayout>
  );
};

export default ExperienceDetailPage;

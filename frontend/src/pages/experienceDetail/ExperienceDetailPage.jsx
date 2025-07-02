import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import StarRating from "../../components/Stars";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import "leaflet/dist/leaflet.css";
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
import { useTheme, useMediaQuery } from "@mui/material";
import ExperienceDetailSkeleton from "./components/ExperienceDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import useUser from "../../hooks/useUser";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  getUserFavorites,
} from "../../services/index/favorites";
import { Box, Typography, Button } from "@mui/material";
import Aside from "./container/Aside";
import Hero from "./container/Hero";
import { Tabs, Tab } from "./container/Tabs";
import CarouselExperiences from "./container/CarouselExperiences";

const ExperienceDetailPage = () => {
  const { slug } = useParams();
  const { user, jwt } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = useTheme(true);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isDefaultImage = (photoUrl) => {
    return photoUrl && photoUrl.startsWith("https://images.unsplash.com");
  };

  const getImageUrl = () => {
    if (!data?.photo) return images.sampleExperienceImage;

    return data.photo.startsWith("http")
      ? data.photo
      : stables.UPLOAD_FOLDER_BASE_URL + data.photo;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: async (data) => {
      console.log("Raw API Response:", data);

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
          {/* Responsive Hero Section */}
          <Hero
            imageUrl={getImageUrl()}
            imageAlt={data?.title}
            isDefaultImage={isDefaultImage(data?.photo)}
            category={data?.categories}
            indicatorType={isMobile ? "corner" : "watermark"} // Different indicators for mobile
          />
          <BgShape />

          {/* Responsive Main Content */}
          <section
            className="container mx-auto px-5 py-5"
            style={{
              paddingLeft: isMobile ? "1rem" : "1.25rem",
              paddingRight: isMobile ? "1rem" : "1.25rem",
              paddingTop: isMobile ? "1rem" : "1.25rem",
              paddingBottom: isMobile ? "1rem" : "1.25rem",
            }}
          >
            <BreadcrumbBack />

            {/* Responsive Categories */}
            <div
              className="mt-4 flex gap-2"
              style={{
                flexWrap: "wrap",
                gap: isMobile ? "0.5rem" : "0.75rem",
              }}
            >
              {Array.isArray(data?.categories) &&
                data.categories.map((category) => (
                  <Link
                    key={category}
                    to={`/experience?category=${category}`}
                    className="text-primary text-sm inline-block md:text-base"
                    style={{
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      padding: isMobile ? "0.25rem 0.5rem" : "0.5rem 0.75rem",
                      backgroundColor: theme.palette.primary.light,
                      borderRadius: "20px",
                      textDecoration: "none",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {category}
                  </Link>
                ))}
            </div>

            {/* Responsive Title and Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: isMobile ? "flex-start" : "space-between",
                gap: isMobile ? 2 : 1,
                padding: 0,
                mb: 2,
              }}
            >
              {/* Responsive Title */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: isMobile ? 1 : 0,
                    fontSize: {
                      xs: "1.5rem",
                      sm: "1.75rem",
                      md: "2rem",
                      lg: "2.5rem",
                    },
                    lineHeight: 1.2,
                  }}
                >
                  {data?.title}
                </Typography>

                {/* Location Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                    px: isMobile ? 1.5 : 2,
                    py: isMobile ? 0.5 : 0.75,
                    borderRadius: "20px",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  {data?.region}, {data?.prefecture}
                </Box>
              </Box>

              {/* Responsive Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 1.5 : 2,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {/* Favorite Button */}
                <Button
                  onClick={handleFavoriteClick}
                  variant="contained"
                  sx={{
                    background: isFavorite
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                    color: "white",
                    borderRadius: "25px",
                    px: isMobile ? 2 : 3,
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      opacity: 0.9,
                    },
                    minWidth: isMobile ? "100%" : "auto",
                  }}
                  startIcon={
                    isFavorite ? (
                      <FavoriteIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    ) : (
                      <FavoriteBorderOutlinedIcon
                        sx={{ fontSize: isMobile ? 18 : 20 }}
                      />
                    )
                  }
                >
                  {isMobile
                    ? isFavorite
                      ? "En Favoritos"
                      : "Agregar a Favoritos"
                    : isFavorite
                      ? "Agregado a Favoritos"
                      : "Agregar a Favoritos"}
                </Button>

                {/* Share Button */}
                <Button
                  onClick={handleShareClick}
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    borderRadius: "25px",
                    px: isMobile ? 2 : 3,
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                      borderColor: theme.palette.primary.main,
                    },
                    minWidth: isMobile ? "100%" : "auto",
                  }}
                  startIcon={
                    <ShareOutlinedIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                  }
                >
                  Compartir
                </Button>
              </Box>
            </Box>

            {/* Responsive Rating Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 1 : 2,
                mb: 3,
                p: isMobile ? 2 : 0,
                backgroundColor: isMobile
                  ? theme.palette.background.default
                  : "transparent",
                borderRadius: isMobile ? 2 : 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                {data?.ratings
                  ? `${data.ratings.toFixed(1)} / 5`
                  : "Sin calificaciones"}
              </Typography>

              <StarRating
                rating={data?.ratings || 0}
                isEditable={false}
                size={isMobile ? 18 : 20}
              />

              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
              >
                ({data?.numReviews || 0} reseñas)
              </Typography>
            </Box>

            {/* Responsive Tabs */}
            <Tabs>
              <Tab label="Descripción">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: isMobile ? "auto" : "100vh",
                  }}
                >
                  <Box width="100%">
                    <Aside info={data} />
                  </Box>

                  <Box mt={isMobile ? 4 : "auto"} pt={5}>
                    <CarouselExperiences
                      header="Experiencias relacionadas"
                      experiences={ExperiencesData?.data}
                      currentExperience={data}
                    />
                  </Box>
                </Box>
              </Tab>

              <Tab label="Reseñas">
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

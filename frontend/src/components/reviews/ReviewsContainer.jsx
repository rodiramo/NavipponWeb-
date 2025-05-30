import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useTheme,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ArrowDownWideNarrow } from "lucide-react";
import PropTypes from "prop-types";
import Review from "./Review";
import ReviewForm from "./ReviewForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewReview,
  deleteReview,
  updateReview,
} from "../../services/index/reviews";
import { toast } from "react-hot-toast";
import useUser from "../../hooks/useUser";
import StarIcon from "@mui/icons-material/Star";

const ReviewsContainer = ({
  className,
  loggedInUserId,
  reviews = [],
  experienceSlug,
}) => {
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState("fecha-reciente");
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, jwt } = useUser();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);
  const [affectedReview, setAffectedReview] = useState(null);
  const theme = useTheme();

  // Sorting options
  const sortingOptions = [
    { value: "fecha-reciente", label: "Fecha Reciente" },
    { value: "fecha-antigua", label: "Fecha más Antigua" },
    { value: "best-rating", label: "Mejores Calificaciones" },
    { value: "worst-rating", label: "Peores Calificaciones" },
  ];

  // Sort reviews based on the selected option
  const sortReviews = (option, reviews) => {
    if (option === "fecha-reciente") {
      return reviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // Sort by newest date
    } else if (option === "fecha-antigua") {
      return reviews.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ); // Sort by oldest date
    } else if (option === "best-rating") {
      return reviews.sort((a, b) => b.rating - a.rating);
    } else if (option === "worst-rating") {
      return reviews.sort((a, b) => a.rating - b.rating);
    }
    return reviews;
  };

  // Handle sort button click
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle sort option selection
  const handleSortSelection = (value) => {
    setSortOption(value);
    setAnchorEl(null);
  };

  // Calculate average rating
  const validRatings = allReviews.filter((review) => review.rating != null);
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, review) => sum + review.rating, 0) /
        validRatings.length
      : 0;

  const { mutate: mutateNewReview, isLoading: isLoadingNewReview } =
    useMutation({
      mutationFn: ({
        token,
        rating,
        title,
        desc,
        slug,
        parent,
        replyOnUser,
      }) => {
        return createNewReview({
          token,
          rating,
          title: title,
          desc: desc,
          slug,
          parent,
          replyOnUser,
        });
      },
      onSuccess: () => {
        toast.success("Tu reseña se ha enviado con éxito");
        queryClient.invalidateQueries(["experience", experienceSlug]);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateReview } = useMutation({
    mutationFn: ({ token, rating, title, desc, reviewId }) => {
      return updateReview({ token, rating, title, desc, reviewId });
    },
    onSuccess: () => {
      toast.success("Tu reseña se ha actualizado correctamente");
      queryClient.invalidateQueries(["experience", experienceSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate: mutateDeleteReview } = useMutation({
    mutationFn: ({ token, reviewId }) => {
      return deleteReview({ token, reviewId });
    },
    onSuccess: () => {
      toast.success("Tu reseña se borró correctamente");
      queryClient.invalidateQueries(["experience", experienceSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const addReviewHandler = ({ rating, title, desc }) => {
    mutateNewReview({
      rating: rating,
      title: title,
      desc: desc,
      token: jwt,
      slug: experienceSlug,
    });
    setAffectedReview(null);
    setShowReviewForm(false);
  };

  const handleFormCancel = () => {
    console.log("Form canceled");
    setShowReviewForm(false);
  };

  const updateReviewHandler = ({ rating, title, desc, reviewId }) => {
    mutateUpdateReview({
      token: jwt,
      rating: rating,
      title: title,
      desc: desc,
      reviewId,
    });
    setAffectedReview(null);
  };

  const deleteReviewHandler = (reviewId) => {
    mutateDeleteReview({ token: jwt, reviewId });
  };

  // Sort the reviews based on the selected sort option
  const sortedReviews = sortReviews(sortOption, [...allReviews]);

  return (
    <div className={`${className}`}>
      {/* Header with Button and Sorting Dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h2">Todas las reseñas</Typography>

        <button
          className="py-2 px-4"
          style={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.white,
            borderRadius: "30rem",
          }}
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? "Cancelar" : "Escribir Reseña"}
        </button>
      </div>
      {showReviewForm && (
        <ReviewForm
          btnLabel="Enviar"
          formSubmitHandler={(rating, title, desc) =>
            addReviewHandler({ rating, title, desc })
          }
          loading={isLoadingNewReview}
        />
      )}
      {sortedReviews.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: theme.palette.secondary.medium }}
            >
              Promedio de Calificación
            </Typography>
            <Box
              sx={{
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h2">
                {averageRating.toFixed(1)} / 5
              </Typography>
              <StarIcon rating={averageRating} size={30} />
            </Box>
          </Box>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Typography
              variant="body2"
              className="text-gray-600 hidden sm:block"
            >
              Ordenar por:
            </Typography>
            <IconButton
              onClick={handleSortClick}
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "30px",
                padding: "8px",
              }}
            >
              <ArrowDownWideNarrow
                size={20}
                color={theme.palette.primary.main}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {sortingOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSortSelection(option.value)}
                  sx={{
                    fontSize: "0.875rem",
                    padding: "12px 20px",
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>
      )}

      {/* Reviews List */}
      <div
        className="space-y-4 mt-8"
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          marginBottom: "60px",
          marginTop: "20px",
        }}
      >
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Review
              key={review._id}
              review={review}
              loggedInUserId={loggedInUserId}
              affectedReview={affectedReview}
              setAffectedReview={setAffectedReview}
              addReview={addReviewHandler}
              formCancelHandler={handleFormCancel}
              updateReview={updateReviewHandler}
              deleteReview={deleteReviewHandler}
              replies={review.replies}
            />
          ))
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <img
              src="/assets/nothing-here.png"
              alt="nothing-here"
              style={{ width: "35%", marginRight: "1rem" }}
            />
            <Typography
              variant="h6"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
                color: theme.palette.secondary.medium,
              }}
            >
              No hay reseñas aún. ¡Sé el primero en escribir una!
            </Typography>
            <button
              className="py-2 px-4"
              style={{
                background: theme.palette.primary.main,
                color: theme.palette.primary.white,
                borderRadius: "30rem",
                marginBottom: "50px",
              }}
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancelar" : "Escribir Reseña"}
            </button>
          </Box>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;

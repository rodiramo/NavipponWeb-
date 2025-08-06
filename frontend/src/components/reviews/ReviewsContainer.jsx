import React, { useState, useEffect } from "react";

import { useTheme, Typography, Menu, MenuItem } from "@mui/material";
import { ArrowDownWideNarrow } from "lucide-react";

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
  onReviewChange,
}) => {
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState("fecha-reciente");
  const [anchorEl, setAnchorEl] = useState(null);
  const { jwt } = useUser();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);
  const [affectedReview, setAffectedReview] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    setAllReviews(reviews);
  }, [reviews]);

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
        if (onReviewChange) onReviewChange();
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
      if (onReviewChange) onReviewChange();
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
      if (onReviewChange) onReviewChange();
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
      {/* Header Section */}
      <div className=" rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <Typography variant="h4" className="font-bold  mb-2">
              Todas las reseñas
            </Typography>
            <Typography variant="body2">
              Descubre lo que otros usuarios opinan
            </Typography>
          </div>

          <button
            className="px-6 py-3 rounded-full font-medium text-white transition-all duration-200 hover:shadow-md active:scale-95 whitespace-nowrap"
            style={{
              backgroundColor: theme.palette.primary.main,
            }}
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancelar" : "Escribir reseña"}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          btnLabel="Enviar"
          formSubmitHandler={(rating, title, desc) =>
            addReviewHandler({ rating, title, desc })
          }
          formCancelHandler={handleFormCancel}
          loading={isLoadingNewReview}
        />
      )}

      {/* Statistics and Sorting */}
      {sortedReviews.length > 0 && (
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            {/* Average Rating Display */}
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="body2" className=" mb-2">
                  Promedio de Calificación
                </Typography>
                <div className="flex items-center gap-3">
                  <Typography
                    variant="h3"
                    className="font-bold"
                    style={{ color: theme.palette.primary.main }}
                  >
                    {averageRating.toFixed(1)}
                  </Typography>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <StarIcon
                        key={index}
                        sx={{
                          color:
                            index < Math.floor(averageRating)
                              ? theme.palette.primary.main
                              : "#e5e7eb",
                          fontSize: "1.5rem",
                        }}
                      />
                    ))}
                  </div>
                  <Typography variant="body2" className="text-gray-500 ml-2">
                    ({sortedReviews.length} reseña
                    {sortedReviews.length !== 1 ? "s" : ""})
                  </Typography>
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <Typography variant="body2" className=" hidden sm:block">
                Ordenar por:
              </Typography>
              <button
                onClick={handleSortClick}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowDownWideNarrow size={18} />
                <span className="text-sm ">
                  {
                    sortingOptions.find((opt) => opt.value === sortOption)
                      ?.label
                  }
                </span>
              </button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {sortingOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleSortSelection(option.value)}
                    selected={sortOption === option.value}
                    sx={{
                      fontSize: "0.875rem",
                      padding: "12px 20px",
                      "&.Mui-selected": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
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
          <div className="rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-200">
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <div className="w-48 h-48 mb-6 opacity-90">
                <img
                  src="/assets/nothing-here.png"
                  alt="No reviews yet"
                  className="w-full h-full object-contain"
                />
              </div>

              <Typography variant="h6" className="font-semibold mb-3">
                No hay reseñas aún
              </Typography>

              <Typography variant="body2" className=" mb-8 leading-relaxed">
                ¡Sé el primero en compartir tu experiencia! Tu opinión ayudará a
                otros usuarios a tomar mejores decisiones.
              </Typography>

              <button
                className="px-8 py-3 mt-4 rounded-full font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                style={{
                  color: theme.palette.primary.white,
                  backgroundColor: theme.palette.primary.main,
                }}
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancelar" : "Escribir primera reseña"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;

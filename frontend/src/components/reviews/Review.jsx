import React from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiTrash } from "react-icons/fi";
import ReviewForm from "./ReviewForm";
import { Avatar, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Review = ({
  review,
  loggedInUserId,
  affectedReview,
  setAffectedReview,
  updateReview,
  deleteReview,
}) => {
  const theme = useTheme();

  const reviewBelongsToUser = review.user._id === loggedInUserId;
  const isEditing =
    affectedReview &&
    affectedReview.type === "editing" &&
    affectedReview._id === review._id;

  return (
    <div
      className="flex flex-nowrap items-start gap-x-3 p-1 rounded-lg"
      style={{
        width: "80%",
        flexDirection: "column",
      }}
      id={`review-${review._id}`}
    >
      <div
        style={{
          width: "100%",
          background: theme.palette.background.bg,
          padding: "1rem",
          borderRadius: "1rem",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* User Avatar & Info */}
        <div
          className="flex"
          style={{
            marginLeft: "2rem",
            alignItems: "start",
            flexDirection: "column",
            width: "25%",
          }}
        >
          <Avatar
            src={
              review.user.avatar
                ? review.user.avatar
                : "/assets/default-avatar.png"
            }
            sx={{ width: 60, height: 60 }}
          />
          <h5 className="font-bold text-dark-hard text-xs lg:text-sm">
            @{review.user.name}
          </h5>
        </div>

        {/* Review Content */}
        <div style={{ width: "100%" }}>
          {!isEditing && (
            <div>
              {/* Star Rating */}
              <div className="font-opensans text-dark-light flex items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index}>
                    {index < Math.floor(review.rating) ? (
                      <StarIcon
                        style={{ color: theme.palette.primary.main }}
                        fontSize="1.5rem"
                      />
                    ) : index < review.rating ? (
                      <StarIcon
                        style={{ color: theme.palette.primary.main }}
                        fontSize="inherit"
                      />
                    ) : (
                      <StarIcon style={{ color: "grey" }} fontSize="inherit" />
                    )}
                  </span>
                ))}
              </div>
              {/* Review Title & Description */}
              <p
                className="font-opensans"
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  fontStyle: "italic",
                }}
              >
                {review.title}
              </p>
              <p
                className="font-opensans"
                style={{
                  color: theme.palette.secondary.medium,
                  fontStyle: "italic",
                  marginTop: "5px",
                }}
              >
                "{review.desc}"
              </p>
            </div>
          )}
          {/* Review Timestamp (Spanish Format) */}
          <span className="text-xs text-dark-light">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
              locale: es, // ✅ Spanish Locale
            })}
          </span>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-x-3 text-dark-light text-sm mt-3 mb-3">
          {reviewBelongsToUser && (
            <>
              <button
                className="flex items-center space-x-2"
                onClick={() =>
                  setAffectedReview({ type: "editing", _id: review._id })
                }
              >
                <FiEdit2 className="w-4 h-auto" />
                <span>Editar</span>
              </button>
              <button
                className="flex items-center space-x-2"
                onClick={() => deleteReview(review._id)}
              >
                <FiTrash className="w-4 h-auto" />
                <span>Eliminar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editing Form */}
      <div style={{ width: "100%" }}>
        {isEditing && (
          <ReviewForm
            btnLabel="Update"
            formSubmitHandler={(rating, title, desc) => {
              console.log("Updating review with ID:", review._id); // Debugging
              updateReview({ rating, title, desc, reviewId: review._id });
            }}
            formCancelHandler={() => setAffectedReview(null)}
            initialText={review.desc}
            initialTitle={review.title}
            initialRating={review.rating}
          />
        )}
      </div>
    </div>
  );
};

Review.propTypes = {
  review: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    rating: PropTypes.number,
    desc: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
  }).isRequired,
  loggedInUserId: PropTypes.string.isRequired,
  affectedReview: PropTypes.shape({
    type: PropTypes.string,
    _id: PropTypes.string,
  }),
  setAffectedReview: PropTypes.func.isRequired,
  updateReview: PropTypes.func.isRequired,
  deleteReview: PropTypes.func.isRequired,
};

export default Review;

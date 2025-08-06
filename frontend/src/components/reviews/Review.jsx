import React from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { Avatar, useTheme, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import stables from "../../constants/stables"; // Import your stables file

const Review = ({
  review,
  loggedInUserId,
  affectedReview,
  setAffectedReview,
  updateReview,
  deleteReview,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = React.useState(false);

  const reviewBelongsToUser = review.user._id === loggedInUserId;
  const isEditing =
    affectedReview &&
    affectedReview.type === "editing" &&
    affectedReview._id === review._id;

  // Navigate to user profile
  const handleUserProfileClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/profile/${review.user._id}`);
  };

  // Construct the full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/assets/default-avatar.png";

    // If avatar already contains full URL (starts with http), use as is
    if (avatar.startsWith("http")) {
      return avatar;
    }

    // Otherwise, construct the full URL using the base URL from stables
    return `${stables.UPLOAD_FOLDER_BASE_URL}${avatar}`;
  };

  const avatarUrl = getAvatarUrl(review.user.avatar);

  // Debug log to see what avatar URL we're getting
  React.useEffect(() => {
    console.log(
      "Avatar field for user:",
      review.user.name,
      ":",
      review.user.avatar
    );
    console.log("Constructed avatar URL:", avatarUrl);
    console.log("User object:", review.user);
    console.log("User verified status:", review.user.verified);
  }, [review.user.avatar, review.user.name, avatarUrl, review.user]);

  // Handle avatar load error
  const handleAvatarError = () => {
    console.log("Avatar failed to load:", avatarUrl);
    setAvatarError(true);
  };

  return (
    <div className="w-full mt-5 mx-auto  sm:p-4" id={`review-${review._id}`}>
      <div className="w-full rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        {/* Main Review Content */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* User Avatar & Info */}
          <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 flex-shrink-0">
            <div className="relative">
              <Avatar
                src={avatarError ? "/assets/default-avatar.png" : avatarUrl}
                onError={handleAvatarError}
                sx={{
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "3px solid white",
                }}
              />
            </div>
            <div
              className="text-center sm:text-left cursor-pointer group transition-all duration-200 "
              onClick={handleUserProfileClick}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "semibold",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  {review.user.name}
                </Typography>
                {review.user.verified && (
                  <Box
                    className="flex items-center"
                    title="Usuario verificado"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <ShieldCheck size={16} className="duration-200" />
                  </Box>
                )}
              </div>
              <span className="text-xs sm:text-sm  transition-colors duration-200">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            {!isEditing && (
              <div className="space-y-3">
                {/* Star Rating */}
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      style={{
                        color:
                          index < Math.floor(review.rating)
                            ? theme.palette.primary.main
                            : index < review.rating
                              ? theme.palette.primary.main
                              : "#e5e7eb",
                        fontSize: "1.5rem",
                      }}
                      className="drop-shadow-sm"
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium ">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="font-bold text-lg sm:text-xl  text-center sm:text-left break-words mb-3 leading-tight">
                  {review.title}
                </h3>

                {/* Review Description */}
                <blockquote
                  className="text-base sm:text-lg text-center sm:text-left break-words leading-relaxed pl-4 border-l-4 italic"
                  style={{
                    color: theme.palette.secondary.medium,
                    borderLeftColor: theme.palette.primary.main,
                  }}
                >
                  "{review.desc}"
                </blockquote>
              </div>
            )}
          </div>
        </div>

        {/* Edit & Delete Buttons */}
        {reviewBelongsToUser && (
          <div className="flex items-center justify-center sm:justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium  rounded-full transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-95"
              onClick={() =>
                setAffectedReview({ type: "editing", _id: review._id })
              }
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all duration-200 border border-red-200 hover:border-red-300 hover:shadow-sm active:scale-95"
              onClick={() => deleteReview(review._id)}
            >
              <FiTrash className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="w-full mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <ReviewForm
            btnLabel="Update"
            formSubmitHandler={(rating, title, desc) => {
              console.log("Updating review with ID:", review._id);
              updateReview({ rating, title, desc, reviewId: review._id });
            }}
            formCancelHandler={() => setAffectedReview(null)}
            initialText={review.desc}
            initialTitle={review.title}
            initialRating={review.rating}
          />
        </div>
      )}
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
      verified: PropTypes.bool,
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

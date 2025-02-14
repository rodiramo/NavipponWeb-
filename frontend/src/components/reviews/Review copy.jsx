import React from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { images, stables } from "../../constants";
import ReviewForm from "./ReviewForm";
import { Avatar, useTheme } from "@mui/material";
import useUser from "../../hooks/useUser";
import StarIcon from "@mui/icons-material/Star";
import { formatDistanceToNow } from "date-fns";

const Review = ({
  review,
  logginedUserId,
  affectedReview,
  setAffectedReview,
  updateReview,
  deleteReview,
}) => {
  const { jwt } = useUser();
  const theme = useTheme();
  const reviewBelongsToUser = logginedUserId === review.user._id;
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
      id={`review-${review?._id}`}
    >
      {" "}
      <div
        style={{
          width: "100%",
          background: theme.palette.primary.white,
          padding: "1rem",
          borderRadius: "1rem",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {" "}
        <div
          className=" flex"
          style={{
            marginLeft: "2rem",
            alignItems: "start",
            flexDirection: "column",
            width: "25%",
          }}
        >
          <img
            src={
              review?.user?.avatar
                ? stables.UPLOAD_FOLDER_BASE_URL + review.user.avatar
                : images.userImage
            }
            alt="user profile"
            className="w-9 h-9 object-cover rounded-full"
          />
          <div className="flex-1 flex flex-col">
            <h5 className="font-bold text-dark-hard text-xs lg:text-sm">
              {review.user.name}
            </h5>
            <span className="text-xs text-dark-light">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
              })}
            </span>
          </div>
        </div>
        {!isEditing && (
          <p className="font-opensans mt-[10px] text-dark-light">
            {review.desc}
          </p>
        )}
        {isEditing && (
          <ReviewForm
            btnLabel="Update"
            formSubmitHanlder={(value) => updateReview(value, review._id, jwt)}
            formCancelHandler={() => setAffectedReview(null)}
            initialText={review.desc}
          />
        )}
        {reviewBelongsToUser && (
          <div className="flex items-center gap-x-3 text-dark-light text-sm mt-3 mb-3">
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
              onClick={() => deleteReview(review._id, jwt)}
            >
              <FiTrash className="w-4 h-auto" />
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;

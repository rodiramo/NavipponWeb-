import React, { useState } from "react";
import { useSelector } from "react-redux";

import Review from "./Review";
import ReviewForm from "./ReviewForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewReview,
  deleteReview,
  updateReview,
} from "../../services/index/reviews";
import { toast } from "react-hot-toast";

const ReviewsContainer = ({
  className,
  logginedUserId,
  reviews,
  experienceSlug,
}) => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [affectedReview, setAffectedReview] = useState(null);

  const { mutate: mutateNewReview, isLoading: isLoadingNewReview } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return createNewReview({ token, desc, slug, parent, replyOnUser });
      },
      onSuccess: () => {
        toast.success(
          "Tu comentario se ha enviado con éxito, será visible tras la confirmación del Administrador"
        );
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateReview } = useMutation({
    mutationFn: ({ token, desc, reviewId }) => {
      return updateReview({ token, desc, reviewId });
    },
    onSuccess: () => {
      toast.success("Tu comentario se ha actualizado correctamente");
      queryClient.invalidateQueries(["experience", experienceSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate: mutateDeleteReview } = useMutation({
    mutationFn: ({ token, desc, reviewId }) => {
      return deleteReview({ token, reviewId });
    },
    onSuccess: () => {
      toast.success("Tu comentario se borró correctamente");
      queryClient.invalidateQueries(["experience", experienceSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const addReviewHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewReview({
      desc: value,
      parent,
      replyOnUser,
      token: userState.userInfo.token,
      slug: experienceSlug,
    });
    setAffectedReview(null);
  };

  const updateReviewHandler = (value, reviewId) => {
    mutateUpdateReview({
      token: userState.userInfo.token,
      desc: value,
      reviewId,
    });
    setAffectedReview(null);
  };

  const deleteReviewHandler = (reviewId) => {
    mutateDeleteReview({ token: userState.userInfo.token, reviewId });
  };

  return (
    <div className={`${className}`}>
      <ReviewForm
        btnLabel="Enviar"
        formSubmitHanlder={(value) => addReviewHandler(value)}
        loading={isLoadingNewReview}
      />
      <div className="space-y-4 mt-8">
        {reviews.map((review) => (
          <Review
            key={review._id}
            review={review}
            logginedUserId={logginedUserId}
            affectedReview={affectedReview}
            setAffectedReview={setAffectedReview}
            addReview={addReviewHandler}
            updateReview={updateReviewHandler}
            deleteReview={deleteReviewHandler}
            replies={review.replies}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsContainer;

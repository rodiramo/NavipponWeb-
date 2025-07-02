import React, { useState } from "react";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewComment,
  deleteComment,
  updateComment,
} from "../../services/index/comments";
import { toast } from "react-hot-toast";
import useUser from "../../hooks/useUser";

const CommentsContainer = ({
  className,
  logginedUserId,
  comments,
  postSlug,
}) => {
  const queryClient = useQueryClient();
  const { jwt } = useUser();
  const [affectedComment, setAffectedComment] = useState(null);

  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return createNewComment({ token, desc, slug, parent, replyOnUser });
      },
      onSuccess: () => {
        toast.success("Tu comentario se ha enviado con éxito");
        queryClient.invalidateQueries(["blog", postSlug]);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ token, desc, commentId }) => {
      return updateComment({ token, desc, commentId });
    },
    onSuccess: () => {
      toast.success("Tu comentario se ha actualizado correctamente");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ token, commentId }) => {
      return deleteComment({ token, commentId });
    },
    onSuccess: () => {
      toast.success("Tu comentario se borró correctamente");
      queryClient.invalidateQueries(["blog", postSlug]);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    if (!jwt) {
      toast.error("Debes estar autenticado para agregar un comentario");
      return;
    }
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: jwt,
      slug: postSlug,
    });
    setAffectedComment(null);
  };

  const updateCommentHandler = (value, commentId) => {
    if (!jwt) {
      toast.error("Debes estar autenticado para actualizar un comentario");
      return;
    }
    mutateUpdateComment({
      token: jwt,
      desc: value,
      commentId,
    });
    setAffectedComment(null);
  };

  const deleteCommentHandler = (commentId) => {
    if (!jwt) {
      toast.error("Debes estar autenticado para eliminar un comentario");
      return;
    }
    mutateDeleteComment({ token: jwt, commentId });
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Enviar"
        formSubmitHanlder={(value) => addCommentHandler(value)}
        loading={isLoadingNewComment}
      />
      <div className="space-y-4 mt-8">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsContainer;

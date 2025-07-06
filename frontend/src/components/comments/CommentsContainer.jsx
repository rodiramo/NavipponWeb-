import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";
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
  const theme = useTheme();
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
    <Box
      className={className}
      sx={{
        width: "100%",
        mt: { xs: 4, md: 6 },
      }}
    >
      {/* Comments Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            backgroundColor: theme.palette.primary.light,
            borderRadius: "12px",
          }}
        >
          <ChatBubbleOutline
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.2,
            }}
          >
            Comentarios
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {comments?.length || 0}{" "}
            {comments?.length === 1 ? "comentario" : "comentarios"}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          mb: 4,
          borderColor: theme.palette.divider,
        }}
      />

      {/* Comment Form */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Únete a la conversación
        </Typography>
        <CommentForm
          btnLabel="Enviar comentario"
          formSubmitHanlder={(value) => addCommentHandler(value)}
          loading={isLoadingNewComment}
        />
      </Paper>

      {/* Comments List */}
      <Box
        sx={{
          position: "relative",
        }}
      >
        {comments?.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
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
          </Box>
        ) : (
          /* Empty State */
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: theme.palette.background.blue,
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <ChatBubbleOutline
              sx={{
                fontSize: { xs: 48, sm: 64 },
                color: theme.palette.text.disabled,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.125rem" },
              }}
            >
              Sé el primero en comentar
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              Comparte tus pensamientos sobre este artículo y comienza una
              conversación
            </Typography>
          </Paper>
        )}

        {/* Loading State */}
        {isLoadingNewComment && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 3,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              }}
            >
              <CircularProgress size={24} />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Enviando comentario...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentsContainer;

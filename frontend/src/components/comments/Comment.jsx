import React from "react";
import {
  useTheme,
  Avatar,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { FiMessageSquare, FiEdit2, FiTrash } from "react-icons/fi";

import { images, stables } from "../../constants";
import CommentForm from "./CommentForm";
import useUser from "../../hooks/useUser";

const Comment = ({
  comment,
  logginedUserId,
  affectedComment,
  setAffectedComment,
  addComment,
  parentId = null,
  updateComment,
  deleteComment,
  replies,
}) => {
  const { jwt } = useUser();
  const theme = useTheme();

  const isUserLoggined = Boolean(logginedUserId);
  const commentBelongsToUser = logginedUserId === comment.user._id;
  const isReplying =
    affectedComment &&
    affectedComment.type === "replying" &&
    affectedComment._id === comment._id;
  const isEditing =
    affectedComment &&
    affectedComment.type === "editing" &&
    affectedComment._id === comment._id;
  const repliedCommentId = parentId ? parentId : comment._id;
  const replyOnUserId = comment.user._id;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        gap: 2,
        bgcolor: theme.palette.background.bg,
        p: 2,
        borderRadius: "10px",
        mb: 2,
      }}
      id={`comment-${comment?._id}`}
    >
      {/* User Avatar */}
      <Avatar
        src={
          comment?.user?.avatar
            ? stables.UPLOAD_FOLDER_BASE_URL + comment.user.avatar
            : images.userImage
        }
        alt={comment.user.name}
        sx={{ width: 40, height: 40 }}
      />

      <Box sx={{ flex: 1 }}>
        {/* User Name & Date */}
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          {comment.user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(comment.createdAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
          })}
        </Typography>

        {/* Comment Text */}
        {!isEditing && (
          <Typography
            variant="body2"
            sx={{ mt: 1, color: theme.palette.text.primary }}
          >
            {comment.desc}
          </Typography>
        )}

        {/* Edit Comment Form */}
        {isEditing && (
          <CommentForm
            btnLabel="Actualizar"
            formSubmitHanlder={(value) =>
              updateComment(value, comment._id, jwt)
            }
            formCancelHandler={() => setAffectedComment(null)}
            initialText={comment.desc}
          />
        )}

        {/* Actions: Reply, Edit, Delete */}
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {isUserLoggined && (
            <Button
              size="small"
              startIcon={<FiMessageSquare />}
              sx={{ textTransform: "none", color: theme.palette.primary.main }}
              onClick={() =>
                setAffectedComment({ type: "replying", _id: comment._id })
              }
            >
              Responder
            </Button>
          )}
          {commentBelongsToUser && (
            <>
              <Button
                size="small"
                startIcon={<FiEdit2 />}
                sx={{
                  textTransform: "none",
                  color: theme.palette.secondary.main,
                }}
                onClick={() =>
                  setAffectedComment({ type: "editing", _id: comment._id })
                }
              >
                Editar
              </Button>
              <Button
                size="small"
                startIcon={<FiTrash />}
                sx={{ textTransform: "none", color: theme.palette.error.main }}
                onClick={() => deleteComment(comment._id, jwt)}
              >
                Eliminar
              </Button>
            </>
          )}
        </Box>

        {/* Reply Form */}
        {isReplying && (
          <Box sx={{ mt: 2 }}>
            <CommentForm
              btnLabel="Responder"
              formSubmitHanlder={(value) =>
                addComment(value, repliedCommentId, replyOnUserId, jwt)
              }
              formCancelHandler={() => setAffectedComment(null)}
            />
          </Box>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pl: 3,
              borderLeft: `2px solid ${theme.palette.divider}`,
            }}
          >
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                addComment={addComment}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                comment={reply}
                deleteComment={deleteComment}
                logginedUserId={logginedUserId}
                replies={[]}
                updateComment={updateComment}
                parentId={comment._id}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;

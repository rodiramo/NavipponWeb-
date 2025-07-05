import React, { useState } from "react";
import {
  useTheme,
  Avatar,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  useMediaQuery,
  Fade,
  Collapse,
} from "@mui/material";
import { Reply, Edit, Delete, Schedule } from "@mui/icons-material";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showActions, setShowActions] = useState(false);

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

  const isReply = Boolean(parentId);
  const hasReplies = replies && replies.length > 0;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Hace unos minutos";
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `Hace ${days} día${days > 1 ? "s" : ""}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <Box
      id={`comment-${comment?._id}`}
      sx={{
        width: "100%",
        mb: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={isReply ? 0 : 1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: isReply
            ? theme.palette.grey[50]
            : theme.palette.background.default,
          border: isReply
            ? `1px solid ${theme.palette.divider}`
            : `1px solid transparent`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: isReply ? theme.shadows[2] : theme.shadows[4],
            borderColor: isReply
              ? theme.palette.primary.light
              : theme.palette.primary.main,
          },
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header with User Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
            >
              <Avatar
                src={
                  comment?.user?.avatar
                    ? stables.UPLOAD_FOLDER_BASE_URL + comment.user.avatar
                    : images.userImage
                }
                alt={comment.user.name}
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  border: `2px solid ${theme.palette.primary.light}`,
                  boxShadow: theme.shadows[2],
                }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    {comment.user.name}
                  </Typography>

                  {commentBelongsToUser && (
                    <Chip
                      label="Tú"
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        fontSize: "0.65rem",
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule
                    sx={{ fontSize: 14, color: theme.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions Menu - Desktop */}
            {!isMobile && (
              <Fade in={showActions || isEditing || isReplying}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {isUserLoggined && (
                    <Tooltip title="Responder">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setAffectedComment({
                            type: "replying",
                            _id: comment._id,
                          })
                        }
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}12`,
                          },
                        }}
                      >
                        <Reply sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {commentBelongsToUser && (
                    <>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setAffectedComment({
                              type: "editing",
                              _id: comment._id,
                            })
                          }
                          sx={{
                            color: theme.palette.secondary.medium,
                            "&:hover": {
                              backgroundColor: `${theme.palette.secondary.main}12`,
                            },
                          }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => deleteComment(comment._id, jwt)}
                          sx={{
                            color: theme.palette.error.main,
                            "&:hover": {
                              backgroundColor: `${theme.palette.error.main}12`,
                            },
                          }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Fade>
            )}
          </Box>

          {/* Comment Content */}
          {!isEditing && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.6,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {comment.desc}
              </Typography>
            </Box>
          )}

          {/* Edit Form */}
          {isEditing && (
            <Box sx={{ mb: 2 }}>
              <CommentForm
                btnLabel="Actualizar"
                formSubmitHanlder={(value) =>
                  updateComment(value, comment._id, jwt)
                }
                formCancelHandler={() => setAffectedComment(null)}
                initialText={comment.desc}
              />
            </Box>
          )}

          {/* Mobile Actions */}
          {isMobile && (isUserLoggined || commentBelongsToUser) && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: isReplying ? 2 : 0,
              }}
            >
              {isUserLoggined && (
                <Button
                  size="small"
                  startIcon={<Reply sx={{ fontSize: 16 }} />}
                  onClick={() =>
                    setAffectedComment({ type: "replying", _id: comment._id })
                  }
                  sx={{
                    textTransform: "none",
                    color: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}08`,
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    py: 0.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}16`,
                    },
                  }}
                >
                  Responder
                </Button>
              )}

              {commentBelongsToUser && (
                <>
                  <Button
                    size="small"
                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                    onClick={() =>
                      setAffectedComment({ type: "editing", _id: comment._id })
                    }
                    sx={{
                      textTransform: "none",
                      color: theme.palette.secondary.medium,
                      backgroundColor: `${theme.palette.secondary.main}08`,
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      py: 0.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: `${theme.palette.secondary.main}16`,
                      },
                    }}
                  >
                    Editar
                  </Button>

                  <Button
                    size="small"
                    startIcon={<Delete sx={{ fontSize: 16 }} />}
                    onClick={() => deleteComment(comment._id, jwt)}
                    sx={{
                      textTransform: "none",
                      color: theme.palette.error.main,
                      backgroundColor: `${theme.palette.error.main}08`,
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      py: 0.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: `${theme.palette.error.main}16`,
                      },
                    }}
                  >
                    Eliminar
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Reply Form */}
          <Collapse in={isReplying}>
            <Box sx={{ mt: 2 }}>
              <CommentForm
                btnLabel="Responder"
                formSubmitHanlder={(value) =>
                  addComment(value, repliedCommentId, replyOnUserId, jwt)
                }
                formCancelHandler={() => setAffectedComment(null)}
              />
            </Box>
          </Collapse>
        </Box>

        {/* Replies Section */}
        {hasReplies && (
          <Box>
            <Divider sx={{ borderColor: theme.palette.divider }} />
            <Box
              sx={{
                pl: { xs: 2, sm: 4 },
                pr: { xs: 2, sm: 3 },
                py: 2,
                backgroundColor: `${theme.palette.primary.main}04`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: { xs: 16, sm: 24 },
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.black,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  mb: 2,
                  ml: 3,
                  display: "block",
                }}
              >
                {replies.length} respuesta {replies.length > 1 ? "s" : ""}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Comment;

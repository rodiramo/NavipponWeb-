import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteComment,
  getAllComments,
  updateComment,
} from "../../../../services/index/comments";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import {
  Trash2,
  Calendar,
  User,
  MessageCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Reply,
  FileText,
} from "lucide-react";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";

const Comments = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    currentPage,
    searchKeyword,
    data: commentsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllComments(jwt, searchKeyword, currentPage),
    dataQueryKey: "comments",
    deleteDataMessage: "Comentario eliminado",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteComment({
        commentId: slug,
        token,
      });
    },
  });

  const { mutate: mutateUpdateCommentCheck } = useMutation({
    mutationFn: ({ token, check, commentId }) => {
      return updateComment({ token, check, commentId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
      toast.success(
        data?.check ? "Comentario aprobado" : "Comentario desaprobado"
      );
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  // Mobile Card Component
  const CommentCard = ({ comment }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.neutral.light}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Comment Header - Author and Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                comment?.user?.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + comment?.user?.avatar
                  : images.userImage
              }
              alt={comment?.user?.name}
              sx={{
                width: 48,
                height: 48,
                mr: 2,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                }}
              >
                {comment?.user?.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <User
                  size={14}
                  style={{
                    marginRight: 4,
                    color: theme.palette.neutral.medium,
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  Autor del comentario
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            size="small"
            label={comment?.check ? "Aprobado" : "Pendiente"}
            color={comment?.check ? "success" : "warning"}
            variant="filled"
            sx={{
              backgroundColor: comment?.check
                ? theme.palette.success.main
                : theme.palette.warning.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Reply Context */}
        {comment?.replyOnUser !== null && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Reply
                size={16}
                style={{ marginRight: 8, color: theme.palette.secondary.main }}
              />
              <Typography variant="body2" color="textSecondary">
                En respuesta a:
              </Typography>
            </Box>
            <Button
              component={Link}
              to={`/blog/${comment?.post?.slug}/#comment-${comment?._id}`}
              endIcon={<ExternalLink size={14} />}
              sx={{
                color: theme.palette.secondary.main,
                textTransform: "none",
                fontWeight: "bold",
                padding: 0,
                minHeight: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              {comment?.replyOnUser?.name}
            </Button>
          </Box>
        )}

        {/* Comment Content */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <MessageCircle
              size={16}
              style={{ marginRight: 8, color: theme.palette.neutral.medium }}
            />
            <Typography variant="body2" color="textSecondary">
              Comentario:
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              padding: 2,
              borderRadius: 1,
              fontStyle: "italic",
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            "{comment?.desc}"
          </Typography>
        </Box>

        {/* Post Reference */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <FileText
              size={16}
              style={{ marginRight: 8, color: theme.palette.primary.main }}
            />
            <Typography variant="body2" color="textSecondary">
              En respuesta al post:
            </Typography>
          </Box>
          <Button
            component={Link}
            to={`/blog/${comment?.post?.slug}`}
            endIcon={<ExternalLink size={14} />}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              fontWeight: "bold",
              padding: 0,
              minHeight: "auto",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              {comment?.post?.title}
            </Typography>
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date and Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Calendar
              size={16}
              style={{ marginRight: 8, color: theme.palette.neutral.medium }}
            />
            <Typography variant="body2" color="textSecondary">
              {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Approval Toggle */}
            <Tooltip
              title={
                comment?.check ? "Desaprobar comentario" : "Aprobar comentario"
              }
            >
              <IconButton
                disabled={isLoadingDeleteData}
                onClick={() =>
                  mutateUpdateCommentCheck({
                    token: jwt,
                    check: comment?.check ? false : true,
                    commentId: comment._id,
                  })
                }
                sx={{
                  backgroundColor: comment?.check
                    ? theme.palette.success.lightest
                    : theme.palette.warning.lightest,
                  color: comment?.check
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
                  "&:hover": {
                    backgroundColor: comment?.check
                      ? theme.palette.success.light
                      : theme.palette.warning.light,
                    transform: "scale(1.05)",
                  },
                }}
              >
                {comment?.check ? (
                  <CheckCircle size={18} />
                ) : (
                  <XCircle size={18} />
                )}
              </IconButton>
            </Tooltip>

            {/* Delete Button */}
            <Button
              disabled={isLoadingDeleteData}
              startIcon={<Trash2 size={16} />}
              onClick={() =>
                deleteDataHandler({ slug: comment?._id, token: jwt })
              }
              sx={{
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.lightest,
                  borderColor: theme.palette.error.dark,
                },
              }}
              variant="outlined"
              size="small"
            >
              Borrar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
      }}
    >
      <DataTable
        pageTitle="Administrar Comentarios"
        dataListName="Comentarios"
        searchInputPlaceHolder="Buscar comentarios..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile
            ? []
            : [
                "Autor",
                "Comentario",
                "En respuesta a",
                "Creado",
                "Estado",
                "Acciones",
              ]
        }
        isFetching={isFetching}
        isLoading={isLoading}
        data={commentsData?.data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={commentsData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {commentsData?.data.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout
          commentsData?.data.map((comment) => (
            <tr
              key={comment._id}
              style={{
                backgroundColor: theme.palette.background.default,
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              {/* Author */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      comment?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + comment?.user?.avatar
                        : images.userImage
                    }
                    alt={comment?.user?.name}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    >
                      {comment?.user?.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <User
                        size={14}
                        style={{
                          marginRight: 4,
                          color: theme.palette.neutral.medium,
                        }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Autor
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </td>

              {/* Comment and Reply */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "300px",
                }}
              >
                <Box>
                  {comment?.replyOnUser !== null && (
                    <Box sx={{ mb: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Reply
                          size={14}
                          style={{
                            marginRight: 4,
                            color: theme.palette.secondary.main,
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          En respuesta a:
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={`/blog/${comment?.post?.slug}/#comment-${comment?._id}`}
                        sx={{
                          color: theme.palette.secondary.main,
                          textTransform: "none",
                          fontWeight: "bold",
                          padding: 0,
                          minHeight: "auto",
                          fontSize: "0.875rem",
                          "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {comment?.replyOnUser?.name}
                      </Button>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <MessageCircle
                      size={16}
                      style={{
                        marginRight: 8,
                        marginTop: 2,
                        color: theme.palette.neutral.medium,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontStyle: "italic",
                      }}
                    >
                      "{comment?.desc}"
                    </Typography>
                  </Box>
                </Box>
              </td>

              {/* Post Title */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "250px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FileText
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Button
                    component={Link}
                    to={`/blog/${comment?.post?.slug}`}
                    endIcon={<ExternalLink size={12} />}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: "bold",
                      padding: 0,
                      minHeight: "auto",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textAlign: "left",
                      }}
                    >
                      {comment?.post?.title}
                    </Typography>
                  </Button>
                </Box>
              </td>

              {/* Created Date */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                  <Typography variant="body2" color="textPrimary">
                    {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Typography>
                </Box>
              </td>

              {/* Approval Status */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Stack direction="column" spacing={1} alignItems="center">
                  <Tooltip
                    title={
                      comment?.check
                        ? "Click para desaprobar"
                        : "Click para aprobar"
                    }
                  >
                    <IconButton
                      disabled={isLoadingDeleteData}
                      onClick={() =>
                        mutateUpdateCommentCheck({
                          token: jwt,
                          check: comment?.check ? false : true,
                          commentId: comment._id,
                        })
                      }
                      sx={{
                        backgroundColor: comment?.check
                          ? theme.palette.success.lightest
                          : theme.palette.warning.lightest,
                        color: comment?.check
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        width: 48,
                        height: 48,
                        "&:hover": {
                          backgroundColor: comment?.check
                            ? theme.palette.success.light
                            : theme.palette.warning.light,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {comment?.check ? (
                        <CheckCircle size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Chip
                    size="small"
                    label={comment?.check ? "Aprobado" : "Pendiente"}
                    color={comment?.check ? "success" : "warning"}
                    variant="outlined"
                  />
                </Stack>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Button
                  disabled={isLoadingDeleteData}
                  startIcon={<Trash2 size={16} />}
                  onClick={() =>
                    deleteDataHandler({ slug: comment?._id, token: jwt })
                  }
                  sx={{
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    textTransform: "none",
                    borderRadius: 30,
                    "&:hover": {
                      backgroundColor: theme.palette.error.lightest,
                      borderColor: theme.palette.error.dark,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  variant="outlined"
                  size="small"
                >
                  Borrar
                </Button>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </Box>
  );
};

export default Comments;

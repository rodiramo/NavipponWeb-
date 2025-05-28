import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteReview,
  getAllReviews,
  updateReview,
} from "../../../../services/index/reviews";
import DataTable from "../../components/DataTable";
import { images, stables } from "../../../../constants";
import { Link } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import {
  Trash2,
  Calendar,
  User,
  Star,
  CheckCircle,
  XCircle,
  ExternalLink,
  MessageSquare,
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
  Rating,
} from "@mui/material";

const Reviews = () => {
  const { jwt } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    currentPage,
    searchKeyword,
    data: reviewsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllReviews(jwt, searchKeyword, currentPage),
    dataQueryKey: "reviews",
    deleteDataMessage: "Reseña eliminada",
    mutateDeleteFn: ({ slug, token }) => {
      return deleteReview({ reviewId: slug, token });
    },
  });

  const { mutate: mutateUpdateReviewCheck } = useMutation({
    mutationFn: ({ token, check, reviewId }) => {
      return updateReview({ token, check, reviewId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success(data?.check ? "Reseña aprobada" : "Reseña desaprobada");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  // Mobile Card Component
  const ReviewCard = ({ review }) => (
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
        {/* Review Header - Author and Status */}
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
                review?.user?.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + review?.user?.avatar
                  : images.userImage
              }
              alt={review?.user?.name}
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
                {review?.user?.name}
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
                  Autor de la reseña
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            size="small"
            label={review?.check ? "Aprobada" : "Pendiente"}
            color={review?.check ? "success" : "warning"}
            variant="filled"
            sx={{
              backgroundColor: review?.check
                ? theme.palette.success.main
                : theme.palette.warning.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Experience Link */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Star
              size={16}
              style={{ marginRight: 8, color: theme.palette.primary.main }}
            />
            <Typography variant="body2" color="textSecondary">
              Reseña para:
            </Typography>
          </Box>
          <Button
            component={Link}
            to={`/experience/${review?.experience?.slug}`}
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
            {review?.experience?.title}
          </Button>
        </Box>

        {/* Review Content */}
        {review?.desc && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MessageSquare
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
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              "{review.desc}"
            </Typography>
          </Box>
        )}

        {/* Rating if available */}
        {review?.rating && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
              Calificación:
            </Typography>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1, fontWeight: "bold" }}>
              {review.rating}/5
            </Typography>
          </Box>
        )}

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
              {new Date(review.createdAt).toLocaleDateString("es-ES", {
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
              title={review?.check ? "Desaprobar reseña" : "Aprobar reseña"}
            >
              <IconButton
                disabled={isLoadingDeleteData}
                onClick={() =>
                  mutateUpdateReviewCheck({
                    token: jwt,
                    check: review?.check ? false : true,
                    reviewId: review._id,
                  })
                }
                sx={{
                  backgroundColor: review?.check
                    ? theme.palette.success.lightest
                    : theme.palette.warning.lightest,
                  color: review?.check
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
                  "&:hover": {
                    backgroundColor: review?.check
                      ? theme.palette.success.light
                      : theme.palette.warning.light,
                    transform: "scale(1.05)",
                  },
                }}
              >
                {review?.check ? (
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
                deleteDataHandler({ slug: review?._id, token: jwt })
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
        pageTitle=""
        dataListName="Administrar Reseñas"
        searchInputPlaceHolder="Buscar reseñas..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile
            ? []
            : ["Autor", "Experiencia", "Creado", "Estado", "Acciones"]
        }
        isFetching={isFetching}
        isLoading={isLoading}
        data={reviewsData?.data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={reviewsData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {reviewsData?.data.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout
          reviewsData?.data.map((review) => (
            <tr
              key={review._id}
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
                      review?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + review?.user?.avatar
                        : images.userImage
                    }
                    alt={review?.user?.name}
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
                      {review?.user?.name}
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

              {/* Experience */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "300px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Star
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Box>
                    <Button
                      component={Link}
                      to={`/experience/${review?.experience?.slug}`}
                      endIcon={<ExternalLink size={14} />}
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
                        {review?.experience?.title}
                      </Typography>
                    </Button>
                    {review?.rating && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ({review.rating})
                        </Typography>
                      </Box>
                    )}
                  </Box>
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
                    {new Date(review.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
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
                      review?.check
                        ? "Click para desaprobar"
                        : "Click para aprobar"
                    }
                  >
                    <IconButton
                      disabled={isLoadingDeleteData}
                      onClick={() =>
                        mutateUpdateReviewCheck({
                          token: jwt,
                          check: review?.check ? false : true,
                          reviewId: review._id,
                        })
                      }
                      sx={{
                        backgroundColor: review?.check
                          ? theme.palette.success.lightest
                          : theme.palette.warning.lightest,
                        color: review?.check
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        width: 48,
                        height: 48,
                        "&:hover": {
                          backgroundColor: review?.check
                            ? theme.palette.success.light
                            : theme.palette.warning.light,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {review?.check ? (
                        <CheckCircle size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Chip
                    size="small"
                    label={review?.check ? "Aprobada" : "Pendiente"}
                    color={review?.check ? "success" : "warning"}
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
                    deleteDataHandler({ slug: review?._id, token: jwt })
                  }
                  sx={{
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
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

export default Reviews;

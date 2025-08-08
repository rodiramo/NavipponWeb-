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
  useMediaQuery,
  Tooltip,
  Stack,
  Rating,
  TableRow,
  TableCell,
} from "@mui/material";

const Reviews = () => {
  // Fix 1: Use consistent destructuring - use 'user' instead of 'userInfo'
  const { jwt, user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  console.log("🔍 Debug - User info:", {
    user,
    jwt: jwt ? "Present" : "Missing",
    isAdmin: user?.admin,
  });

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
    DeleteConfirmationDialog,
  } = useDataTable({
    dataQueryFn: () => getAllReviews(jwt, searchKeyword, currentPage),
    dataQueryKey: "reviews",
    deleteDataMessage: "Reseña eliminada",
    // Fix 2: Ensure token is properly passed to delete function
    mutateDeleteFn: ({ slug, token }) => {
      console.log("🗑️ DEBUG - Delete function called:", {
        reviewId: slug,
        token: token ? "Present" : "Missing",
        actualToken: token,
      });
      return deleteReview({ reviewId: slug, token: token || jwt });
    },
  });

  // Fix 3: Enhanced delete handler with better debugging
  const handleDeleteReview = async (reviewId) => {
    try {
      console.log("🗑️ Delete review attempt:", {
        reviewId,
        user,
        isAdmin: user?.admin,
        jwt: jwt ? "Present" : "Missing",
      });

      // Check if user is admin
      if (!user?.admin) {
        toast.error(
          "No tienes permisos de administrador para eliminar reseñas"
        );
        return;
      }

      // Check if JWT token exists
      if (!jwt) {
        toast.error(
          "Token de autenticación no encontrado. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      // Call the delete handler with proper parameters
      await deleteDataHandler({ slug: reviewId, token: jwt });
      console.log("✅ Delete successful");
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      toast.error(`Error al eliminar la reseña: ${error.message}`);
    }
  };

  // Fix 4: Enhanced approval mutation with better error handling
  const { mutate: mutateUpdateReviewCheck, isLoading: isUpdatingReview } =
    useMutation({
      mutationFn: ({ token, check, reviewId }) => {
        console.log("✅ DEBUG - Update review check:", {
          reviewId,
          check,
          token: token ? "Present" : "Missing",
          actualToken: token,
        });
        return updateReview({ token: token || jwt, check, reviewId });
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["reviews"]);
        const action = variables.check ? "aprobada" : "desaprobada";
        toast.success(`Reseña ${action} correctamente`);
        console.log("✅ Review update successful:", data);
      },
      onError: (error) => {
        console.error("❌ Error updating review:", error);
        toast.error(`Error al actualizar la reseña: ${error.message}`);
      },
    });

  // Fix 5: Enhanced approval handler
  const handleToggleApproval = (review) => {
    console.log("🔄 Toggle approval for review:", {
      reviewId: review._id,
      currentStatus: review?.check,
      newStatus: !review?.check,
      user,
      isAdmin: user?.admin,
    });

    // Check permissions
    if (!user?.admin) {
      toast.error(
        "No tienes permisos de administrador para aprobar/desaprobar reseñas"
      );
      return;
    }

    if (!jwt) {
      toast.error(
        "Token de autenticación no encontrado. Por favor, inicia sesión nuevamente."
      );
      return;
    }

    // Call the mutation
    mutateUpdateReviewCheck({
      token: jwt,
      check: !review?.check,
      reviewId: review._id,
    });
  };

  // Mobile Card Component
  const ReviewCard = ({ review }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[8],
          transform: "translateY(-4px)",
        },
        border: `1px solid ${theme.palette.divider}`,
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
                    color: theme.palette.text.secondary,
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
            icon={
              review?.check ? <CheckCircle size={16} /> : <XCircle size={16} />
            }
            sx={{
              backgroundColor: review?.check
                ? theme.palette.success.main + "15"
                : theme.palette.warning.main + "15",
              color: review?.check
                ? theme.palette.success.dark
                : theme.palette.warning.dark,
              border: `1px solid ${
                review?.check
                  ? theme.palette.success.main + "40"
                  : theme.palette.warning.main + "40"
              }`,
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Experience Link */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Star
              size={16}
              color={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              style={{ marginRight: 8 }}
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
                style={{ marginRight: 8, color: theme.palette.text.secondary }}
              />
              <Typography variant="body2" color="textSecondary">
                Comentario:
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                padding: 2,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                fontStyle: "italic",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
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
            <Rating
              value={review.rating}
              readOnly
              size="small"
              sx={{
                color: theme.palette.secondary.medium,
                "& .MuiRating-iconFilled": {
                  color: theme.palette.secondary.medium,
                },
              }}
            />
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
              style={{ marginRight: 8, color: theme.palette.text.secondary }}
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
              title={
                !user?.admin
                  ? "Necesitas permisos de administrador"
                  : review?.check
                    ? "Desaprobar reseña"
                    : "Aprobar reseña"
              }
            >
              <span>
                <IconButton
                  disabled={
                    isLoadingDeleteData || isUpdatingReview || !user?.admin
                  }
                  onClick={() => handleToggleApproval(review)}
                  sx={{
                    backgroundColor: review?.check
                      ? theme.palette.success.main + "15"
                      : theme.palette.warning.main + "15",
                    color: review?.check
                      ? theme.palette.success.main
                      : theme.palette.warning.main,
                    "&:hover": {
                      backgroundColor: review?.check
                        ? theme.palette.success.main + "25"
                        : theme.palette.warning.main + "25",
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  {review?.check ? (
                    <CheckCircle size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            {/* Delete Button */}
            <Button
              disabled={isLoadingDeleteData || isUpdatingReview || !user?.admin}
              startIcon={<Trash2 size={16} />}
              onClick={() => handleDeleteReview(review._id)}
              sx={{
                borderRadius: 20,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 2,
                py: 0.75,
                borderColor: theme.palette.error.main + "60",
                color: theme.palette.error.main,
                backgroundColor: theme.palette.error.main + "08",
                "&:hover": {
                  backgroundColor: theme.palette.error.main + "15",
                  borderColor: theme.palette.error.main,
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
                transition: "all 0.2s ease",
              }}
              variant="outlined"
              size="small"
            >
              {isLoadingDeleteData ? "Eliminando..." : "Eliminar"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Show admin status warning if not admin
  if (user && !user.admin) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1">
          No tienes permisos de administrador para acceder a esta página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        p: { xs: 2, md: 3 },
      }}
    >
      <DataTable
        pageTitle=""
        dataListName="Administrar reseñas"
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
            {reviewsData?.data?.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout with Modern Styling
          reviewsData?.data?.map((review) => (
            <TableRow
              key={review._id}
              sx={{
                backgroundColor: theme.palette.background.paper,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                  transform: "scale(1.001)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {/* Author */}
              <TableCell
                sx={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  minWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={
                      review?.user?.avatar
                        ? stables.UPLOAD_FOLDER_BASE_URL + review?.user?.avatar
                        : images.userImage
                    }
                    alt={review?.user?.name}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: `2px solid ${theme.palette.background.default}`,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: "1rem",
                        mb: 0.5,
                      }}
                    >
                      {review?.user?.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <User
                        size={12}
                        style={{
                          marginRight: 4,
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.7rem",
                          fontWeight: 500,
                        }}
                      >
                        Autor de reseña
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TableCell>

              {/* Experience */}
              <TableCell
                sx={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  maxWidth: "300px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Star
                    size={14}
                    style={{
                      marginRight: 6,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Experiencia
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to={`/experience/${review?.experience?.slug}`}
                  endIcon={<ExternalLink size={12} />}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                    fontWeight: 600,
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
                      fontSize: "0.9rem",
                    }}
                  >
                    {review?.experience?.title}
                  </Typography>
                </Button>
                {review?.rating && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{
                        color: theme.palette.secondary.medium,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ ml: 0.5, fontWeight: 600 }}
                    >
                      ({review.rating}/5)
                    </Typography>
                  </Box>
                )}
              </TableCell>

              {/* Created Date */}
              <TableCell
                sx={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  minWidth: "140px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Calendar
                    size={14}
                    style={{
                      marginRight: 6,
                      color: theme.palette.info.main,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Creado
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {new Date(review.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.7rem",
                  }}
                >
                  {new Date(review.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </TableCell>

              {/* Status */}
              <TableCell
                sx={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  minWidth: "120px",
                }}
              >
                <Tooltip
                  title={
                    !user?.admin
                      ? "Necesitas permisos de administrador"
                      : review?.check
                        ? "Click para desaprobar"
                        : "Click para aprobar"
                  }
                >
                  <span>
                    <IconButton
                      disabled={
                        isLoadingDeleteData || isUpdatingReview || !user?.admin
                      }
                      onClick={() => handleToggleApproval(review)}
                      sx={{
                        backgroundColor: review?.check
                          ? theme.palette.success.main + "15"
                          : theme.palette.warning.main + "15",
                        color: review?.check
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                        border: `1px solid ${
                          review?.check
                            ? theme.palette.success.main + "40"
                            : theme.palette.warning.main + "40"
                        }`,
                        width: 48,
                        height: 48,
                        "&:hover": {
                          backgroundColor: review?.check
                            ? theme.palette.success.main + "25"
                            : theme.palette.warning.main + "25",
                          transform: "scale(1.05)",
                        },
                        "&:disabled": {
                          opacity: 0.5,
                          cursor: "not-allowed",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {review?.check ? (
                        <CheckCircle size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>

              {/* Actions */}
              <TableCell
                sx={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  minWidth: "150px",
                }}
              >
                <Button
                  disabled={
                    isLoadingDeleteData || isUpdatingReview || !user?.admin
                  }
                  startIcon={<Trash2 size={16} />}
                  onClick={() => handleDeleteReview(review._id)}
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    px: 2,
                    py: 0.75,
                    borderColor: theme.palette.error.main + "60",
                    color: theme.palette.error.main,
                    backgroundColor: theme.palette.error.main + "08",
                    "&:hover": {
                      backgroundColor: theme.palette.error.main + "15",
                      borderColor: theme.palette.error.main,
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                    transition: "all 0.2s ease",
                  }}
                  variant="outlined"
                  size="small"
                >
                  {isLoadingDeleteData ? "Eliminando..." : "Eliminar"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
      <DeleteConfirmationDialog />
    </Box>
  );
};

export default Reviews;

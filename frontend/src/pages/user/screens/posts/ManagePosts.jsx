import React, { useState, useEffect } from "react";
import { images, stables } from "../../../../constants";
import {
  deleteUserPost,
  getUserPosts,
} from "../../../../services/index/userPosts";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useDataTable } from "../../../../hooks/useDataTable";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import useUser from "../../../../hooks/useUser";
import {
  Trash2,
  Edit,
  Calendar,
  Tag,
  FolderOpen,
  CheckCircle,
  XCircle,
  Plus,
  FileText,
  TrendingUp,
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
  CardMedia,
  Stack,
  Fade,
  Container,
} from "@mui/material";

const ManagePosts = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    currentPage,
    searchKeyword,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getUserPosts(searchKeyword, currentPage, 10, jwt),
    dataQueryKey: ["userPosts", user?._id],
    deleteDataMessage: "Post borrado",
    mutateDeleteFn: ({ slug }) => {
      return deleteUserPost({
        slug,
        token: jwt,
      });
    },
  });

  const [updatedPosts, setUpdatedPosts] = useState(postsData?.data || []);

  useEffect(() => {
    setUpdatedPosts(postsData?.data || []);
  }, [postsData]);

  // Empty State Component
  const EmptyState = () => (
    <Container maxWidth="sm">
      <Fade in={true} timeout={600}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 8,
            px: 4,
          }}
        >
          {/* Empty State Illustration */}
          <Box
            sx={{
              width: { xs: 200, sm: 250 },
              height: { xs: 200, sm: 250 },
              mb: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                height: "80%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite",
              },
              "@keyframes pulse": {
                "0%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.05)" },
                "100%": { transform: "translate(-50%, -50%) scale(1)" },
              },
            }}
          >
            <Box
              component="img"
              src="/assets/nothing-here.png"
              alt="No hay publicaciones"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontFamily: theme.typography.h1?.fontFamily,
            }}
          >
            ¡Comienza tu aventura!
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "medium",
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Aún no has subido ninguna publicación
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            ¡Comparte tus experiencias, aventuras y conocimientos con otros
            usuarios de la comunidad!
          </Typography>

          {/* Action Button */}
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/user/posts/manage/create")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: "25px",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: theme.shadows[4],
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[8],
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Crear Mi Primera Publicación
          </Button>
        </Box>
      </Fade>
    </Container>
  );

  // Mobile Card Component
  const PostCard = ({ post }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${
          theme.palette.neutral?.light || theme.palette.grey[200]
        }`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Post Image Header */}
      <CardMedia
        component="div"
        sx={{
          height: 180,
          position: "relative",
          backgroundImage: `url(${
            post?.photo
              ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo
              : images.samplePostImage
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
          }}
        >
          <Chip
            size="small"
            label={post.approved ? "Aprobado" : "Pendiente"}
            sx={{
              backgroundColor: post.approved
                ? theme.palette.success.main
                : theme.palette.warning.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardMedia>

      <CardContent sx={{ p: 3 }}>
        {/* Post Title */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </Typography>

        {/* Post Info Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar
                size={16}
                style={{
                  marginRight: 8,
                  color:
                    theme.palette.neutral?.medium || theme.palette.grey[600],
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Creado:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FolderOpen
                size={16}
                style={{
                  marginRight: 8,
                  color:
                    theme.palette.neutral?.medium || theme.palette.grey[600],
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Categoría:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {post.categories.length > 0
                ? post.categories
                    .slice(0, 2)
                    .map((cat) => cat.title)
                    .join(", ")
                : "Sin categorizar"}
            </Typography>
          </Grid>
        </Grid>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Tag
                size={16}
                style={{
                  marginRight: 8,
                  color:
                    theme.palette.neutral?.medium || theme.palette.grey[600],
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Etiquetas:
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              {post.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  size="small"
                  label={tag}
                  sx={{
                    backgroundColor:
                      theme.palette.secondary?.light ||
                      theme.palette.secondary.main,
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            component={Link}
            to={`/user/posts/manage/edit/${post?.slug}`}
            startIcon={<Edit size={16} />}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Editar
          </Button>

          <Button
            disabled={isLoadingDeleteData}
            startIcon={<Trash2 size={16} />}
            onClick={() => deleteDataHandler({ slug: post?.slug })}
            sx={{
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.error.lightest ||
                  `${theme.palette.error.main}15`,
                borderColor: theme.palette.error.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Borrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Show empty state when no posts exist
  if (updatedPosts.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.bg,
          minHeight: "100vh",
          py: 4,
        }}
      >
        <EmptyState />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.bg,
        minHeight: "100vh",
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <FileText sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontFamily: theme.typography.h1?.fontFamily,
            }}
          >
            Administrar Publicaciones
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => navigate("/user/posts/manage/create")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRadius: "25px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: theme.shadows[3],
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-1px)",
              boxShadow: theme.shadows[6],
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Crear Nueva Publicación
        </Button>
      </Box>

      <DataTable
        searchInputPlaceHolder="Título del post..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile
            ? []
            : [
                "Post",
                "Categorías",
                "Creado",
                "Etiquetas",
                "Estado",
                "Acciones",
              ]
        }
        isLoading={isLoading}
        isFetching={isFetching}
        data={updatedPosts}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={postsData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {updatedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Box>
        ) : (
          // Desktop Table Layout
          updatedPosts.map((post) => (
            <tr
              key={post._id}
              style={{
                backgroundColor: theme.palette.background.default,
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              {/* Post Thumbnail and Title */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                  minWidth: "300px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      post?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo
                        : images.samplePostImage
                    }
                    alt={post.title}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Box>
                </Box>
              </td>

              {/* Categories */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                  maxWidth: "200px",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ flexWrap: "wrap", gap: 0.5 }}
                >
                  {post.categories.length > 0 ? (
                    post.categories.slice(0, 2).map((category, index) => (
                      <Chip
                        key={index}
                        size="small"
                        label={category.title}
                        variant="outlined"
                        sx={{
                          borderColor: theme.palette.secondary.main,
                          color: theme.palette.secondary.main,
                          fontSize: "0.75rem",
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin categorizar
                    </Typography>
                  )}
                </Stack>
              </td>

              {/* Created Date */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    size={16}
                    style={{
                      marginRight: 8,
                      color:
                        theme.palette.neutral?.medium ||
                        theme.palette.grey[600],
                    }}
                  />
                  <Typography variant="body2" color="textPrimary">
                    {new Date(post.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              </td>

              {/* Tags */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                  maxWidth: "200px",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ flexWrap: "wrap", gap: 0.5 }}
                >
                  {post.tags.length > 0 ? (
                    post.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        size="small"
                        label={tag}
                        sx={{
                          backgroundColor:
                            theme.palette.secondary?.light ||
                            theme.palette.secondary.main,
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin etiquetas
                    </Typography>
                  )}
                </Stack>
              </td>

              {/* Approval Status */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: post.approved
                        ? theme.palette.success.lightest ||
                          `${theme.palette.success.main}15`
                        : theme.palette.warning.lightest ||
                          `${theme.palette.warning.main}15`,
                      color: post.approved
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {post.approved ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    {post.approved ? "Aprobado" : "Pendiente"}
                  </Typography>
                </Box>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${
                    theme.palette.neutral?.light || theme.palette.grey[200]
                  }`,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    to={`/user/posts/manage/edit/${post?.slug}`}
                    startIcon={<Edit size={16} />}
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        borderColor: theme.palette.primary.dark,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Editar
                  </Button>

                  <Button
                    disabled={isLoadingDeleteData}
                    startIcon={<Trash2 size={16} />}
                    onClick={() => deleteDataHandler({ slug: post?.slug })}
                    sx={{
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.error.lightest ||
                          `${theme.palette.error.main}15`,
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
                </Stack>
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </Box>
  );
};

export default ManagePosts;

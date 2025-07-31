import React, { useState, useEffect } from "react";
import { images, stables } from "../../../../constants";
import {
  deleteUserPost,
  getUserPosts,
} from "../../../../services/index/userPosts";
import {
  getSavedPosts,
  toggleSavePost,
} from "../../../../services/index/posts";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useDataTable } from "../../../../hooks/useDataTable";

import useUser from "../../../../hooks/useUser";
import {
  Trash2,
  Edit,
  Calendar,
  FolderOpen,
  Plus,
  Eye,
  Search,
  Bookmark,
  BookmarkX,
  FileEdit,
  Heart,
} from "lucide-react";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  CardMedia,
  Stack,
  Fade,
  Container,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";

const ManagePosts = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Error state management
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Saved posts state
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  const [savedPostsPage, setSavedPostsPage] = useState(1);
  const [savedPostsTotal, setSavedPostsTotal] = useState(0);

  // My Posts Data Table
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
    dataQueryFn: () => {
      try {
        return getUserPosts(searchKeyword, currentPage, 10, jwt);
      } catch (err) {
        setError("Error loading posts: " + err.message);
        setShowError(true);
        throw err;
      }
    },
    dataQueryKey: ["userPosts", user?._id],
    deleteDataMessage: "Post borrado",
    mutateDeleteFn: ({ slug }) => {
      try {
        return deleteUserPost({
          slug,
          token: jwt,
        });
      } catch (err) {
        setError("Error deleting post: " + err.message);
        setShowError(true);
        throw err;
      }
    },
  });

  const [updatedPosts, setUpdatedPosts] = useState(postsData?.data || []);

  useEffect(() => {
    setUpdatedPosts(postsData?.data || []);
  }, [postsData]);

  // Load saved posts when tab changes
  useEffect(() => {
    if (currentTab === 1 && jwt) {
      loadSavedPosts();
    }
  }, [currentTab, savedPostsPage, jwt]);

  // Load saved posts function
  const loadSavedPosts = async () => {
    setSavedPostsLoading(true);
    try {
      const response = await getSavedPosts({
        token: jwt,
        page: savedPostsPage,
        limit: 10,
      });
      setSavedPosts(response.posts || []);
      setSavedPostsTotal(response.total || 0);
    } catch (err) {
      setError("Error cargando publicaciones guardadas: " + err.message);
      setShowError(true);
    } finally {
      setSavedPostsLoading(false);
    }
  };

  // Handle unsaving a post
  const handleUnsavePost = async (postId) => {
    try {
      await toggleSavePost({ postId, token: jwt });
      setSuccess("Publicación eliminada de tus guardados");
      setShowSuccess(true);
      // Reload saved posts
      loadSavedPosts();
    } catch (err) {
      setError("Error eliminando de guardados: " + err.message);
      setShowError(true);
    }
  };

  // Enhanced error handler
  const handleError = (errorMessage, action = "") => {
    const fullMessage = action ? `${action}: ${errorMessage}` : errorMessage;
    setError(fullMessage);
    setShowError(true);
    console.error(fullMessage);
  };

  // Enhanced delete handler with error handling
  const handleDelete = async (slug) => {
    try {
      await deleteDataHandler({ slug });
      setSuccess("Post deleted successfully");
      setShowSuccess(true);
    } catch (err) {
      handleError(err.message, "Error deleting post");
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Success Snackbar component
  const SuccessSnackbar = () => (
    <Snackbar
      open={showSuccess}
      autoHideDuration={4000}
      onClose={() => setShowSuccess(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setShowSuccess(false)}
        severity="success"
        sx={{ width: "100%" }}
      >
        {success}
      </Alert>
    </Snackbar>
  );

  // Error Snackbar component
  const ErrorSnackbar = () => (
    <Snackbar
      open={showError}
      autoHideDuration={6000}
      onClose={() => setShowError(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setShowError(false)}
        severity="error"
        sx={{ width: "100%" }}
      >
        {error}
      </Alert>
    </Snackbar>
  );

  // Empty State Component for My Posts
  const MyPostsEmptyState = () => (
    <Container
      sx={{
        background: theme.palette.background.default,
        width: "100%",
        height: "100%",
      }}
    >
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
          <Box
            sx={{
              width: { xs: 200, sm: 250 },
              height: { xs: 200, sm: 250 },
              mb: 4,
            }}
          >
            <Box
              component="img"
              src="/assets/nothing-here.png"
              alt="No hay publicaciones"
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            ¡Comienza tu aventura!
          </Typography>

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

          <Typography sx={{ color: theme.palette.text.secondary, mb: 4 }}>
            ¡Comparte tus experiencias, aventuras y conocimientos con otros
            usuarios de la comunidad!
          </Typography>

          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/user/posts/manage/create")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: "30rem",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Subir publicación
          </Button>
        </Box>
      </Fade>
    </Container>
  );

  // Empty State Component for Saved Posts
  const SavedPostsEmptyState = () => (
    <Container
      sx={{
        background: theme.palette.background.default,
        width: "100%",
        height: "100%",
      }}
    >
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
          <Heart size={80} color={theme.palette.secondary.main} />

          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            No tienes posts guardados
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "medium",
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Guarda posts que te interesen
          </Typography>

          <Typography sx={{ color: theme.palette.text.secondary, mb: 4 }}>
            Explora la comunidad y guarda los posts que más te gusten para
            leerlos más tarde.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Search size={20} />}
            onClick={() => navigate("/blog")}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: "white",
              borderRadius: "30rem",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Explorar posts
          </Button>
        </Box>
      </Fade>
    </Container>
  );

  // My Post Card Component
  const MyPostCard = ({ post }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          position: "relative",
          backgroundImage: `url(${post?.photo ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo : images.samplePostImage})`,
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

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar size={16} style={{ marginRight: 8 }} />
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
              <FolderOpen size={16} style={{ marginRight: 8 }} />
              <Typography variant="body2" color="textSecondary">
                Categoría:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {post.categories?.length > 0
                ? post.categories
                    .slice(0, 2)
                    .map((cat) => cat.title)
                    .join(", ")
                : "Sin categorizar"}
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to={`/blog/${post?.slug}`}
            startIcon={<Eye size={16} />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "30rem", textTransform: "none" }}
          >
            Ver
          </Button>
          <Button
            component={Link}
            to={`/user/posts/manage/edit/${post?.slug}`}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "30rem", textTransform: "none" }}
          >
            <Edit size={16} />
          </Button>
          <Button
            disabled={isLoadingDeleteData}
            onClick={() => handleDelete(post?.slug)}
            variant="outlined"
            size="small"
            color="error"
            sx={{ borderRadius: "30rem", textTransform: "none" }}
          >
            <Trash2 size={16} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Saved Post Card Component
  const SavedPostCard = ({ post }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          position: "relative",
          backgroundImage: `url(${post?.photo ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo : images.samplePostImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
          <Chip
            size="small"
            icon={<Bookmark size={14} />}
            label="Guardado"
            sx={{
              backgroundColor: theme.palette.info.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardMedia>

      <CardContent sx={{ p: 3 }}>
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

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar size={16} style={{ marginRight: 8 }} />
              <Typography variant="body2" color="textSecondary">
                Publicado:
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
              <Typography variant="body2" color="textSecondary">
                Autor:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {post.user?.name || "Usuario"}
            </Typography>
          </Grid>
        </Grid>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
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
                    backgroundColor: theme.palette.secondary.main,
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to={`/blog/${post?.slug}`}
            startIcon={<Eye size={16} />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "30rem", textTransform: "none" }}
          >
            Leer post
          </Button>
          <Button
            onClick={() => handleUnsavePost(post._id)}
            startIcon={<BookmarkX size={16} />}
            variant="outlined"
            size="small"
            color="warning"
            sx={{ borderRadius: "30rem", textTransform: "none" }}
          >
            Quitar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <ErrorSnackbar />
      <SuccessSnackbar />

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
        >
          Gestión de Posts
        </Typography>

        {/* Tabs */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                minWidth: isMobile ? "auto" : 200,
              },
            }}
          >
            <Tab
              icon={<FileEdit size={20} />}
              label={
                <Badge
                  badgeContent={postsData?.headers?.["x-totalcount"] || 0}
                  color="primary"
                  max={999}
                >
                  Mis publicaciones
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              icon={<Bookmark size={20} />}
              label={
                <Badge
                  badgeContent={savedPostsTotal}
                  color="secondary"
                  max={999}
                >
                  Publicaciones guardadas
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Create New Post Button - Only show on "My Posts" tab */}
        {currentTab === 0 && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/user/posts/manage/create")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: "30rem",
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Subir nueva publicación
          </Button>
        )}
      </Box>

      {/* Tab Content */}
      {currentTab === 0 ? (
        // MY POSTS TAB
        <>
          {/* Show empty state when no posts exist */}
          {updatedPosts.length === 0 && !isLoading ? (
            <Box sx={{ minHeight: "50vh", py: 4 }}>
              <MyPostsEmptyState />
            </Box>
          ) : (
            <>
              {/* Desktop: DataTable */}
              {!isMobile && (
                <DataTable
                  pageTitle=""
                  dataListName="Mis publicaciones"
                  searchInputPlaceHolder="Título de publicación..."
                  searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
                  searchKeywordOnChangeHandler={searchKeywordHandler}
                  searchKeyword={searchKeyword}
                  tableHeaderTitleList={[
                    "Post",
                    "Categorías",
                    "Creado",
                    "Etiquetas",
                    "Estado",
                    "Acciones",
                  ]}
                  isLoading={isLoading}
                  isFetching={isFetching}
                  data={updatedPosts}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  headers={postsData?.headers}
                >
                  {updatedPosts.map((post) => (
                    <tr key={post._id}>
                      <td style={{ padding: "16px 24px" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={
                              post?.photo
                                ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo
                                : images.samplePostImage
                            }
                            alt={post.title}
                            variant="rounded"
                            sx={{ width: 70, height: 60, mr: 2 }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {post.title}
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ flexWrap: "wrap", gap: 0.5 }}
                        >
                          {post.categories?.length > 0 ? (
                            post.categories
                              .slice(0, 2)
                              .map((category, index) => (
                                <Chip
                                  key={index}
                                  size="small"
                                  label={category.title}
                                  variant="outlined"
                                />
                              ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Sin categorizar
                            </Typography>
                          )}
                        </Stack>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <Typography variant="body2">
                          {new Date(post.createdAt).toLocaleDateString(
                            "es-ES",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </Typography>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ flexWrap: "wrap", gap: 0.5 }}
                        >
                          {post.tags?.length > 0 ? (
                            post.tags.slice(0, 3).map((tag, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={tag}
                                sx={{
                                  backgroundColor: theme.palette.secondary.main,
                                  color: "white",
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
                      <td style={{ padding: "16px 24px" }}>
                        <Chip
                          size="small"
                          label={post.approved ? "Aprobado" : "Pendiente"}
                          color={post.approved ? "success" : "warning"}
                        />
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            component={Link}
                            to={`/blog/${post?.slug}`}
                            startIcon={<Eye size={16} />}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: "30rem" }}
                          >
                            Ver
                          </Button>
                          <Button
                            component={Link}
                            to={`/user/posts/manage/edit/${post?.slug}`}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: "30rem" }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            disabled={isLoadingDeleteData}
                            onClick={() => handleDelete(post?.slug)}
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ borderRadius: "30rem" }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              )}

              {/* Mobile: Card Layout */}
              {isMobile && (
                <Box>
                  {/* Mobile Search */}
                  <Box
                    component="form"
                    onSubmit={submitSearchKeywordHandler}
                    sx={{ display: "flex", gap: 1, mb: 3, px: 2 }}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Título de publicación..."
                      onChange={searchKeywordHandler}
                      value={searchKeyword}
                      size="small"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": { borderRadius: "30px" },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Search size={16} />}
                      size="small"
                      sx={{ borderRadius: "30px", px: 3 }}
                    >
                      Buscar
                    </Button>
                  </Box>

                  {/* Loading State */}
                  {(isLoading || isFetching) && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 2 }}>Cargando datos...</Typography>
                    </Box>
                  )}

                  {/* Mobile Cards */}
                  {!isLoading && !isFetching && (
                    <Box sx={{ px: 2 }}>
                      {updatedPosts.map((post) => (
                        <MyPostCard key={post._id} post={post} />
                      ))}
                    </Box>
                  )}

                  {/* Mobile Pagination */}
                  {!isLoading && updatedPosts.length > 0 && (
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          sx={{ minWidth: "auto", px: 2, borderRadius: 30 }}
                        >
                          Anterior
                        </Button>
                        <Typography variant="body2" sx={{ mx: 2 }}>
                          Página {currentPage} de{" "}
                          {postsData?.headers?.["x-totalpagecount"] || 1}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={
                            currentPage >=
                            parseInt(
                              postsData?.headers?.["x-totalpagecount"] || "1"
                            )
                          }
                          onClick={() => setCurrentPage(currentPage + 1)}
                          sx={{ minWidth: "auto", px: 2, borderRadius: 30 }}
                        >
                          Siguiente
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        // SAVED POSTS TAB
        <>
          {/* Show empty state when no saved posts exist */}
          {savedPosts.length === 0 && !savedPostsLoading ? (
            <Box sx={{ minHeight: "50vh", py: 4 }}>
              <SavedPostsEmptyState />
            </Box>
          ) : (
            <Box>
              {/* Loading State */}
              {savedPostsLoading && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>
                    Cargando publicaciones guardadas...
                  </Typography>
                </Box>
              )}

              {/* Saved Posts Cards */}
              {!savedPostsLoading && (
                <Box sx={{ px: isMobile ? 2 : 4 }}>
                  <Grid container spacing={isMobile ? 2 : 3}>
                    {savedPosts.map((post) => (
                      <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <SavedPostCard post={post} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Saved Posts Pagination */}
              {!savedPostsLoading && savedPosts.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    px: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={savedPostsPage <= 1}
                      onClick={() => setSavedPostsPage(savedPostsPage - 1)}
                      sx={{ minWidth: "auto", px: 2, borderRadius: 30 }}
                    >
                      Anterior
                    </Button>
                    <Typography variant="body2" sx={{ mx: 2 }}>
                      Página {savedPostsPage} de{" "}
                      {Math.ceil(savedPostsTotal / 10)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={
                        savedPostsPage >= Math.ceil(savedPostsTotal / 10)
                      }
                      onClick={() => setSavedPostsPage(savedPostsPage + 1)}
                      sx={{ minWidth: "auto", px: 2, borderRadius: 30 }}
                    >
                      Siguiente
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ManagePosts;

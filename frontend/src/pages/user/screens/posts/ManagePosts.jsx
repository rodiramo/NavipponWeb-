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
import ArticleCard from "../../../../components/ArticleCard"; // Import ArticleCard

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
  IconButton,
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
        limit: 12, // Increased for better grid layout
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

  // Handle unsaving a post (now handled by ArticleCard internally)
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
      setSuccess("Publicación eliminada correctamente");
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
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              width: { xs: 150, sm: 200, md: 250 },
              height: { xs: 150, sm: 200, md: 250 },
              mb: { xs: 2, md: 4 },
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
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
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
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Aún no has subido ninguna publicación
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "0.875rem", md: "1rem" },
              maxWidth: { xs: "90%", md: "100%" },
            }}
          >
            ¡Comparte tus experiencias, aventuras y conocimientos con otros
            usuarios de la comunidad!
          </Typography>
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
            py: { xs: 4, md: 8 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Heart
            size={isMobile ? 60 : 80}
            color={theme.palette.secondary.main}
          />

          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
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
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Guarda posts que te interesen
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "0.875rem", md: "1rem" },
              maxWidth: { xs: "90%", md: "100%" },
            }}
          >
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
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: "1rem", md: "1.1rem" },
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

  // Enhanced My Post Card Component for Mobile
  const MyPostCard = ({ post }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[8],
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: { xs: 160, sm: 180 },
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
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </CardMedia>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {post.title}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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
            sx={{
              borderRadius: "30rem",
              textTransform: "none",
              minWidth: { xs: "auto", sm: "80px" },
            }}
          >
            {isMobile ? "" : "Ver"}
          </Button>
          <IconButton
            component={Link}
            to={`/user/posts/manage/edit/${post?.slug}`}
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "50%",
            }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            disabled={isLoadingDeleteData}
            onClick={() => handleDelete(post?.slug)}
            size="small"
            color="error"
            sx={{
              border: `1px solid ${theme.palette.error.main}`,
              borderRadius: "50%",
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pb: { xs: 2, md: 4 },
      }}
    >
      <ErrorSnackbar />
      <SuccessSnackbar />

      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 2, md: 0 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            mb: 3,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",

              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Administrar publicaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate("/user/posts/manage/create")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: "30rem",
              px: { xs: 2.5, md: 3 },
              py: { xs: 1, md: 1.5 },
              textTransform: "none",
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            {isMobile ? "Nueva publicación" : "Subir nueva publicación"}
          </Button>
        </Box>
        {/* Tabs */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-start" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "flex-start",
                fontSize: { xs: "0.875rem", md: "1rem" },
                minWidth: isMobile ? 200 : 400,
                px: { xs: 1, md: 2 },
              },
            }}
          >
            <Tab
              icon={<FileEdit size={isMobile ? 18 : 20} />}
              label={
                <Badge
                  badgeContent={postsData?.headers?.["x-totalcount"] || 0}
                  color="primary"
                  max={999}
                >
                  {isMobile ? "Mis publicaciones" : "Mis publicaciones"}
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              icon={<Bookmark size={isMobile ? 18 : 20} />}
              label={
                <Badge
                  badgeContent={savedPostsTotal}
                  color="secondary"
                  max={999}
                >
                  {isMobile ? "Guardados" : "Posts guardados"}
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </Box>
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
                    <IconButton
                      type="submit"
                      color="primary"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      <Search size={20} />
                    </IconButton>
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
                        <Typography
                          variant="body2"
                          sx={{ mx: 2, fontSize: "0.875rem" }}
                        >
                          {currentPage} de{" "}
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

              {/* Saved Posts using ArticleCard */}
              {!savedPostsLoading && savedPosts.length > 0 && (
                <Box sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {savedPosts.map((post) => (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={post._id}>
                        <ArticleCard
                          post={post}
                          currentUser={user}
                          token={jwt}
                          className="h-full" // Ensure consistent height
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Saved Posts Pagination */}
              {!savedPostsLoading && savedPosts.length > 0 && (
                <Box
                  sx={{
                    mt: 4,
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
                      sx={{
                        minWidth: "auto",
                        px: { xs: 1.5, md: 2 },
                        borderRadius: 30,
                      }}
                    >
                      Anterior
                    </Button>
                    <Typography
                      variant="body2"
                      sx={{
                        mx: 2,
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {savedPostsPage} de {Math.ceil(savedPostsTotal / 12)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={
                        savedPostsPage >= Math.ceil(savedPostsTotal / 12)
                      }
                      onClick={() => setSavedPostsPage(savedPostsPage + 1)}
                      sx={{
                        minWidth: "auto",
                        px: { xs: 1.5, md: 2 },
                        borderRadius: 30,
                      }}
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

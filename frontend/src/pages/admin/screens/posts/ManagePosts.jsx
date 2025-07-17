import React, { useState, useEffect } from "react";
import { images, stables } from "../../../../constants";
import {
  deletePost,
  getAllPosts,
  updatePost,
} from "../../../../services/index/posts";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import useUser from "../../../../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Calendar,
  Tag,
  FolderOpen,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
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
} from "@mui/material";

const ManagePosts = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleApproval = async (post) => {
    try {
      const updatedPost = { ...post, approved: !post.approved };
      await updatePost({
        updatedData: updatedPost,
        slug: updatedPost.slug,
        token: jwt,
      });
      queryClient.invalidateQueries(["posts"]);
    } catch (error) {
      console.error("Error toggling approval:", error);
    }
  };

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
    dataQueryFn: () => getAllPosts(searchKeyword, currentPage),
    dataQueryKey: "posts",
    deleteDataMessage: "Post borrado",
    mutateDeleteFn: ({ slug }) => deletePost({ slug, token: jwt }),
  });

  const [updatedPosts, setUpdatedPosts] = useState(postsData?.data || []);

  useEffect(() => {
    setUpdatedPosts(postsData?.data || []);
  }, [postsData]);

  // Mobile Card Component
  const PostCard = ({ post }) => (
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.neutral.light}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Post Image Header */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
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
            color={post.approved ? "success" : "warning"}
            variant="filled"
            sx={{
              backgroundColor: post.approved
                ? theme.palette.success.light
                : theme.palette.warning.light,
              color: "black",
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
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Creado:{" "}
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FolderOpen
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Categorías:
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {post.categories.length > 0 ? (
                post.categories.slice(0, 3).map((cat, index) => (
                  <Chip
                    key={index}
                    size="small"
                    label={cat.title}
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.secondary.medium,
                      color: theme.palette.secondary.medium,
                      fontSize: "0.75rem",
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sin categorizar
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Tag
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Etiquetas:
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {post.tags.length > 0 ? (
                post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    size="small"
                    label={tag}
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.dark,
                      fontSize: "0.75rem",
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sin etiquetas
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Approval Toggle */}
          <Tooltip
            title={
              post.approved ? "Desaprobar publicación" : "Aprobar publicación"
            }
          >
            <IconButton
              onClick={() => toggleApproval(post)}
              disabled={isLoadingDeleteData}
              sx={{
                backgroundColor: post.approved
                  ? theme.palette.success.lightest
                  : theme.palette.warning.lightest,
                color: post.approved
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                "&:hover": {
                  backgroundColor: post.approved
                    ? theme.palette.success.light
                    : theme.palette.warning.light,
                  transform: "scale(1.05)",
                },
              }}
            >
              {post.approved ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<Eye size={16} />}
            component={Link}
            to={`/blog/${post?.slug}`}
            sx={{
              textTransform: "none",
              borderRadius: 30,
              color: theme.palette.secondary.medium,
              borderColor: theme.palette.secondary.medium,
              "&:hover": {
                backgroundColor: theme.palette.secondary.light,
                borderColor: theme.palette.secondary.dark,
              },
            }}
            variant="outlined"
            size="small"
          >
            Ver detalles
          </Button>
          {/* Edit Button */}
          <Button
            startIcon={<Edit size={16} />}
            component={Link}
            to={`/admin/posts/manage/edit/${post.slug}`}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              borderRadius: 30,
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

          {/* Delete Button */}
          <Button
            disabled={isLoadingDeleteData}
            startIcon={<Trash2 size={16} />}
            onClick={() => deleteDataHandler({ slug: post?.slug })}
            sx={{
              color: theme.palette.error.main,
              textTransform: "none",
              borderRadius: 30,
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
        dataListName="Administrar publicaciones"
        searchInputPlaceHolder="Título publicación..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile
            ? []
            : [
                "Título",
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
            >
              {/* Post Thumbnail and Title */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
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
                      width: 64,
                      height: 64,
                      mr: 2,
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
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <FolderOpen
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                </Box>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ flexWrap: "wrap", gap: 0.5 }}
                >
                  {post.categories.length > 0 ? (
                    post.categories.slice(0, 2).map((cat, index) => (
                      <Chip
                        key={index}
                        size="small"
                        label={cat.title}
                        variant="outlined"
                        sx={{
                          borderColor: theme.palette.secondary.medium,
                          color: theme.palette.secondary.medium,
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
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Tag
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
                    }}
                  />
                </Box>
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
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.dark,

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
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Tooltip
                  title={
                    post.approved
                      ? "Click para desaprobar"
                      : "Click para aprobar"
                  }
                >
                  <IconButton
                    onClick={() => toggleApproval(post)}
                    disabled={isLoadingDeleteData}
                    sx={{
                      backgroundColor: post.approved
                        ? theme.palette.success.lightest
                        : theme.palette.warning.lightest,
                      color: post.approved
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                      width: 48,
                      height: 48,
                      "&:hover": {
                        backgroundColor: post.approved
                          ? theme.palette.success.light
                          : theme.palette.warning.light,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {post.approved ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </IconButton>
                </Tooltip>
              </td>

              {/* Actions */}
              <td
                style={{
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<Eye size={16} />}
                    component={Link}
                    to={`/blog/${post?.slug}`}
                    sx={{
                      textTransform: "none",
                      width: "120px",

                      borderRadius: 30,
                      color: theme.palette.secondary.medium,
                      borderColor: theme.palette.secondary.medium,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.light,
                        borderColor: theme.palette.secondary.dark,
                      },
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Ver detalles
                  </Button>
                  <Button
                    component={Link}
                    to={`/admin/posts/manage/edit/${post.slug}`}
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      textTransform: "none",
                      borderRadius: 30,
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
                    {" "}
                    <Edit size={16} />
                  </Button>

                  <Button
                    disabled={isLoadingDeleteData}
                    onClick={() => deleteDataHandler({ slug: post?.slug })}
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
                    <Trash2 size={16} />
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

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllPosts } from "../../services/index/posts";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ArticleCard from "../../components/ArticleCard";
import MainLayout from "../../components/MainLayout";
import Hero from "./container/Hero";
import Pagination from "../../components/Pagination";
import UserList from "./container/UserList";
import PostForm from "../../components/PostForm";
import { useSearchParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { ArrowDownNarrowWide } from "lucide-react";
import {
  Button,
  Modal,
  Box,
  Typography,
  MenuItem,
  useTheme,
  IconButton,
  Container,
  Grid,
  Paper,
  Chip,
  Menu,
} from "@mui/material";
import { Close, PostAdd, PeopleOutlined } from "@mui/icons-material";

let isFirstRun = true;

const BlogPage = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, jwt } = useUser();

  const [sortBy, setSortBy] = useState("newest");

  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12, sortBy, jwt),
    queryKey: ["posts", searchKeyword, currentPage, sortBy],
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error fetching posts");
      console.log(error);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, searchKeyword, sortBy, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword, sortBy });
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortSelection = (value) => {
    setSortBy(value);
    setSearchParams({
      page: 1,
      search: searchKeyword,
      sortBy: value,
    });
    setAnchorEl(null);
  };

  const sortingOptions = [
    {
      value: "newest",
      label: "Más recientes",
    },
    {
      value: "oldest",
      label: "Más antiguos",
    },
    {
      value: "most-popular",
      label: "Más populares",
    },
    {
      value: "least-popular",
      label: "Menos populares",
    },
  ];

  // Get current sort option label
  const currentSortLabel =
    sortingOptions.find((option) => option.value === sortBy)?.label ||
    "Más recientes";

  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero user={user} jwt={jwt} onOpenModal={() => setOpen(true)} />

      {/* Main Content */}
      <Box
        sx={{
          background: `linear-gradient(180deg, 
            ${theme.palette.background.default} 0%, 
            ${theme.palette.grey[50]} 100%)`,
          minHeight: "100vh",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Main Posts Section */}
            <Grid item xs={12} lg={user ? 8.5 : 12}>
              {/* Section Header */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  mb: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, 
                    ${theme.palette.background.paper} 0%, 
                    ${theme.palette.grey[50]} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={3}
                >
                  {/* Title and Stats */}
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: { xs: "1.75rem", sm: "2rem" },
                      }}
                    >
                      Comunidad de viajeros
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Descubre historias increíbles y comparte tus experiencias
                      en Japón
                    </Typography>

                    {/* Stats Pills */}
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={`${data?.data?.length || 0} publicaciones`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Sort Dropdown - New Style */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        display: { xs: "none", sm: "block" },
                        fontWeight: 500,
                      }}
                    >
                      Ordenar por:
                    </Typography>

                    {/* Current selection display on mobile */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        display: { xs: "block", sm: "none" },
                        fontWeight: 600,
                      }}
                    >
                      {currentSortLabel}
                    </Typography>

                    <IconButton
                      onClick={handleSortClick}
                      sx={{
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: "30px",
                        padding: "8px",
                        backgroundColor: theme.palette.background.paper,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.light,
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <ArrowDownNarrowWide
                        size={20}
                        color={theme.palette.primary.main}
                      />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      sx={{
                        "& .MuiPaper-root": {
                          borderRadius: 2,
                          minWidth: 200,
                          boxShadow: theme.shadows[8],
                          border: `1px solid ${theme.palette.divider}`,
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {sortingOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          onClick={() => handleSortSelection(option.value)}
                          selected={sortBy === option.value}
                          sx={{
                            fontSize: "0.875rem",
                            padding: "12px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.dark,
                              fontWeight: 600,
                            },
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {option.icon}
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
              </Paper>

              {/* Posts Content */}
              <Box>
                {isLoading || isFetching ? (
                  <Grid container spacing={3}>
                    {[...Array(6)].map((_, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={index}>
                        <ArticleCardSkeleton />
                      </Grid>
                    ))}
                  </Grid>
                ) : isError ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 6,
                      textAlign: "center",
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.error.light}`,
                      backgroundColor: `${theme.palette.error.light}08`,
                    }}
                  >
                    <ErrorMessage message="No se pudieron obtener los datos de las publicaciones." />
                  </Paper>
                ) : data?.data.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 8,
                      textAlign: "center",
                      borderRadius: 3,
                      border: `2px dashed ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <PostAdd
                      sx={{
                        fontSize: 64,
                        color: theme.palette.text.disabled,
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      No se encontraron publicaciones
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
                    >
                      {searchKeyword
                        ? "Intenta con diferentes términos de búsqueda"
                        : "¡Sé el primero en compartir una experiencia increíble!"}
                    </Typography>
                    {user && (
                      <Button
                        variant="contained"
                        onClick={() => setOpen(true)}
                        startIcon={<PostAdd />}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Crear primera publicación
                      </Button>
                    )}
                  </Paper>
                ) : (
                  <>
                    {/* Posts Grid */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                      {data?.data.map((post) => (
                        <Grid item xs={12} sm={6} lg={4} key={post._id}>
                          <ArticleCard
                            post={post}
                            currentUser={user}
                            token={jwt}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {/* Pagination */}
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Pagination
                          onPageChange={handlePageChange}
                          currentPage={currentPage}
                          totalPageCount={JSON.parse(
                            data?.headers?.["x-totalpagecount"] || "1"
                          )}
                        />
                      </Paper>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>

            {/* Sidebar */}
            {user && (
              <Grid item xs={12} lg={3.5}>
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        background: `linear-gradient(135deg, 
                          ${theme.palette.primary.main}08, 
                          ${theme.palette.secondary.main}05)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ mb: 1 }}
                      >
                        <PeopleOutlined color="primary" />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                          }}
                        >
                          Descubre usuarios
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Conecta con otros miembros de la comunidad
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <UserList currentUser={user} token={jwt} />
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "95vw",
            maxHeight: "95vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: theme.shadows[24],
            borderRadius: 4,
            outline: "none",
          }}
        >
          {/* Enhanced Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1000,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              "&:hover": {
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                transform: "scale(1.1)",
              },
              boxShadow: theme.shadows[4],
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close />
          </IconButton>

          <PostForm onClose={() => setOpen(false)} token={jwt} />
        </Box>
      </Modal>
    </MainLayout>
  );
};

export default BlogPage;

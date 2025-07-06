import React, { useState, useEffect, useMemo } from "react";
import { images, stables } from "../../../../constants";
import {
  deleteExperience,
  getAllExperiences,
} from "../../../../services/index/experiences";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import {
  Trash2,
  Edit,
  Calendar,
  FolderOpen,
  MapPin,
  Eye,
  Tags,
  Map,
  Plus,
  PlusCircle,
  MoreVertical,
} from "lucide-react";
import useUser from "../../../../hooks/useUser";
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
  Paper,
  LinearProgress,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
  Divider,
} from "@mui/material";

const ManageExperiences = () => {
  const { jwt } = useUser();
  const theme = useTheme();

  // More granular breakpoints for better responsiveness
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const {
    currentPage,
    searchKeyword,
    data: experiencesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllExperiences(searchKeyword, currentPage),
    dataQueryKey: "experiences",
    deleteDataMessage: "Experiencia Borrada",
    mutateDeleteFn: ({ slug }) => {
      return deleteExperience({
        slug,
        token: jwt,
      });
    },
  });

  const [updatedExperiences, setUpdatedExperiences] = useState(
    experiencesData?.data || []
  );

  // Fetch ALL experiences for overview statistics
  const {
    data: allExperiencesData,
    isLoading: isLoadingAllExperiences,
    error: allExperiencesError,
  } = useQuery({
    queryKey: ["allExperiences"],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching all experiences for overview...");
        const response = await getAllExperiences("", 1, 1000);
        console.log(
          "✅ Fetched all experiences for overview:",
          response.data?.length || 0
        );
        return response.data || [];
      } catch (error) {
        console.error("❌ Error fetching all experiences:", error);
        throw error;
      }
    },
    enabled: !!jwt,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Failed to load overview statistics:", error);
    },
  });

  useEffect(() => {
    setUpdatedExperiences(experiencesData?.data || []);
  }, [experiencesData]);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const experiencesToAnalyze =
      allExperiencesData || (allExperiencesError ? updatedExperiences : []);

    if (!experiencesToAnalyze || experiencesToAnalyze.length === 0) {
      return {
        categories: {},
        regions: {},
        tags: {},
        totalExperiences: 0,
      };
    }

    const categories = {};
    const regions = {};
    const tags = {};

    experiencesToAnalyze.forEach((experience) => {
      // Count categories
      if (experience.categories && typeof experience.categories === "string") {
        const category = experience.categories.trim();
        categories[category] = (categories[category] || 0) + 1;
      }

      // Count regions/prefectures
      if (experience.prefecture && typeof experience.prefecture === "string") {
        const prefecture = experience.prefecture.trim();
        regions[prefecture] = (regions[prefecture] || 0) + 1;
      } else if (experience.region && typeof experience.region === "string") {
        const region = experience.region.trim();
        regions[region] = (regions[region] || 0) + 1;
      } else if (
        experience.location &&
        typeof experience.location === "string"
      ) {
        const location = experience.location.trim();
        regions[location] = (regions[location] || 0) + 1;
      }

      // Count tags
      if (experience.tags && Array.isArray(experience.tags)) {
        experience.tags.forEach((tag) => {
          if (tag && typeof tag === "string") {
            const tagName = tag.trim();
            tags[tagName] = (tags[tagName] || 0) + 1;
          }
        });
      }

      if (experience.generalTags) {
        Object.values(experience.generalTags).forEach((tagArray) => {
          if (Array.isArray(tagArray)) {
            tagArray.forEach((tag) => {
              if (tag && typeof tag === "string") {
                const tagName = tag.trim();
                tags[tagName] = (tags[tagName] || 0) + 1;
              }
            });
          }
        });
      }
    });

    return {
      categories,
      regions,
      tags,
      totalExperiences: experiencesToAnalyze.length,
    };
  }, [allExperiencesData, allExperiencesError, updatedExperiences]);

  // Responsive Overview Statistics Component
  const OverviewSection = () => {
    const [expandedCards, setExpandedCards] = useState({});

    const toggleExpanded = (cardType) => {
      setExpandedCards((prev) => ({
        ...prev,
        [cardType]: !prev[cardType],
      }));
    };

    const getTopItems = (data, limit = null) => {
      const sorted = Object.entries(data).sort(([, a], [, b]) => b - a);
      return limit ? sorted.slice(0, limit) : sorted;
    };

    const StatCard = ({
      title,
      icon,
      data,
      color,
      emptyMessage,
      isLoading,
      cardType,
    }) => {
      const isExpanded = expandedCards[cardType] || false;
      const displayLimit = isExpanded ? null : isMobile ? 3 : 5;
      const topItems = getTopItems(data, displayLimit);
      const totalCount = Object.values(data).reduce(
        (sum, count) => sum + count,
        0
      );
      const hasError = allExperiencesError && !isLoading;
      const hasMore = Object.keys(data).length > (isMobile ? 3 : 5);

      return (
        <Card
          elevation={0}
          sx={{
            borderRadius: { xs: "12px", sm: "14px", md: "16px" },
            border: `1px solid ${theme.palette.divider}`,
            transition: "all 0.3s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: { xs: 1.5, md: 2 },
              }}
            >
              <Box
                sx={{
                  p: { xs: 1, sm: 1.25, md: 1.5 },
                  borderRadius: { xs: "8px", md: "12px" },
                  backgroundColor: hasError
                    ? `${theme.palette.error.main}15`
                    : `${color}15`,
                  color: hasError ? theme.palette.error.main : color,
                  mr: { xs: 1.5, md: 2 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {React.cloneElement(icon, {
                  size: isMobile ? 20 : 24,
                })}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  fontWeight="600"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                {isLoading ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  >
                    Cargando...
                  </Typography>
                ) : hasError ? (
                  <Typography
                    variant="body2"
                    color="error.main"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  >
                    Error
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    {Object.keys(data).length} únicos • {totalCount} total
                  </Typography>
                )}
              </Box>
              {hasMore && !isLoading && !hasError && (
                <Button
                  size="small"
                  onClick={() => toggleExpanded(cardType)}
                  sx={{
                    color: color,
                    textTransform: "none",
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                    minWidth: "auto",
                    p: { xs: 0.5, md: 1 },
                    ml: 1,
                  }}
                >
                  {isExpanded
                    ? "Menos"
                    : `+${Object.keys(data).length - (isMobile ? 3 : 5)}`}
                </Button>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              {isLoading ? (
                <Box sx={{ py: { xs: 2, md: 3 } }}>
                  <LinearProgress sx={{ mb: 1, height: 4, borderRadius: 2 }} />
                  <LinearProgress sx={{ mb: 1, height: 4, borderRadius: 2 }} />
                  <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
                </Box>
              ) : hasError ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    py: { xs: 1, md: 2 },
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Error al cargar
                </Typography>
              ) : topItems.length > 0 ? (
                <Box
                  sx={{
                    maxHeight: isExpanded
                      ? { xs: "300px", md: "400px" }
                      : "auto",
                    overflowY: "auto",
                  }}
                >
                  {topItems.map(([name, count], index) => {
                    const percentage =
                      totalCount > 0 ? (count / totalCount) * 100 : 0;
                    return (
                      <Box
                        key={name}
                        sx={{
                          mb:
                            index < topItems.length - 1
                              ? { xs: 1.5, md: 2 }
                              : 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                              fontSize: { xs: "0.75rem", md: "0.875rem" },
                            }}
                            title={name}
                          >
                            {name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: { xs: 0.5, md: 1 },
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.6rem", md: "0.7rem" } }}
                            >
                              {percentage.toFixed(1)}%
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontWeight: 600,
                                minWidth: { xs: "20px", md: "30px" },
                                textAlign: "right",
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                              }}
                            >
                              {count}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: { xs: 4, md: 6 },
                            borderRadius: 3,
                            backgroundColor: `${color}20`,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    py: { xs: 1, md: 2 },
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {emptyMessage}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      );
    };

    return (
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Total Experiences Summary */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: { xs: "12px", sm: "14px", md: "16px" },
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Box>
                  {isLoadingAllExperiences ? (
                    <>
                      <LinearProgress
                        sx={{ width: { xs: 100, md: 120 }, mb: 1 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                      >
                        Cargando...
                      </Typography>
                    </>
                  ) : allExperiencesError ? (
                    <>
                      <Typography
                        variant={isMobile ? "h4" : "h3"}
                        fontWeight="700"
                        color="error.main"
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        }}
                      >
                        ⚠️
                      </Typography>
                      <Typography
                        variant="h6"
                        color="error.main"
                        sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                      >
                        Error al cargar
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                      >
                        Datos de página actual
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant={isMobile ? "h4" : "h3"}
                        fontWeight="700"
                        color="primary.main"
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                          lineHeight: 1,
                        }}
                      >
                        {overviewStats.totalExperiences.toLocaleString("es-ES")}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "1rem", md: "1.25rem" },
                          mt: 0.5,
                        }}
                      >
                        Experiencias Totales
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} lg={4}>
            <StatCard
              title="Categorías"
              icon={<FolderOpen />}
              data={overviewStats.categories}
              color={theme.palette.primary.main}
              emptyMessage="Sin categorías"
              isLoading={isLoadingAllExperiences}
              cardType="categories"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <StatCard
              title="Ubicaciones"
              icon={<Map />}
              data={overviewStats.regions}
              color={theme.palette.secondary.medium}
              emptyMessage="Sin ubicaciones"
              isLoading={isLoadingAllExperiences}
              cardType="regions"
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={4}>
            <StatCard
              title="Etiquetas"
              icon={<Tags />}
              data={overviewStats.tags}
              color={theme.palette.info.main}
              emptyMessage="Sin etiquetas"
              isLoading={isLoadingAllExperiences}
              cardType="tags"
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Enhanced Mobile/Tablet Card Component
  const ExperienceCard = ({ experience }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <Card
        sx={{
          mb: { xs: 2, sm: 2.5 },
          borderRadius: { xs: "12px", sm: "16px" },
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-1px)",
          },
          overflow: "hidden",
        }}
      >
        {/* Experience Image Header */}
        <CardMedia
          component="div"
          sx={{
            height: { xs: 160, sm: 200, md: 220 },
            position: "relative",
            backgroundImage: `url(${
              experience?.photo
                ? experience.photo.startsWith("http")
                  ? experience.photo
                  : stables.UPLOAD_FOLDER_BASE_URL + experience.photo
                : images.sampleExperienceImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Menu button overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
            }}
          >
            <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 1 }}>
              <MoreVertical size={18} />
            </IconButton>
          </Box>
        </CardMedia>

        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* Experience Title */}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              mb: { xs: 1.5, md: 2 },
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              lineHeight: 1.3,
            }}
          >
            {experience.title}
          </Typography>

          {/* Experience Info Grid - Responsive */}
          <Grid
            container
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ mb: { xs: 1.5, md: 2 } }}
          >
            <Grid item xs={6} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Calendar
                  size={isMobile ? 14 : 16}
                  style={{
                    marginRight: 6,
                    color: theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                >
                  Creado:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "medium",
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                }}
              >
                {(() => {
                  if (!experience.createdAt) return "No definida";
                  const date = new Date(experience.createdAt);
                  if (isNaN(date.getTime())) return "No válida";
                  return date.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: isMobile ? "2-digit" : "numeric",
                  });
                })()}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <FolderOpen
                  size={isMobile ? 14 : 16}
                  style={{
                    marginRight: 6,
                    color: theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                >
                  Categoría:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "medium",
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={
                  typeof experience.categories === "string"
                    ? experience.categories
                    : "Sin categorizar"
                }
              >
                {typeof experience.categories === "string"
                  ? experience.categories
                  : "Sin categorizar"}
              </Typography>
            </Grid>
          </Grid>

          {/* Collapsible Details Section */}
          <Collapse in={showDetails}>
            <Divider sx={{ mb: 2 }} />

            {/* Description Preview */}
            {experience.caption && typeof experience.caption === "string" && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontStyle: "italic",
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    lineHeight: 1.4,
                  }}
                >
                  {experience.caption}
                </Typography>
              </Box>
            )}

            {/* Location */}
            {experience.location && typeof experience.location === "string" && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MapPin
                  size={isMobile ? 14 : 16}
                  style={{
                    marginRight: 8,
                    color: theme.palette.secondary.medium,
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                >
                  {experience.location}
                </Typography>
              </Box>
            )}
          </Collapse>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 1.5 },
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Details Toggle Button */}
            <Button
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                color: theme.palette.text.secondary,
                minWidth: "auto",
                p: { xs: 0.5, md: 1 },
              }}
            >
              {showDetails ? "Menos detalles" : "Más detalles"}
            </Button>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                startIcon={<Eye size={isMobile ? 14 : 16} />}
                component={Link}
                to={`/experience/${experience?.slug}`}
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 0.5, md: 0.75 },
                  color: theme.palette.secondary.medium,
                  borderColor: theme.palette.secondary.medium,
                  "&:hover": {
                    backgroundColor: `${theme.palette.secondary.medium}10`,
                  },
                }}
                variant="outlined"
                size="small"
              >
                {isMobile ? "Ver" : "Ver detalles"}
              </Button>
            </Box>
          </Box>
        </CardContent>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 160 },
          }}
        >
          <MenuItem
            component={Link}
            to={`/admin/experiences/manage/edit/${experience?.slug}`}
            onClick={handleMenuClose}
            sx={{ py: 1.5 }}
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              deleteDataHandler({ slug: experience?.slug });
            }}
            disabled={isLoadingDeleteData}
            sx={{ py: 1.5, color: theme.palette.error.main }}
          >
            <Trash2 size={16} style={{ marginRight: 8 }} />
            Borrar
          </MenuItem>
        </Menu>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 1, sm: 2, md: 3 },
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header with Create Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 2, md: 3 },
          mb: { xs: 3, md: 4 },
          p: { xs: 1, sm: 1.5, md: 2 },
          borderRadius: { xs: "12px", md: "16px" },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h4"
            fontWeight="700"
            color="primary.main"
            sx={{
              mb: 1,
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2rem",
                lg: "2.125rem",
              },
            }}
          >
            Administrar Experiencias
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Gestiona todas las experiencias de la plataforma
          </Typography>
        </Box>

        {/* Create Experience Button */}
        <Button
          component={Link}
          to="/admin/experiences/manage/create"
          variant="contained"
          startIcon={<Plus size={isMobile ? 16 : 20} />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            px: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1, sm: 1.25, md: 1.5 },
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          {isMobile
            ? "Nueva"
            : isTablet
              ? "Nueva Experiencia"
              : "Crear Nueva Experiencia"}
        </Button>
      </Box>

      {/* Overview Statistics Section */}
      {((!isLoading && updatedExperiences.length > 0) ||
        isLoadingAllExperiences ||
        allExperiencesData) && <OverviewSection />}

      {/* Data Table with responsive table headers */}
      <DataTable
        pageTitle=""
        dataListName="Lista de experiencias"
        searchInputPlaceHolder="Título experiencia..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isDesktop ? ["Experiencia", "Categoría", "Creado", "Acciones"] : []
        }
        isLoading={isLoading}
        isFetching={isFetching}
        data={updatedExperiences}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={experiencesData?.headers}
      >
        {/* Responsive Layout: Cards for mobile/tablet, Table for desktop */}
        {isDesktop ? (
          // Desktop Table Layout
          updatedExperiences.map((experience) => (
            <tr
              key={experience._id}
              style={{
                transition: "all 0.2s ease-in-out",
              }}
              className="hover:shadow-lg"
            >
              {/* Experience Image and Title */}
              <td style={{ padding: "16px 24px", minWidth: "350px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={
                      experience?.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + experience?.photo
                        : images.sampleExperienceImage
                    }
                    alt={experience.title}
                    variant="rounded"
                    sx={{
                      width: { md: 80, lg: 90 },
                      height: { md: 60, lg: 68 },
                      mr: 2,
                      borderRadius: 2,
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
                        mb: 0.5,
                        fontSize: { md: "1rem", lg: "1.1rem" },
                      }}
                    >
                      {experience.title}
                    </Typography>
                    {experience.caption &&
                      typeof experience.caption === "string" && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontStyle: "italic",
                            fontSize: { md: "0.875rem", lg: "0.9rem" },
                          }}
                        >
                          {experience.caption}
                        </Typography>
                      )}
                  </Box>
                </Box>
              </td>

              {/* Category */}
              <td style={{ padding: "16px 24px", maxWidth: "200px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FolderOpen
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.text.secondary,
                    }}
                  />
                  {experience.categories &&
                  typeof experience.categories === "string" ? (
                    <Chip
                      size="small"
                      label={experience.categories}
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.secondary.medium,
                        color: theme.palette.secondary.medium,
                        fontSize: { md: "0.75rem", lg: "0.8rem" },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: { md: "0.875rem", lg: "0.9rem" } }}
                    >
                      Sin categorizar
                    </Typography>
                  )}
                </Box>
              </td>

              {/* Created Date */}
              <td style={{ padding: "16px 24px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{ fontSize: { md: "0.875rem", lg: "0.9rem" } }}
                  >
                    {(() => {
                      try {
                        if (!experience.createdAt) return "No disponible";
                        const date = new Date(experience.createdAt);
                        if (isNaN(date.getTime())) return "No válida";
                        return date.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                      } catch {
                        return "No disponible";
                      }
                    })()}
                  </Typography>
                </Box>
              </td>

              {/* Actions */}
              <td style={{ padding: "16px 24px" }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<Eye size={16} />}
                    component={Link}
                    to={`/experience/${experience?.slug}`}
                    sx={{
                      width: { md: "110px", lg: "120px" },
                      textTransform: "none",
                      borderRadius: 30,
                      fontSize: { md: "0.75rem", lg: "0.875rem" },
                      color: theme.palette.secondary.medium,
                      borderColor: theme.palette.secondary.medium,
                      "&:hover": {
                        backgroundColor: `${theme.palette.secondary.medium}10`,
                      },
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Ver
                  </Button>
                  <Button
                    component={Link}
                    to={`/admin/experiences/manage/edit/${experience?.slug}`}
                    sx={{
                      color: theme.palette.primary.black,
                      textTransform: "none",
                      borderRadius: 30,
                      borderColor: theme.palette.primary.black,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}10`,
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    variant="outlined"
                    size="small"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    disabled={isLoadingDeleteData}
                    onClick={() =>
                      deleteDataHandler({ slug: experience?.slug })
                    }
                    sx={{
                      color: theme.palette.error.main,
                      textTransform: "none",
                      borderRadius: 30,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.error.main}10`,
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
        ) : (
          // Mobile/Tablet Card Layout
          <Box sx={{ width: "100%" }}>
            {updatedExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </Box>
        )}
      </DataTable>

      {/* Floating Action Button for Mobile/Tablet */}
      {!isDesktop && (
        <Fab
          component={Link}
          to="/admin/experiences/manage/create"
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            backgroundColor: theme.palette.primary.main,
            color: "white",
            zIndex: 1000,
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <PlusCircle size={isMobile ? 20 : 24} />
        </Fab>
      )}
    </Box>
  );
};

export default ManageExperiences;

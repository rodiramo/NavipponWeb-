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
  Star,
  Eye,
  BarChart3,
  Tags,
  Map,
  TrendingUp,
  Activity,
  Plus,
  PlusCircle,
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
  Tooltip,
  CardMedia,
  Stack,
  Rating,
  Paper,
  Divider,
  LinearProgress,
  Fab,
} from "@mui/material";

const ManageExperiences = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

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

  // Fetch ALL experiences for overview statistics (not paginated)
  const {
    data: allExperiencesData,
    isLoading: isLoadingAllExperiences,
    error: allExperiencesError,
  } = useQuery({
    queryKey: ["allExperiences"],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching all experiences for overview...");

        // Option 1: Use the new backend endpoint (if you added the service function)
        // const data = await getAllExperiencesForModal(jwt);
        // console.log("✅ Fetched all experiences for overview:", data.length);
        // return data;

        // Option 2: Use existing function with high limit (current implementation)
        const response = await getAllExperiences("", 1, 1000); // Get first 1000 experiences
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    onError: (error) => {
      console.error("Failed to load overview statistics:", error);
    },
  });

  useEffect(() => {
    setUpdatedExperiences(experiencesData?.data || []);
  }, [experiencesData]);

  // Calculate overview statistics from ALL experiences
  const overviewStats = useMemo(() => {
    // Use all experiences data for statistics, fall back to paginated data if API fails
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

      // Count regions/prefectures (check multiple possible fields)
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

      // Handle generalTags if available
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

    console.log("📊 Overview statistics calculated:", {
      totalExperiences: experiencesToAnalyze.length,
      categoriesCount: Object.keys(categories).length,
      regionsCount: Object.keys(regions).length,
      tagsCount: Object.keys(tags).length,
      dataSource: allExperiencesData
        ? "All experiences API"
        : "Paginated data fallback",
    });

    return {
      categories,
      regions,
      tags,
      totalExperiences: experiencesToAnalyze.length,
    };
  }, [allExperiencesData, allExperiencesError, updatedExperiences]);

  // Header with Create Button Component

  // Overview Statistics Component
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
      const displayLimit = isExpanded ? null : 5;
      const topItems = getTopItems(data, displayLimit);
      const totalCount = Object.values(data).reduce(
        (sum, count) => sum + count,
        0
      );
      const hasError = allExperiencesError && !isLoading;
      const hasMore = Object.keys(data).length > 5;

      return (
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            transition: "all 0.3s ease",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: hasError
                    ? `${theme.palette.error.main}15`
                    : `${color}15`,
                  color: hasError ? theme.palette.error.main : color,
                  mr: 2,
                }}
              >
                {icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  {title}
                </Typography>
                {isLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Cargando datos...
                  </Typography>
                ) : hasError ? (
                  <Typography variant="body2" color="error.main">
                    Error al cargar datos
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
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
                    fontSize: "0.75rem",
                    minWidth: "auto",
                    p: 1,
                  }}
                >
                  {isExpanded
                    ? "Ver menos"
                    : `Ver todos (${Object.keys(data).length})`}
                </Button>
              )}
            </Box>

            {isLoading ? (
              <Box sx={{ py: 3 }}>
                <LinearProgress sx={{ mb: 2 }} />
                <LinearProgress sx={{ mb: 2 }} />
                <LinearProgress />
              </Box>
            ) : hasError ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                No se pudieron cargar las estadísticas completas
              </Typography>
            ) : topItems.length > 0 ? (
              <Box
                sx={{
                  maxHeight: isExpanded ? "400px" : "auto",
                  overflowY: "auto",
                }}
              >
                {topItems.map(([name, count], index) => {
                  const percentage =
                    totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <Box
                      key={name}
                      sx={{ mb: index < topItems.length - 1 ? 2 : 0 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: isExpanded ? "180px" : "200px",
                          }}
                          title={name} // Show full name on hover
                        >
                          {name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {percentage.toFixed(1)}%
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontWeight: 600,
                              minWidth: "30px",
                              textAlign: "right",
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
                          height: 6,
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
                sx={{ textAlign: "center", py: 2 }}
              >
                {emptyMessage}
              </Typography>
            )}
          </CardContent>
        </Card>
      );
    };

    return (
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {/* Total Experiences Summary */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                borderRadius: "16px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  {isLoadingAllExperiences ? (
                    <>
                      <LinearProgress sx={{ width: 120, mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        Cargando experiencias...
                      </Typography>
                    </>
                  ) : allExperiencesError ? (
                    <>
                      <Typography
                        variant="h3"
                        fontWeight="700"
                        color="error.main"
                      >
                        ⚠️
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        Error al cargar estadísticas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mostrando datos de la página actual
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h3"
                        fontWeight="700"
                        color="primary.main"
                      >
                        {overviewStats.totalExperiences.toLocaleString("es-ES")}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Experiencias Totales
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} md={4}>
            <StatCard
              title="Categorías"
              icon={<FolderOpen size={24} />}
              data={overviewStats.categories}
              color={theme.palette.primary.main}
              emptyMessage="No hay categorías definidas"
              isLoading={isLoadingAllExperiences}
              cardType="categories"
            />
          </Grid>

          {/* Regions/Locations */}
          <Grid item xs={12} md={4}>
            <StatCard
              title="Ubicaciones"
              icon={<Map size={24} />}
              data={overviewStats.regions}
              color={theme.palette.secondary.medium}
              emptyMessage="No hay ubicaciones definidas"
              isLoading={isLoadingAllExperiences}
              cardType="regions"
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12} md={4}>
            <StatCard
              title="Etiquetas"
              icon={<Tags size={24} />}
              data={overviewStats.tags}
              color={theme.palette.info.main}
              emptyMessage="No hay etiquetas definidas"
              isLoading={isLoadingAllExperiences}
              cardType="tags"
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Mobile Card Component
  const ExperienceCard = ({ experience }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Experience Image Header */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
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
      ></CardMedia>

      <CardContent>
        {/* Experience Title */}
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
          {experience.title}
        </Typography>

        {/* Experience Info Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Calendar
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Creado:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {(() => {
                // Check if experience.createdAt exists and is a valid date
                if (!experience.createdAt) {
                  return "Fecha no definida";
                }

                const date = new Date(experience.createdAt);

                if (isNaN(date.getTime())) {
                  return "Fecha no válida";
                }

                return date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
              })()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FolderOpen
                size={16}
                style={{ marginRight: 8, color: theme.palette.neutral.medium }}
              />
              <Typography variant="body2" color="textSecondary">
                Categoría:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {typeof experience.categories === "string"
                ? experience.categories
                : "Sin categorizar"}
            </Typography>
          </Grid>
        </Grid>

        {/* Description Preview */}
        {experience.caption && typeof experience.caption === "string" && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontStyle: "italic",
              }}
            >
              {experience.caption}
            </Typography>
          </Box>
        )}

        {/* Location if available */}
        {experience.location && typeof experience.location === "string" && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MapPin
              size={16}
              style={{ marginRight: 8, color: theme.palette.secondary.main }}
            />
            <Typography variant="body2" color="textSecondary">
              {experience.location}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* View Button */}
          <Button
            startIcon={<Eye size={16} />}
            component={Link}
            to={`/experience/${experience?.slug}`}
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
            to={`/admin/experiences/manage/edit/${experience?.slug}`}
            sx={{
              textTransform: "none",
              borderRadius: 30,
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
          {/* Delete Button */}
          <Button
            disabled={isLoadingDeleteData}
            startIcon={<Trash2 size={16} />}
            onClick={() => deleteDataHandler({ slug: experience?.slug })}
            sx={{
              textTransform: "none",
              borderRadius: 30,
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
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        position: "relative",
      }}
    >
      {/* Header with Create Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 2,
          mb: 3,
          p: 1,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Administrar Experiencias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona todas las experiencias de la plataforma
          </Typography>
        </Box>

        {/* Create Experience Button */}
        <Button
          component={Link}
          to="/admin/experiences/manage/create"
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            px: isMobile ? 2 : 3,
            py: 1.5,
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: isMobile ? "0.9rem" : "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isMobile ? "Nueva Experiencia" : "Crear Nueva Experiencia"}
        </Button>
      </Box>

      {/* Overview Statistics Section */}
      {((!isLoading && updatedExperiences.length > 0) ||
        isLoadingAllExperiences ||
        allExperiencesData) && <OverviewSection />}

      <DataTable
        pageTitle=""
        dataListName="Lista de experiencias"
        searchInputPlaceHolder="Título experiencia..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={
          isMobile ? [] : ["Experiencia", "Categoría", "Creado", "Acciones"]
        }
        isLoading={isLoading}
        isFetching={isFetching}
        data={updatedExperiences}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={experiencesData?.headers}
      >
        {isMobile ? (
          // Mobile Card Layout
          <Box sx={{ width: "100%" }}>
            {updatedExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </Box>
        ) : (
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
              <td
                style={{
                  padding: "16px 24px",
                  minWidth: "350px",
                }}
              >
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
                      width: 80,
                      height: 60,
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
                          }}
                        >
                          {experience.caption}
                        </Typography>
                      )}
                  </Box>
                </Box>
              </td>

              {/* Category */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                  maxWidth: "200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FolderOpen
                    size={16}
                    style={{
                      marginRight: 8,
                      color: theme.palette.neutral.medium,
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
                        fontSize: "0.75rem",
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin categorizar
                    </Typography>
                  )}
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
                    {(() => {
                      try {
                        if (!experience.createdAt) return "Fecha no disponible";

                        const date = new Date(experience.createdAt);

                        if (isNaN(date.getTime())) return "Fecha no válida";

                        return date.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                      } catch {
                        return "Fecha no disponible";
                      }
                    })()}
                  </Typography>
                </Box>
              </td>

              {/* Actions */}
              <td
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${theme.palette.neutral.light}`,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<Eye size={16} />}
                    component={Link}
                    to={`/experience/${experience?.slug}`}
                    sx={{
                      width: "120px",
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
                  <Button
                    component={Link}
                    to={`/admin/experiences/manage/edit/${experience?.slug}`}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      borderRadius: 30,
                      borderColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        borderColor: theme.palette.primary.dark,
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
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      borderRadius: 30,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: theme.palette.error.lightest,
                        borderColor: theme.palette.error.dark,
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

      {/* Floating Action Button for Mobile (Alternative option) */}
      {isMobile && (
        <Fab
          component={Link}
          to="/admin/experiences/manage/create"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            zIndex: 1000,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <PlusCircle size={24} />
        </Fab>
      )}
    </Box>
  );
};

export default ManageExperiences;

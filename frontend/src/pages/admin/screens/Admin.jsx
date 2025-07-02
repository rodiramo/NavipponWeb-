import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getUserCount } from "../../../services/index/users";
import {
  getExperienceCount,
  getTopExperiences,
} from "../../../services/index/experiences";
import { getReviewCount } from "../../../services/index/reviews";
import { getPostCount } from "../../../services/index/posts";
import { getCommentCount } from "../../../services/index/comments";
import { getFavoritesCount } from "../../../services/index/favorites";
import useUser from "../../../hooks/useUser";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";
import {
  Users,
  Star,
  Heart,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react";

const Admin = () => {
  const { jwt } = useUser();
  const theme = useTheme();
  const [counts, setCounts] = useState({
    users: 0,
    experiences: 0,
    reviews: 0,
    posts: 0,
    comments: 0,
  });
  const [topExperiences, setTopExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          usersCount,
          experiencesCount,
          reviewsCount,
          postsCount,
          commentsCount,
          topExperiencesData,
        ] = await Promise.all([
          getUserCount(jwt),
          getExperienceCount(jwt),
          getReviewCount(jwt),
          getPostCount(jwt),
          getCommentCount(jwt),
          getTopExperiences(),
        ]);

        const experiencesWithFavorites = await Promise.all(
          topExperiencesData.map(async (experience) => {
            if (typeof experience.favoritesCount !== "undefined")
              return experience;
            const favoritesData = await getFavoritesCount(experience._id);
            return {
              ...experience,
              favoritesCount: favoritesData.favoritesCount,
            };
          })
        );

        setCounts({
          users: usersCount,
          experiences: experiencesCount,
          reviews: reviewsCount,
          posts: postsCount,
          comments: commentsCount,
        });
        setTopExperiences(experiencesWithFavorites);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwt]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${theme.palette.primary.light}08, ${theme.palette.secondary.light}08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "16px",
            p: 4,
          }}
        >
          <CircularProgress size={32} color="primary" />
          <Typography variant="h6" fontWeight="500">
            Cargando panel de administración...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Calcular totales para los gráficos
  const totalContent =
    counts.experiences + counts.reviews + counts.posts + counts.comments;

  const contentData = [
    {
      name: "Reseñas",
      value: counts.reviews,
      color: theme.palette.warning.main,
      percentage: totalContent
        ? ((counts.reviews / totalContent) * 100).toFixed(1)
        : 0,
    },
    {
      name: "Comentarios",
      value: counts.comments,
      color: theme.palette.error.main,
      percentage: totalContent
        ? ((counts.comments / totalContent) * 100).toFixed(1)
        : 0,
    },
    {
      name: "Publicaciones",
      value: counts.posts,
      color: theme.palette.secondary.main,
      percentage: totalContent
        ? ((counts.posts / totalContent) * 100).toFixed(1)
        : 0,
    },
    {
      name: "Experiencias",
      value: counts.experiences,
      color: theme.palette.primary.main,
      percentage: totalContent
        ? ((counts.experiences / totalContent) * 100).toFixed(1)
        : 0,
    },
  ];

  const experienceData = topExperiences.map((exp, index) => ({
    name:
      exp.title.length > 20 ? exp.title.substring(0, 20) + "..." : exp.title,
    favorites: exp.favoritesCount,
    rank: index + 1,
  }));

  const trendData = [
    { month: "Ene", users: 6, experiences: 28, reviews: 120 },
    { month: "Feb", users: 10, experiences: 29, reviews: 100 },
    { month: "Mar", users: 11, experiences: 25, reviews: 150 },
    { month: "Abr", users: 14, experiences: 32, reviews: 168 },
    {
      month: "May",
      users: counts.users,
      experiences: counts.experiences,
      reviews: counts.reviews,
    },
  ];

  const userGrowth = (((counts.users - 980) / 980) * 100).toFixed(1);
  const expGrowth = (((counts.experiences - 280) / 280) * 100).toFixed(1);
  const reviewGrowth = (((counts.reviews - 1200) / 1200) * 100).toFixed(1);

  const MetricCard = ({ title, value, icon, growth, color }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        transition: "all 0.3s ease",

        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: `${color}10`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Chip
            label={`+${growth}%`}
            size="small"
            sx={{
              backgroundColor: `${theme.palette.success.main}15`,
              color: theme.palette.success.dark,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 500, mb: 1 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="700"
          color="text.primary"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            lineHeight: 1.2,
          }}
        >
          {typeof value === "number" ? value.toLocaleString("es-ES") : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <BarChart3 size={32} color={theme.palette.primary.main} />
            <Typography
              variant="h3"
              fontWeight="800"
              color="text.primary"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.5rem" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Panel de Administración
            </Typography>
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Estadísticas y métricas de rendimiento de{" "}
            <span style={{ color: theme.palette.primary.main }}>Navippon</span>
          </Typography>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total de usuarios"
              value={counts.users}
              icon={<Users size={24} />}
              growth={userGrowth}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Experiencias publicadas"
              value={counts.experiences}
              icon={<Calendar size={24} />}
              growth={expGrowth}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Reseñas escritas"
              value={counts.reviews}
              icon={<Star size={24} />}
              growth={reviewGrowth}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Interacciones totales"
              value={counts.comments + counts.posts}
              icon={<Activity size={24} />}
              growth={
                counts.posts > 0
                  ? ((counts.comments / counts.posts) * 100).toFixed(0)
                  : 0
              }
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Content Distribution Pie Chart */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Distribución de contenido
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name) => [
                        `${value.toLocaleString("es-ES")}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "12px",
                        color: theme.palette.text.primary,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {contentData.map((item) => (
                    <Grid item xs={6} key={item.name}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1,
                          borderRadius: "8px",
                          "&:hover": {
                            backgroundColor: `${item.color}08`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.percentage}% (
                            {item.value.toLocaleString("es-ES")})
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Growth Trends */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Tendencias de crecimiento
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="userGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "12px",
                      color: theme.palette.text.primary,
                    }}
                    labelFormatter={(label) => `Mes: ${label}`}
                    formatter={(value, name) => [
                      value.toLocaleString("es-ES"),
                      name === "users" ? "Usuarios" : name,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={theme.palette.primary.main}
                    fill="url(#userGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Experiences Bar Chart */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color="text.primary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Experiencias más populares por favoritos
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={experienceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                fontSize={12}
              />
              <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  color: theme.palette.text.primary,
                }}
                formatter={(value) => [
                  `${value.toLocaleString("es-ES")} favoritos`,
                  "Favoritos",
                ]}
              />
              <Bar
                dataKey="favorites"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Percentage breakdown */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {topExperiences.map((exp, index) => {
              const totalFavorites = topExperiences.reduce(
                (sum, e) => sum + e.favoritesCount,
                0
              );
              const percentage = totalFavorites
                ? ((exp.favoritesCount / totalFavorites) * 100).toFixed(1)
                : 0;
              return (
                <Grid item xs={12} sm={6} md={2.4} key={exp._id}>
                  <Box
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}08`,
                      borderRadius: "12px",
                      p: 2,
                      textAlign: "center",
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      color="primary.main"
                      gutterBottom
                      sx={{ fontSize: "1.75rem" }}
                    >
                      {percentage}%
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.3,
                        display: "block",
                        fontWeight: 500,
                      }}
                    >
                      {exp.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      <Heart
                        size={14}
                        color={theme.palette.error.main}
                        fill={theme.palette.error.main}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="600"
                      >
                        {exp.favoritesCount.toLocaleString("es-ES")}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Admin;

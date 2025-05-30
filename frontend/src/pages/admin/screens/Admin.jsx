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
  TrendingUp,
  People,
  Star,
  ChatBubbleOutline,
  Favorite,
  Assessment,
} from "@mui/icons-material";

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
        console.error("Error fetching counts", error);
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
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.text.secondary,
          }}
        >
          <CircularProgress size={32} color="primary" />
          <Typography variant="h6">Cargando panel...</Typography>
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
      elevation={2}
      sx={{
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        border: `1px solid ${theme.palette.divider}`,
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
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
          <Chip
            label={`+${growth}%`}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Panel de Análisis
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rendimiento de la plataforma y métricas de participación de usuarios
          </Typography>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total de Usuarios"
              value={counts.users}
              icon={<People />}
              growth={userGrowth}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Experiencias"
              value={counts.experiences}
              icon={<Assessment />}
              growth={expGrowth}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Reseñas"
              value={counts.reviews}
              icon={<Star />}
              growth={reviewGrowth}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Participación"
              value={counts.comments + counts.posts}
              icon={<ChatBubbleOutline />}
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
              elevation={2}
              sx={{
                borderRadius: 3,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="semibold"
                color="text.primary"
                gutterBottom
              >
                Distribución de Contenido
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
                        `${value.toLocaleString()}`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {contentData.map((item) => (
                    <Grid item xs={6} key={item.name}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.percentage}%
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
              elevation={2}
              sx={{
                borderRadius: 3,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="semibold"
                color="text.primary"
                gutterBottom
              >
                Tendencias de Crecimiento
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
                  />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      color: theme.palette.text.primary,
                    }}
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
          elevation={2}
          sx={{
            borderRadius: 3,
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="semibold"
            color="text.primary"
            gutterBottom
          >
            Experiencias Más Populares por Favoritos
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
              />
              <YAxis stroke={theme.palette.text.secondary} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  color: theme.palette.text.primary,
                }}
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
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 2,
                      p: 2,
                      textAlign: "center",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="primary.main"
                      gutterBottom
                    >
                      {percentage}%
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {exp.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      <Favorite
                        fontSize="small"
                        sx={{ mr: 0.5, verticalAlign: "middle" }}
                      />
                      {exp.favoritesCount}
                    </Typography>
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

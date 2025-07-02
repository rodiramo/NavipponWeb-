import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Help,
  Search,
  PlayCircle,
  Map,
  Person,
  Settings,
  QuestionAnswer,
  VideoLibrary,
  MenuBook,
  Lightbulb,
  ExpandMore,
  CheckCircle,
  Schedule,
  Favorite,
  Navigation,
  Hotel,
  Restaurant,
  Attractions,
  Phone,
  Email,
  Chat,
  Clear,
  ArrowForward,
  Star,
  TrendingUp,
  NewReleases,
} from "@mui/icons-material";

const HelpCenterPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const helpCategories = [
    {
      id: "getting-started",
      title: "Primeros Pasos",

      color: theme.palette.primary.main,
      description:
        "Todo lo que necesitas para comenzar tu aventura en Navippon",
      articles: [
        {
          title: "Crear tu primera cuenta",
          time: "2 min",
          difficulty: "Fácil",
          popular: true,
        },
        { title: "Completar tu perfil", time: "3 min", difficulty: "Fácil" },
        {
          title: "Explorar experiencias",
          time: "5 min",
          difficulty: "Fácil",
          popular: true,
        },
        {
          title: "Entender las categorías",
          time: "3 min",
          difficulty: "Fácil",
        },
      ],
    },
    {
      id: "itineraries",
      title: "Gestión de Itinerarios",
      icon: <Map />,
      color: theme.palette.secondary.main,
      description: "Aprende a crear y gestionar tus planes de viaje perfectos",
      articles: [
        {
          title: "Crear tu primer itinerario",
          time: "5 min",
          difficulty: "Medio",
          popular: true,
        },
        {
          title: "Añadir experiencias a itinerarios",
          time: "3 min",
          difficulty: "Fácil",
        },
        {
          title: "Organizar por días de viaje",
          time: "4 min",
          difficulty: "Medio",
        },
        {
          title: "Compartir itinerarios",
          time: "2 min",
          difficulty: "Fácil",
          new: true,
        },
      ],
    },
    {
      id: "experiences",
      title: "Experiencias y Reservas",
      icon: <Attractions />,
      color: theme.palette.success.main,
      description:
        "Descubre cómo encontrar y reservar las mejores experiencias",
      articles: [
        {
          title: "Buscar hoteles por región",
          time: "4 min",
          difficulty: "Fácil",
        },
        {
          title: "Filtrar restaurantes por tipo",
          time: "3 min",
          difficulty: "Fácil",
        },
        {
          title: "Contactar proveedores directamente",
          time: "2 min",
          difficulty: "Fácil",
          popular: true,
        },
        {
          title: "Entender las valoraciones",
          time: "3 min",
          difficulty: "Fácil",
        },
      ],
    },
    {
      id: "account",
      title: "Mi Cuenta",
      icon: <Person />,
      color: theme.palette.info.main,
      description:
        "Gestiona tu cuenta, preferencias y configuración de privacidad",
      articles: [
        {
          title: "Actualizar información personal",
          time: "3 min",
          difficulty: "Fácil",
        },
        { title: "Cambiar contraseña", time: "2 min", difficulty: "Fácil" },
        { title: "Gestionar favoritos", time: "4 min", difficulty: "Fácil" },
        {
          title: "Configurar notificaciones",
          time: "3 min",
          difficulty: "Medio",
        },
        { title: "Eliminar cuenta", time: "2 min", difficulty: "Fácil" },
      ],
    },
    {
      id: "troubleshooting",
      title: "Solución de Problemas",
      icon: <Settings />,
      color: theme.palette.warning.main,
      description: "Resuelve problemas comunes y errores técnicos",
      articles: [
        {
          title: "No puedo iniciar sesión",
          time: "3 min",
          difficulty: "Fácil",
          popular: true,
        },
        {
          title: "Las imágenes no se cargan",
          time: "2 min",
          difficulty: "Fácil",
        },
        {
          title: "Error al crear itinerario",
          time: "4 min",
          difficulty: "Medio",
        },
        { title: "Problema con favoritos", time: "3 min", difficulty: "Fácil" },
        { title: "Página no responde", time: "2 min", difficulty: "Fácil" },
      ],
    },
    {
      id: "advanced",
      title: "Funciones Avanzadas",
      icon: <Lightbulb />,
      color: theme.palette.error.main,
      description: "Aprovecha al máximo todas las características de Navippon",
      articles: [
        {
          title: "Uso de filtros avanzados",
          time: "6 min",
          difficulty: "Avanzado",
        },
        { title: "Optimizar búsquedas", time: "5 min", difficulty: "Medio" },
        {
          title: "Personalizar experiencias",
          time: "7 min",
          difficulty: "Avanzado",
        },
        {
          title: "Atajos de teclado",
          time: "3 min",
          difficulty: "Medio",
          new: true,
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Crear Cuenta",
      icon: <Person />,
      url: "/register",
      color: theme.palette.primary.main,
    },
    {
      title: "Explorar Experiencias",
      icon: <Attractions />,
      url: "/experience",
      color: theme.palette.secondary.main,
    },
    {
      title: "Crear Itinerario",
      icon: <Map />,
      url: "/itinerarios",
      color: theme.palette.success.main,
    },
    {
      title: "Contactar Soporte",
      icon: <Phone />,
      url: "/contact",
      color: theme.palette.warning.main,
    },
  ];

  const popularGuides = [
    {
      title: "Guía Completa: Tu Primer Viaje a Japón",
      description:
        "Todo lo que necesitas saber para planificar tu primera visita a Japón",
      time: "15 min",
      difficulty: "Principiante",
      views: "2.3k",
      rating: 4.9,
    },
    {
      title: "Cómo Crear el Itinerario Perfecto",
      description: "Consejos profesionales para optimizar tu plan de viaje",
      time: "12 min",
      difficulty: "Intermedio",
      views: "1.8k",
      rating: 4.8,
    },
    {
      title: "Reservar Experiencias como un Experto",
      description: "Estrategias para conseguir las mejores reservas en Japón",
      time: "10 min",
      difficulty: "Intermedio",
      views: "1.5k",
      rating: 4.7,
    },
  ];

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.articles.some((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Fácil":
        return theme.palette.success.main;
      case "Medio":
        return theme.palette.warning.main;
      case "Avanzado":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}08 50%,
          ${theme.palette.primary.main}05 100%)`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Box
            sx={{
              display: "inline-flex",
              p: 3,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              mb: 3,
            }}
          >
            <Help sx={{ fontSize: 48, color: theme.palette.primary.main }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Centro de Ayuda
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            ヘルプセンター (Help Center)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Encuentra respuestas, aprende nuevas funciones y aprovecha al máximo
            tu experiencia de planificación de viajes a Japón.
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <TextField
            fullWidth
            placeholder="¿En qué podemos ayudarte? Busca guías, tutoriales o soluciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Clear
                    sx={{
                      cursor: "pointer",
                      color: theme.palette.text.secondary,
                    }}
                    onClick={() => setSearchTerm("")}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                fontSize: "1.1rem",
                py: 1,
              },
            }}
          />
        </Paper>

        {/* Quick Actions */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.secondary.main}20`,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: theme.palette.secondary.main }}
          >
            Acciones Rápidas
          </Typography>

          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Button
                  component={Link}
                  to={action.url}
                  fullWidth
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    textTransform: "none",
                    flexDirection: "column",
                    gap: 1,
                    background: `${action.color}08`,
                    border: `1px solid ${action.color}20`,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      background: `${action.color}15`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      background: `${action.color}20`,
                      color: action.color,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Popular Guides */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.warning.main}20`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TrendingUp
              sx={{ color: theme.palette.warning.main, fontSize: 32 }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: theme.palette.warning.main }}
            >
              Guías Más Populares
            </Typography>
            <Chip
              label="Trending"
              color="warning"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={3}>
            {popularGuides.map((guide, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.warning.main}20`,
                    background: `${theme.palette.warning.main}05`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 25px ${theme.palette.warning.main}20`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PlayCircle sx={{ color: theme.palette.warning.main }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, flex: 1 }}
                      >
                        {guide.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {guide.description}
                    </Typography>

                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip
                        label={guide.time}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={guide.difficulty}
                        size="small"
                        sx={{
                          backgroundColor: `${getDifficultyColor(guide.difficulty)}20`,
                          color: getDifficultyColor(guide.difficulty),
                          border: `1px solid ${getDifficultyColor(guide.difficulty)}30`,
                        }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star
                          sx={{
                            color: theme.palette.warning.main,
                            fontSize: 16,
                          }}
                        />
                        <Typography variant="body2">{guide.rating}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({guide.views} vistas)
                        </Typography>
                      </Box>
                      <ArrowForward
                        sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Help Categories */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary }}
        >
          Categorías de Ayuda
        </Typography>

        <Grid container spacing={4}>
          {(searchTerm ? filteredCategories : helpCategories).map(
            (category) => (
              <Grid item xs={12} md={6} key={category.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, 
                    ${theme.palette.background.paper}95 0%, 
                    ${theme.palette.background.paper}90 100%)`,
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${category.color}20`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 40px ${category.color}15`,
                    },
                  }}
                >
                  {/* Category Header */}
                  <Box
                    sx={{
                      p: 3,
                      background: `linear-gradient(135deg, ${category.color}15, ${category.color}10)`,
                      borderBottom: `1px solid ${category.color}20`,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: `${category.color}20`,
                          color: category.color,
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Box flex={1}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {category.title}
                        </Typography>
                        <Chip
                          label={`${category.articles.length} artículos`}
                          size="small"
                          sx={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>

                  {/* Articles List */}
                  <Box sx={{ p: 2 }}>
                    {category.articles.map((article, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: "8px",
                          mb: 1,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: `${category.color}08`,
                            transform: "translateX(4px)",
                          },
                          "&:last-child": {
                            mb: 0,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              p: 0.5,
                              borderRadius: "6px",
                              background: `${category.color}15`,
                              color: category.color,
                            }}
                          >
                            <MenuBook sx={{ fontSize: 16 }} />
                          </Box>
                          <Box flex={1}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600 }}
                              >
                                {article.title}
                              </Typography>
                              {article.popular && (
                                <Chip
                                  label="Popular"
                                  size="small"
                                  color="warning"
                                  sx={{ fontSize: "0.7rem", height: 20 }}
                                />
                              )}
                              {article.new && (
                                <Chip
                                  label="Nuevo"
                                  size="small"
                                  color="success"
                                  sx={{ fontSize: "0.7rem", height: 20 }}
                                />
                              )}
                            </Box>
                            <Box display="flex" gap={1}>
                              <Chip
                                label={article.time}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                              <Chip
                                label={article.difficulty}
                                size="small"
                                sx={{
                                  backgroundColor: `${getDifficultyColor(article.difficulty)}20`,
                                  color: getDifficultyColor(article.difficulty),
                                  fontSize: "0.7rem",
                                  height: 20,
                                  border: `1px solid ${getDifficultyColor(article.difficulty)}30`,
                                }}
                              />
                            </Box>
                          </Box>
                          <ArrowForward
                            sx={{ color: category.color, fontSize: 18 }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )
          )}
        </Grid>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "20px",
              background: `linear-gradient(135deg, 
                ${theme.palette.background.paper}95 0%, 
                ${theme.palette.background.paper}90 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.grey[300]}`,
              mt: 4,
            }}
          >
            <Search
              sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              No encontramos resultados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No pudimos encontrar artículos que coincidan con "{searchTerm}"
            </Typography>
            <Button
              variant="contained"
              href="/contact"
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Contactar Soporte
            </Button>
          </Paper>
        )}

        {/* Contact Support */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Help
            sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
          />

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            ¿Aún necesitas ayuda?
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}
          >
            Nuestro equipo de soporte está disponible 24/7 para ayudarte con
            cualquier pregunta sobre tu planificación de viaje a Japón.
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              href="mailto:soporte@navippon.com"
              startIcon={<Email />}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              Enviar Email
            </Button>

            <Button
              variant="outlined"
              href="/contact"
              startIcon={<Chat />}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            >
              Chat en Vivo
            </Button>

            <Button
              variant="outlined"
              href="tel:+34-1234-4567"
              startIcon={<Phone />}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
              }}
            >
              Llamar Ahora
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenterPage;

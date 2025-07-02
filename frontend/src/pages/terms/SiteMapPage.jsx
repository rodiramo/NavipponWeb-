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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import MainLayout from "../../components/MainLayout";
import { Link } from "react-router-dom";
import {
  AccountTree,
  Search,
  Home,
  Explore,
  Map,
  Person,
  Help,
  Security,
  Business,
  Login,
  PersonAdd,
  Settings,
  Favorite,
  Navigation,
  Restaurant,
  Hotel,
  Attractions,
  Info,
  ContactMail,
  Accessibility,
  Cookie,
  Gavel,
  PrivacyTip,
  QuestionAnswer,
  Clear,
} from "@mui/icons-material";

const SiteMapPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const siteStructure = [
    {
      id: "main",
      title: "Páginas Principales",
      icon: <Home />,
      color: theme.palette.primary.main,
      pages: [
        {
          title: "Inicio",
          url: "/",
          description: "Página principal de Navippon",
          icon: <Home />,
        },
        {
          title: "Explorar Experiencias",
          url: "/experience",
          description: "Descubre hoteles, restaurantes y atracciones",
          icon: <Explore />,
        },
        {
          title: "Mis Itinerarios",
          url: "/itinerarios",
          description: "Gestiona tus planes de viaje",
          icon: <Map />,
        },
        {
          title: "Acerca de Nosotros",
          url: "/about",
          description: "Conoce más sobre Navippon",
          icon: <Info />,
        },
        {
          title: "Contacto",
          url: "/contact",
          description: "Ponte en contacto con nosotros",
          icon: <ContactMail />,
        },
      ],
    },
    {
      id: "experiences",
      title: "Categorías de Experiencias",
      icon: <Explore />,
      color: theme.palette.secondary.main,
      pages: [
        {
          title: "Hoteles",
          url: "/experience?category=Hoteles",
          description: "Encuentra alojamiento único en Japón",
          icon: <Hotel />,
        },
        {
          title: "Restaurantes",
          url: "/experience?category=Restaurantes",
          description: "Descubre la gastronomía japonesa",
          icon: <Restaurant />,
        },
        {
          title: "Atracciones",
          url: "/experience?category=Atractivos",
          description: "Explora templos, museos y más",
          icon: <Attractions />,
        },
      ],
    },
    {
      id: "regiones",
      title: "Regiones de Japón en Navippon",
      icon: <Map />,
      color: theme.palette.secondary.main,
      pages: [
        {
          title: "Hokkaido",
          url: "/region/Hokkaido",
          description:
            "Naturaleza salvaje, esquí de clase mundial y mariscos frescos en el norte de Japón",
          icon: <Map />,
        },
        {
          title: "Tohoku",
          url: "/region/Tohoku",
          description:
            "Tradiciones ancestrales, festivales coloridos y aguas termales en paisajes montañosos",
          icon: <Map />,
        },
        {
          title: "Kanto",
          url: "/region/Kanto",
          description:
            "El corazón moderno de Japón con Tokio, cultura pop y innovación tecnológica",
          icon: <Map />,
        },
        {
          title: "Kansai",
          url: "/region/Kansai",
          description:
            "Cuna de la cultura japonesa con Kioto, Osaka y los templos más sagrados",
          icon: <Map />,
        },
        {
          title: "Chubu",
          url: "/region/Chubu",
          description:
            "Monte Fuji, Alpes Japoneses y pueblos tradicionales entre montañas",
          icon: <Map />,
        },
        {
          title: "Chugoku",
          url: "/region/Chugoku",
          description:
            "Historia de paz en Hiroshima y jardines tradicionales junto al mar interior",
          icon: <Map />,
        },
        {
          title: "Shikoku",
          url: "/region/Shikoku",
          description:
            "Peregrinación espiritual, templos budistas y la esencia rural de Japón",
          icon: <Map />,
        },
        {
          title: "Kyushu",
          url: "/region/Kyushu",
          description:
            "Volcanes activos, aguas termales únicas y cultura distintiva del sur",
          icon: <Map />,
        },
      ],
    },
    {
      id: "user",
      title: "Área de Usuario",
      icon: <Person />,
      color: theme.palette.success.main,
      pages: [
        {
          title: "Mi Perfil",
          url: "/profile",
          description: "Gestiona tu información personal",
          icon: <Person />,
        },
        {
          title: "Configuración",
          url: "/profile/settings",
          description: "Ajusta tus preferencias",
          icon: <Settings />,
        },
        {
          title: "Mis Favoritos",
          url: "/profile/favorites",
          description: "Experiencias que has marcado como favoritas",
          icon: <Favorite />,
        },
        {
          title: "Historial de Itinerarios",
          url: "/profile/itineraries",
          description: "Todos tus planes de viaje",
          icon: <Navigation />,
        },
      ],
    },
    {
      id: "auth",
      title: "Autenticación",
      icon: <Login />,
      color: theme.palette.info.main,
      pages: [
        {
          title: "Iniciar Sesión",
          url: "/login",
          description: "Accede a tu cuenta",
          icon: <Login />,
        },
        {
          title: "Registrarse",
          url: "/register",
          description: "Crea una nueva cuenta",
          icon: <PersonAdd />,
        },
        {
          title: "Recuperar Contraseña",
          url: "/forgot-password",
          description: "Restablece tu contraseña",
          icon: <Security />,
        },
      ],
    },
    {
      id: "help",
      title: "Ayuda y Soporte",
      icon: <Help />,
      color: theme.palette.warning.main,
      pages: [
        {
          title: "Preguntas Frecuentes",
          url: "/faq",
          description: "Respuestas a las consultas más comunes",
          icon: <QuestionAnswer />,
        },
        {
          title: "Centro de Ayuda",
          url: "/help",
          description: "Guías y tutoriales",
          icon: <Help />,
        },
        {
          title: "Contáctanos",
          url: "/contact",
          description: "Soporte directo",
          icon: <ContactMail />,
        },
      ],
    },
    {
      id: "legal",
      title: "Legal y Políticas",
      icon: <Gavel />,
      color: theme.palette.error.main,
      pages: [
        {
          title: "Términos de Uso",
          url: "/terms",
          description: "Condiciones de uso de la plataforma",
          icon: <Gavel />,
        },
        {
          title: "Política de Privacidad",
          url: "/privacy",
          description: "Cómo protegemos tus datos",
          icon: <PrivacyTip />,
        },

        {
          title: "Accesibilidad",
          url: "/accessibility",
          description: "Compromiso con la accesibilidad",
          icon: <Accessibility />,
        },
      ],
    },
    {
      id: "admin",
      title: "Administración",
      icon: <Business />,
      color: theme.palette.grey[600],
      pages: [
        {
          title: "Panel de Administración",
          url: "/admin",
          description: "Gestión del sitio (solo administradores)",
          icon: <Business />,
        },
        {
          title: "Gestión de Experiencias",
          url: "/admin/experiences",
          description: "Administrar contenido",
          icon: <Settings />,
        },
        {
          title: "Usuarios",
          url: "/admin/users",
          description: "Gestión de usuarios",
          icon: <Person />,
        },
      ],
      restricted: true,
    },
  ];

  // Filter pages based on search term
  const filteredStructure = siteStructure
    .map((section) => ({
      ...section,
      pages: section.pages.filter(
        (page) =>
          page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.pages.length > 0);

  const totalPages = siteStructure.reduce(
    (acc, section) => acc + section.pages.length,
    0
  );
  const publicPages = siteStructure
    .filter((section) => !section.restricted)
    .reduce((acc, section) => acc + section.pages.length, 0);

  return (
    <MainLayout
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
              mt: 19,
            }}
          >
            <AccountTree
              sx={{ fontSize: 48, color: theme.palette.primary.main }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Mapa del Sitio
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            サイトマップ (Site Map)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Encuentra fácilmente cualquier página de Navippon. Todas nuestras
            secciones organizadas para tu conveniencia.
          </Typography>

          {/* Statistics */}
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Chip
              label={`${totalPages} páginas totales`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${publicPages} páginas públicas`}
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${siteStructure.length} secciones`}
              color="success"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Search */}
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
            placeholder="Buscar páginas..."
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
              },
            }}
          />

          {searchTerm && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {filteredStructure.reduce(
                (acc, section) => acc + section.pages.length,
                0
              )}{" "}
              resultados encontrados
            </Typography>
          )}
        </Paper>

        {/* Breadcrumb Style Navigation */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "15px",
            background: `${theme.palette.primary.main}08`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Breadcrumbs
            separator="›"
            sx={{ "& .MuiBreadcrumbs-separator": { mx: 1 } }}
          >
            <MuiLink
              component={Link}
              to="/"
              underline="hover"
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Home sx={{ fontSize: 18 }} />
              Inicio
            </MuiLink>
            <Typography
              color="text.primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AccountTree sx={{ fontSize: 18 }} />
              Mapa del Sitio
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Site Structure */}
        <Grid container spacing={4} mb={4}>
          {(searchTerm ? filteredStructure : siteStructure).map((section) => (
            <Grid item xs={12} md={6} key={section.id}>
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
                  border: `1px solid ${section.color}20`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 40px ${section.color}15`,
                  },
                }}
              >
                {/* Section Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${section.color}15, ${section.color}10)`,
                    borderBottom: `1px solid ${section.color}20`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        background: `${section.color}20`,
                        color: section.color,
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {section.title}
                      </Typography>
                      <Chip
                        label={`${section.pages.length} páginas`}
                        size="small"
                        sx={{
                          backgroundColor: `${section.color}20`,
                          color: section.color,
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                    {section.restricted && (
                      <Chip
                        label="Restringido"
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Pages List */}
                <List sx={{ p: 2 }}>
                  {section.pages.map((page, index) => (
                    <ListItem
                      key={index}
                      component={Link}
                      to={page.url}
                      sx={{
                        borderRadius: "12px",
                        mb: 1,
                        transition: "all 0.2s ease",
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": {
                          backgroundColor: `${section.color}08`,
                          transform: "translateX(8px)",
                        },
                        "&:last-child": {
                          mb: 0,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            p: 0.5,
                            borderRadius: "8px",
                            background: `${section.color}15`,
                            color: section.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {page.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={page.title}
                        secondary={page.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {searchTerm && filteredStructure.length === 0 && (
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
            }}
          >
            <Search
              sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              No se encontraron resultados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No pudimos encontrar páginas que coincidan con "{searchTerm}"
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <Chip
                label="Intenta términos más generales"
                variant="outlined"
                color="primary"
              />
              <Chip
                label="Revisa la ortografía"
                variant="outlined"
                color="secondary"
              />
            </Box>
          </Paper>
        )}
      </Container>
    </MainLayout>
  );
};

export default SiteMapPage;

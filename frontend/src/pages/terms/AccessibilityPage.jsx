import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Accessibility,
  Visibility,
  VolumeUp,
  TouchApp,
  Keyboard,
  Mouse,
  Language,
  Email,
  CheckCircle,
  Info,
  Build,
  Feedback,
} from "@mui/icons-material";
import { Mail, Phone, MessageSquareWarning } from "lucide-react";
import MainLayout from "../../components/MainLayout";

const AccessibilityPage = () => {
  const theme = useTheme();

  const accessibilityFeatures = [
    {
      icon: <Keyboard />,
      title: "Navegación por Teclado",
      description:
        "Navegación completa usando solo el teclado con indicadores de foco visibles",
      status: "Implementado",
    },
    {
      icon: <Visibility />,
      title: "Soporte para Lectores de Pantalla",
      description:
        "Compatible con NVDA, JAWS, VoiceOver y otros lectores de pantalla",
      status: "Implementado",
    },
    {
      icon: <TouchApp />,
      title: "Contraste Alto",
      description: "Cumple con las pautas WCAG AA para contraste de color",
      status: "Implementado",
    },
    {
      icon: <VolumeUp />,
      title: "Texto Alternativo",
      description:
        "Todas las imágenes incluyen descripciones alternativas descriptivas",
      status: "Implementado",
    },
    {
      icon: <Mouse />,
      title: "Zoom y Escalado",
      description: "Soporte para zoom hasta 200% sin pérdida de funcionalidad",
      status: "Implementado",
    },
    {
      icon: <Language />,
      title: "Estructura Semántica",
      description: "HTML semántico con encabezados apropiados y landmarks",
      status: "Implementado",
    },
  ];

  const plannedFeatures = [
    "Modo de alto contraste personalizable",
    "Narración automática de contenido",
    "Traducción automática a lenguaje de señas",
    "Interfaz simplificada para usuarios con discapacidades cognitivas",
    "Soporte para dispositivos de entrada alternativos",
  ];

  const assistiveTech = [
    { name: "NVDA", compatibility: "Completa" },
    { name: "JAWS", compatibility: "Completa" },
    { name: "VoiceOver (macOS/iOS)", compatibility: "Completa" },
    { name: "TalkBack (Android)", compatibility: "Completa" },
    { name: "Dragon NaturallySpeaking", compatibility: "Parcial" },
    { name: "Switch Control", compatibility: "Completa" },
  ];

  return (
    <MainLayout
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}08 50%,
          ${theme.palette.primary.main}05 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Box
            mt={16}
            sx={{
              display: "inline-flex",
              p: 3,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              mb: 3,
            }}
          >
            <Accessibility
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
            Accesibilidad
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            アクセシビリティ (Accessibility)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            En Navippon, creemos que viajar a Japón debe ser accesible para
            todos. Nos comprometemos a hacer que nuestra plataforma sea usable
            por personas con todas las capacidades y necesidades.
          </Typography>
        </Box>

        {/* Commitment Statement */}
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
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}
          >
            Nuestro Compromiso
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.7 }}
          >
            Navippon se compromete a cumplir con las Pautas de Accesibilidad
            para el Contenido Web (WCAG) 2.1 nivel AA. Trabajamos continuamente
            para mejorar la experiencia de todos nuestros usuarios,
            independientemente de sus capacidades físicas, cognitivas o
            tecnológicas.
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip
              label="WCAG 2.1 AA"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Sección 508"
              color={theme.palette.secondary.medium}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="EN 301 549"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Paper>

        {/* Current Accessibility Features */}
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
            border: `1px solid ${theme.palette.success.main}20`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <CheckCircle
              sx={{ color: theme.palette.success.main, fontSize: 32 }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.success.main }}
            >
              Características Implementadas
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {accessibilityFeatures.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background: `${theme.palette.success.main}08`,
                  border: `1px solid ${theme.palette.success.main}20`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      background: `${theme.palette.success.main}20`,
                      color: theme.palette.success.main,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {feature.description}
                </Typography>
                <Chip
                  label={feature.status}
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Assistive Technology Compatibility */}
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
            border: `1px solid ${theme.palette.info.main}20`,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Build sx={{ color: theme.palette.info.main, fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.info.main }}
            >
              Tecnologías Asistivas Compatibles
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            {assistiveTech.map((tech, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: `${theme.palette.info.main}08`,
                  border: `1px solid ${theme.palette.info.main}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {tech.name}
                </Typography>
                <Chip
                  label={tech.compatibility}
                  size="small"
                  color={
                    tech.compatibility === "Completa" ? "success" : "warning"
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Keyboard Navigation Guide */}
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
            border: `1px solid ${theme.palette.secondary.main}20`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: theme.palette.secondary.medium,
            }}
          >
            Guía de Navegación por Teclado
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {[
              {
                key: "Tab",
                action: "Navegar al siguiente elemento interactivo",
              },
              { key: "Shift + Tab", action: "Navegar al elemento anterior" },
              { key: "Enter", action: "Activar enlaces y botones" },
              { key: "Espacio", action: "Activar botones y checkboxes" },
              { key: "Flechas", action: "Navegar entre opciones de menú" },
              { key: "Escape", action: "Cerrar diálogos y menús" },
            ].map((shortcut, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: `${theme.palette.secondary.main}08`,
                  border: `1px solid ${theme.palette.secondary.main}20`,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {shortcut.key}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {shortcut.action}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Future Improvements */}
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
            <Info sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.warning.main }}
            >
              Mejoras Planificadas
            </Typography>
          </Box>

          <List>
            {plannedFeatures.map((feature, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: theme.palette.warning.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={feature}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Contact and Feedback */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <MessageSquareWarning size={48} color={theme.palette.primary.main} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
            ¿Encontraste un Problema de Accesibilidad?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}
          >
            Tu feedback es invaluable para mejorar la accesibilidad de Navippon.
            Si encuentras alguna barrera o tienes sugerencias, por favor
            contáctanos.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              href="mailto:infonavippon@gmail.com"
              startIcon={<Mail />}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                background: `linear-gradient(135deg, ${theme.palette.primary.main},)`,
              }}
            >
              Reportar Problema
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
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            >
              Llamar Soporte
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Nos comprometemos a responder a todas las consultas de accesibilidad
            dentro de 48 horas.
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default AccessibilityPage;

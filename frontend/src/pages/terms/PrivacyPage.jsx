import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PrivacyTip,
  Security,
  DataUsage,
  Cookie,
  Share,
  Delete,
  Download,
  Edit,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { Mail } from "lucide-react"; // Use Mail icon for email links
import MainLayout from "../../components/MainLayout";

const PrivacyPage = () => {
  const theme = useTheme();

  const dataTypes = [
    {
      type: "Información de Cuenta",
      data: "Nombre, email, contraseña (encriptada)",
    },
    {
      type: "Información de Perfil",
      data: "Foto de perfil, preferencias de viaje",
    },
    {
      type: "Datos de Uso",
      data: "Páginas visitadas, tiempo en el sitio, clics",
    },
    {
      type: "Información Técnica",
      data: "Dirección IP, tipo de navegador, dispositivo",
    },
    {
      type: "Datos de Itinerarios",
      data: "Destinos, fechas, experiencias seleccionadas",
    },
    {
      type: "Comunicaciones",
      data: "Mensajes de soporte, feedback, consultas",
    },
  ];

  const userRights = [
    {
      right: "Acceso",
      description: "Solicitar una copia de sus datos personales",
      icon: <Download />,
    },
    {
      right: "Rectificación",
      description: "Corregir datos inexactos o incompletos",
      icon: <Edit />,
    },
    {
      right: "Eliminación",
      description: "Solicitar la eliminación de sus datos",
      icon: <Delete />,
    },
    {
      right: "Portabilidad",
      description: "Transferir sus datos a otro servicio",
      icon: <Share />,
    },
    {
      right: "Oposición",
      description: "Oponerse al procesamiento de sus datos",
      icon: <Warning />,
    },
    {
      right: "Limitación",
      description: "Restringir el procesamiento de sus datos",
      icon: <Security />,
    },
  ];

  const sections = [
    {
      id: "introduction",
      title: "1. Introducción",
      icon: <PrivacyTip />,
      content: `En Navippon, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza nuestra plataforma.

Esta política cumple con el Reglamento General de Protección de Datos (GDPR), la Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y otras leyes de privacidad aplicables.

Al utilizar Navippon, usted acepta las prácticas descritas en esta política.`,
    },
    {
      id: "data-controller",
      title: "2. Responsable del Tratamiento",
      icon: <Security />,
      content: `Responsable del tratamiento:
Navippon S.L.
Av. La Paz 1536, Madrid, España
Email: infonavippon@gmail.com
Teléfono: +34-1234-4567

Para cualquier consulta relacionada con la privacidad de sus datos, puede contactarnos a través de los canales mencionados anteriormente.`,
    },
    {
      id: "data-collection",
      title: "3. Información que Recopilamos",
      icon: <DataUsage />,
      content: `Recopilamos información de las siguientes maneras:

Información que usted nos proporciona directamente:
• Datos de registro (nombre, email, contraseña)
• Información de perfil y preferencias
• Contenido que crea (itinerarios, reseñas, fotos)
• Comunicaciones con nuestro equipo de soporte

Información recopilada automáticamente:
• Datos de uso y navegación
• Información técnica del dispositivo
• Dirección IP y ubicación aproximada
• Cookies y tecnologías similares

Información de terceros:
• Datos de redes sociales (si se conecta mediante login social)
• Información de proveedores de servicios de pago
• Datos de Google Places para experiencias verificadas`,
    },
  ];

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
            <PrivacyTip
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
            Política de Privacidad
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            プライバシーポリシー (Privacy Policy)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: "1.1rem" }}
          >
            <strong>Última actualización:</strong> 16 de Junio de 2025
          </Typography>

          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            flexWrap="wrap"
            mb={3}
          >
            <Chip
              label="GDPR Compliant"
              color="primary"
              icon={<CheckCircle />}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="LOPDGDD"
              color="secondary"
              icon={<Security />}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="ISO 27001"
              color="success"
              icon={<Security />}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Introduction Sections */}
        {sections.map((section, index) => (
          <Paper
            key={section.id}
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: "20px",
              overflow: "hidden",
              background: `linear-gradient(135deg, 
                ${theme.palette.background.paper}95 0%, 
                ${theme.palette.background.paper}90 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
                borderBottom: `1px solid ${theme.palette.primary.main}20`,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    background: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                  }}
                >
                  {section.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
                  {section.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </Typography>
            </Box>
          </Paper>
        ))}

        {/* Data Types We Collect */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.info.main}20`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.info.main}10, ${theme.palette.info.main}05)`,
              borderBottom: `1px solid ${theme.palette.info.main}20`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background: `${theme.palette.info.main}20`,
                  color: theme.palette.info.main,
                }}
              >
                <DataUsage />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                4. Tipos de Datos que Procesamos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {dataTypes.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    background: `${theme.palette.info.main}08`,
                    border: `1px solid ${theme.palette.info.main}20`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.info.main,
                    }}
                  >
                    {item.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.data}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* How We Use Data */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.secondary.main}20`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}10, ${theme.palette.secondary.main}05)`,
              borderBottom: `1px solid ${theme.palette.secondary.main}20`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background: `${theme.palette.secondary.main}20`,
                  color: theme.palette.secondary.main,
                }}
              >
                <Security />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                5. Cómo Utilizamos sus Datos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Utilizamos sus datos personales para los siguientes propósitos:
            </Typography>

            <List>
              {[
                "Proporcionar y mantener nuestros servicios",
                "Crear y gestionar su cuenta de usuario",
                "Personalizar su experiencia de viaje",
                "Comunicarnos con usted sobre su cuenta y servicios",
                "Mejorar nuestros servicios y desarrollar nuevas funcionalidades",
                "Cumplir con obligaciones legales y regulatorias",
                "Prevenir fraude y garantizar la seguridad de la plataforma",
              ].map((purpose, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle
                      sx={{ color: theme.palette.secondary.main, fontSize: 20 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={purpose}
                    primaryTypographyProps={{ fontSize: "1rem" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        {/* User Rights */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.success.main}20`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.success.main}10, ${theme.palette.success.main}05)`,
              borderBottom: `1px solid ${theme.palette.success.main}20`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background: `${theme.palette.success.main}20`,
                  color: theme.palette.success.main,
                }}
              >
                <Security />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                6. Sus Derechos como Usuario
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Bajo el GDPR y la LOPDGDD, usted tiene los siguientes derechos:
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {userRights.map((right, index) => (
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
                      {right.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {right.right}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {right.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Cookies Policy */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: "20px",
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.warning.main}20`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.warning.main}05)`,
              borderBottom: `1px solid ${theme.palette.warning.main}20`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  background: `${theme.palette.warning.main}20`,
                  color: theme.palette.warning.main,
                }}
              >
                <Cookie />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                7. Cookies y Tecnologías de Seguimiento
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Utilizamos cookies y tecnologías similares para:
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mb: 3,
              }}
            >
              {[
                {
                  type: "Cookies Esenciales",
                  purpose: "Necesarias para el funcionamiento básico del sitio",
                },
                {
                  type: "Cookies de Análisis",
                  purpose: "Para entender cómo usa nuestro sitio web",
                },
                {
                  type: "Cookies de Preferencias",
                  purpose: "Para recordar sus configuraciones y preferencias",
                },
                {
                  type: "Cookies de Marketing",
                  purpose: "Para mostrar contenido relevante y personalizado",
                },
              ].map((cookie, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: "8px",
                    background: `${theme.palette.warning.main}08`,
                    border: `1px solid ${theme.palette.warning.main}20`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {cookie.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cookie.purpose}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Puede gestionar sus preferencias de cookies a través de la
              configuración de su navegador. Sin embargo, deshabilitar ciertas
              cookies puede afectar la funcionalidad del sitio.
            </Typography>
          </Box>
        </Paper>

        {/* Contact for Privacy */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "20px",
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <PrivacyTip
            sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
          />

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            ¿Preguntas sobre Privacidad?
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}
          >
            Para ejercer sus derechos de privacidad o hacer consultas sobre el
            tratamiento de sus datos personales, puede contactarnos a través de
            los siguientes medios:
          </Typography>

          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            flexWrap="wrap"
            mb={3}
          >
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              Contactar
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Nos comprometemos a responder a todas las consultas de privacidad
            dentro de 30 días.
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PrivacyPage;

import React, { useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import { ExpandMore, HelpOutline, Settings } from "@mui/icons-material";

import MainLayout from "../../components/MainLayout";
import { Calendar, MapPin, Plane, MessageCircle, Mail } from "lucide-react";
const FAQPage = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqCategories = [
    {
      id: "general",
      title: "General",
      icon: <HelpOutline />,
      color: theme.palette.primary.main,
      questions: [
        {
          id: "what-is-navippon",
          question: "¿Qué es Navippon?",
          answer:
            "Navippon es una plataforma digital que te ayuda a planificar tu viaje perfecto a Japón. Puedes explorar experiencias únicas, crear itinerarios personalizados y descubrir los mejores hoteles, restaurantes y atracciones del país del sol naciente.",
        },
        {
          id: "how-to-start",
          question: "¿Cómo empiezo a usar Navippon?",
          answer:
            "Es muy sencillo: 1) Crea tu cuenta gratuita, 2) Explora nuestras experiencias verificadas, 3) Crea tu primer itinerario, 4) Añade las experiencias que más te interesen. ¡Y listo para tu aventura japonesa!",
        },
        {
          id: "is-free",
          question: "¿Es gratis usar Navippon?",
          answer:
            "Sí, crear una cuenta y usar las funciones básicas de Navippon es completamente gratuito. Puedes explorar experiencias, crear itinerarios y gestionar tus favoritos sin costo alguno.",
        },
      ],
    },
    {
      id: "itineraries",
      title: "Itinerarios",
      icon: <Calendar />,
      color: theme.palette.secondary.main,
      questions: [
        {
          id: "create-itinerary",
          question: "¿Cómo creo un itinerario?",
          answer:
            "Ve a 'Mis Itinerarios' y haz clic en 'Crear Nuevo Itinerario'. Define las fechas de tu viaje, el número de días y comienza a añadir experiencias. Puedes organizar tus actividades por días y personalizar tu plan de viaje.",
        },
        {
          id: "share-itinerary",
          question: "¿Puedo compartir mi itinerario con otros?",
          answer:
            "Actualmente estamos trabajando en la función de compartir itinerarios. Próximamente podrás enviar tus planes de viaje a amigos y familiares directamente desde la plataforma.",
        },
        {
          id: "modify-itinerary",
          question: "¿Puedo modificar mi itinerario después de crearlo?",
          answer:
            "¡Por supuesto! Puedes editar tu itinerario en cualquier momento: añadir o quitar experiencias, cambiar fechas, reorganizar actividades por días. Tu itinerario es totalmente flexible.",
        },
      ],
    },
    {
      id: "experiences",
      title: "Experiencias",
      icon: <MapPin />,
      color: theme.palette.warning.main,
      questions: [
        {
          id: "types-experiences",
          question: "¿Qué tipos de experiencias ofrecen?",
          answer:
            "Ofrecemos tres categorías principales: Hoteles (desde ryokans tradicionales hasta hoteles modernos), Restaurantes (desde sushi de alta calidad hasta ramen auténtico) y Atractivos (templos, museos, parques y experiencias culturales únicas).",
        },
        {
          id: "verified-experiences",
          question: "¿Las experiencias están verificadas?",
          answer:
            "Sí, todas nuestras experiencias son cuidadosamente seleccionadas y verificadas por nuestro equipo. Trabajamos con Google Places y realizamos una curación manual para asegurar calidad y autenticidad.",
        },
        {
          id: "book-directly",
          question: "¿Puedo reservar directamente desde Navippon?",
          answer:
            "Actualmente Navippon funciona como una plataforma de planificación. Te proporcionamos toda la información necesaria (teléfono, sitio web, ubicación) para que puedas contactar directamente con los establecimientos para realizar tus reservas.",
        },
      ],
    },
    {
      id: "account",
      title: "Mi Cuenta",
      icon: <Settings />,
      color: theme.palette.success.main,
      questions: [
        {
          id: "forgot-password",
          question: "Olvidé mi contraseña, ¿qué hago?",
          answer:
            "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e introduce tu email. Te enviaremos un enlace para restablecer tu contraseña de forma segura.",
        },
        {
          id: "change-email",
          question: "¿Puedo cambiar mi email o información personal?",
          answer:
            "Sí, puedes actualizar tu información personal desde tu perfil de usuario. Ve a 'Mi Cuenta' > 'Configuración' para modificar tu email, nombre y otras preferencias.",
        },
        {
          id: "delete-account",
          question: "¿Cómo elimino mi cuenta?",
          answer:
            "Si deseas eliminar tu cuenta, contáctanos a través de infonavippon@gmail.com. Procesaremos tu solicitud y eliminaremos todos tus datos de acuerdo con nuestra política de privacidad.",
        },
      ],
    },
    {
      id: "travel",
      title: "Viajar a Japón",
      icon: <Plane />,
      color: theme.palette.info.main,
      questions: [
        {
          id: "best-time-visit",
          question: "¿Cuál es la mejor época para visitar Japón?",
          answer:
            "Japón es hermoso todo el año. Primavera (marzo-mayo) es ideal para los cerezos en flor, verano (junio-agosto) para festivales, otoño (septiembre-noviembre) para los colores del follaje, e invierno (diciembre-febrero) para nieve y deportes de invierno.",
        },
        {
          id: "visa-requirements",
          question: "¿Necesito visa para viajar a Japón?",
          answer:
            "Depende de tu nacionalidad. Los ciudadanos de la UE, España incluida, pueden ingresar sin visa por hasta 90 días como turistas. Te recomendamos verificar los requisitos específicos con el consulado japonés de tu país.",
        },
        {
          id: "language-barrier",
          question: "¿Es difícil viajar a Japón sin hablar japonés?",
          answer:
            "¡Para nada! Muchas señales están en inglés, especialmente en áreas turísticas. Los japoneses son muy serviciales, y con aplicaciones de traducción y gestos puedes comunicarte perfectamente. Navippon te ayuda a planificar todo con anticipación.",
        },
      ],
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
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box textAlign="center" mb={6} mt={19}>
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
            Preguntas frecuentes
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            よくある質問 (Yoku aru shitsumon)
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}
          >
            Encuentra respuestas a las preguntas más comunes sobre Navippon y
            planificación de viajes a Japón
          </Typography>
        </Box>

        {/* FAQ Categories */}
        {faqCategories.map((category) => (
          <Paper
            key={category.id}
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: "20px",
              overflow: "hidden",
              background: `linear-gradient(135deg, 
                ${theme.palette.background.paper}95 0%, 
                ${theme.palette.background.paper}90 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${category.color}20`,
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
              <Box display="flex" alignItems="center" gap={2}>
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
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
                  {category.title}
                </Typography>
                <Chip
                  label={`${category.questions.length} preguntas`}
                  size="small"
                  sx={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            {/* Questions */}
            <Box sx={{ p: 2 }}>
              {category.questions.map((faq, index) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === `${category.id}-${index}`}
                  onChange={handleChange(`${category.id}-${index}`)}
                  elevation={0}
                  sx={{
                    mb: 1,
                    borderRadius: "12px !important",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      background: `${category.color}08`,
                      border: `1px solid ${category.color}20`,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: category.color }} />}
                    sx={{
                      borderRadius: "12px",
                      "&.Mui-expanded": {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "1.1rem",
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      pt: 0,
                      borderTop: `1px solid ${category.color}15`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        fontSize: "1rem",
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        ))}

        {/* Contact Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            mb: 6,
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <MessageCircle
            size={48}
            color={theme.palette.primary.main}
            style={{ marginBottom: "16px" }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            ¿No encuentras lo que buscas?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "500px", mx: "auto" }}
          >
            Nuestro equipo de soporte está aquí para ayudarte con cualquier
            pregunta adicional sobre tu viaje a Japón.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              startIcon={<Mail />}
              variant="contained"
              href="mailto:infonavippon@gmail.com"
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              }}
            >
              Contactar Soporte
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default FAQPage;

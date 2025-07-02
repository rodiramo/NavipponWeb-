// OnboardingGuide.jsx - Interactive guide for new users
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Backdrop,
  useTheme,
  Tooltip,
  Zoom,
} from "@mui/material";
import {
  X,
  MapPin,
  Heart,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

const OnboardingGuide = ({ open, onClose, user }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a Navippon!",
      icon: <Sparkles size={48} />,
      content:
        "Tu compañero perfecto para planificar viajes inolvidables por Japón",
      illustration: "/assets/welcome-illustration.svg",
    },
    {
      title: "Explora experiencias",
      icon: <MapPin size={48} />,
      content:
        "Descubre hoteles, restaurantes y atracciones en todo Japón. Usa los filtros para encontrar exactamente lo que buscas.",
      illustration: "/assets/explore-illustration.svg",
    },
    {
      title: "Guarda tus favoritos",
      icon: <Heart size={48} />,
      content:
        "Haz clic en el corazón para guardar tus lugares favoritos. Los encontrarás fácilmente cuando crees tu itinerario.",
      illustration: "/assets/favorites-illustration.svg",
    },
    {
      title: "Crea tu itinerario",
      icon: <Calendar size={48} />,
      content:
        "Organiza tu viaje día por día. Arrastra tus favoritos al calendario y nosotros calculamos el presupuesto automáticamente.",
      illustration: "/assets/itinerary-illustration.svg",
    },
    {
      title: "Viaja con amigos",
      icon: <Users size={48} />,
      content:
        "Invita a tus compañeros de viaje para planificar juntos. Todos pueden ver y editar el itinerario en tiempo real.",
      illustration: "/assets/friends-illustration.svg",
    },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    // Save that user has completed onboarding
    localStorage.setItem("onboardingCompleted", "true");
    onClose();
  };

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      }}
    >
      <Fade in={open}>
        <Card
          sx={{
            position: "relative",
            maxWidth: 600,
            width: "90%",
            overflow: "auto",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}95, ${theme.palette.background.paper}85)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.divider}40`,
            boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <X size={20} />
          </IconButton>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {/* Progress */}
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          display: { xs: "none", sm: "block" },
                        },
                      }}
                    >
                      {step.title}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Current Step Content */}
            <Zoom in key={activeStep}>
              <Box
                sx={{
                  textAlign: "center",
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    color: theme.palette.primary.main,
                  }}
                >
                  {steps[activeStep].icon}
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {steps[activeStep].title}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 400,
                    lineHeight: 1.6,
                  }}
                >
                  {steps[activeStep].content}
                </Typography>
              </Box>
            </Zoom>

            {/* Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ChevronLeft />}
                sx={{
                  textTransform: "none",
                  visibility: activeStep === 0 ? "hidden" : "visible",
                }}
              >
                Anterior
              </Button>

              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={
                  activeStep === steps.length - 1 ? <Check /> : <ChevronRight />
                }
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                  px: 4,
                  py: 1.5,
                  borderRadius: 30,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {activeStep === steps.length - 1 ? "¡Empezar!" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Fade>
    </Backdrop>
  );
};

// FloatingHelpButton.jsx - Persistent help button
const FloatingHelpButton = ({ onClick }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip title="¿Necesitas ayuda?" placement="left" arrow>
      <Box
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          zIndex: 1000,
          "&:hover": {
            transform: "translateY(-4px) scale(1.1)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              transition: "all 0.3s ease",
              width: isHovered ? "auto" : 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {isHovered && "Ayuda"}
          </Typography>
          <Typography sx={{ fontSize: "1.5rem" }}>?</Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

// QuickStartCard.jsx - Feature highlight card
const QuickStartCard = ({ onStartItinerary }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        borderRadius: 4,
        p: 4,
        mb: 4,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${theme.palette.primary.main}30`,
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",

          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ¿Listo para planificar tu viaje?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Crea tu itinerario perfecto en 3 simples pasos: explora experiencias,
          guarda tus favoritos y organiza tu viaje día por día.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            onClick={onStartItinerary}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              borderRadius: 30,
              px: 4,
              textTransform: "none",
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Crear mi itinerario
            <div className="w-6 h-6 ml-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>{" "}
          </Button>{" "}
        </Box>
      </Box>
    </Box>
  );
};

// FeatureTips.jsx - Contextual tips
const FeatureTips = () => {
  const theme = useTheme();
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: <Heart size={20} />,
      text: "💡 Consejo: Guarda tus lugares favoritos haciendo clic en el corazón",
    },
    {
      icon: <Calendar size={20} />,
      text: "📅 Consejo: Arrastra y suelta para organizar tu itinerario fácilmente",
    },
    {
      icon: <Users size={20} />,
      text: "👥 Consejo: Invita amigos para planificar juntos en tiempo real",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <Fade in key={currentTip}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.info.light}15)`,
          borderRadius: 3,
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: `1px solid ${theme.palette.info.main}30`,
        }}
      >
        {tips[currentTip].icon}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {tips[currentTip].text}
        </Typography>
      </Box>
    </Fade>
  );
};

export { OnboardingGuide, FloatingHelpButton, QuickStartCard, FeatureTips };

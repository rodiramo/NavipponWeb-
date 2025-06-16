import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, MapPin, Compass } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}08 50%,
          ${theme.palette.primary.main}05 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}10 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      {/* Floating Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      >
        <MapPin size={48} color={theme.palette.primary.main} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "15%",
          opacity: 0.1,
          animation: "float 8s ease-in-out infinite",
          animationDelay: "2s",
        }}
      >
        <Compass size={64} color={theme.palette.secondary.main} />
      </Box>

      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper}95 0%, 
              ${theme.palette.background.paper}90 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.primary.main}20`,
            borderRadius: "32px",
            padding: { xs: 4, md: 6 },
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", md: "8rem", lg: "10rem" },
              fontWeight: 900,
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              mb: 2,
              letterSpacing: "-0.02em",
              position: "relative",
              "&::after": {
                content: '"404"',
                position: "absolute",
                top: "30px",
                left: "250px",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                zIndex: -1,
              },
            }}
          >
            404
          </Typography>

          {/* Main Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            ¡Oops! Página No Encontrada
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            道に迷いました (Michi ni mayoimashita)
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontStyle: "italic",
              opacity: 0.8,
            }}
          >
            "Nos hemos perdido en el camino"
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 5,
              maxWidth: "500px",
              margin: "0 auto 2.5rem auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            La página que buscas parece haber tomado un desvío en tu viaje por
            Japón. ¡Pero no te preocupes! Te ayudamos a encontrar el camino de
            vuelta.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Primary Button */}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              startIcon={<Home size={20} />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                border: "none",
                minWidth: { xs: "100%", sm: "auto" },
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
                },
              }}
            >
              Volver al Inicio
            </Button>

            {/* Secondary Button */}
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft size={20} />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                minWidth: { xs: "100%", sm: "auto" },
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                  background: `${theme.palette.primary.main}08`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Página Anterior
            </Button>
          </Box>

          {/* Footer Message */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 4,
              color: theme.palette.text.secondary,
              opacity: 0.7,
              fontSize: "0.875rem",
            }}
          >
            Si necesitas ayuda, no dudes en contactarnos
          </Typography>
        </Box>
      </Container>

      {/* Additional Floating Elements */}
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          opacity: 0.08,
          animation: "float 10s ease-in-out infinite",
          animationDelay: "4s",
        }}
      >
        <Box
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "12%",
          opacity: 0.06,
          animation: "float 12s ease-in-out infinite",
          animationDelay: "6s",
        }}
      >
        <Box
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "20px",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            transform: "rotate(45deg)",
          }}
        />
      </Box>
    </Box>
  );
};

export default NotFound;

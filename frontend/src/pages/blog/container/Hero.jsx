import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Container, Chip } from "@mui/material";

const Hero = ({ user, jwt }) => {
  // ✅ Fixed props destructuring
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "60vh", sm: "50vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingY: { xs: 6, sm: 8, md: 15 },
        paddingX: { xs: 2, sm: 4 },
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}05 50%, 
          ${theme.palette.background.default} 100%)`,
        borderRadius: {
          xs: "0 0 30px 30px",
          sm: "0 0 40px 40px",
          md: "0 0 50px 50px",
        },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 30%, ${theme.palette.primary.main}12 0%, transparent 50%), 
                      radial-gradient(circle at 70% 80%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 4 },
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
            lineHeight: { xs: 1.1, sm: 1.2 },
            maxWidth: "900px",
            letterSpacing: "-0.02em",
          }}
        >
          Comparte, Conecta y Descubre Japón
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            fontWeight: 400,
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
            maxWidth: "700px",
            opacity: 0.9,
          }}
        >
          Publica tus experiencias, descubre historias de otros viajeros y
          conecta con una{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            comunidad apasionada
          </Box>{" "}
          por Japón.
        </Typography>
      </Container>
    </Box>
  );
};

export default Hero;

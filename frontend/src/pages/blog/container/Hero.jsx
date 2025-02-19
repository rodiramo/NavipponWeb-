import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "3rem 1rem",
        borderRadius: "0 0 50px 50px",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/assets/bg-blog.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)", // Blur effect
          zIndex: -2,
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: theme.palette.secondary.dark,
          opacity: 0.6, // Adjust transparency for better readability
          zIndex: -1,
        }}
      />

      {/* Hero Content */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          paddingTop: "50px",
          fontSize: "2.5rem",
          maxWidth: "800px",
          color: theme.palette.primary.contrastText,
        }}
      >
        Comparte, Conecta y Descubre Japón
      </Typography>

      <Typography
        variant="h5"
        sx={{
          marginTop: "1rem",
          maxWidth: "700px",
          opacity: 0.9,
          color: theme.palette.primary.contrastText,
        }}
      >
        Publica tus experiencias, descubre historias de otros viajeros y conecta
        con una comunidad apasionada por Japón.
      </Typography>
    </Box>
  );
};

export default Hero;

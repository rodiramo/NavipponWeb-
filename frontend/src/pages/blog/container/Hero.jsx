import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";
import { Pencil, Users } from "lucide-react"; // Icons for modern look

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.light,
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "3rem 1rem",
        borderRadius: "0 0 50px 50px",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          maxWidth: "800px",
        }}
      >
        Comparte, Conecta y Descubre Japón 🇯🇵✨
      </Typography>

      <Typography
        variant="h5"
        sx={{
          marginTop: "1rem",
          maxWidth: "700px",
          opacity: 0.85,
        }}
      >
        Publica tus experiencias, descubre historias de otros viajeros y conecta
        con una comunidad apasionada por Japón.
      </Typography>
    </Box>
  );
};

export default Hero;

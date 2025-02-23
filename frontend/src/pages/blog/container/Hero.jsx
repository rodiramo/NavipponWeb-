import React, { useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Modal, Button } from "@mui/material";
import PostForm from "../../../components/PostForm";
const Hero = (user, jwt) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
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

      {/* ✅ Floating "Create Post" Button */}
      {user && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "30px",
            minWidth: "auto",
            marginTop: "1rem",
            textTransform: "none",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          Subir una Publicación
        </Button>
      )}

      {/* ✅ Create Post Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          }}
        >
          <Box
            sx={{
              width: "95%",
              maxWidth: "800px",
              maxHeight: "95vh",
              overflowY: "auto", // Enables scrolling if content is too large
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "10px",
            }}
          >
            <PostForm onClose={() => setOpen(false)} token={jwt} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Hero;

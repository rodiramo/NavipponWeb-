import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Container, Button } from "@mui/material";
import { Pencil } from "lucide-react";
const nube = "./assets/nube.png";

const Hero = ({ user, jwt, onOpenModal }) => {
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
        paddingTop: { xs: 15, sm: 20, md: 20 },
        paddingX: { xs: 2, sm: 4 },
        borderRadius: {
          xs: "0 0 30px 30px",
          sm: "0 0 40px 40px",
          md: "0 0 50px 50px",
        },
        overflow: "hidden",
      }}
    >
      {" "}
      {/* Floating Cloud Element - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: "120px",
          height: "80px",
          opacity: "50%",
          backgroundImage: `url(${nube})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      {/* Floating Cloud Element - Bottom Left */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          opacity: "50%",
          left: "10%",
          width: "120px",
          height: "80px",
          backgroundImage: `url(${nube})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
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
          Comparte, conecta y descubre Japón
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

        {/* Call-to-Action Buttons - Only show if user is logged in */}
        {user && jwt && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: 2,
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onOpenModal}
              startIcon={<Pencil />}
              sx={{
                borderRadius: "50px",
                padding: { xs: "12px 32px", sm: "16px 40px" },
                fontSize: { xs: "1rem", sm: "1.125rem" },
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                minWidth: { xs: "250px", sm: "auto" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                "&:hover": {
                  boxShadow: "none",
                  "& .MuiButton-startIcon": {
                    transform: "translateX(4px) rotate(15deg)",
                  },
                },
                "& .MuiButton-startIcon": {
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "center",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              Subir una Publicación
            </Button>
          </Box>
        )}

        {/* Welcome Message for logged-in users */}
        {user && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textAlign: "center",
              }}
            >
              ¡Hola,{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                {user.name}
              </Box>
              ! Bienvenido de vuelta
            </Typography>
          </Box>
        )}

        {/* Guest Call-to-Action */}
        {!user && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              backgroundColor: `${theme.palette.primary.main}08`,
              borderRadius: "20px",
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textAlign: "center",
                mb: 2,
              }}
            >
              ¿Quieres compartir tus experiencias en Japón?
            </Typography>
            <Button
              variant="contained"
              size="medium"
              href="/login"
              sx={{
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Hero;

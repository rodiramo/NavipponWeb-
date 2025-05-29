import { useTheme } from "@mui/material/styles";
import { Box, Typography, Container, useMediaQuery } from "@mui/material";

const Seccion1 = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const logoSrc = isDarkMode
    ? "/assets/navippon-logo-white.png"
    : "/assets/navippon-icon.png";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "80vh" },
        position: "relative",
        padding: {
          xs: "2rem 1rem",
          sm: "2rem 2rem",
          md: "2rem 4rem",
          lg: "2rem 7rem",
        },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "flex-start" },
        overflow: "hidden",
      }}
    >
      {/* Text Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          padding: {
            xs: "1rem",
            sm: "2rem",
            md: "3rem 2rem",
            lg: "4rem 3rem",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logoSrc}
          alt="Logo"
          sx={{
            width: {
              xs: "80px",
              sm: "100px",
              md: "120px",
              lg: "160px",
            },
            height: "auto",
            marginBottom: {
              xs: "1rem",
              md: "1.5rem",
            },
            filter: isDarkMode ? "brightness(1.1)" : "none",
          }}
        />

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
              md: "2.5rem",
              lg: "3rem",
            },
            fontWeight: "bold",
            color: theme.palette.primary.main,
            marginBottom: {
              xs: "1rem",
              md: "1.5rem",
            },
            paddingTop: {
              xs: "1rem",
              md: "2rem",
            },
            lineHeight: 1.2,
            fontFamily: theme.typography.h1.fontFamily,
          }}
        >
          ¿Qué es Navippon?
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
            },
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            textAlign: { xs: "center", sm: "left" },
            maxWidth: { xs: "100%", md: "90%" },
            "& span": {
              color: theme.palette.primary.main,
              fontWeight: "bold",
            },
          }}
        >
          En un mundo donde los viajes de ocio son cada vez más populares, hemos
          desarrollado una <span>aplicación</span> que ofrece a los usuarios la
          oportunidad de <span>descubrir</span> el destino perfecto para unas
          vacaciones inolvidables en <span>Japón</span>. Esta aplicación está
          diseñada para proporcionar a los viajeros una guía completa y
          personalizada.
        </Typography>
      </Box>

      {/* Image Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          height: {
            xs: "300px",
            sm: "400px",
            md: "100%",
          },
          position: { xs: "relative", md: "absolute" },
          right: { md: 0 },
          top: { md: 0 },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
          marginTop: { xs: "2rem", md: 0 },
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src="/assets/about-section.jpg"
          alt="Festival"
          sx={{
            width: {
              xs: "100%",
              sm: "90%",
              md: "85%",
            },
            height: {
              xs: "100%",
              md: "auto",
            },
            maxHeight: { md: "90vh" },
            objectFit: "cover",
            borderRadius: {
              xs: "1rem",
              sm: "2rem",
              md: "20rem 0 0 20rem",
            },
            boxShadow: theme.shadows[4],
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: { md: "scale(1.02)" },
            },
          }}
        />
      </Box>

      {/* Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          zIndex: 0,
          display: { xs: "none", md: "block" },
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-20px)",
            },
            "100%": {
              transform: "translateY(0px)",
            },
          },
        }}
      />

      {/* Additional Background Element */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, transparent)`,
          zIndex: 0,
          display: { xs: "none", lg: "block" },
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
    </Box>
  );
};

export default Seccion1;

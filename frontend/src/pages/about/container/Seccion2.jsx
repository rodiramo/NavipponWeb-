import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const Seccion2 = () => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: {
          xs: "auto",
          sm: "50vh",
          md: "45vh",
          lg: "50vh",
        },
        backgroundColor: primaryLight,
        alignItems: "center",
        marginBottom: {
          xs: "1rem",
          md: "2rem",
        },
        padding: {
          xs: "2rem 1rem",
          sm: "2rem",
          md: "3rem",
          lg: "3rem 4rem",
        },
        borderRadius: {
          xs: "2rem",
          sm: "3rem",
          md: "20rem 0rem 0rem 20rem",
        },
        gap: { xs: 2, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: {
            xs: "1rem",
            md: "2rem",
          },
          order: { xs: 2, md: 1 },
        }}
      >
        {/* Responsive Video Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: {
              xs: "100%",
              sm: "480px",
              md: "100%",
              lg: "560px",
            },
            aspectRatio: "16/9",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: theme.shadows[6],
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: { md: "scale(1.02)" },
              boxShadow: theme.shadows[12],
            },
          }}
        >
          <Box
            component="iframe"
            src="https://www.youtube.com/embed/WLIv7HnZ_fE?start=13"
            title="YouTube video player - ¿Por qué Japón?"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Box>

      {/* Text Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          padding: {
            xs: "1rem",
            sm: "2rem",
            md: "2rem 3rem",
          },
          order: { xs: 1, md: 2 },
        }}
      >
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
            color: theme.palette.text.primary,
            marginBottom: {
              xs: "1rem",
              md: "1.5rem",
            },
            lineHeight: 1.2,
            fontFamily: theme.typography.h1.fontFamily,
          }}
        >
          ¿Por qué Japón?
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
            lineHeight: 1.7,
            color: theme.palette.text.primary,
            maxWidth: { xs: "100%", md: "95%" },
            "& .highlight": {
              fontWeight: "bold",
              color: theme.palette.primary.dark,
              fontSize: "1.05em",
            },
          }}
        >
          Viajar a Japón es una experiencia única que te sumerge en una cultura
          milenaria, paisajes impresionantes y tecnología de vanguardia.
          Descubrirás la serenidad de antiguos templos, la emoción de las
          ciudades modernas y la deliciosa gastronomía japonesa.{" "}
          <span className="highlight">
            ¡Japón te espera con maravillas inigualables!
          </span>
        </Typography>
      </Box>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}20, transparent)`,
          display: { xs: "none", lg: "block" },
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%": {
              transform: "translateY(0px) rotate(0deg)",
            },
            "50%": {
              transform: "translateY(-15px) rotate(180deg)",
            },
            "100%": {
              transform: "translateY(0px) rotate(360deg)",
            },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}15, transparent)`,
          display: { xs: "none", md: "block" },
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
    </Box>
  );
};

export default Seccion2;

import { Box, Typography, useTheme } from "@mui/material";
import Search from "../../../components/Search"; // Import your Search component
import nube from "../../../assets/nube.png";

const Header = ({ onSearchKeyword }) => {
  // Accept search handler as prop
  const theme = useTheme();

  return (
    <Box
      className="header"
      sx={{
        position: "relative",
        textAlign: "center",
        marginBottom: "-1.75rem",
        paddingTop: { xs: "6rem", sm: "8rem", md: "9rem" },
        paddingBottom: { xs: 6, sm: 8, md: 5 },
        paddingX: { xs: 2, sm: 4, md: 6 },
        borderRadius: {
          xs: "0 0 3rem 3rem",
          sm: "0 0 4rem 4rem",
          md: "0 0 5rem 5rem",
        },
        overflow: "hidden",
      }}
    >
      {/* Floating Cloud Element - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "10%",
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

      {/* Floating Cloud Element - Bottom Left */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
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

      {/* Content Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          margin: "0 auto",
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
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem", lg: "4.5rem" },
            fontWeight: 800,
            lineHeight: { xs: 1.1, sm: 1.2 },
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          Planea tu viaje ideal
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            fontWeight: 400,
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
            maxWidth: "600px",
            opacity: 0.9,
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          Puedes filtrar para encontrar lo que necesitas,{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            fácil, rápido e ideal
          </Box>{" "}
          para hacer tu experiencia como viajero mucho más relajadora.
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search
            className="w-full"
            onSearchKeyword={onSearchKeyword}
            placeholder="Buscar experiencias, destinos, actividades..."
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

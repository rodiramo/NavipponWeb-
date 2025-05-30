import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";

const CommunitySection = () => {
  const theme = useTheme();
  const lightBlue = theme.palette.secondary.light;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        backgroundColor: lightBlue,
        borderRadius: {
          xs: "2rem",
          sm: "3rem",
          md: "8px",
        },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: {
          xs: "auto",
          sm: "50vh",
          md: "45vh",
          lg: "50vh",
        },
        alignItems: "center",
        marginBottom: {
          xs: "1rem",
          md: "2rem",
        },
        padding: {
          xs: "2rem 1rem",
          sm: "2rem",
          md: "1rem",
          lg: "2rem",
        },
        gap: { xs: 2, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "100%", md: "50%" },
          order: { xs: 1, md: 1 },
          padding: {
            xs: "1rem 0",
            md: "2rem",
          },
        }}
      >
        <Box
          component="img"
          src="/assets/community.jpg"
          alt="Nuestra Comunidad"
          sx={{
            width: {
              xs: "100%",
              sm: "90%",
              md: "95%",
            },
            height: "auto",
            maxWidth: "100%",
            borderRadius: {
              xs: "1rem",
              sm: "2rem",
              md: "0rem 20rem 20rem 0rem",
            },
            objectFit: "cover",
            boxShadow: theme.shadows[6],
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: { md: "scale(1.02)" },
              boxShadow: theme.shadows[12],
            },
          }}
        />
      </Box>

      {/* Text Section */}
      <Box
        sx={{
          flex: 1,
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          padding: {
            xs: "1rem",
            sm: "2rem",
            md: "2rem 3rem",
            lg: "3rem 4rem",
          },
          order: { xs: 2, md: 2 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            marginBottom: {
              xs: "1rem",
              md: "1.5rem",
            },
            fontWeight: "bold",
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
              md: "2.5rem",
              lg: "3rem",
            },
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            fontFamily: theme.typography.h1.fontFamily,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-0.5rem",
              left: { xs: "50%", md: 0 },
              transform: { xs: "translateX(-50%)", md: "none" },
              width: "60px",
              height: "4px",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "2px",
            },
          }}
        >
          Nuestra comunidad
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            width: { xs: "100%", md: "90%", lg: "80%" },
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
            },
            lineHeight: 1.7,
            color: theme.palette.text.primary,
            marginBottom: {
              xs: "1.5rem",
              md: "2rem",
            },
            "& .highlight": {
              fontWeight: "bold",
              color: theme.palette.primary.main,
              fontSize: "1.05em",
            },
          }}
        >
          Nuestra comunidad es fundamental para nosotros. Estamos deseando verla{" "}
          <span className="highlight">crecer y florecer</span> con nuevos
          miembros apasionados por <span className="highlight">Japón</span>. Que
          se animen a discusiones, compartir aventuras y conectar con amantes de
          la cultura japonesa de{" "}
          <span className="highlight">todo el mundo.</span>
        </Typography>

        {/* Community Stats */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {[
            { number: "10", label: "Miembros activos" },
            { number: "15+", label: "Experiencias compartidas" },
            { number: "5+", label: "Países conectados" },
          ].map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                backgroundColor: theme.palette.primary.main,
                color: "white",
                padding: {
                  xs: "0.8rem 1.2rem",
                  md: "1rem 1.5rem",
                },
                borderRadius: "12px",
                minWidth: {
                  xs: "140px",
                  sm: "120px",
                },
                boxShadow: theme.shadows[3],
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.2rem",
                    md: "1.5rem",
                  },
                  marginBottom: "0.2rem",
                }}
              >
                {stat.number}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    md: "0.875rem",
                  },
                  opacity: 0.9,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}20)`,
          display: { xs: "none", lg: "block" },
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              opacity: 0.7,
            },
            "50%": {
              transform: "scale(1.1)",
              opacity: 0.4,
            },
            "100%": {
              transform: "scale(1)",
              opacity: 0.7,
            },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, transparent)`,
          display: { xs: "none", md: "block" },
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-15px)",
            },
            "100%": {
              transform: "translateY(0px)",
            },
          },
        }}
      />

      {/* Connection Lines */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "45%",
          width: "2px",
          height: "40%",
          background: `linear-gradient(180deg, transparent, ${theme.palette.primary.main}30, transparent)`,
          display: { xs: "none", lg: "block" },
          animation: "fadeInOut 3s ease-in-out infinite",
          "@keyframes fadeInOut": {
            "0%": { opacity: 0 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0 },
          },
        }}
      />
    </Box>
  );
};

export default CommunitySection;

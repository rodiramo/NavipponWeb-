import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { Goal, Telescope, HandHeart } from "lucide-react";
import CustomShape from "../../../components/Shapes/CustomShape";

const PrinciplesSection = () => {
  const theme = useTheme();
  const primaryMain = theme.palette.primary.main;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const principles = [
    {
      icon: Goal,
      title: "Misión",
      content: (
        <Box>
          <Typography>
            Nuestra misión en Navippon es ser el{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              compañero confiable{" "}
            </span>{" "}
            para los viajeros que desean explorar la riqueza y belleza de Japón.
            Estamos comprometidos a proporcionar a nuestros usuarios las
            herramientas y la información que necesitan para planificar viajes
            personalizados y significativos.
          </Typography>{" "}
        </Box>
      ),
    },
    {
      icon: HandHeart,
      title: "Valores",
      content: (
        <Box>
          <Typography>
            Amamos Japón en todas sus dimensiones y compartimos esa pasión con
            nuestros usuarios. Nos esforzamos por promover el{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              entendimiento y respeto{" "}
            </span>{" "}
            por la cultura japonesa en cada experiencia de viaje que ofrecemos.
          </Typography>{" "}
        </Box>
      ),
    },
    {
      icon: Telescope,
      title: "Visión",
      content: (
        <Box>
          <Typography>
            Nuestra visión en Navippon es convertirnos en la plataforma líder
            para la exploración y planificación de viajes en Japón. Aspiramos a
            ser reconocidos por nuestra{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              excelencia
            </span>{" "}
            en proporcionar a los viajeros una experiencia donde puedan
            descubrir la autenticidad de Japón.
          </Typography>{" "}
        </Box>
      ),
    },
  ];

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 6,
          sm: 8,
          md: 10,
          lg: 12,
        },
        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: {
            xs: 6,
            sm: 8,
            md: 10,
            lg: 12,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* Custom Shape */}
        <Box sx={{ mb: 3 }}>
          <CustomShape size={isMobile ? 1.5 : 2} />
        </Box>

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
              lg: "3.5rem",
            },
            fontWeight: "bold",
            color: theme.palette.text.primary,
            mb: 2,
            fontFamily: theme.typography.h1.fontFamily,
            position: "relative",
          }}
        >
          Nuestros principios
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            opacity: 0.9,
            color: theme.palette.text.secondary,
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
            },
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          <span
            style={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            {" "}
            Navippon{" "}
          </span>{" "}
          te ayuda a planificar tu viaje con nuestros ideales.
        </Typography>
      </Box>

      {/* Principles Cards */}
      <Grid
        container
        spacing={{
          xs: 3,
          sm: 4,
          md: 4,
          lg: 6,
        }}
        justifyContent="center"
        alignItems="stretch"
      >
        {principles.map((principle, index) => {
          const IconComponent = principle.icon;

          return (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  maxWidth: {
                    xs: "100%",
                    sm: "400px",
                    md: "100%",
                    lg: "450px",
                  },
                  minHeight: {
                    xs: "320px",
                    sm: "350px",
                    md: "380px",
                    lg: "400px",
                  },
                  width: "100%",
                  backgroundColor: theme.palette.background.default,
                  transition: "all 0.3s ease-in-out",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: {
                      xs: "translateY(-5px)",
                      md: "translateY(-10px)",
                    },
                    boxShadow: theme.shadows[8],
                    "& .icon-container": {
                      transform: "scale(1.1) rotate(5deg)",
                      backgroundColor: theme.palette.primary.light,
                    },
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 3,
                      sm: 3.5,
                      md: 4,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Icon */}
                  <Box
                    className="icon-container"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor:
                        theme.palette.primary.lightest ||
                        `${theme.palette.primary.main}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      transition: "all 0.3s ease-in-out",
                      alignSelf: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <IconComponent size={48} color={primaryMain} />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: {
                        xs: "1.3rem",
                        sm: "1.4rem",
                        md: "1.5rem",
                      },
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      mb: 2,
                      textAlign: { xs: "center", md: "left" },
                      fontFamily: theme.typography.h1.fontFamily,
                    }}
                  >
                    {principle.title}
                  </Typography>

                  {/* Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      textAlign: "left",
                      lineHeight: 1.7,
                      fontSize: {
                        xs: "0.95rem",
                        sm: "1rem",
                        md: "1.05rem",
                      },
                      color: theme.palette.text.secondary,
                      flex: 1,
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    {principle.content}
                  </Typography>
                </CardContent>

                {/* Decorative Corner */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20, transparent)`,
                    borderRadius: "100% 0 0 0",
                  }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}15)`,
          display: { xs: "none", lg: "block" },
          animation: "float 8s ease-in-out infinite",
          "@keyframes float": {
            "0%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(180deg)" },
            "100%": { transform: "translateY(0px) rotate(360deg)" },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `linear-gradient(225deg, ${theme.palette.secondary.main}20, transparent)`,
          display: { xs: "none", md: "block" },
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
    </Container>
  );
};

export default PrinciplesSection;

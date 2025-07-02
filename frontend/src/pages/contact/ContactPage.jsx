import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Container,
  Grid,
  Chip,
} from "@mui/material";
import { images } from "../../constants";
import { useSelector } from "react-redux";
import { Phone, MapPin, Mail } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import MainLayout from "../../components/MainLayout";
import { Send } from "lucide-react";
import axios from "axios";

const ContactPage = () => {
  const mode = useSelector((state) => state.theme.mode);
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/email", formData);
      if (response.status === 201) {
        alert("Mensaje enviado con éxito");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          consent: false,
        });
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert(
        "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: "100vh",
          py: 20,
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box display="flex" alignItems="center" mb={6}>
            <img
              src={mode === "dark" ? images.LogoWhite : images.LogoBlack}
              alt="Logo"
              className="h-16 mr-5"
            />{" "}
            <Box>
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Contáctanos
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                }}
              >
                Estamos aquí para ayudarte en tu próxima aventura
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {/* Contact Form */}
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  borderRadius: "24px",
                  background: theme.palette.background.default,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  backdropFilter: "blur(20px)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box mb={4}>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      sx={{
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      Envíanos un mensaje
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                      }}
                    >
                      ¿Tienes una pregunta o necesitas ayuda planificando tu
                      viaje? Completa el formulario y te responderemos dentro de
                      24 horas.
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nombre completo"
                          variant="outlined"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                              "&.Mui-focused": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Correo electrónico"
                          type="email"
                          variant="outlined"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                              "&.Mui-focused": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Teléfono (opcional)"
                          type="tel"
                          variant="outlined"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                              "&.Mui-focused": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="¿En qué podemos ayudarte?"
                          multiline
                          rows={4}
                          variant="outlined"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Cuéntanos sobre tu próximo viaje, dudas sobre destinos, reservas, o cualquier otra consulta..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "16px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                              "&.Mui-focused": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="consent"
                              checked={formData.consent}
                              onChange={handleChange}
                              required
                              sx={{
                                "&.Mui-checked": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              Acepto los términos y condiciones y la política de
                              privacidad
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                      mt={4}
                      flexDirection={{ xs: "column", sm: "row" }}
                      gap={2}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        endIcon={<Send size={16} />}
                        sx={{
                          borderRadius: "30px",
                          px: 4,
                          py: 1.5,
                          textTransform: "none",
                          justifyContent: "flex-end",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          background: `linear-gradient(45deg, ${theme.palette.primary.main})`,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
                          },
                        }}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                      </Button>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Info & Image */}
            <Grid item xs={12} lg={4}>
              <Box display="flex" flexDirection="column" gap={3} height="100%">
                {/* Contact Information Cards */}
                <Card
                  sx={{
                    background: theme.palette.background.default,
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={3}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Información de contacto
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: theme.palette.primary.light + "20",
                          color: theme.palette.primary.main,
                        }}
                      >
                        <Phone />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          +34-1234-4567
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: theme.palette.primary.light + "20",
                          color: theme.palette.primary.main,
                        }}
                      >
                        <Mail />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          infonavippon@gmail.com
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: theme.palette.primary.light + "20",
                          color: theme.palette.primary.main,
                        }}
                      >
                        <MapPin />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ubicación
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          Av. La Paz 1536
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>

                {/* Response Time Info */}
                <Card
                  sx={{
                    borderRadius: "20px",
                    background: theme.palette.background.default,
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={2}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Tiempo de respuesta
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label="< 24 horas"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.white,
                        backgroundColor: theme.palette.secondary.medium,
                      }}
                    />
                    <Chip
                      label="Soporte 24/7"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Nuestro equipo está disponible para ayudarte en cualquier
                    momento.
                  </Typography>
                </Card>

                {/* Hero Image */}
                <Card
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    flexGrow: 1,
                    minHeight: { xs: "250px", lg: "300px" },
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundImage:
                        "url(https://viajes.nationalgeographic.com.es/medio/2024/07/15/castillo-de-osaka_d8742318_1513825088_240715144429_1280x854.jpg)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(180deg, rgba(15, 39, 96, 0.15), rgba(9, 26, 73, 0.85))",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        color: "white",
                        zIndex: 1,
                      }}
                    >
                      <Typography variant="h6" fontWeight="700" mb={1}>
                        ¡Comienza tu aventura!
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Descubre destinos increíbles
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default ContactPage;

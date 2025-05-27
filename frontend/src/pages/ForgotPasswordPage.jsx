import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/index/users";
import logoBlack from "../assets/navippon-icon.png";
import logo from "../assets/navippon-logo-white.png";
import backgroundImage from "../assets/login-bg.jpg";
import HomeButton from "../components/HomeButton";

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setEmailSent(true);
    },
  });

  const submitHandler = (data) => {
    mutation.mutate(data.email);
  };

  if (emailSent) {
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        backgroundColor={theme.palette.background.default}
        flexDirection="column"
        p={2}
      >
        <Box
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: "center",
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            mb={2}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            ¡Email enviado!
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Hemos enviado un enlace de recuperación a{" "}
            <strong>{getValues("email")}</strong>. Revisa tu bandeja de entrada
            y sigue las instrucciones.
          </Typography>
          <Typography variant="body2" mb={3} color="text.secondary">
            Si no recibes el email en unos minutos, revisa tu carpeta de spam.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            }}
          >
            Volver al Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="100vh"
      backgroundColor={theme.palette.primary.white}
      flexDirection={isNonMobileScreens ? "row" : "column"}
    >
      {/* Left side - same as login */}
      {isNonMobileScreens ? (
        <Box
          flexBasis="40%"
          position="relative"
          sx={{
            borderRadius: "0rem 200rem 200rem 0rem",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            sx={{
              background: `linear-gradient(to bottom, ${theme.palette.background.nav} 0%, rgba(0, 0, 0, 0.0) 100%)`,
              display: "flex",
              flexDirection: "column",
              borderRadius: "0rem 200rem 200rem 0rem",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "1rem",
            }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="Navippon Logo"
                style={{
                  width: "7rem",
                  marginTop: "2rem",
                  marginLeft: "2rem",
                }}
              />
            </Link>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          mt={2}
        >
          <img
            src={logoBlack}
            alt="Navippon Logo"
            style={{ width: "7rem", marginTop: "3.5rem" }}
          />
        </Box>
      )}

      {/* Right side - form */}
      <Box
        flexBasis={isNonMobileScreens ? "60%" : "100%"}
        backgroundColor={theme.palette.primary.white}
        p="2rem"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <HomeButton />
        <Box width="100%" maxWidth="60%">
          <Typography variant="h4" mb={1} textAlign="center">
            Recuperar contraseña
          </Typography>
          <Typography
            variant="body2"
            mb={3}
            textAlign="center"
            color="text.secondary"
          >
            Ingresa tu email y te enviaremos un enlace para restablecer tu
            contraseña
          </Typography>

          {mutation.error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {mutation.error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit(submitHandler)}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              {...register("email", {
                required: "El Email es requerido",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Ingresa un email válido",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                borderRadius: "50px",
                "& fieldset": { borderRadius: "50px" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: "50px", padding: "10px" }}
              disabled={!isValid || mutation.isLoading}
            >
              {mutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar enlace de recuperación"
              )}
            </Button>

            <Box textAlign="center" mt={3}>
              <Link
                to="/login"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
              >
                ← Volver al login
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;

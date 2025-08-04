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
  Checkbox,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useUser from "../../hooks/useUser";
import HomeButton from "../../components/HomeButton";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { login, isLoginLoading, hasLoginError } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Theme-aware logo selection
  const getLogoSrc = (isMobile = false) => {
    const isDark = theme.palette.mode === "dark";

    if (isMobile) {
      return isDark
        ? "/assets/navippon-logo-white.png"
        : "/assets/navippon-icon.png";
    } else {
      return isDark
        ? "/assets/navippon-logo-white.png"
        : "/assets/navippon-logo-white.png";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { email, password } = data;
    login({ email, password, rememberMe });
  };

  // Input styles without hover/active states
  const inputStyles = {
    borderRadius: "50px",
    width: { xs: "100%", md: "450px" },
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px",
      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "inherit",
          borderWidth: "1px",
          backgroundColor: "transparent !important",
        },
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "inherit",
          borderWidth: "1px",
          backgroundColor: "transparent !important",
          boxShadow: "none", // Remove focus box shadow
        },
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "inherit",
        backgroundColor: "transparent !important",
        boxShadow: "none",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "inherit",
        backgroundColor: "transparent !important",
        borderWidth: "1px",
        boxShadow: "none",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "50px",
      borderWidth: "1px",
      backgroundColor: "transparent",
      boxShadow: "none",
      borderColor: "inherit",
    },
    "& .MuiInputBase-input": {
      borderRadius: "50px",
      backgroundColor: "transparent !important",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "transparent !important",
        boxShadow: "none",
      },
      "&:focus": {
        backgroundColor: "transparent !important",
        boxShadow: "none",
        outline: "none",
      },
      "&:focus-visible": {
        outline: "none",
        backgroundColor: "transparent !important",
        boxShadow: "none",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "inherit",
      },
    },
    // Remove any box shadows completely
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
    "&:focus": {
      boxShadow: "none",
    },
    "&:focus-within": {
      boxShadow: "none",
    },
  };

  return (
    <Box
      display="flex"
      height="100vh"
      backgroundColor={theme.palette.primary.white}
      flexDirection={isNonMobileScreens ? "row" : "column"}
    >
      {isNonMobileScreens ? (
        <Box
          flexBasis="60%"
          position="relative"
          sx={{
            borderRadius: "0rem 200rem 200rem 0rem",
            backgroundImage: "url(/assets/login-bg.jpg)",
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
                src={getLogoSrc(false)} // Desktop logo
                alt="Navippon Logo"
                style={{
                  width: "7rem",
                  marginTop: "2rem",
                  marginLeft: "2rem",
                  // Add filter for white logo in dark mode if needed
                  filter:
                    theme.palette.mode === "dark" ? "brightness(1)" : "none",
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
            src={getLogoSrc(true)} // Mobile logo
            alt="Navippon Logo"
            style={{
              width: "7rem",
              marginTop: "3.5rem",
              // Add filter for white logo in dark mode if needed
              filter: theme.palette.mode === "dark" ? "brightness(1)" : "none",
            }}
          />
        </Box>
      )}
      <Box
        flexBasis={isNonMobileScreens ? "80%" : "100%"}
        backgroundColor={theme.palette.primary.white}
        p="2rem"
        display="flex"
        flexDirection="column"
        justifyContent={isNonMobileScreens ? "center" : "flex-start"}
        alignItems="center"
        height={isNonMobileScreens ? "auto" : "min-content"}
        mt={isNonMobileScreens ? 0 : "2rem"}
      >
        <HomeButton />
        <Box width="100%" sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
          <Typography variant="h4" mb={2} textAlign="center">
            Iniciar sesión
          </Typography>

          <form
            onSubmit={handleSubmit(submitHandler)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Email: *"
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
              sx={inputStyles}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña: *"
              type={showPassword ? "text" : "password"}
              sx={inputStyles}
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              display="flex"
              flexDirection={isNonMobileScreens ? "row" : "column"}
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": { color: theme.palette.primary.main },
                    }}
                  />
                }
                label="Mantenerse conectado"
              />

              <Link
                to="/forgot-password"
                style={{ color: theme.palette.primary.main }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                fontSize: "1rem",
                width: "200px",
                borderRadius: "50px",
                padding: "10px",
                textTransform: "none",
              }}
              disabled={!isValid || isLoginLoading}
            >
              Acceder
            </Button>
            <Typography textAlign="center" mt={2}>
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                Registrarse
              </Link>
            </Typography>
          </form>
          {hasLoginError && (
            <Typography color="error" textAlign="center" mt={2}>
              Credenciales inválidas
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

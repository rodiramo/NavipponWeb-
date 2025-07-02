import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { resetPassword, verifyResetToken } from "../services/index/users";
import HomeButton from "../components/HomeButton";
const logoBlack = "./assets/navippon-icon.png";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Verify token validity
  const { isLoading: verifyingToken, error: tokenError } = useQuery({
    queryKey: ["verify-reset-token", token],
    queryFn: () => verifyResetToken(token),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setResetSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
  });

  const submitHandler = (data) => {
    mutation.mutate({
      token,
      newPassword: data.newPassword,
    });
  };

  const newPassword = watch("newPassword");

  if (verifyingToken) {
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        backgroundColor={theme.palette.background.default}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (tokenError) {
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
          <Typography variant="h4" mb={2} color="error">
            Enlace inválido
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            El enlace de recuperación ha expirado o es inválido.
          </Typography>
          <Button
            component={Link}
            to="/forgot-password"
            variant="contained"
            sx={{ borderRadius: "50px", px: 4, mr: 2 }}
          >
            Solicitar nuevo enlace
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{ borderRadius: "50px", px: 4 }}
          >
            Ir al Login
          </Button>
        </Box>
      </Box>
    );
  }

  if (resetSuccess) {
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
            ¡Contraseña actualizada!
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Tu contraseña ha sido cambiada exitosamente. Serás redirigido al
            login en unos segundos.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ borderRadius: "50px", px: 4 }}
          >
            Ir al Login
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
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box mb={4}>
        <img src={logoBlack} alt="Navippon Logo" style={{ width: "7rem" }} />
      </Box>

      <HomeButton />

      <Box width="100%" maxWidth="500px" px={2}>
        <Typography variant="h4" mb={1} textAlign="center">
          Nueva contraseña
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          textAlign="center"
          color="text.secondary"
        >
          Ingresa tu nueva contraseña
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
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            {...register("newPassword", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{
              borderRadius: "50px",
              "& fieldset": { borderRadius: "50px" },
            }}
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

          <TextField
            fullWidth
            margin="normal"
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === newPassword || "Las contraseñas no coinciden",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{
              borderRadius: "50px",
              "& fieldset": { borderRadius: "50px" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
              "Cambiar contraseña"
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
  );
};

export default ResetPasswordPage;

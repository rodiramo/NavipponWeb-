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
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import HomeButton from "../components/HomeButton";
import { useMutation } from "@tanstack/react-query";

const logoBlack = "./assets/navippon-icon.png";
const logo = "./assets/navippon-logo-white.png";
const backgroundImage = "./assets/login-bg.jpg";

const sendVerificationCode = async (email) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/password/send-verification-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error enviando código");
  }

  return response.json();
};
const verifyCode = async (email, code) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/password/verify-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Código inválido");
  }

  return response.json();
};

const resetPasswordWithCode = async (email, code, password) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/password/reset-password-with-code`, // ← Fixed URL
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password }), // ← Fixed payload
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al cambiar contraseña");
  }

  return response.json();
};

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    "Verificar Email",
    "Código de Verificación",
    "Nueva Contraseña",
  ];

  // Step 1: Email form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isValid: emailIsValid },
  } = useForm({
    defaultValues: { email: "" },
    mode: "onChange",
  });

  // Step 2: Code form
  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors, isValid: codeIsValid },
    setValue: setCodeValue,
  } = useForm({
    defaultValues: { code: "" },
    mode: "onChange",
  });

  // Step 3: Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isValid: passwordIsValid },
    watch,
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = watch("password");

  // Mutations
  const sendCodeMutation = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: () => {
      setCurrentStep(1);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: ({ email, code }) => verifyCode(email, code),
    onSuccess: () => {
      setCurrentStep(2);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ email, code, password }) =>
      resetPasswordWithCode(email, code, password),
    onSuccess: () => {
      setCurrentStep(3); // Success step
    },
  });

  // Step handlers
  const handleEmailSubmit = (data) => {
    setUserEmail(data.email);
    sendCodeMutation.mutate(data.email);
  };

  const handleCodeSubmit = (data) => {
    setVerificationCode(data.code);
    verifyCodeMutation.mutate({ email: userEmail, code: data.code });
  };

  const handlePasswordSubmit = (data) => {
    if (data.password !== data.confirmPassword) return;
    resetPasswordMutation.mutate({
      email: userEmail,
      code: verificationCode,
      password: data.password,
    });
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resendCode = () => {
    sendCodeMutation.mutate(userEmail);
  };

  // Success state
  if (currentStep === 3) {
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
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: "center",
            borderRadius: "20px",
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
            ¡Contraseña Cambiada!
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar
            sesión con tu nueva contraseña.
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
            Ir al Login
          </Button>
        </Paper>
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

      {/* Right side - multi-step form */}
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
        <Box width="100%" maxWidth="500px">
          <Typography variant="h4" mb={1} textAlign="center">
            Recuperar contraseña
          </Typography>

          {/* Progress stepper */}
          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Email */}
          {currentStep === 0 && (
            <>
              <Typography
                variant="body2"
                mb={3}
                textAlign="center"
                color="text.secondary"
              >
                Ingresa tu email para recibir un código de verificación
              </Typography>

              {sendCodeMutation.error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                  {sendCodeMutation.error.message}
                </Alert>
              )}

              <form onSubmit={handleSubmitEmail(handleEmailSubmit)}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  {...registerEmail("email", {
                    required: "El Email es requerido",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Ingresa un email válido",
                    },
                  })}
                  error={!!emailErrors.email}
                  helperText={emailErrors.email?.message}
                  sx={{
                    "& fieldset": { borderRadius: "10px" },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    borderRadius: "10px",
                    padding: "12px",
                    textTransform: "none",
                  }}
                  disabled={!emailIsValid || sendCodeMutation.isLoading}
                >
                  {sendCodeMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Enviar código de verificación"
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Verification Code */}
          {currentStep === 1 && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={goBack} sx={{ mr: 1 }}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  Código enviado a: <strong>{userEmail}</strong>
                </Typography>
              </Box>

              {verifyCodeMutation.error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                  {verifyCodeMutation.error.message}
                </Alert>
              )}

              <form onSubmit={handleSubmitCode(handleCodeSubmit)}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Código de verificación"
                  placeholder="123456"
                  {...registerCode("code", {
                    required: "El código es requerido",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Ingresa un código de 6 dígitos",
                    },
                  })}
                  error={!!codeErrors.code}
                  helperText={codeErrors.code?.message}
                  sx={{
                    "& fieldset": { borderRadius: "10px" },
                    "& input": {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      letterSpacing: "0.5rem",
                    },
                  }}
                  inputProps={{ maxLength: 6 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    borderRadius: "10px",
                    padding: "12px",
                    textTransform: "none",
                  }}
                  disabled={!codeIsValid || verifyCodeMutation.isLoading}
                >
                  {verifyCodeMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verificar código"
                  )}
                </Button>

                <Box textAlign="center" mt={2}>
                  <Button
                    variant="text"
                    onClick={resendCode}
                    disabled={sendCodeMutation.isLoading}
                    sx={{ textTransform: "none" }}
                  >
                    {sendCodeMutation.isLoading
                      ? "Enviando..."
                      : "Reenviar código"}
                  </Button>
                </Box>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {currentStep === 2 && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={goBack} sx={{ mr: 1 }}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  Crear nueva contraseña para: <strong>{userEmail}</strong>
                </Typography>
              </Box>

              {resetPasswordMutation.error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                  {resetPasswordMutation.error.message}
                </Alert>
              )}

              <form onSubmit={handleSubmitPassword(handlePasswordSubmit)}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  error={!!passwordErrors.password}
                  helperText={passwordErrors.password?.message}
                  sx={{ "& fieldset": { borderRadius: "10px" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
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
                  {...registerPassword("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                  sx={{ "& fieldset": { borderRadius: "10px" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    borderRadius: "10px",
                    padding: "12px",
                    textTransform: "none",
                  }}
                  disabled={!passwordIsValid || resetPasswordMutation.isLoading}
                >
                  {resetPasswordMutation.isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>
              </form>
            </>
          )}

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
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;

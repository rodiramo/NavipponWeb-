import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import HomeButton from "../../components/HomeButton";
import { useDispatch } from "react-redux";
import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";
import logoBlack from "../../assets/navippon-icon.png";
import logo from "../../assets/navippon-logo-white.png";
import backgroundImage from "../../assets/register-bg.jpg";

const RegisterPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password }) =>
      signup({ name, email, password }),
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      toast.success("Registro completado con éxito. Por favor, inicia sesión.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { name, email, password } = data;
    mutate({ name, email, password });
  };

  const password = watch("password");

  return (
    <Box
      display="flex"
      height="100vh"
      backgroundColor={theme.palette.primary.white}
      flexDirection={isNonMobileScreens ? "row" : "column"}
    >
      <HomeButton />
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
                style={{ width: "7rem", marginTop: "2rem", marginLeft: "2rem" }}
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
      <Box
        flexBasis={isNonMobileScreens ? "60%" : "100%"}
        backgroundColor={theme.palette.primary.white}
        p="2rem"
        display="flex"
        flexDirection="column"
        justifyContent={isNonMobileScreens ? "center" : "flex-start"}
        alignItems="center"
        height={isNonMobileScreens ? "auto" : "min-content"}
        mt={isNonMobileScreens ? 0 : "2rem"}
      >
        <Box width="100%" maxWidth="60%">
          <Typography variant="h4" mb={2} textAlign="center">
            Registro
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
              label="Nombre: *"
              type="text"
              sx={{
                borderRadius: "50px",
                "& fieldset": { borderRadius: "50px" },
              }}
              {...register("name", { required: "El nombre es requerido" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email: *"
              type="email"
              sx={{
                borderRadius: "50px",
                "& fieldset": { borderRadius: "50px" },
              }}
              {...register("email", { required: "El Email es requerido" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña: *"
              type={showPassword ? "text" : "password"}
              sx={{
                borderRadius: "50px",
                "& fieldset": { borderRadius: "50px" },
              }}
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
            <TextField
              fullWidth
              margin="normal"
              label="Confirmar Contraseña: *"
              sx={{
                borderRadius: "50px",
                "& fieldset": { borderRadius: "50px" },
              }}
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "La confirmación de la contraseña es requerida",
                validate: (value) =>
                  value === password || "La contraseña no coincide",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              sx={{
                mt: 3,
                borderRadius: "50px",
                padding: "10px",
                width: "fit-content",
                textTransform: "none",
                fontSize: "1rem",
              }}
              disabled={!isValid || isLoading}
            >
              Registrarse
            </Button>
          </form>
          <Typography textAlign="center" mt={2}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: theme.palette.primary.main }}>
              Iniciar Sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;

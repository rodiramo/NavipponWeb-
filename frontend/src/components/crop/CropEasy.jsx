import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfilePicture,
  updateCoverImage,
} from "../../services/index/users";
import { useDispatch } from "react-redux";
import useUser from "../../hooks/useUser";
import { userActions } from "../../store/reducers/userReducers";
import { toast } from "react-hot-toast";
import {
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  CircularProgress,
  useTheme,
  IconButton,
  Backdrop,
} from "@mui/material";
import {
  Close,
  ZoomIn,
  CloudUpload,
  AccountCircle,
  Image,
} from "@mui/icons-material";

const CropEasy = ({
  photo,
  setOpenCrop,
  onAvatarChange,
  onCoverChange,
  type = "profile",
}) => {
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Configuration based on image type
  const config = {
    profile: {
      aspect: 1, // Square aspect ratio
      title: "Cortar Imagen de Perfil",
      subtitle: "Ajusta tu imagen para obtener el mejor resultado",
      icon: AccountCircle,
      buttonText: "Cortar y Subir Perfil",
      height: "300px",
    },
    cover: {
      aspect: 16 / 9, // Wide aspect ratio for cover
      title: "Cortar Imagen de Portada",
      subtitle: "Crea una portada atractiva para tu perfil",
      icon: Image,
      buttonText: "Cortar y Subir Portada",
      height: "200px",
    },
  };

  const currentConfig = config[type];

  // Profile picture mutation
  const profileMutation = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["userProfile", user._id]);
      if (onAvatarChange) onAvatarChange(data.avatar);
      toast.success("La imagen de perfil se ha actualizado");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  // Cover image mutation
  const coverMutation = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateCoverImage({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["userProfile", user._id]);
      if (onCoverChange) onCoverChange(data.coverImage);
      toast.success("La imagen de portada se ha actualizado");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const currentMutation = type === "profile" ? profileMutation : coverMutation;

  const handleCropComplete = (cropedArea, cropedAreaPixels) => {
    setCroppedAreaPixels(cropedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const croppedImg = await getCroppedImg(photo?.url, croppedAreaPixels);

      const file = new File([croppedImg.file], `${photo?.file?.name}`, {
        type: photo?.file?.type,
      });

      const formData = new FormData();

      if (type === "profile") {
        formData.append("profilePicture", file);
      } else {
        formData.append("coverImage", file);
      }

      currentMutation.mutate({ token: jwt, formData: formData });
    } catch (error) {
      toast.error("Error cropping image:", error.message);
      console.error(error);
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => setOpenCrop(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: type === "cover" ? "600px" : "450px" },
          maxHeight: "90vh",
          overflow: "auto",
          outline: "none",
        }}
      >
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[24],
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <currentConfig.icon color="primary" />
              {currentConfig.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 0.5,
              }}
            >
              {currentConfig.subtitle}
            </Typography>

            <IconButton
              onClick={() => setOpenCrop(false)}
              disabled={currentMutation.isLoading}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Cropper Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: currentConfig.height,
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: theme.palette.grey[100],
                border: `2px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Cropper
                image={photo?.url}
                crop={crop}
                zoom={zoom}
                aspect={currentConfig.aspect}
                onZoomChange={setZoom}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                style={{
                  containerStyle: {
                    borderRadius: "12px",
                  },
                }}
              />
            </Box>

            {/* Zoom Control */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: "medium",
                  color: theme.palette.text.primary,
                }}
              >
                <ZoomIn color="primary" />
                Zoom: {`${Math.round(zoom * 100)}%`}
              </Typography>

              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(event, newValue) => setZoom(newValue)}
                disabled={currentMutation.isLoading}
                sx={{
                  color: theme.palette.primary.main,
                  height: 8,
                  "& .MuiSlider-track": {
                    border: "none",
                    borderRadius: 4,
                  },
                  "& .MuiSlider-thumb": {
                    height: 24,
                    width: 24,
                    backgroundColor: theme.palette.primary.main,
                    border: `3px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[4],
                    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                      boxShadow: `0 0 0 8px ${theme.palette.primary.main}25`,
                    },
                    "&:before": {
                      display: "none",
                    },
                  },
                  "& .MuiSlider-rail": {
                    color: theme.palette.grey[300],
                    opacity: 1,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={() => setOpenCrop(false)}
                disabled={currentMutation.isLoading}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "medium",
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  "&:hover": {
                    borderColor: theme.palette.error.dark,
                    backgroundColor: theme.palette.error.light + "10",
                  },
                }}
              >
                Cancelar
              </Button>

              <Button
                onClick={handleCropImage}
                disabled={currentMutation.isLoading}
                variant="contained"
                startIcon={
                  currentMutation.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CloudUpload />
                  )
                }
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "medium",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                }}
              >
                {currentMutation.isLoading
                  ? "Procesando..."
                  : currentConfig.buttonText}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default CropEasy;

// Simplified Friend Toggle Component
import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  Group,
  Person,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { toggleFriend } from "../../../services/index/users";

const FriendToggle = ({
  profile,
  currentUser,
  token,
  isFriend,
  setIsFriend,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleToggleFriend = async () => {
    if (!profile?._id || !currentUser?._id || !token) {
      toast.error("Error: información de usuario no disponible");
      return;
    }

    setIsLoading(true);
    const previousStatus = isFriend;

    try {
      // Optimistic update
      setIsFriend(!isFriend);

      // Call the API
      const response = await toggleFriend({
        userId: profile._id,
        token,
      });

      console.log("Friend toggle response:", response);

      // Show success message
      toast.success(
        !previousStatus
          ? `Ahora eres amigo de ${profile.name}`
          : `Ya no eres amigo de ${profile.name}`
      );
    } catch (error) {
      console.error("Error toggling friend status:", error);

      // Revert the optimistic update
      setIsFriend(previousStatus);

      toast.error(error.message || "Error al actualizar el estado de amistad");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Friend Status Indicator */}
      <Chip
        label={isFriend ? "Amigos" : "No son amigos"}
        size="medium"
        sx={{
          backgroundColor: isFriend
            ? theme.palette.success.light
            : theme.palette.grey[100],
          color: isFriend
            ? theme.palette.success.dark
            : theme.palette.text.secondary,
          fontWeight: 600,
          "& .MuiChip-icon": {
            color: isFriend
              ? theme.palette.success.dark
              : theme.palette.text.secondary,
          },
        }}
      />

      {/* Friend Toggle Button */}
      <Tooltip
        title={isFriend ? "Eliminar de amigos" : "Agregar a amigos"}
        arrow
      >
        <IconButton
          onClick={handleToggleFriend}
          disabled={isLoading}
          sx={{
            backgroundColor: isFriend
              ? theme.palette.error.light
              : theme.palette.primary.light,
            color: isFriend
              ? theme.palette.error.dark
              : theme.palette.primary.dark,
            width: 35,
            height: 35,
            "&:hover": {
              backgroundColor: isFriend
                ? theme.palette.error.main
                : theme.palette.primary.main,
              color: "white",
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isFriend ? (
            <PersonRemoveOutlined size={10} />
          ) : (
            <PersonAddOutlined size={10} />
          )}
        </IconButton>
      </Tooltip>

      {/* Status Text */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {isLoading
            ? "Actualizando..."
            : isFriend
              ? `Eres amigo de ${profile.name}`
              : `Agregar a ${profile.name} como amigo`}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {isFriend
            ? "Haz clic para eliminar de amigos"
            : "Haz clic para enviar solicitud de amistad"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FriendToggle;

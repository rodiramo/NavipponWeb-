import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { updateCoverImg } from "../../../services/index/users";

import { updateProfile } from "../../../services/index/users";
import useUser from "../../../hooks/useUser";
import FriendsWidget from "../widgets/FriendWidget";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { EditOutlined, Close, CameraAlt } from "@mui/icons-material";
import ProfilePicture from "../../../components/ProfilePicture";
import FlexBetween from "../../../components/FlexBetween";
import { toast } from "react-hot-toast";
import { setUserInfo } from "../../../store/reducers/authSlice";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newCoverImage, setNewCoverImage] = useState(null); // For uploading new cover image
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { user: reduxUser, jwt } = useUser();
  const [user, setUser] = useState(reduxUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || "");
  const [budget, setBudget] = useState(user?.budget || "");
  const [coverImage, setCoverImage] = useState(
    user?.coverImage || "/assets/bg-home1.jpg"
  );
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");

  useEffect(() => {
    console.log("🔄 Redux User Updated:", reduxUser);
    if (reduxUser) {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder al perfil");
    }
  }, [jwt, navigate]);

  // Handle Profile Edit
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <Box width="100%">
      <Box
        sx={{
          width: "100%",
          height: "40vh",
          borderRadius: "10px",
          backgroundImage: `url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Cover Edit Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { background: "rgba(0,0,0,0.7)" },
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewCoverImage(file);
                const reader = new FileReader();
                reader.onloadend = () => setCoverImage(reader.result); // for preview
                reader.readAsDataURL(file);
              }
            }}
          />
          <CameraAlt fontSize="small" />
        </IconButton>
      </Box>

      {/* Profile Info Section - Overlapping Cover */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          marginTop: "-75px",
          paddingBottom: "1rem",
        }}
      >
        <ProfilePicture avatar={user?.avatar} size="150px" />
        <Typography variant="h6" color={theme.palette.secondary.medium}>
          @{user?.name}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ marginBottom: "10px" }}
        >
          <Typography variant="h4" fontWeight="500">
            {user?.name}
          </Typography>
          <IconButton
            size="small"
            onClick={handleEditProfile}
            sx={{
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              "&:hover": {
                background: theme.palette.primary.dark,
                color: theme.palette.primary.light,
              },
            }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Box>

        {user.city && user.country ? (
          <Box display="flex" alignItems="center" gap={1}>
            <FmdGoodOutlinedIcon sx={{ color: theme.palette.primary.main }} />
            <Typography>
              {user.city}, {user.country}
            </Typography>
          </Box>
        ) : (
          <Button
            variant="text"
            color="primary"
            onClick={() => setOpenLocation(true)}
          >
            Agrega tu Ubicación
          </Button>
        )}
      </Box>

      {/* Friends Widget */}
      <FriendsWidget token={jwt} />

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>
          Edita tu Perfil
          <IconButton
            aria-label="close"
            onClick={() => setIsEditing(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Nombre"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="secondary">
            Cancelar
          </Button>
          <Button color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;

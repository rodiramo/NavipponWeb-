import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../../services/index/users";
import useUser from "../../../hooks/useUser";
import FriendsWidget from "../widgets/FriendWidget"; // ✅ Display Friends List
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
  useTheme,
} from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { EditOutlined, Close } from "@mui/icons-material";
import UserImage from "../../../components/UserImage";
import FlexBetween from "../../../components/FlexBetween";
import Dropzone from "react-dropzone";
import { toast } from "react-hot-toast";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, jwt } = useUser();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: user?.picturePath || "/default-avatar.png",
  });

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder al perfil");
    }
  }, [jwt, navigate]);

  // ✅ Handle Profile Edit Modal
  const handleEditProfile = () => {
    setIsEditing(true);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ token: jwt, userData: formData, userId: user._id });
      queryClient.invalidateQueries(["profile"]);
      toast.success("Perfil actualizado");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error al actualizar perfil");
      console.error(error);
    }
  };

  // ✅ Handle Location Update
  const fetchCountry = async (city) => {
    try {
      const apiKey = "520000b141fc413aae789c43254dd0bb";
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setLocation({ city, country: data.results[0].components.country });
      }
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };

  const handleLocationSubmit = async () => {
    if (!location.city) return;
    setOpenLocation(false);
    toast.success("Ubicación guardada");
  };

  return (
    <Box>
      {/* Profile Section */}
      <FlexBetween gap="0.5rem" pb="1.1rem" sx={{ flexDirection: "column" }}>
        <FlexBetween gap="1rem">
          <UserImage image={user?.avatar} size="150px" />
          <IconButton
            onClick={handleEditProfile}
            sx={{
              position: "absolute",
              marginTop: "128px",
              marginLeft: "113px",
            }}
          >
            <EditOutlined
              sx={{
                color: theme.palette.primary.white,
                padding: "4px",
                borderRadius: "30rem",
                fontSize: "2rem",
                background: theme.palette.primary.main,
              }}
            />
          </IconButton>
        </FlexBetween>

        <Box textAlign="center">
          <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
            @{user?.name}
          </Typography>
          <Typography variant="h4" fontWeight="500">
            {user?.name}
          </Typography>

          {user.city && user.country ? (
            <Typography>
              <FmdGoodOutlinedIcon sx={{ color: theme.palette.primary.main }} />{" "}
              {user.city}, {user.country}
            </Typography>
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
      </FlexBetween>

      {/* Friends Widget Section */}
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
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            name="password"
            label="Nueva Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProfile}
            style={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.white,
              padding: "0.7rem",
              borderRadius: "30rem",
              marginLeft: "0.7rem",
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Location Modal */}
      <Dialog open={openLocation} onClose={() => setOpenLocation(false)}>
        <DialogTitle>Agrega tu Ubicación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="city"
            label="Ciudad"
            type="text"
            fullWidth
            variant="outlined"
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
            onBlur={(e) => fetchCountry(e.target.value)}
          />
          {location.country && (
            <Typography mt={2}>
              País detectado: <strong>{location.country}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocation(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleLocationSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;

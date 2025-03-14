import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { images, stables } from "../../constants";
// Use the updated function that fetches a user profile by ID
import { getUserProfileById } from "../../services/index/users";
import MainLayout from "../../components/MainLayout";
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const UserProfilePage = () => {
  const { userId } = useParams(); // Expecting /profile/:userId
  const { jwt: token } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token && userId) {
      console.log(`Fetching profile for user ID: ${userId}`);
      getUserProfileById({ userId, token })
        .then((data) => {
          console.log("API User Profile Response:", data);
          setProfile(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setError("Error cargando el perfil del usuario.");
          setLoading(false);
        });
    }
  }, [userId, token]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Cargando perfil...</Typography>
      </Box>
    );
  if (error) return <Typography color="red">{error}</Typography>;
  if (!profile)
    return <Typography>No se encontró el perfil del usuario.</Typography>;

  return (
    <MainLayout>
      <Box id="body">
        <Box marginTop="10rem" textAlign="center">
          <Avatar
            src={
              profile.avatar
                ? stables.UPLOAD_FOLDER_BASE_URL + profile.avatar
                : "/default-avatar.png"
            }
            alt={profile.name}
            sx={{ width: 80, height: 80, margin: "auto" }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            {profile.name || "Usuario desconocido"}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {profile.email || "Correo no disponible"}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default UserProfilePage;

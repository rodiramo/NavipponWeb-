import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser"; // ✅ Import your custom hook
import { getFriendProfile } from "../../services/index/users";
import MainLayout from "../../components/MainLayout";
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const FriendProfilePage = () => {
  const { friendId } = useParams(); // ✅ Get the friend ID from the URL
  const { user, jwt: token } = useUser(); // ✅ Get user & token from custom hook
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      console.log(`Fetching profile for friend ID: ${friendId}`); // ✅ Debugging

      getFriendProfile({ friendId, token })
        .then((data) => {
          console.log("🔍 API Friend Profile Response:", data); // ✅ Debugging API response
          setFriend(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ Error fetching friend profile:", error);
          setError("Error cargando el perfil del amigo.");
          setLoading(false);
        });
    }
  }, [friendId, token]);

  if (loading)
    return (
      <Typography>
        <CircularProgress /> Cargando perfil...
      </Typography>
    );
  if (error) return <Typography sx={{ color: "red" }}>{error}</Typography>;
  if (!friend)
    return <Typography>No se encontró el perfil del amigo.</Typography>;

  return (
    <MainLayout>
      <div id="body">
        <Box marginTop="10rem">
          <Avatar
            src={friend.avatar || "/default-avatar.png"}
            alt={friend.name}
            sx={{ width: "80px", height: "80px", margin: "auto" }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            {friend.name || "Usuario desconocido"}
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {friend.email || "Correo no disponible"}
          </Typography>

          <Button
            variant="contained"
            sx={{ marginTop: "10px" }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>
      </div>
    </MainLayout>
  );
};

export default FriendProfilePage;

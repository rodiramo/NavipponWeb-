import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  toggleFriend,
  getUserProfile,
} from "../../../services/index/users";
import { Avatar, IconButton, Typography, Box, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { stables } from "../../../constants";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";

const UserList = ({ currentUser, token }) => {
  const theme = useTheme();
  const [friends, setFriends] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  // 🔹 Fetch users
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      token ? getAllUsers(token) : Promise.reject("No token available"),
    enabled: !!token,
    onError: (error) => {
      toast.error(error.message || "No se pudieron obtener los usuarios");
      console.error("Error fetching users:", error);
    },
  });

  // 🔹 Fetch current user's friends from DB
  useEffect(() => {
    if (currentUser && token) {
      getUserProfile({ token })
        .then((userData) => {
          const friendStatus = {};
          userData.friends.forEach((friendId) => {
            friendStatus[friendId] = true;
          });
          setFriends(friendStatus);
          localStorage.setItem("friends", JSON.stringify(friendStatus)); // ✅ Store in local storage
        })
        .catch((error) => console.error("Error fetching friends:", error));
    }
  }, [currentUser, token]);

  // 🔹 Get friends from Local Storage (Fallback)
  useEffect(() => {
    const storedFriends = localStorage.getItem("friends");
    if (storedFriends) {
      setFriends(JSON.parse(storedFriends));
    }
  }, []);

  // 🔹 Toggle Friend Status
  const handleFriendToggle = async (userId) => {
    try {
      await toggleFriend({ userId, token });

      setFriends((prev) => {
        const updatedFriends = { ...prev, [userId]: !prev[userId] };
        localStorage.setItem("friends", JSON.stringify(updatedFriends)); // ✅ Update Local Storage
        return updatedFriends;
      });

      toast.success(
        friends[userId] ? "Eliminado de amigos" : "Agregado a amigos"
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  if (isLoading) return <Typography>Cargando usuarios...</Typography>;
  if (isError)
    return <Typography>No se pudieron obtener los usuarios.</Typography>;

  // 🔹 Filter users based on search term
  const filteredUsers = data?.data?.filter(
    (user) =>
      user._id !== currentUser?._id &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "10px",
        padding: "1rem",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Lista de Usuarios
      </Typography>

      {/* 🔹 Search Field */}
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            backgroundColor: theme.palette.primary.white,
          },
        }}
      />

      {/* 🔹 Display Filtered Users */}
      {filteredUsers.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray", mt: 2 }}>
          No se encontraron usuarios.
        </Typography>
      ) : (
        filteredUsers.map((user) => (
          <Box
            key={user._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <Avatar
              src={
                user.avatar
                  ? `${stables.UPLOAD_FOLDER_BASE_URL}/${user.avatar}`
                  : "/default-avatar.png"
              }
              alt={user.name}
            />
            <Typography sx={{ flexGrow: 1 }}>{user.name}</Typography>

            {/* Friend Request Button */}
            <IconButton
              size="small"
              onClick={() => handleFriendToggle(user._id)}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              {friends[user._id] ? (
                <PersonRemoveOutlined size={20} sx={{ color: primaryDark }} />
              ) : (
                <PersonAddOutlined size={20} sx={{ color: primaryDark }} />
              )}
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserList;

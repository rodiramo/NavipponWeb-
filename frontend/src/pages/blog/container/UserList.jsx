import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  toggleFriend,
  getUserProfile,
} from "../../../services/index/users";
import { Avatar, IconButton, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { stables } from "../../../constants";
import { UserRoundPlus, UserRoundX } from "lucide-react";

const UserList = ({ currentUser, token }) => {
  const theme = useTheme();
  const [friends, setFriends] = useState({});

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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        padding: "1rem",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Lista de Usuarios
      </Typography>

      {data?.data
        ?.filter((user) => user._id !== currentUser?._id) // Don't show current user
        .map((user) => (
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
              sx={{
                backgroundColor: friends[user._id]
                  ? theme.palette.secondary.light
                  : theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: friends[user._id]
                    ? theme.palette.secondary.dark
                    : theme.palette.primary.dark,
                },
              }}
            >
              {friends[user._id] ? (
                <UserRoundX size={20} />
              ) : (
                <UserRoundPlus size={20} />
              )}
            </IconButton>
          </Box>
        ))}
    </Box>
  );
};

export default UserList;

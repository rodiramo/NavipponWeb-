import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchFriends,
  toggleFriendAsync,
} from "../../../store/reducers/friendsSlice";
import { Avatar, IconButton, Typography, Box, TextField } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { toast } from "react-hot-toast";

const UserList = ({ currentUser, token }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  // 🔹 Ensure `friendsList` is always an array (Fix for undefined error)
  const {
    friendsList = [],
    users = [],
    loading,
  } = useSelector((state) => state.friends) || {};
  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token)); // Fetch all users
      dispatch(fetchFriends(token)); // Fetch friend list
    }
  }, [token, dispatch]);

  const handleFriendToggle = (userId) => {
    dispatch(toggleFriendAsync({ userId, token }))
      .then(() => {
        toast.success(
          friendsList.includes(userId)
            ? "Eliminado de amigos"
            : "Agregado a amigos"
        );
      })
      .catch(() => toast.error("Error al actualizar amigos"));
  };

  // 🔹 Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUser?._id && // Exclude current user
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Search filter
  );

  return (
    <Box>
      <Typography variant="h6">Lista de Usuarios</Typography>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : filteredUsers.length === 0 ? (
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
            <Avatar src={user.avatar || "/default-avatar.png"} />
            <Typography>{user.name}</Typography>
            <IconButton onClick={() => handleFriendToggle(user._id)}>
              {friendsList.includes(user._id) ? (
                <PersonRemoveOutlined />
              ) : (
                <PersonAddOutlined />
              )}
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserList;

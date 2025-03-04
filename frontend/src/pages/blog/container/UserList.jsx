import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, toggleFriend } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice"; // ✅ Redux action
import { Avatar, IconButton, Typography, Box, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { stables } from "../../../constants";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";

const UserList = ({ currentUser, token }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const friends = useSelector((state) =>
    Array.isArray(state.auth.user?.friends) ? state.auth.user.friends : []
  );

  const [users, setUsers] = useState([]); // Stores all users
  const [searchTerm, setSearchTerm] = useState("");
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;

  useEffect(() => {
    if (token) {
      getAllUsers(token)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [token]);

  const handleFriendToggle = async (userId) => {
    try {
      const updatedUser = await toggleFriend({ userId, token });

      // ✅ Update Redux store with the actual backend response
      dispatch(setFriends(updatedUser.friends));

      toast.success(
        updatedUser.friends.includes(userId)
          ? "Agregado a amigos"
          : "Eliminado de amigos"
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    }
  };

  // 🔹 Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUser?._id &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        borderRadius: "10px",
        padding: "1rem",
      }}
      className={`relative rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] group `}
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

      {/* 🔹 Display Users */}
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
              marginBottom: "10px",
              gap: "5px",
              padding: "5px",
            }}
          >
            <Avatar
              src={
                user.avatar
                  ? `${stables.UPLOAD_FOLDER_BASE_URL}/${user.avatar}`
                  : "/default-avatar.png"
              }
              alt={user.name}
              sx={{ width: "40px", height: "40px" }}
            />
            <Typography sx={{ flexGrow: 1, fontWeight: "500" }}>
              {user.name}
            </Typography>

            {/* Friend Request Button */}
            <IconButton
              size="small"
              onClick={() => handleFriendToggle(user._id)}
              sx={{
                backgroundColor: primaryLight,
                p: "0.6rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: theme.palette.primary.white,
                },
              }}
            >
              {friends.includes(user._id) ? (
                <PersonRemoveOutlined
                  sx={{
                    color: primaryDark,
                  }}
                />
              ) : (
                <PersonAddOutlined
                  sx={{
                    color: primaryDark,
                  }}
                />
              )}
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

export default UserList;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserFriends, toggleFriend } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice";
import useUser from "../../../hooks/useUser";
import { stables } from "../../../constants";
import {
  ExpandMore,
  ExpandLess,
  PersonRemoveOutlined,
} from "@mui/icons-material";

const FriendsWidget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, jwt: token } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [localFriends, setLocalFriends] = useState(user?.friends || []);

  useEffect(() => {
    if (token && user?._id) {
      getUserFriends({ userId: user._id, token })
        .then((data) => {
          if (Array.isArray(data)) {
            dispatch(setFriends(data));
            setLocalFriends(data);
          } else {
            console.error("⚠️ Expected an array, received:", data);
          }
        })
        .catch((error) => console.error("Error fetching friends:", error));
    }
  }, [token, user?._id, dispatch]);

  const handleUnfollow = async (friendId) => {
    try {
      const updatedUser = await toggleFriend({ userId: friendId, token });
      const newFriendList = localFriends.filter(
        (friend) => friend._id !== friendId
      );

      setLocalFriends(newFriendList); // Remove from local state
      dispatch(setFriends(updatedUser.friends)); // Update Redux state
    } catch (error) {
      console.error("❌ Error unfollowing friend:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "12px",
        padding: "1rem",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header with Friend Count & Expand/Collapse Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Lista de Amigos ({localFriends.length})
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* No Friends Message */}
      {localFriends.length === 0 ? (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 2 }}>
          No tienes amigos agregados.
        </Typography>
      ) : (
        <Collapse in={expanded}>
          {localFriends.map((friend) => (
            <Box
              key={friend._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.grey[200],
                },
              }}
            >
              <Avatar
                src={
                  friend.avatar
                    ? `${stables.UPLOAD_FOLDER_BASE_URL}/${friend.avatar}`
                    : "/default-avatar.png"
                }
                alt={friend.name || "Amigo"}
                sx={{ width: "40px", height: "40px" }}
              />
              <Typography sx={{ flexGrow: 1, fontWeight: "500" }}>
                {friend.name || "Desconocido"}
              </Typography>

              {/* View Profile Button */}
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/profile/${friend._id}`)}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                }}
              >
                Visitar Perfil
              </Button>

              {/* Unfollow Friend Icon */}
              <IconButton
                onClick={() => handleUnfollow(friend._id)}
                sx={{
                  backgroundColor: theme.palette.grey[300],
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.error.main,
                    color: "white",
                  },
                }}
              >
                <PersonRemoveOutlined />
              </IconButton>
            </Box>
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default FriendsWidget;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserFriends, toggleFriend } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice";
import useUser from "../../../hooks/useUser";
import { stables } from "../../../constants";
import { PersonRemoveOutlined, PeopleOutlined } from "@mui/icons-material";

const FriendsWidget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, jwt: token } = useUser();
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

      setLocalFriends(newFriendList);
      dispatch(setFriends(updatedUser.friends));
    } catch (error) {
      console.error("❌ Error unfollowing friend:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "16px",
        padding: "1.5rem",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap="12px" mb={2}>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: "12px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PeopleOutlined sx={{ color: "white", fontSize: "20px" }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: theme.palette.text.primary,
              fontSize: "1.1rem",
            }}
          >
            Mis Amigos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.85rem",
            }}
          >
            {localFriends.length}{" "}
            {localFriends.length === 1 ? "amigo" : "amigos"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Friends List */}
      {localFriends.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
          }}
        >
          <PeopleOutlined
            sx={{
              fontSize: "48px",
              color: theme.palette.text.disabled,
              mb: 1,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "500",
            }}
          >
            No tienes amigos agregados
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.disabled,
              mt: 0.5,
            }}
          >
            Comienza a conectar con otras personas
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {localFriends.map((friend, index) => (
            <Box
              key={friend._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: theme.palette.action.hover,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
                sx={{
                  width: "44px",
                  height: "44px",
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "600",
                    color: theme.palette.text.primary,
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {friend.name || "Desconocido"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.8rem",
                  }}
                >
                  Amigo
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/profile/${friend._id}`)}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    minWidth: "80px",
                    height: "32px",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  Ver Perfil
                </Button>

                <IconButton
                  onClick={() => handleUnfollow(friend._id)}
                  size="small"
                  sx={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.error.light,
                      borderColor: theme.palette.error.main,
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <PersonRemoveOutlined sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FriendsWidget;

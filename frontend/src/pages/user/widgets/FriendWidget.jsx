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
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserFriends, toggleFriend } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice";
import useUser from "../../../hooks/useUser";
import { stables } from "../../../constants";
import { PersonRemoveOutlined, PeopleOutlined } from "@mui/icons-material";
import { Eye } from "lucide-react";

const FriendsWidget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // screens smaller than 900px
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
        padding: { xs: "1rem", sm: "1.5rem" },
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap="12px" mb={2}>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: "12px",
            padding: { xs: "6px", sm: "8px" }, // Smaller on mobile
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PeopleOutlined
            sx={{ color: "white", fontSize: { xs: "18px", sm: "20px" } }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: "1rem", sm: "1.1rem" }, // Responsive font size
            }}
          >
            Mis amigos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
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
            py: { xs: 3, sm: 4 }, // Responsive padding
            px: 2,
          }}
        >
          <PeopleOutlined
            sx={{
              fontSize: { xs: "40px", sm: "48px" },
              color: theme.palette.text.disabled,
              mb: 1,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "500",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            No tienes amigos agregados
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.disabled,
              mt: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Comienza a conectar con otras personas
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: "8px", sm: "12px" },
          }}
        >
          {localFriends.map((friend, index) => (
            <Box
              key={friend._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: "8px", sm: "12px" }, // Responsive gap
                padding: { xs: "8px", sm: "12px" }, // Responsive padding
                borderRadius: "12px",
                transition: "all 0.2s ease",
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
                  width: { xs: "36px", sm: "44px" }, // Smaller on mobile
                  height: { xs: "36px", sm: "44px" },
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
                    fontSize: { xs: "0.85rem", sm: "0.95rem" }, // Responsive font size
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
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    display: { xs: "none", sm: "block" }, // Hide on mobile to save space
                  }}
                >
                  Amigo
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: "4px", sm: "8px" },
                  alignItems: "center",
                }}
              >
                {/* View Profile Button - Responsive design */}
                {isMobile ? (
                  // Mobile: Icon-only button with tooltip-like title
                  <IconButton
                    onClick={() => navigate(`/profile/${friend._id}`)}
                    size="small"
                    title="Ver perfil" // Tooltip on hover/touch
                    sx={{
                      width: "32px",
                      height: "32px",
                      border: `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Eye size={16} />
                  </IconButton>
                ) : (
                  // Desktop: Button with text
                  <Button
                    size="small"
                    startIcon={<Eye />}
                    variant="outlined"
                    onClick={() => navigate(`/profile/${friend._id}`)}
                    sx={{
                      borderRadius: "30px",
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
                    Ver perfil
                  </Button>
                )}

                {/* Remove Friend Button */}
                <IconButton
                  onClick={() => handleUnfollow(friend._id)}
                  size="small"
                  title="Eliminar amigo" // Tooltip
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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, toggleFriend } from "../../../services/index/users";
import { setFriends } from "../../../store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Skeleton,
  Badge,
  Tooltip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { stables } from "../../../constants";
import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  SearchOutlined,
  PeopleOutlined,
  Clear,
} from "@mui/icons-material";

const UserList = ({ currentUser, token }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const friends = useSelector((state) =>
    Array.isArray(state.auth.user?.friends) ? state.auth.user.friends : []
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingFriends, setProcessingFriends] = useState(new Set());

  useEffect(() => {
    if (token) {
      setLoading(true);
      getAllUsers(token)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast.error("Error al cargar usuarios");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  const handleFriendToggle = async (userId) => {
    setProcessingFriends((prev) => new Set(prev.add(userId)));

    try {
      const updatedUser = await toggleFriend({ userId, token });
      dispatch(setFriends(updatedUser.friends));

      // Find the user name from your users list
      const user = users.find((u) => u._id === userId);
      const userName = user?.name || "Usuario";

      const isFriend = updatedUser.friends.includes(userId);
      toast.success(
        isFriend
          ? `Ahora eres amigo de ${userName}`
          : `Has dejado de seguir a ${userName}`,
        {
          duration: 3000,
        }
      );
    } catch (error) {
      toast.error("Error al actualizar amigos");
      console.error(error);
    } finally {
      setProcessingFriends((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUser?._id &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const friendsCount = friends.length;
  const totalUsers = filteredUsers.length;

  // Limit the number of displayed users to avoid overflow
  const displayedUsers = filteredUsers.slice(0, 100); // Show only first 6 users

  return (
    <Box
      sx={{
        width: "100%",
        height: "fit-content",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        {/* Stats */}
        <Box display="flex" gap={1} sx={{ mb: 2 }}>
          <Chip
            size="small"
            label={`${friendsCount} amigos`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
          <Chip
            size="small"
            label={`${totalUsers} usuarios`}
            color={theme.palette.secondary.medium}
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
        </Box>
      </Box>

      {/* Search Field */}
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 30,
            backgroundColor: theme.palette.background.default,
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ p: 0.5 }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Loading State */}
      {loading ? (
        <Box>
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 1.5,
              }}
            >
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                px: 2,
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 3,
                backgroundColor:
                  theme.palette.background.theme.palette.background.default,
              }}
            >
              <PeopleOutlined
                sx={{
                  fontSize: 48,
                  color: theme.palette.text.disabled,
                  mb: 2,
                }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                {searchTerm ? "Sin resultados" : "No hay usuarios"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Sé el primero en unirte a la comunidad"}
              </Typography>
              {searchTerm && (
                <Button
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ mt: 2, textTransform: "none" }}
                >
                  Limpiar búsqueda
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Users List - No Scroll, Limited Display */}
              <Box sx={{ overflow: "hidden" }}>
                {displayedUsers.map((user, index) => (
                  <Box key={user._id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {/* Avatar */}
                      <Avatar
                        src={
                          user.avatar
                            ? `${stables.UPLOAD_FOLDER_BASE_URL}/${user.avatar}`
                            : undefined
                        }
                        alt={user.name}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${theme.palette.primary.light}`,
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.dark,
                          fontWeight: 600,
                        }}
                      >
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar>

                      {/* User Info */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {friends.includes(user._id) ? "Amigo" : "Usuario"}
                        </Typography>
                      </Box>
                      {/* Friend Toggle Button */}
                      <Tooltip title="Ver perfil">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/profile/${user._id}`)}
                          sx={{
                            borderRadius: "30px",
                            textTransform: "none",

                            height: "32px",
                            borderColor: theme.palette.secondary.medium,
                            color: theme.palette.secondary.medium,
                            "&:hover": {
                              backgroundColor: theme.palette.secondary.medium,
                              color: theme.palette.primary.white,
                              borderColor: theme.palette.secondary.medium,
                            },
                          }}
                        >
                          <Eye />
                        </Button>
                      </Tooltip>
                      {/* Friend Toggle Button */}
                      <Tooltip
                        title={
                          friends.includes(user._id)
                            ? "Eliminar de amigos"
                            : "Agregar a amigos"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleFriendToggle(user._id)}
                          disabled={processingFriends.has(user._id)}
                          sx={{
                            p: 1,
                            border: `1.5px solid ${theme.palette.primary.main}`,
                            backgroundColor: friends.includes(user._id)
                              ? theme.palette.error.lightest
                              : theme.palette.primary.light,
                            color: friends.includes(user._id)
                              ? theme.palette.error.dark
                              : theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: friends.includes(user._id)
                                ? theme.palette.error.main
                                : theme.palette.primary.main,
                              color: "white",
                            },
                            "&:disabled": {
                              backgroundColor:
                                theme.palette.action.disabledBackground,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          {processingFriends.has(user._id) ? (
                            <CircularProgress size={20} />
                          ) : friends.includes(user._id) ? (
                            <PersonRemoveOutlined fontSize="small" />
                          ) : (
                            <PersonAddOutlined fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Divider between users */}
                    {index < displayedUsers.length - 1 && (
                      <Divider sx={{ mx: 2, opacity: 0.5 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default UserList;

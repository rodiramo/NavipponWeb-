import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  useTheme,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Popover,
  Link as MuiLink,
  Chip,
  Divider,
  Fade,
  Zoom,
  Tooltip,
  Slide,
} from "@mui/material";
import { Plus, Edit, Eye } from "lucide-react";
import { stables } from "../../../../../constants";

const Travelers = ({
  travelers,
  friendsList,
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
  creator,
  userRole = "viewer",
  currentUserId,
}) => {
  const theme = useTheme();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [selectedFriendRole, setSelectedFriendRole] = useState("viewer");

  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverTraveler, setPopoverTraveler] = useState(null);

  // Check if user can manage travelers (only owners)
  const canManageTravelers = userRole === "owner";

  const handleOpenAddModal = () => {
    if (!canManageTravelers) return;
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setSelectedFriendId("");
    setSelectedFriendRole("viewer");
    setOpenAddModal(false);
  };

  const handleAddTravelerSubmit = () => {
    if (!canManageTravelers) return;
    if (selectedFriendId) {
      onAddTraveler(selectedFriendId, selectedFriendRole);
      handleCloseAddModal();
    }
  };

  const handleAvatarClick = (event, traveler) => {
    // Only open popover if user can manage travelers or it's their own avatar
    const isOwnAvatar =
      currentUserId &&
      (traveler.userId._id || traveler.userId).toString() ===
        currentUserId.toString();
    if (canManageTravelers || isOwnAvatar) {
      setAnchorEl(event.currentTarget);
      setPopoverTraveler(traveler);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverTraveler(null);
  };

  const handleChangeRole = (newRole) => {
    if (!canManageTravelers || !popoverTraveler) return;
    onUpdateTraveler(
      popoverTraveler.userId._id || popoverTraveler.userId,
      newRole
    );
  };

  const handleRemove = () => {
    if (!canManageTravelers || !popoverTraveler) return;
    onRemoveTraveler(popoverTraveler.userId._id || popoverTraveler.userId);
    handlePopoverClose();
  };

  // Filter out users already in travelers from friendsList
  const availableFriendsForAdd = friendsList.filter(
    (friend) =>
      !travelers?.some(
        (traveler) =>
          (traveler.userId._id || traveler.userId).toString() ===
          friend._id.toString()
      )
  );

  const openPopover = Boolean(anchorEl);

  const getRoleConfig = (role) => {
    switch (role) {
      case "owner":
        return {
          color: theme.palette.warning.main,
          bgColor: `${theme.palette.warning.main}15`,
          label: "Propietario",
          borderRadius: 30,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
        };
      case "editor":
        return {
          color: theme.palette.primary.main,
          bgColor: `${theme.palette.primary.main}15`,
          label: "Editor",
          borderRadius: 30,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main})`,
        };
      case "viewer":
        return {
          color: theme.palette.secondary.main,
          bgColor: `${theme.palette.grey[600]}15`,
          label: "Invitado",
          borderRadius: 30,
          gradient: `linear-gradient(135deg, ${theme.palette.grey[600]})`,
        };
      default:
        return {
          color: "white",
          bgColor: `${theme.palette.grey[600]}15`,
          borderRadius: 30,
          label: "Invitado",
          gradient: `linear-gradient(135deg, ${theme.palette.grey[600]})`,
        };
    }
  };

  const isPopoverReadOnly =
    !canManageTravelers &&
    popoverTraveler &&
    currentUserId &&
    (popoverTraveler.userId._id || popoverTraveler.userId).toString() ===
      currentUserId.toString();

  return (
    <>
      <Box>
        <Box sx={{}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: -2,
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {/* Show Creator Avatar if exists */}
            {creator && (
              <Tooltip
                title={
                  <Box sx={{ textAlign: "center", p: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {creator.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.warning.main }}
                    >
                      Propietario
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Zoom in={true} style={{ transitionDelay: `${0 * 150}ms` }}>
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 100,
                      ml: 2,
                      mr: travelers?.length > 0 ? -1.5 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: -3,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                          opacity: 0.6,
                        },
                      }}
                    >
                      <Avatar
                        src={
                          creator.avatar
                            ? `${stables.UPLOAD_FOLDER_BASE_URL}/${creator.avatar}`
                            : ""
                        }
                        sx={{
                          width: 56,
                          height: 56,
                          position: "relative",
                          zIndex: 1,
                          border: `3px solid ${theme.palette.background.default}`,
                          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                          background: !creator.avatar
                            ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                            : undefined,
                          color: "white",
                          fontSize: "1.3rem",
                          fontWeight: 700,
                        }}
                      >
                        {!creator.avatar &&
                          creator.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Box>
                  </Box>
                </Zoom>
              </Tooltip>
            )}

            {/* Travelers */}
            {travelers?.map((traveler, index) => {
              const { userId, role } = traveler;
              const avatarUrl = userId.avatar
                ? `${stables.UPLOAD_FOLDER_BASE_URL}/${userId.avatar}`
                : "";
              const firstLetter = userId.name
                ? userId.name.charAt(0).toUpperCase()
                : "";
              const roleConfig = getRoleConfig(role);
              const isCurrentUser =
                currentUserId &&
                (userId._id || userId).toString() === currentUserId.toString();

              return (
                <Tooltip
                  key={index}
                  title={
                    <Box sx={{ textAlign: "center", p: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {userId.name} {isCurrentUser && "(Tú)"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: roleConfig.color }}
                      >
                        {roleConfig.label}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 99 - index,
                        cursor:
                          canManageTravelers || isCurrentUser
                            ? "pointer"
                            : "default",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        ml: index === 0 && !creator ? 2 : -1.5,
                        "&:hover":
                          canManageTravelers || isCurrentUser
                            ? {
                                transform: "translateY(-8px) scale(1.05)",
                                zIndex: 200,
                              }
                            : {},
                      }}
                      onClick={(e) => handleAvatarClick(e, traveler)}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: -3,
                            borderRadius: "50%",
                            background: roleConfig.gradient,
                            opacity: 0.6,
                            transition: "all 0.3s ease",
                          },
                          "&:hover::before":
                            canManageTravelers || isCurrentUser
                              ? {
                                  opacity: 1,
                                  inset: -5,
                                }
                              : {},
                        }}
                      >
                        <Avatar
                          src={avatarUrl}
                          sx={{
                            width: 56,
                            height: 56,
                            position: "relative",
                            zIndex: 1,
                            border: `3px solid ${theme.palette.background.default}`,
                            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover":
                              canManageTravelers || isCurrentUser
                                ? {
                                    boxShadow: `0 20px 40px ${roleConfig.color}30`,
                                  }
                                : {},
                            background: !avatarUrl
                              ? roleConfig.gradient
                              : undefined,
                            color: "white",
                            fontSize: "1.3rem",
                            fontWeight: 700,
                          }}
                        >
                          {!avatarUrl && firstLetter}
                        </Avatar>
                      </Box>
                    </Box>
                  </Zoom>
                </Tooltip>
              );
            })}

            {/* Add Traveler Button - Only show for owners */}
            {canManageTravelers && (
              <Tooltip title="Añadir compañero" arrow>
                <Box
                  sx={{
                    ml: travelers?.length > 0 || creator ? -0.5 : 2,
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={handleOpenAddModal}
                    sx={{
                      width: 56,
                      height: 56,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                      color: "white",
                      border: `3px solid ${theme.palette.background.default}`,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: `0 20px 40px ${theme.palette.primary.main}40`,
                        transform: "translateY(-8px) scale(1.05)",
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark})`,
                      },
                      "&:active": {
                        transform: "translateY(-6px) scale(1.02)",
                      },
                    }}
                  >
                    <Plus size={28} />
                  </IconButton>
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Popover - Show for owners or when viewing own profile */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        sx={{
          mt: 2,
          "& .MuiPopover-paper": {
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.background.default}95, ${theme.palette.background.default}80)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.divider}40`,
            boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
            overflow: "visible",
          },
        }}
      >
        {popoverTraveler && (
          <Box sx={{ p: 4, minWidth: 320, maxWidth: 380 }}>
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Avatar
                src={
                  popoverTraveler.userId.avatar
                    ? `${stables.UPLOAD_FOLDER_BASE_URL}/${popoverTraveler.userId.avatar}`
                    : undefined
                }
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background: !popoverTraveler.userId.avatar
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : undefined,
                }}
              >
                {!popoverTraveler.userId.avatar
                  ? popoverTraveler.userId.name?.charAt(0).toUpperCase()
                  : ""}
              </Avatar>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {popoverTraveler.userId.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ opacity: 0.7 }}
              >
                @{popoverTraveler.userId._id?.slice(-6) || "user"}
              </Typography>
            </Box>

            {/* Role Chip */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Chip
                label={getRoleConfig(popoverTraveler.role).label}
                sx={{
                  background: getRoleConfig(popoverTraveler.role).gradient,
                  color: "white",
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  height: 36,
                  fontSize: "0.875rem",
                  borderRadius: "30rem",
                }}
              />
            </Box>

            <Divider sx={{ my: 3, opacity: 0.3 }} />

            {/* Profile Link */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <MuiLink
                href={`/profile/${popoverTraveler.userId._id}`}
                target="_blank"
                rel="noopener"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  borderRadius: 30,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}
              >
                <Eye size={16} />
                Ver perfil completo
              </MuiLink>
            </Box>

            {/* Only show role management for owners */}
            {canManageTravelers && (
              <>
                {/* Role Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="role-label" sx={{ fontWeight: 600 }}>
                    Cambiar Rol
                  </InputLabel>
                  <Select
                    labelId="role-label"
                    value={popoverTraveler.role}
                    label="Cambiar Rol"
                    onChange={(e) => handleChangeRole(e.target.value)}
                    sx={{
                      borderRadius: 3,
                      "& .MuiOutlinedInput-root": {
                        background: `${theme.palette.background.default}50`,
                        backdropFilter: "blur(10px)",
                      },
                    }}
                  >
                    <MenuItem value="viewer">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${theme.palette.grey[600]}, ${theme.palette.grey[700]})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <Eye size={16} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Invitado
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Solo puede ver
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="editor">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <Edit size={16} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Editor
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Puede editar
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Remove Button */}
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleRemove}
                  sx={{
                    borderRadius: 30,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    background: `${theme.palette.error.main}10`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${theme.palette.error.main}30`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: theme.palette.error.main,
                      color: "white",
                    },
                  }}
                >
                  Eliminar del Viaje
                </Button>
              </>
            )}

            {/* Show read-only message for non-owners viewing their own profile */}
            {isPopoverReadOnly && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", fontStyle: "italic" }}
              >
                Solo el propietario puede gestionar compañeros
              </Typography>
            )}
          </Box>
        )}
      </Popover>

      {/* Add Traveler Modal - Only accessible by owners */}
      {canManageTravelers && (
        <Dialog
          open={openAddModal}
          onClose={handleCloseAddModal}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.background.default}95, ${theme.palette.background.default}85)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.divider}40`,
              boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              p: 4,
              textAlign: "center",
              position: "relative",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "white",
                mb: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              Añadir compañero
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.9)",
                position: "relative",
                zIndex: 1,
              }}
            >
              Invita a un amigo a unirse a tu aventura
            </Typography>
          </Box>

          <DialogContent sx={{ p: 4 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel
                id="friend-select-label"
                sx={{
                  fontWeight: 600,
                  color: `${theme.palette.primary.black} !important`,
                  "&.Mui-focused": {
                    color: `${theme.palette.primary.black} !important`,
                  },
                }}
              >
                Selecciona un amigo
              </InputLabel>
              <Select
                labelId="friend-select-label"
                value={selectedFriendId}
                label="Selecciona un amigo"
                onChange={(e) => setSelectedFriendId(e.target.value)}
                sx={{
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    background: `${theme.palette.background.default}50`,
                    backdropFilter: "blur(10px)",
                  },
                }}
              >
                {availableFriendsForAdd?.map((friend) => (
                  <MenuItem key={friend._id} value={friend._id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <img
                        src={
                          friend.avatar
                            ? stables.UPLOAD_FOLDER_BASE_URL + friend.avatar
                            : "/assets/default-avatar.jpg"
                        }
                        alt={friend.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/36x36/cccccc/666666?text=" +
                            friend.name.charAt(0).toUpperCase();
                        }}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <Typography sx={{ fontWeight: 600 }}>
                        {friend.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel
                id="role-select-label"
                sx={{
                  fontWeight: 600,
                  color: `${theme.palette.primary.black} !important`,
                  "&.Mui-focused": {
                    color: `${theme.palette.primary.black} !important`,
                  },
                }}
              >
                Asignar rol
              </InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedFriendRole}
                label="Asignar rol"
                onChange={(e) => setSelectedFriendRole(e.target.value)}
                sx={{
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    background: `${theme.palette.background.default}50`,
                    backdropFilter: "blur(10px)",
                  },
                }}
              >
                <MenuItem value="viewer">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${theme.palette.grey[600]}, ${theme.palette.grey[700]})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Eye size={16} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Invitado
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Solo puede ver
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="editor">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Edit size={16} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Editor
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Puede editar
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions sx={{ p: 4, gap: 2 }}>
            <Button
              onClick={handleCloseAddModal}
              variant="outlined"
              sx={{
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                flex: 1,
                background: `${theme.palette.grey[500]}10`,
                backdropFilter: "blur(10px)",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddTravelerSubmit}
              variant="contained"
              disabled={!selectedFriendId}
              sx={{
                borderRadius: 30,
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                flex: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
                },
                "&:disabled": {
                  background: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              Añadir compañero
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Travelers;

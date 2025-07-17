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
  Tooltip,
  Slide,
  useMediaQuery,
  AvatarGroup,
  Badge,
} from "@mui/material";
import { Plus, Edit, Eye, Crown } from "lucide-react";
import { stables } from "../../../../../constants";

const Travelers = ({
  travelers = [],
  friendsList = [],
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
  creator,
  userRole = "viewer",
  currentUserId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    handlePopoverClose();
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
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
        };
      case "editor":
        return {
          color: theme.palette.primary.main,
          bgColor: `${theme.palette.primary.main}15`,
          label: "Editor",
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        };
      case "viewer":
        return {
          color: theme.palette.grey[600],
          bgColor: `${theme.palette.grey[600]}15`,
          label: "Invitado",
          gradient: `linear-gradient(135deg, ${theme.palette.grey[600]}, ${theme.palette.grey[700]})`,
        };
      default:
        return {
          color: theme.palette.grey[600],
          bgColor: `${theme.palette.grey[600]}15`,
          label: "Invitado",
          gradient: `linear-gradient(135deg, ${theme.palette.grey[600]}, ${theme.palette.grey[700]})`,
        };
    }
  };

  const isPopoverReadOnly =
    !canManageTravelers &&
    popoverTraveler &&
    currentUserId &&
    (popoverTraveler.userId._id || popoverTraveler.userId).toString() ===
      currentUserId.toString();

  // Create avatar data for display
  const allTravelers = [
    ...(creator
      ? [
          {
            userId: creator,
            role: "owner",
            isCreator: true,
          },
        ]
      : []),
    ...travelers,
  ];

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Avatar Group */}
        <AvatarGroup
          max={isMobile ? 3 : 5}
          sx={{
            "& .MuiAvatar-root": {
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              border: `2px solid ${theme.palette.background.default}`,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                zIndex: 10,
              },
            },
            "& .MuiAvatarGroup-avatar": {
              color: "white",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 600,
            },
          }}
        >
          {allTravelers.map((traveler, index) => {
            const { userId, role, isCreator } = traveler;
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
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    isCreator ? (
                      <Crown
                        size={10}
                        style={{
                          color: theme.palette.warning.main,
                          background: theme.palette.background.default,
                          borderRadius: "50%",
                          padding: 1,
                        }}
                      />
                    ) : null
                  }
                >
                  <Avatar
                    src={
                      userId.avatar
                        ? `${stables.UPLOAD_FOLDER_BASE_URL}/${userId.avatar}`
                        : ""
                    }
                    sx={{
                      background: !userId.avatar
                        ? roleConfig.gradient
                        : undefined,
                      color: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    onClick={(e) =>
                      !isCreator && handleAvatarClick(e, traveler)
                    }
                  >
                    {!userId.avatar && userId.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </Tooltip>
            );
          })}
        </AvatarGroup>

        {/* Add Traveler Button - Only show for owners */}
        {canManageTravelers && (
          <Tooltip title="Añadir compañero" arrow>
            <IconButton
              onClick={handleOpenAddModal}
              size="small"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                background: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: `2px solid ${theme.palette.background.default}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.3)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Plus size={isMobile ? 14 : 16} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Popover for role management */}
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
            maxWidth: isMobile ? "90vw" : 380,
          },
        }}
      >
        {popoverTraveler && (
          <Box sx={{ p: { xs: 3, sm: 4 }, minWidth: { xs: 280, sm: 320 } }}>
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Avatar
                src={
                  popoverTraveler.userId.avatar
                    ? `${stables.UPLOAD_FOLDER_BASE_URL}/${popoverTraveler.userId.avatar}`
                    : undefined
                }
                sx={{
                  width: { xs: 72, sm: 80 },
                  height: { xs: 72, sm: 80 },
                  mx: "auto",
                  mb: 2,
                  background: !popoverTraveler.userId.avatar
                    ? getRoleConfig(popoverTraveler.role).gradient
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
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
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
                  height: { xs: 32, sm: 36 },
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
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
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}25, ${theme.palette.secondary.main}25)`,
                  },
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
                            background: getRoleConfig("viewer").gradient,
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
                            background: getRoleConfig("editor").gradient,
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

      {/* Add Traveler Modal */}
      {canManageTravelers && (
        <Dialog
          open={openAddModal}
          onClose={handleCloseAddModal}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 4,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              p: { xs: 3, sm: 4 },
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
                fontSize: { xs: "1.5rem", sm: "2rem" },
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
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Invita a un amigo a unirse a tu aventura
            </Typography>
          </Box>

          <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
            {availableFriendsForAdd.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay amigos disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Todos tus amigos ya están en este viaje o no tienes amigos
                  añadidos aún.
                </Typography>
              </Box>
            ) : (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel
                    id="friend-select-label"
                    sx={{
                      fontWeight: 600,
                      color: `${theme.palette.text.primary} !important`,
                      "&.Mui-focused": {
                        color: `${theme.palette.primary.main} !important`,
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={
                              friend.avatar
                                ? `${stables.UPLOAD_FOLDER_BASE_URL}/${friend.avatar}`
                                : undefined
                            }
                            sx={{ width: 36, height: 36 }}
                          >
                            {!friend.avatar &&
                              friend.name?.charAt(0).toUpperCase()}
                          </Avatar>
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
                      color: `${theme.palette.text.primary} !important`,
                      "&.Mui-focused": {
                        color: `${theme.palette.primary.main} !important`,
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: getRoleConfig("viewer").gradient,
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
                            background: getRoleConfig("editor").gradient,
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
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ p: { xs: 3, sm: 4 }, gap: 2 }}>
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
            {availableFriendsForAdd.length > 0 && (
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Travelers;

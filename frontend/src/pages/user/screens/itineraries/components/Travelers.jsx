import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
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
} from "@mui/material";
import { Plus } from "lucide-react";
import { stables } from "../../../../../constants"; // adjust path as needed

const Travelers = ({
  travelers,
  friendsList,
  onAddTraveler,
  onUpdateTraveler,
  onRemoveTraveler,
}) => {
  const theme = useTheme();
  // State for adding a new traveler
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [selectedFriendRole, setSelectedFriendRole] = useState("viewer");

  // State for the "profile card" popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverTraveler, setPopoverTraveler] = useState(null);

  // Handlers for Add Traveler Modal
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setSelectedFriendId("");
    setSelectedFriendRole("viewer");
    setOpenAddModal(false);
  };

  const handleAddTravelerSubmit = () => {
    if (selectedFriendId) {
      onAddTraveler(selectedFriendId, selectedFriendRole);
      handleCloseAddModal();
    }
  };

  // "Profile card" popover open
  const handleAvatarClick = (event, traveler) => {
    setAnchorEl(event.currentTarget);
    setPopoverTraveler(traveler);
  };

  // "Profile card" popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverTraveler(null);
  };

  // For the role dropdown inside the popover
  const handleChangeRole = (newRole) => {
    if (popoverTraveler) {
      onUpdateTraveler(
        popoverTraveler.userId._id || popoverTraveler.userId,
        newRole
      );
    }
  };

  // For removing traveler inside the popover
  const handleRemove = () => {
    if (popoverTraveler) {
      onRemoveTraveler(popoverTraveler.userId._id || popoverTraveler.userId);
    }
  };

  // Filter out users already in `travelers` from `friendsList`.
  const availableFriendsForAdd = friendsList.filter(
    (friend) =>
      !travelers?.some(
        (traveler) =>
          (traveler.userId._id || traveler.userId).toString() ===
          friend._id.toString()
      )
  );

  // Determine if the popover is open
  const openPopover = Boolean(anchorEl);

  return (
    <>
      {/* Travelers list */}
      <Box sx={{ display: "flex", mt: 1, alignItems: "center" }}>
        {/* Render each traveler as an Avatar icon (like Trello). */}
        {travelers?.length > 0 ? (
          travelers.map((traveler, index) => {
            const { userId, role } = traveler;
            const avatarUrl = userId.avatar
              ? `${stables.UPLOAD_FOLDER_BASE_URL}/${userId.avatar}`
              : "";
            const firstLetter = userId.name
              ? userId.name.charAt(0).toUpperCase()
              : "";

            return (
              <IconButton
                key={index}
                size="small"
                onClick={(e) => handleAvatarClick(e, traveler)}
              >
                <Avatar src={avatarUrl}>{!avatarUrl && firstLetter}</Avatar>
              </IconButton>
            );
          })
        ) : (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            Sin compañeros de viaje.
          </Typography>
        )}
        {/* Button to open modal to add new traveler */}
        <Box
          sx={{
            padding: 1,
            borderRadius: 30,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          {" "}
          <IconButton size="small" onClick={handleOpenAddModal}>
            <Plus size={24} color={theme.palette.primary.main} />
          </IconButton>
        </Box>{" "}
      </Box>

      {/* Popover for showing the traveler's "profile card" */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
      >
        {popoverTraveler && (
          <Box sx={{ p: 2, minWidth: 200, maxWidth: 280 }}>
            {/* Top row: avatar & name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Avatar
                src={
                  popoverTraveler.userId.avatar
                    ? `${stables.UPLOAD_FOLDER_BASE_URL}/${popoverTraveler.userId.avatar}`
                    : undefined
                }
              >
                {!popoverTraveler.userId.avatar
                  ? popoverTraveler.userId.name?.charAt(0).toUpperCase()
                  : ""}
              </Avatar>
              <Box sx={{ ml: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {popoverTraveler.userId.name}
                </Typography>
                {/* Example handle or user ID */}
                <Typography variant="caption" color="text.secondary">
                  @{popoverTraveler.userId._id?.slice(-6) || "user"}
                </Typography>
              </Box>
            </Box>

            {/* Link to user profile */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              <MuiLink
                href={`/profile/${popoverTraveler.userId._id}`}
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Ver Perfil
              </MuiLink>
            </Typography>

            {/* Edit role dropdown */}
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                value={popoverTraveler.role}
                label="Rol"
                onChange={(e) => handleChangeRole(e.target.value)}
              >
                <MenuItem value="viewer">Invitado</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>

            {/* Kick traveler out button */}
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleRemove}
            >
              Eliminar del viaje
            </Button>
          </Box>
        )}
      </Popover>

      {/* Add Traveler Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Añadir Compañero de Viaje</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="friend-select-label">
              Selecciona un amigo
            </InputLabel>
            <Select
              labelId="friend-select-label"
              value={selectedFriendId}
              label="Selecciona un amigo"
              onChange={(e) => setSelectedFriendId(e.target.value)}
            >
              {availableFriendsForAdd?.map((friend) => (
                <MenuItem key={friend._id} value={friend._id}>
                  {friend.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select-label">Selecciona un rol</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedFriendRole}
              label="Selecciona un rol"
              onChange={(e) => setSelectedFriendRole(e.target.value)}
            >
              <MenuItem value="viewer">Invitado</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancelar</Button>
          <Button onClick={handleAddTravelerSubmit}>Añadir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Travelers;

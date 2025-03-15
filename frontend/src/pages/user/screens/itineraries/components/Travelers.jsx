import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { Plus } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { stables } from "../../../../../constants"; // adjust path as needed

const TravelersSection = ({
  travelers,
  onAddFriend,
  onUpdateTraveler,
  onRemoveTraveler,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendRole, setNewFriendRole] = useState("viewer"); // default role

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setNewFriendEmail("");
    setNewFriendRole("viewer");
    setOpenAddModal(false);
  };

  const handleAddFriendSubmit = () => {
    if (newFriendEmail.trim()) {
      onAddFriend(newFriendEmail, newFriendRole);
      handleCloseAddModal();
    }
  };

  const handleTravelerMenuOpen = (event, traveler) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTraveler(traveler);
  };

  const handleTravelerMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTraveler(null);
  };

  const handleUpdateRole = (newRole) => {
    if (selectedTraveler) {
      onUpdateTraveler(
        selectedTraveler.userId._id || selectedTraveler.userId,
        newRole
      );
      handleTravelerMenuClose();
    }
  };

  const handleKickTraveler = () => {
    if (selectedTraveler) {
      onRemoveTraveler(selectedTraveler.userId._id || selectedTraveler.userId);
      handleTravelerMenuClose();
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "center" }}>
        {travelers?.length > 0 ? (
          travelers.map((friend, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title={`${friend.role}: ${friend.userId.name}`} arrow>
                <Chip
                  avatar={
                    <Avatar
                      src={
                        friend.userId.avatar
                          ? `${stables.UPLOAD_FOLDER_BASE_URL}/${friend.userId.avatar}`
                          : "/assets/default-avatar.jpg"
                      }
                      alt={friend.userId.name}
                    />
                  }
                  label={friend.userId.name}
                  variant="outlined"
                  sx={{
                    borderRadius: "50px",
                    backgroundColor: "#ffffff22",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#ffffff44",
                      cursor: "pointer",
                    },
                  }}
                />
              </Tooltip>
              <IconButton
                size="small"
                onClick={(e) => handleTravelerMenuOpen(e, friend)}
              >
                <MoreVertIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="gray">
            Sin compañeros de viaje.
          </Typography>
        )}
        <IconButton size="small" onClick={handleOpenAddModal}>
          <Plus size={20} color="white" />
        </IconButton>
      </Box>

      {/* Traveler Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleTravelerMenuClose}
      >
        <MenuItem onClick={() => handleUpdateRole("editor")}>
          Cambiar a Editor
        </MenuItem>
        <MenuItem onClick={() => handleUpdateRole("viewer")}>
          Cambiar a Invitado
        </MenuItem>
        <MenuItem onClick={handleKickTraveler}>Eliminar del viaje</MenuItem>
      </Menu>

      {/* Add Friend Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Añadir Compañero de Viaje</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            fullWidth
            variant="standard"
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Rol (editor/viewer)"
            fullWidth
            variant="standard"
            value={newFriendRole}
            onChange={(e) => setNewFriendRole(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancelar</Button>
          <Button onClick={handleAddFriendSubmit}>Añadir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TravelersSection;

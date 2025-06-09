// src/components/Notifications.jsx
import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Button,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiBell, FiTrash2, FiX } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@mui/material";
import useUser from "../hooks/useUser";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/index/notifications.js";

const Notifications = () => {
  const { jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Fetch notifications when the dropdown is open.
  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(jwt),
    enabled: open, // only fetch when the dropdown is opened
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead({ token: jwt, notificationId });
      refetch(); // Refetch notifications after marking as read.
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation(); // Prevent the menu item onClick from firing
    try {
      await deleteNotification({ token: jwt, notificationId });
      refetch(); // Refetch notifications after deletion
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await clearAllNotifications(jwt);
      refetch(); // Refetch notifications after clearing all
    } catch (error) {
      console.error("Error clearing all notifications", error);
    }
  };

  const handleNotificationClick = (notificationId) => {
    handleMarkAsRead(notificationId);
    setAnchorEl(null);
    navigate("/user/notifications");
  };

  // Function to truncate long messages
  const truncateMessage = (message, maxLength = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const unreadCount = notifications
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge
          badgeContent={unreadCount}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: "bold",
            },
          }}
        >
          <FiBell size={24} color="white" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            maxWidth: 350,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
      >
        {/* Header with Clear All button */}
        {notifications && notifications.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Notificaciones
              </Typography>
              <Button
                size="small"
                onClick={handleClearAllNotifications}
                sx={{
                  color: theme.palette.primary.main,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}20`,
                  },
                }}
              >
                Limpiar todo
              </Button>
            </Box>
            <Divider />
          </>
        )}

        {/* Notifications List */}
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification._id)}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                py: 1.5,
                px: 2,
                backgroundColor: notification.read
                  ? "transparent"
                  : `${theme.palette.primary.main}08`,
                borderLeft: notification.read
                  ? "none"
                  : `3px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}15`,
                },
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: notification.read ? "normal" : "bold",
                    color: notification.read
                      ? "text.secondary"
                      : "text.primary",
                    wordBreak: "break-word",
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={(e) => handleDeleteNotification(notification._id, e)}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                    backgroundColor: "error.light",
                  },
                  ml: 1,
                  flexShrink: 0,
                }}
              >
                <FiTrash2 size={14} />
              </IconButton>
            </MenuItem>
          ))
        ) : (
          <MenuItem
            onClick={() => setAnchorEl(null)}
            sx={{ py: 3, justifyContent: "center", alignItems: "center" }}
          >
            <Box
              sx={{
                color: "text.secondary",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FiBell
                size={32}
                color={theme.palette.primary.main}
                style={{ opacity: 0.3, marginBottom: 8 }}
              />
              <Typography variant="body2">No hay notificaciones</Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Notifications;

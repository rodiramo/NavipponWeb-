// src/components/Notifications.jsx
import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Badge } from "@mui/material";
import { FiBell } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useUser from "../hooks/useUser";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/index/notifications.js";

const Notifications = () => {
  const { jwt } = useUser();
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

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge
          badgeContent={
            notifications ? notifications.filter((n) => !n.read).length : 0
          }
          color="error"
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
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification._id} onClick={() => setAnchorEl(null)}>
              <div>
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={() => setAnchorEl(null)}>
            No hay notificaciones
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Notifications;

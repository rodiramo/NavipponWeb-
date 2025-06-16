// src/components/Notifications.jsx
import React, { useState, useEffect } from "react";
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
  const { jwt, user } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 🔧 FIX: Always fetch notifications, not just when dropdown is open
  const {
    data: notifications,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(jwt),
    enabled: !!jwt && !!user, // Only fetch when user is authenticated
    refetchInterval: 30000, // 🔄 Auto-refresh every 30 seconds
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 🔄 Refetch notifications when dropdown opens (for real-time updates)
  useEffect(() => {
    if (open && jwt) {
      refetch();
    }
  }, [open, jwt, refetch]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead({ token: jwt, notificationId });
      refetch(); // Refetch notifications after marking as read
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

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    setAnchorEl(null);

    // 🔗 Navigate based on notification type and data
    if (notification.data?.itineraryUrl) {
      navigate(notification.data.itineraryUrl);
    } else if (notification.data?.postUrl) {
      navigate(notification.data.postUrl);
    } else if (
      notification.data?.senderProfileUrl ||
      notification.data?.profileUrl
    ) {
      navigate(
        notification.data.senderProfileUrl || notification.data.profileUrl
      );
    } else {
      // Default to notifications page
      navigate("/user/notifications");
    }
  };

  // 📊 Calculate unread count with better error handling
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // 🎨 Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
      case "friend_added":
        return "👥";
      case "itinerary_invite":
      case "itinerary_update":
        return "✈️";
      case "post_like":
      case "post_shared":
        return "❤️";
      case "comment":
      case "reply":
        return "💬";
      case "account_security":
        return "🔒";
      case "system_welcome":
        return "🎉";
      default:
        return "🔔";
    }
  };

  // 🎨 Get notification priority color
  const getNotificationColor = (type) => {
    switch (type) {
      case "account_security":
        return theme.palette.error.main;
      case "friend_request":
        return theme.palette.info.main;
      case "itinerary_invite":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Don't render if user is not authenticated
  if (!user || !jwt) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          position: "relative",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.2s ease",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor:
                unreadCount > 0
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
              color: "white",
              fontWeight: "bold",
              fontSize: "0.75rem",
              minWidth: "20px",
              height: "20px",
              animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
                "50%": {
                  transform: "scale(1.1)",
                  opacity: 0.8,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            },
          }}
        >
          <FiBell
            size={24}
            color="white"
            style={{
              filter:
                unreadCount > 0
                  ? "drop-shadow(0 0 4px rgba(255,255,255,0.5))"
                  : "none",
            }}
          />
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
            maxWidth: 380,
            minWidth: 320,
            maxHeight: 450,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notificaciones
            {unreadCount > 0 && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  ml: 1,
                  color: theme.palette.error.main,
                  fontWeight: 600,
                }}
              >
                ({unreadCount} nuevas)
              </Typography>
            )}
          </Typography>
          {notifications && notifications.length > 0 && (
            <Button
              size="small"
              onClick={handleClearAllNotifications}
              sx={{
                color: theme.palette.error.main,
                textTransform: "none",
                fontSize: "0.75rem",
                minWidth: "auto",
                padding: "4px 8px",
                "&:hover": {
                  backgroundColor: `${theme.palette.error.main}15`,
                },
              }}
            >
              Limpiar todo
            </Button>
          )}
        </Box>

        {/* Loading State */}
        {isLoading && (
          <MenuItem disabled sx={{ py: 3, justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Cargando notificaciones...
            </Typography>
          </MenuItem>
        )}

        {/* Error State */}
        {error && (
          <MenuItem disabled sx={{ py: 3, justifyContent: "center" }}>
            <Typography variant="body2" color="error">
              Error al cargar notificaciones
            </Typography>
          </MenuItem>
        )}

        {/* Notifications List */}
        {!isLoading && !error && notifications && notifications.length > 0 ? (
          <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
            {notifications.map((notification, index) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  py: 2,
                  px: 3,
                  backgroundColor: notification.read
                    ? "transparent"
                    : `${getNotificationColor(notification.type)}08`,
                  borderLeft: notification.read
                    ? "none"
                    : `4px solid ${getNotificationColor(notification.type)}`,
                  "&:hover": {
                    backgroundColor: `${getNotificationColor(notification.type)}12`,
                  },
                  borderBottom:
                    index < notifications.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                {/* Notification Icon */}
                <Box
                  sx={{
                    fontSize: "1.2rem",
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>

                {/* Notification Content */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: notification.read ? 400 : 600,
                      color: notification.read
                        ? "text.secondary"
                        : "text.primary",
                      wordBreak: "break-word",
                      lineHeight: 1.4,
                      mb: 0.5,
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                    }}
                  >
                    {new Date(notification.createdAt).toLocaleString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>

                {/* Delete Button */}
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteNotification(notification._id, e)}
                  sx={{
                    color: "text.secondary",
                    opacity: 0.7,
                    "&:hover": {
                      color: "error.main",
                      backgroundColor: "error.light",
                      opacity: 1,
                    },
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                  }}
                >
                  <FiTrash2 size={12} />
                </IconButton>
              </MenuItem>
            ))}
          </Box>
        ) : (
          !isLoading &&
          !error && (
            /* Empty State */
            <MenuItem
              disabled
              sx={{
                py: 4,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <FiBell
                size={32}
                color={theme.palette.primary.main}
                style={{ opacity: 0.3 }}
              />
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Te notificaremos cuando algo importante suceda
              </Typography>
            </MenuItem>
          )
        )}

        {/* Footer - View All Link */}
        {notifications && notifications.length > 0 && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/user/notifications");
                setAnchorEl(null);
              }}
              sx={{
                justifyContent: "center",
                py: 1.5,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}10`,
                },
              }}
            >
              Ver todas las notificaciones
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default Notifications;

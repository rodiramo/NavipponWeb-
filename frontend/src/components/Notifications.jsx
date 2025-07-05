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
import { FiBell } from "react-icons/fi";
import {
  Users,
  UserPlus,
  Plane,
  MapPin,
  Heart,
  Share,
  MessageCircle,
  Shield,
  Sparkles,
  Bell,
  Trash2,
} from "lucide-react";
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
  const getNotificationIcon = (type, color) => {
    const iconProps = {
      size: 16,
      color: color || theme.palette.text.secondary,
    };

    switch (type) {
      case "friend_request":
        return <UserPlus {...iconProps} />;
      case "friend_added":
        return <Users {...iconProps} />;
      case "itinerary_invite":
        return <MapPin {...iconProps} />;
      case "itinerary_update":
        return <Plane {...iconProps} />;
      case "post_like":
        return <Heart {...iconProps} />;
      case "post_shared":
        return <Share {...iconProps} />;
      case "comment":
      case "reply":
        return <MessageCircle {...iconProps} />;
      case "account_security":
        return <Shield {...iconProps} />;
      case "system_welcome":
        return <Sparkles {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
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
              minWidth: "30px",
              top: "-2px",
              height: "20px",
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
            width: 360, // Fixed width instead of min/max
            maxHeight: 450,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden", // Prevent any overflow
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 1,
            }}
          >
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
                ({unreadCount})
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
                borderRadius: "50px",
                padding: "4px 8px",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: `${theme.palette.error.main}15`,
                },
              }}
            >
              Limpiar
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
          <Box
            sx={{
              maxHeight: 300, // Increased from 100 to 300px
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
            }}
          >
            {notifications.map((notification, index) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  py: 2,
                  px: 2,
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
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden", // Prevent item overflow
                }}
              >
                {/* Notification Icon */}
                <Box
                  sx={{
                    flexShrink: 0,
                    mt: 0.5,
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getNotificationIcon(
                    notification.type,
                    getNotificationColor(notification.type)
                  )}
                </Box>

                {/* Notification Content */}
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0, // Important for text wrapping
                    overflow: "hidden",
                    width: "calc(100% - 60px)", // Account for icon and delete button
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: notification.read ? 400 : 600,
                      color: notification.read
                        ? "text.secondary"
                        : "text.primary",
                      wordBreak: "break-word",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto",
                      lineHeight: 1.4,
                      mb: 0.5,
                      width: "100%",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
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
                    ml: 0.5,
                  }}
                >
                  <Trash2 size={12} />
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
                textAlign: "center",
              }}
            >
              <Bell
                size={32}
                color={theme.palette.primary.main}
                style={{ opacity: 0.9 }}
              />
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  px: 2,
                  wordBreak: "break-word",
                }}
              >
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
                textAlign: "center",
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

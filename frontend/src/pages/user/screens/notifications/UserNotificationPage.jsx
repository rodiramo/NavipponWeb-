import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  IconButton,
  Link as MuiLink,
  Button,
  Fade,
  Chip,
  Stack,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../../../hooks/useUser";
import {
  getNotifications,
  deleteNotification,
  clearAllNotifications,
} from "../../../../services/index/notifications";
import { Trash2, Bell, BellOff, Sparkles } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const UserNotificationsPage = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(jwt),
  });

  const deleteMutation = useMutation({
    mutationFn: (notificationId) =>
      deleteNotification({ token: jwt, notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(jwt),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Empty state component
  const EmptyState = () => (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -2,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, ${theme.palette.primary.main}40, transparent, ${theme.palette.primary.main}40)`,
              animation: "spin 3s linear infinite",
            },
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        >
          <BellOff
            size={48}
            color={theme.palette.primary.main}
            style={{ zIndex: 1 }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 1,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          ¡Todo despejado!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 400, lineHeight: 1.6 }}
        >
          No tienes notificaciones pendientes. Cuando recibas nuevas
          actualizaciones, aparecerán aquí para mantenerte informado.
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1.5,
            borderRadius: "50px",
            backgroundColor: `${theme.palette.primary.main}08`,
            border: `1px solid ${theme.palette.primary.main}20`,
          }}
        >
          <Sparkles size={16} color={theme.palette.primary.main} />
          <Typography variant="caption" color="text.secondary">
            ¡Perfecto para mantenerte organizado!
          </Typography>
        </Box>
      </Box>
    </Fade>
  );

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Cargando notificaciones...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography variant="h6" color="error">
            Error cargando notificaciones
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 4, px: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "30rem",
              background: ` ${theme.palette.primary.light}`,
            }}
          >
            <Bell size={24} color={theme.palette.primary.main} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Notificaciones
            </Typography>
            {notifications.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip
                  label={`${notifications.length} total`}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                />
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} sin leer`}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                )}
              </Stack>
            )}
          </Box>
        </Box>

        {notifications.length > 0 && (
          <Button
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isLoading}
            sx={{
              borderRadius: "30rem",
              textTransform: "none",
              fontWeight: "600",
              px: 3,
              py: 1,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: theme.palette.error.main + "10",
              },
            }}
          >
            {clearAllMutation.isLoading ? "Limpiando..." : "Limpiar todo"}
          </Button>
        )}
      </Box>

      {/* Content */}
      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <List sx={{ gap: 2 }}>
          {notifications.map((notification, index) => (
            <Fade in timeout={600 + index * 100} key={notification._id}>
              <ListItem disableGutters sx={{ mb: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    p: 3,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    borderRadius: "20px",
                    backgroundColor: notification.read
                      ? "background.paper"
                      : `${theme.palette.primary.main}08`,
                    border: notification.read
                      ? `1px solid ${theme.palette.divider}`
                      : `1px solid ${theme.palette.primary.main}30`,
                    borderLeft: notification.read
                      ? `4px solid ${theme.palette.divider}`
                      : `4px solid ${theme.palette.primary.main}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}12`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}15`,
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: notification.read ? "500" : "bold",
                        color: notification.read
                          ? "text.secondary"
                          : "text.primary",
                        lineHeight: 1.5,
                        mb: 1,
                      }}
                    >
                      {notification.type === "friend_added" &&
                      notification.data?.senderId ? (
                        <MuiLink
                          component={RouterLink}
                          to={`/profile/${notification.data.senderId}`}
                          underline="hover"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: "bold",
                            "&:hover": {
                              color: theme.palette.primary.dark,
                            },
                          }}
                        >
                          {notification.message}
                        </MuiLink>
                      ) : notification.type === "itinerary_invite" &&
                        notification.data?.itineraryId ? (
                        <>
                          Has sido añadido al viaje{" "}
                          <MuiLink
                            component={RouterLink}
                            to={`/itinerary/${notification.data.itineraryId}`}
                            underline="hover"
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: "bold",
                              "&:hover": {
                                color: theme.palette.primary.dark,
                              },
                            }}
                          >
                            {notification.data.itineraryName}
                          </MuiLink>{" "}
                          por{" "}
                          {notification.data?.creatorId ? (
                            <MuiLink
                              component={RouterLink}
                              to={`/profile/${notification.data.creatorId}`}
                              underline="hover"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                "&:hover": {
                                  color: theme.palette.primary.dark,
                                },
                              }}
                            >
                              {notification.data.creatorName || "alguien"}
                            </MuiLink>
                          ) : (
                            notification.message
                              .split(" por ")[1]
                              ?.split(" el")[0]
                          )}
                          .
                        </>
                      ) : (
                        notification.message
                      )}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>

                      {!notification.read && (
                        <Chip
                          label="Nuevo"
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <IconButton
                    onClick={() => deleteMutation.mutate(notification._id)}
                    disabled={deleteMutation.isLoading}
                    sx={{
                      ml: 2,
                      p: 1.5,
                      borderRadius: "30px",
                      backgroundColor: `${theme.palette.error.main}10`,
                      color: theme.palette.error.main,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: theme.palette.error.main,
                        color: "white",
                      },
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Paper>
              </ListItem>
            </Fade>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UserNotificationsPage;

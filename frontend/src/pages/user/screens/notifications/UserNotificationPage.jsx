import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../../../hooks/useUser";
import {
  getNotifications,
  deleteNotification,
} from "../../../../services/index/notifications";
import { Trash2 } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const UserNotificationsPage = () => {
  const { jwt } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(jwt),
  });

  const mutation = useMutation({
    mutationFn: (notificationId) =>
      deleteNotification({ token: jwt, notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  if (isLoading) return <Typography>Cargando notificaciones...</Typography>;
  if (error)
    return <Typography color="red">Error cargando notificaciones</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        Notificaciones
      </Typography>
      <List sx={{ gap: 2 }}>
        {notifications.map((n) => (
          <ListItem key={n._id} disableGutters>
            <Paper
              sx={{
                width: "100%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "none",
                border: `1px solid ${theme.palette.secondary.light}`,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {n.type === "friend_added" && n.data?.senderId ? (
                    <MuiLink
                      component={RouterLink}
                      to={`/profile/${n.data.senderId}`}
                      underline="hover"
                      color="inherit"
                    >
                      {n.message}
                    </MuiLink>
                  ) : n.type === "itinerary_invite" && n.data?.itineraryId ? (
                    <>
                      Has sido añadido al viaje{" "}
                      <MuiLink
                        component={RouterLink}
                        to={`/itinerary/${n.data.itineraryId}`}
                        underline="hover"
                        color="inherit"
                      >
                        {n.data.itineraryName}
                      </MuiLink>{" "}
                      por{" "}
                      {n.data?.creatorId ? (
                        <MuiLink
                          component={RouterLink}
                          to={`/profile/${n.data.creatorId}`}
                          underline="hover"
                          color="inherit"
                        >
                          {n.data.creatorName || "alguien"}
                        </MuiLink>
                      ) : (
                        n.message.split(" por ")[1]?.split(" el")[0]
                      )}
                      .
                    </>
                  ) : (
                    n.message
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <IconButton
                onClick={() => mutation.mutate(n._id)}
                sx={{
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.main,
                  p: 1,
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                    color: theme.palette.error.light,
                  },
                }}
              >
                <Trash2 size={20} />
              </IconButton>
            </Paper>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default UserNotificationsPage;

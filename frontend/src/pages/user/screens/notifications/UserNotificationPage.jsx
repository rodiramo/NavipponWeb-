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
                {/* Render message and check for URLs in n.data */}
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {n.type === "friend_added" && n.data?.senderProfileUrl ? (
                    <MuiLink
                      component={RouterLink}
                      to={n.data.senderProfileUrl}
                      underline="hover"
                      color="inherit"
                    >
                      {n.message}
                    </MuiLink>
                  ) : n.type === "itinerary_invite" && n.data?.itineraryUrl ? (
                    <>
                      Has sido añadido al viaje{" "}
                      <MuiLink
                        component={RouterLink}
                        to={n.data.itineraryUrl}
                        underline="hover"
                        color="inherit"
                      >
                        {n.data.itineraryName}
                      </MuiLink>{" "}
                      por{" "}
                      <MuiLink
                        component={RouterLink}
                        to={n.data.creatorProfileUrl}
                        underline="hover"
                        color="inherit"
                      >
                        {n.message.split(" por ")[1].split(" el")[0]}
                      </MuiLink>
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
                  backgroundColor: theme.palette.error.lightest,
                  color: theme.palette.error.main,
                  p: 1,
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                    color: theme.palette.error.lightest,
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

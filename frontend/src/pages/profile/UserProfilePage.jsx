import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { images, stables } from "../../constants";
// Use the updated function that fetches a user profile by ID
import { getUserProfileById } from "../../services/index/users";
import MainLayout from "../../components/MainLayout";
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  PersonAdd,
  Message,
  Share,
  FmdGoodOutlined,
} from "@mui/icons-material";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser, jwt: token } = useUser();
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // Determine if this is the current user's profile or someone else's
  const isOwnProfile = !userId || userId === currentUser?._id;

  // Cover image state
  const [coverImage, setCoverImage] = useState("/assets/bg-home1.jpg");

  useEffect(() => {
    if (token && userId) {
      console.log(`Fetching profile for user ID: ${userId}`);
      getUserProfileById({ userId, token })
        .then((data) => {
          console.log("API User Profile Response:", data);
          setProfile(data);

          // Set cover image
          if (data.coverImg) {
            setCoverImage(`${stables.UPLOAD_FOLDER_BASE_URL}/${data.coverImg}`);
          }

          // ✅ Enhanced friendship status detection
          if (!isOwnProfile && currentUser) {
            console.log("🔍 Checking friendship status:");
            console.log("Current user friends:", currentUser.friends);
            console.log("Profile user ID:", data._id);
            console.log(
              "Current user sent requests:",
              currentUser.sentFriendRequests
            );

            // Check multiple possible friendship indicators
            const isAlreadyFriend =
              currentUser.friends?.includes(data._id) ||
              currentUser.friends?.some(
                (friend) => friend._id === data._id || friend === data._id
              ) ||
              data.friends?.includes(currentUser._id) ||
              data.friends?.some(
                (friend) =>
                  friend._id === currentUser._id || friend === currentUser._id
              ) ||
              data.areFriends === true ||
              data.isFriend === true;

            const requestSent =
              currentUser.sentFriendRequests?.includes(data._id) ||
              currentUser.sentFriendRequests?.some(
                (req) => req._id === data._id || req === data._id
              ) ||
              data.friendRequestSent === true ||
              data.hasReceivedFriendRequest === true;

            console.log("✅ Friendship result:", {
              isAlreadyFriend,
              requestSent,
            });

            setIsFriend(isAlreadyFriend);
            setFriendRequestSent(requestSent);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setError("Error cargando el perfil del usuario.");
          setLoading(false);
        });
    }
  }, [userId, token, currentUser, isOwnProfile]);

  const handleSendFriendRequest = () => {
    // TODO: Implement friend request logic
    console.log("Send friend request to:", profile._id);
    setFriendRequestSent(true);
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging logic
    console.log("Send message to:", profile._id);
  };

  const handleShare = () => {
    // TODO: Implement share profile logic
    console.log("Share profile:", profile._id);
  };

  if (loading)
    return (
      <MainLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={40} />
          <Typography>Cargando perfil...</Typography>
        </Box>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <Box textAlign="center" mt={4}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>
      </MainLayout>
    );

  if (!profile)
    return (
      <MainLayout>
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            No se encontró el perfil del usuario.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Box id="body" width="100%" mx="auto">
        {/* Cover Image Section */}
        <Box
          sx={{
            width: "100%",
            height: "40vh",
            borderRadius: "10px",
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            marginTop: "2rem",
          }}
        >
          {/* Share Button - Only for other profiles */}
          {!isOwnProfile && (
            <IconButton
              sx={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { background: "rgba(0,0,0,0.7)" },
              }}
              onClick={handleShare}
            >
              <Share fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Profile Info Section - Overlapping Cover */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            marginTop: "-75px",
            paddingBottom: "1rem",
          }}
        >
          {/* Profile Picture */}
          <Avatar
            src={
              profile.avatar
                ? `${stables.UPLOAD_FOLDER_BASE_URL}/${profile.avatar}?${Date.now()}`
                : "/default-avatar.png"
            }
            alt={profile.name}
            sx={{
              width: 150,
              height: 150,
              border: `4px solid white`,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
              mb: 2,
            }}
          />

          {/* User Name and Handle */}
          <Typography
            variant="h6"
            color={theme.palette.secondary.medium}
            gutterBottom
          >
            @{profile.name}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ marginBottom: "10px" }}
          >
            <Typography variant="h4" fontWeight="500">
              {profile.name || "Usuario desconocido"}
            </Typography>
          </Box>

          {/* Email - Only show if public or own profile */}
          {(isOwnProfile || profile.showEmail) && (
            <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
              {profile.email || "Correo no disponible"}
            </Typography>
          )}

          {/* Location */}
          {profile.city && profile.country && (
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FmdGoodOutlined sx={{ color: theme.palette.primary.main }} />
              <Typography>
                {profile.city}, {profile.country}
              </Typography>
            </Box>
          )}

          {/* Action Buttons - Only for other profiles */}
          {!isOwnProfile && (
            <Box display="flex" gap={2} mt={2}>
              {/* Already Friends */}
              {isFriend && (
                <>
                  <Button
                    sx={{
                      borderRadius: "25px",
                      px: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: theme.palette.success.lightest,
                      color: theme.palette.success.main,
                    }}
                  >
                    ✓ Amigos
                  </Button>
                </>
              )}

              {/* Friend Request Sent */}
              {!isFriend && friendRequestSent && (
                <Button
                  variant="outlined"
                  disabled
                  sx={{
                    borderRadius: "25px",
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Solicitud Enviada
                </Button>
              )}

              {/* Add Friend Button */}
              {!isFriend && !friendRequestSent && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleSendFriendRequest}
                  sx={{
                    borderRadius: "25px",
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Agregar Amigo
                </Button>
              )}
            </Box>
          )}

          {/* Stats Section */}
          <Box display="flex" gap={4} mt={3} textAlign="center">
            <Box>
              <Typography variant="h6" fontWeight="600">
                {profile.tripsCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Viajes
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {profile.friends?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amigos
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {profile.publicationsCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publicaciones
              </Typography>
            </Box>
          </Box>

          {/* Travel Preferences - Only if public or own profile */}
          {(isOwnProfile || isFriend) &&
            (profile.travelStyle || profile.budget) && (
              <Box mt={3} textAlign="center">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Preferencias de Viaje
                </Typography>
                <Box
                  display="flex"
                  gap={1}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  {profile.travelStyle && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        px: 2,
                        py: 0.5,
                        borderRadius: "15px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {profile.travelStyle}
                    </Box>
                  )}
                  {profile.budget && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        px: 2,
                        py: 0.5,
                        borderRadius: "15px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      Presupuesto {profile.budget}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

          {/* Back Button */}
          <Button
            variant="outlined"
            sx={{
              mt: 4,
              borderRadius: "25px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>

        {/* TODO: Add tabs section here for trips, publications, favorites */}
        {/* You can add the ProfileTabs component here when ready */}
      </Box>
    </MainLayout>
  );
};

export default UserProfilePage;

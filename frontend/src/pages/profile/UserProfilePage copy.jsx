import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbBack from "../../components/BreadcrumbBack";
import useUser from "../../hooks/useUser";
import { images, stables } from "../../constants";
// Use the updated function that fetches a user profile by ID
import {
  getUserProfileById,
  getUserPosts,
  getUserTrips,
  getUserCollaborativeTrips,
  sendFriendRequest,
} from "../../services/index/users";
import MainLayout from "../../components/MainLayout";
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Divider,
  Paper,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  PersonAdd,
  Message,
  Share,
  FmdGoodOutlined,
  CalendarToday,
  Language,
  Work,
  School,
  Favorite,
  Comment,
  Public,
  Lock,
  Group,
  VerifiedUser,
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
  const [currentTab, setCurrentTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [trips, setTrips] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);

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

  // Fetch posts when Posts tab is selected
  useEffect(() => {
    if (currentTab === 0 && profile && token) {
      setPostsLoading(true);
      getUserPosts({ userId: profile._id, token })
        .then((data) => {
          setPosts(data.posts || []);
          setPostsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          setPosts([]); // Set empty array on error
          setPostsLoading(false);
        });
    }
  }, [currentTab, profile, token]);

  // Fetch trips when Trips tab is selected
  useEffect(() => {
    if (currentTab === 1 && profile && token) {
      setTripsLoading(true);
      getUserTrips({ userId: profile._id, token, includePrivate: isOwnProfile })
        .then((data) => {
          setTrips(data.trips || []);
          setTripsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching trips:", error);
          setTrips([]); // Set empty array on error
          setTripsLoading(false);
        });
    }
  }, [currentTab, profile, token, isOwnProfile]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSendFriendRequest = () => {
    console.log("Sending friend request to:", profile._id);

    sendFriendRequest({ userId: profile._id, token })
      .then((data) => {
        setFriendRequestSent(true);
        console.log("Friend request sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending friend request:", error);
        // You might want to show an error message to the user here
      });
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging logic
    console.log("Send message to:", profile._id);
  };

  const handleShare = () => {
    // TODO: Implement share profile logic
    console.log("Share profile:", profile._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <CircularProgress
            size={50}
            sx={{
              color: theme.palette.primary.main,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            Cargando perfil...
          </Typography>
        </Box>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <Box textAlign="center" mt={4}>
          <BreadcrumbBack />{" "}
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
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
        <BreadcrumbBack />{" "}
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            No se encontró el perfil del usuario.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </Box>
      </MainLayout>
    );

  const renderPosts = () => {
    if (postsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      );
    }

    if (posts.length === 0) {
      return (
        <Fade in timeout={800}>
          <Box
            textAlign="center"
            p={6}
            sx={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 300,
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
              }}
            >
              {isOwnProfile
                ? "Aún no has publicado nada"
                : "Este usuario no ha publicado nada"}
            </Typography>
          </Box>
        </Fade>
      );
    }

    return (
      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Zoom in timeout={400 + index * 100}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {post.image && (
                  <CardMedia
                    component="img"
                    height="220"
                    image={`${stables.UPLOAD_FOLDER_BASE_URL}/${post.image}`}
                    alt={post.title}
                    sx={{
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.5,
                      fontWeight: 300,
                    }}
                  >
                    {post.description?.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {formatDate(post.createdAt)}
                    </Typography>
                    <Box display="flex" gap={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        sx={{
                          background: "rgba(255,82,82,0.1)",
                          px: 1,
                          py: 0.5,
                          borderRadius: "12px",
                        }}
                      >
                        <Favorite fontSize="small" color="error" />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.error.main,
                          }}
                        >
                          {post.likesCount || 0}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        sx={{
                          background: "rgba(158,158,158,0.1)",
                          px: 1,
                          py: 0.5,
                          borderRadius: "12px",
                        }}
                      >
                        <Comment fontSize="small" color="action" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {post.commentsCount || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTrips = () => {
    if (tripsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      );
    }

    if (trips.length === 0) {
      return (
        <Fade in timeout={800}>
          <Box
            textAlign="center"
            p={6}
            sx={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 300,
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
              }}
            >
              {isOwnProfile
                ? "Aún no has creado ningún viaje"
                : "Este usuario no tiene viajes públicos"}
            </Typography>
          </Box>
        </Fade>
      );
    }

    return (
      <Grid container spacing={3}>
        {trips.map((trip, index) => (
          <Grid item xs={12} sm={6} md={4} key={trip._id}>
            <Zoom in timeout={400 + index * 100}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {trip.coverImage && (
                  <CardMedia
                    component="img"
                    height="220"
                    image={`${stables.UPLOAD_FOLDER_BASE_URL}/${trip.coverImage}`}
                    alt={trip.title}
                    sx={{
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {trip.title}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        background:
                          trip.privacy === "public"
                            ? "rgba(76,175,80,0.1)"
                            : trip.privacy === "friends"
                              ? "rgba(33,150,243,0.1)"
                              : "rgba(158,158,158,0.1)",
                        color:
                          trip.privacy === "public"
                            ? theme.palette.success.main
                            : trip.privacy === "friends"
                              ? theme.palette.primary.main
                              : theme.palette.grey[600],
                        "&:hover": {
                          background:
                            trip.privacy === "public"
                              ? "rgba(76,175,80,0.2)"
                              : trip.privacy === "friends"
                                ? "rgba(33,150,243,0.2)"
                                : "rgba(158,158,158,0.2)",
                        },
                      }}
                    >
                      {trip.privacy === "public" ? (
                        <Public fontSize="small" />
                      ) : trip.privacy === "friends" ? (
                        <Group fontSize="small" />
                      ) : (
                        <Lock fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.primary.main,
                    }}
                  >
                    📍 {trip.destination}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.5,
                      fontWeight: 300,
                    }}
                  >
                    {trip.description?.length > 100
                      ? `${trip.description.substring(0, 100)}...`
                      : trip.description}
                  </Typography>
                  <Box
                    mt={2}
                    sx={{
                      background: "rgba(0,0,0,0.03)",
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      🗓️ {formatDate(trip.startDate)} -{" "}
                      {formatDate(trip.endDate)}
                    </Typography>
                  </Box>
                  {trip.tags && trip.tags.length > 0 && (
                    <Box mt={2} display="flex" gap={0.5} flexWrap="wrap">
                      {trip.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            background: "rgba(255,255,255,0.5)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "&:hover": {
                              background: "rgba(255,255,255,0.7)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAbout = () => {
    return (
      <Fade in timeout={600}>
        <Box>
          <Paper
            sx={{
              p: 4,
              mb: 3,
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: "1.3rem",
                color: theme.palette.text.primary,
                mb: 3,
              }}
            >
              Información Personal
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              {profile.bio && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Biografía
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {profile.bio}
                  </Typography>
                </Box>
              )}

              {profile.dateOfBirth &&
                (isOwnProfile || profile.showDateOfBirth) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                      background: "rgba(0,0,0,0.03)",
                      px: 2,
                      py: 1.5,
                      borderRadius: "12px",
                    }}
                  >
                    <CalendarToday
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      Nacido el {formatDate(profile.dateOfBirth)}
                    </Typography>
                  </Box>
                )}

              {profile.city && profile.country && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    background: "rgba(0,0,0,0.03)",
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                  }}
                >
                  <FmdGoodOutlined
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    Vive en {profile.city}, {profile.country}
                  </Typography>
                </Box>
              )}

              {profile.website && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    background: "rgba(0,0,0,0.03)",
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                  }}
                >
                  <Language
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography
                    variant="body2"
                    component="a"
                    href={profile.website}
                    target="_blank"
                    sx={{
                      fontWeight: 400,
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {profile.website}
                  </Typography>
                </Box>
              )}

              {profile.occupation && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    background: "rgba(0,0,0,0.03)",
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                  }}
                >
                  <Work
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    {profile.occupation}
                  </Typography>
                </Box>
              )}

              {profile.education && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    background: "rgba(0,0,0,0.03)",
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                  }}
                >
                  <School
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400 }}>
                    {profile.education}
                  </Typography>
                </Box>
              )}

              {profile.joinedDate && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 300,
                      fontStyle: "italic",
                    }}
                  >
                    Se unió en {formatDate(profile.joinedDate)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    );
  };

  return (
    <MainLayout>
      <Box id="body" width="100%" mx="auto">
        <BreadcrumbBack />
        <Fade in timeout={800}>
          <Box
            sx={{
              width: "100%",
              height: "45vh",
              borderRadius: "25px",
              backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%), url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              marginTop: "2rem",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(2px)",
              },
            }}
          >
            {/* Share Button - Only for other profiles */}
            {!isOwnProfile && (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.25)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                  zIndex: 10,
                }}
                onClick={handleShare}
              >
                <Share fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Fade>
        {/* Profile Info Section - Overlapping Cover */}
        <Slide direction="up" in timeout={1000}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              position: "relative",
              marginTop: "-80px",
              paddingBottom: "2rem",
              zIndex: 5,
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
                width: 160,
                height: 160,
                border: `5px solid white`,
                boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.2)",
                mb: 3,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
              }}
            />

            {/* User Name and Handle */}
            <Fade in timeout={1400}>
              <Box textAlign="center">
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 400,
                    fontSize: "1rem",
                    letterSpacing: "0.5px",
                  }}
                  gutterBottom
                >
                  @{profile.name}
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} )`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {profile.name || "Usuario desconocido"}
                  </Typography>
                  {profile.verified && (
                    <VerifiedUser
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: "1.5rem",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Fade>

            {/* Bio */}
            {profile.bio && (
              <Fade in timeout={1600}>
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    maxWidth: 700,

                    color: "text.secondary",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    px: 2,
                  }}
                >
                  {profile.bio}
                </Typography>
              </Fade>
            )}

            {/* Email - Only show if public or own profile */}
            {(isOwnProfile || profile.showEmail) && (
              <Fade in timeout={1800}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    fontWeight: 300,
                    letterSpacing: "0.3px",
                  }}
                >
                  {profile.email || "Correo no disponible"}
                </Typography>
              </Fade>
            )}

            {/* Location */}
            {profile.city && profile.country && (
              <Fade in timeout={2000}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px)",
                    px: 3,
                    py: 1.5,
                    borderRadius: "25px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <FmdGoodOutlined
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "1.2rem",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {profile.city}, {profile.country}
                  </Typography>
                </Box>
              </Fade>
            )}

            {!isOwnProfile && (
              <Fade in timeout={2200}>
                <Box
                  display="flex"
                  gap={2}
                  mt={2}
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  {/* Already Friends */}
                  {isFriend && (
                    <>
                      <Button
                        sx={{
                          borderRadius: "30px",
                          px: 4,
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          background:
                            "linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0.05) 100%)",
                          backdropFilter: "blur(20px)",
                          color: theme.palette.success.main,
                          border: `2px solid ${theme.palette.success.main}`,
                          boxShadow: "0 8px 25px rgba(76,175,80,0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, rgba(76,175,80,0.25) 0%, rgba(76,175,80,0.15) 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(76,175,80,0.4)",
                          },
                          transition: "all 0.3s ease",
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
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)",
                        border: "2px solid rgba(0,0,0,0.12)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
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
                        borderRadius: "30px",
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      Agregar Amigo
                    </Button>
                  )}
                </Box>
              </Fade>
            )}

            {/* Stats Section */}
            <Fade in timeout={2400}>
              <Box
                display="flex"
                gap={6}
                mt={4}
                textAlign="center"
                sx={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px)",
                  px: 6,
                  py: 3,
                  borderRadius: "25px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      fontSize: "1.8rem",
                    }}
                  >
                    {profile.tripsCount || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Viajes
                  </Typography>
                </Box>
                <Box
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.secondary.main,
                      fontSize: "1.8rem",
                    }}
                  >
                    {profile.friends?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Amigos
                  </Typography>
                </Box>
                <Box
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.success.main,
                      fontSize: "1.8rem",
                    }}
                  >
                    {profile.publicationsCount || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Publicaciones
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Slide>
        {/* Tabs Section */}
        <Fade in timeout={2600}>
          <Box sx={{ mt: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                sx={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "25px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  p: 1,
                  minHeight: "auto",
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    borderRadius: "20px",
                    minHeight: "auto",
                    py: 1.5,
                    px: 3,
                    margin: "0 2px",
                    transition: "all 0.3s ease",
                    color: theme.palette.text.secondary,
                    "&.Mui-selected": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} )`,
                      color: "white",
                    },
                  },
                }}
              >
                <Tab label="Publicaciones" />
                <Tab label="Viajes" />
                <Tab label="Acerca de" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ mt: 4 }}>
              {currentTab === 0 && renderPosts()}
              {currentTab === 1 && renderTrips()}
              {currentTab === 2 && renderAbout()}
            </Box>
          </Box>
        </Fade>
      </Box>
    </MainLayout>
  );
};

export default UserProfilePage;

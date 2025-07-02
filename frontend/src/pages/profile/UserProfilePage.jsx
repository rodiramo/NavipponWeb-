import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { stables } from "../../constants";
import BreadcrumbBack from "../../components/BreadcrumbBack";
import {
  getUserProfileById,
  getUserPosts,
  getUserTrips,
} from "../../services/index/users";
import MainLayout from "../../components/MainLayout";
import ArticleCard from "../../components/ArticleCard";
import {
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Container,
} from "@mui/material";
import {
  FmdGoodOutlined,
  CalendarToday,
  Language,
  Work,
  School,
  Public,
  Lock,
  VerifiedUser,
  Edit,
} from "@mui/icons-material";
import FriendToggle from "./component/FriendToggle";
import { Eye, ScrollText, Info } from "lucide-react";
const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, jwt: token } = useUser();
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
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

          // Enhanced friendship status detection
          if (!isOwnProfile && currentUser) {
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

            setIsFriend(isAlreadyFriend);
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
          setPosts([]);
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
          setTrips([]);
          setTripsLoading(false);
        });
    }
  }, [currentTab, profile, token, isOwnProfile]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Helper function to determine user permissions
  const getUserTripPermissions = (trip, currentUser) => {
    if (!currentUser || !trip) {
      return { canView: false, canEdit: false, role: null };
    }

    // Owner has full access
    if (trip.user._id === currentUser._id || trip.user === currentUser._id) {
      return { canView: true, canEdit: true, role: "owner" };
    }

    // Check if user is in travelers array
    const traveler = trip.travelers?.find(
      (t) => t.userId?._id === currentUser._id || t.userId === currentUser._id
    );

    if (traveler) {
      return {
        canView: true,
        canEdit: traveler.role === "editor",
        role: traveler.role,
      };
    }

    // Check if trip is public and user can view
    const canView = !trip.isPrivate || trip.privacy === "public";

    return { canView, canEdit: false, role: "visitor" };
  };

  const handleTripClick = (trip) => {
    const permissions = getUserTripPermissions(trip, currentUser);

    if (!permissions.canView) {
      toast.error("No tienes permisos para ver este viaje");
      return;
    }

    navigate(`/user/itineraries/manage/view/${trip._id}`);
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
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Cargando perfil...
          </Typography>
        </Box>
      </MainLayout>
    );

  if (error || !profile)
    return (
      <MainLayout>
        <Box textAlign="center" mt={4}>
          <Typography color="error" variant="h6">
            {error || "No se encontró el perfil del usuario."}
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

  const renderPosts = () => {
    if (postsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (posts.length === 0) {
      return (
        <Box textAlign="center" p={6}>
          <Typography variant="h6" color="text.secondary">
            {isOwnProfile
              ? "Aún no has publicado nada"
              : "Este usuario no ha publicado nada"}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <ArticleCard
              post={{
                ...post,
                slug: post.slug || post._id,
                photo: post.image,
                caption: post.description,
                user: {
                  _id: profile._id,
                  name: profile.name,
                  avatar: profile.avatar,
                },
              }}
              currentUser={currentUser}
              token={token}
              className="h-full"
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTrips = () => {
    if (tripsLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (trips.length === 0) {
      return (
        <Box textAlign="center" p={6}>
          <Typography variant="h6" color="text.secondary">
            {isOwnProfile
              ? "Aún no has creado ningún viaje"
              : "Este usuario no tiene viajes públicos"}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {trips.map((trip) => {
          const permissions = getUserTripPermissions(trip, currentUser);

          return (
            <Grid item xs={12} sm={6} md={4} key={trip._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  cursor: permissions.canView ? "pointer" : "not-allowed",
                  opacity: permissions.canView ? 1 : 0.6,
                  position: "relative",
                  "&:hover": permissions.canView
                    ? {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      }
                    : {},
                }}
                onClick={() => permissions.canView && handleTripClick(trip)}
              >
                {trip.coverImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${stables.UPLOAD_FOLDER_BASE_URL}/${trip.coverImage}`}
                    alt={trip.title}
                  />
                )}

                {/* Permission Badge */}
                <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                  <Chip
                    icon={
                      permissions.role === "owner" ? (
                        <Edit fontSize="small" />
                      ) : permissions.role === "editor" ? (
                        <Edit fontSize="small" />
                      ) : permissions.role === "viewer" ? (
                        <Eye fontSize="small" />
                      ) : (
                        <Eye fontSize="small" />
                      )
                    }
                    label={
                      permissions.role === "owner"
                        ? "Propietario"
                        : permissions.role === "editor"
                          ? "Editor"
                          : permissions.role === "viewer"
                            ? "Visualizador"
                            : "Solo lectura"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        permissions.role === "owner"
                          ? "success.light"
                          : permissions.role === "editor"
                            ? "primary.light"
                            : permissions.role === "viewer"
                              ? "info.light"
                              : "grey.300",
                      color:
                        permissions.role === "owner"
                          ? "success.dark"
                          : permissions.role === "editor"
                            ? "primary.dark"
                            : permissions.role === "viewer"
                              ? "info.dark"
                              : "grey.700",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
                      {trip.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    {trip.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="caption">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      variant={permissions.canEdit ? "contained" : "outlined"}
                      size="small"
                      startIcon={permissions.canEdit ? <Edit /> : <Eye />}
                      disabled={!permissions.canView}
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Ver viaje
                    </Button>

                    {/* Privacy indicator */}
                    <Chip
                      icon={trip.isPrivate ? <Lock /> : <Public />}
                      label={trip.isPrivate ? "Privado" : "Público"}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderAbout = () => {
    return (
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Información Personal
        </Typography>

        <Grid container spacing={3}>
          {profile.bio && (
            <Grid item xs={12}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Biografía
                </Typography>
                <Typography variant="body1">{profile.bio}</Typography>
              </Box>
            </Grid>
          )}

          {profile.city && profile.country && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <FmdGoodOutlined color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body2">
                    {profile.city}, {profile.country}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {profile.occupation && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Work color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ocupación
                  </Typography>
                  <Typography variant="body2">{profile.occupation}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {profile.education && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <School color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Educación
                  </Typography>
                  <Typography variant="body2">{profile.education}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {profile.website && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Language color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sitio Web
                  </Typography>
                  <Typography
                    variant="body2"
                    component="a"
                    href={profile.website}
                    target="_blank"
                    sx={{ color: "primary.main", textDecoration: "none" }}
                  >
                    {profile.website}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {profile.joinedDate && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Se unió
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(profile.joinedDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="95%" sx={{ pb: 10 }}>
        <BreadcrumbBack />

        {/* Header Card */}
        <Card
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            mb: 4,
          }}
        >
          {/* Gradient Header */}
          <Box
            sx={{
              height: "400px",
              background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%), url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              p: 3,
            }}
          />
          {/* Profile Content */}
          <Box sx={{ px: 7, pb: 3, position: "relative", mt: -5 }}>
            {/* Profile Picture */}
            <Avatar
              src={
                profile.avatar
                  ? `${stables.UPLOAD_FOLDER_BASE_URL}/${profile.avatar}`
                  : "/default-avatar.png"
              }
              alt={profile.name}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                mb: 2,
              }}
            />

            <Grid container spacing={7} alignItems="flex-start">
              <Grid item xs={12} md={8}>
                {/* Name and Title */}
                <Box mb={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      {profile.name || "Usuario desconocido"}
                    </Typography>
                    {profile.verified && <VerifiedUser color="primary" />}
                  </Box>

                  {profile.occupation && (
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontWeight: 400 }}
                    >
                      {profile.occupation}
                    </Typography>
                  )}

                  {profile.city && profile.country && (
                    <Typography variant="body2" color="text.secondary">
                      {profile.city}, {profile.country}
                    </Typography>
                  )}
                </Box>

                {/* Bio */}
                {profile.bio && (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.6 }}
                  >
                    {profile.bio}
                  </Typography>
                )}

                {/* Action Buttons for other profiles */}
                {!isOwnProfile && (
                  <Box sx={{ mb: 3 }}>
                    {/* NEW: Replace the button with FriendToggle component */}
                    <FriendToggle
                      profile={profile}
                      currentUser={currentUser}
                      token={token}
                      isFriend={isFriend}
                      setIsFriend={setIsFriend}
                    />
                  </Box>
                )}
              </Grid>

              {/* Stats Section */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    backgroundColor: "grey.50",
                    borderRadius: "16px",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                  ></Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {profile.tripsCount || 0}
                      </Typography>
                      <Typography variant="body2">Viajes</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {profile.friends?.length || 0}
                      </Typography>
                      <Typography variant="body2">Amigos</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {profile.publicationsCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Posts
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Quick Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => setCurrentTab(0)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ScrollText color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ver Publicaciones
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => setCurrentTab(1)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: "secondary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FmdGoodOutlined color="secondary" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ver viajes
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => setCurrentTab(2)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Info color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Más información
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                "&.Mui-selected": {
                  color: "primary.main",
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
        <Box>
          {currentTab === 0 && renderPosts()}
          {currentTab === 1 && renderTrips()}
          {currentTab === 2 && renderAbout()}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default UserProfilePage;

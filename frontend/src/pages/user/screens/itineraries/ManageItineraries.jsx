import React, { useState, useEffect, useContext } from "react";
import {
  getUserItineraries,
  getInvitedItineraries,
  deleteItinerary,
  leaveItinerary,
} from "../../../../services/index/itinerary";
import { stables } from "../../../../constants";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FavoriteContext from "../../../../context/FavoriteContext";
import {
  useTheme,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Grid,
  Fade,
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
} from "@mui/material";

import {
  Eye,
  Trash2,
  User,
  Crown,
  HandCoins,
  Calendar,
  Users,
  LogOut,
  CirclePlus,
  Search,
  Filter,
  Share,
  Copy,
  Globe,
  Lock,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";

const ManageItineraries = () => {
  const [createdItineraries, setCreatedItineraries] = useState([]);
  const [invitedItineraries, setInvitedItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [leaveDialog, setLeaveDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { favorites } = useContext(FavoriteContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [createdData, invitedData] = await Promise.all([
          getUserItineraries(user._id, jwt),
          getInvitedItineraries(jwt),
        ]);
        setCreatedItineraries(createdData);
        setInvitedItineraries(invitedData);
      } catch (error) {
        toast.error("Error al cargar los itinerarios");
      } finally {
        setLoading(false);
      }
    };

    if (user && jwt) {
      fetchData();
    }
  }, [user, jwt]);

  // Default Japan images from Cloudinary
  const getDefaultJapanImage = (itinerary) => {
    const japanImages = [
      "v1750616108/pexels-evgeny-tchebotarev-1058775-2187430_abucrj.jpg",
      "mount-fuji_fntohz",
      "v1750617234/pexels-bagus41-1440476_drn1wh",
      "fushimi-inari_mssyza",
      "shibuya-crossing_vsbcia",
      "senso-ji-temple_eihjkj",
      "teamlabs_ticabj",
      "kyoto-garden_xefeqa",
      "5_klwjjq",
      "3_rnwhf4",
      "2_usqxi1",
      "default-japan-2_tj5def",
      "default-japan-1_dig1ae",
      "1_mi36gv",
    ];

    // Use itinerary ID to consistently pick the same image
    const imageIndex = itinerary._id
      ? itinerary._id.charCodeAt(itinerary._id.length - 1) % japanImages.length
      : Math.floor(Math.random() * japanImages.length);

    return `${stables.UPLOAD_FOLDER_BASE_URL}${japanImages[imageIndex]}`;
  };

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id, jwt);
      setCreatedItineraries((prev) => prev.filter((it) => it._id !== id));
      toast.success("Itinerario eliminado exitosamente");
      setDeleteDialog({ open: false, id: null, name: "" });
    } catch (error) {
      toast.error("Error al eliminar el itinerario");
    }
  };

  const handleLeave = async (id) => {
    try {
      await leaveItinerary(id, jwt);
      setInvitedItineraries((prev) => prev.filter((it) => it._id !== id));
      toast.success("Has abandonado el itinerario");
      setLeaveDialog({ open: false, id: null, name: "" });
    } catch (error) {
      toast.error("Error al abandonar el itinerario");
    }
  };

  const handleShare = async (itinerary) => {
    const shareUrl = `${window.location.origin}/user/itineraries/manage/view/${itinerary._id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    } catch (error) {
      toast.error("Error al copiar el enlace");
    }
  };

  const handleDuplicate = async (itinerary) => {
    // This would need to be implemented in your backend
    toast.info("Funcionalidad de duplicar próximamente");
  };

  // Filter and sort functions
  const filterItineraries = (itineraries, isOwned = true) => {
    let filtered = itineraries.filter((it) =>
      it.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((it) => {
        if (filterStatus === "private") return it.isPrivate;
        if (filterStatus === "public") return !it.isPrivate;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return a.name.localeCompare(b.name);
        case "duration":
          return (b.travelDays || 0) - (a.travelDays || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const ItineraryCard = ({ itinerary, isOwned = true, onAction }) => {
    const daysUntilTrip = itinerary.startDate
      ? Math.ceil(
          (new Date(itinerary.startDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null;

    return (
      <Fade in timeout={600}>
        <Card
          sx={{
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.palette.secondary.light}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="220"
              image={itinerary.coverImage || getDefaultJapanImage(itinerary)}
              alt={itinerary.name}
              sx={{
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />

            {/* Status overlays */}
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack spacing={1}>
                {/* Privacy Status */}
                <Chip
                  icon={
                    itinerary.isPrivate ? (
                      <Lock size={16} />
                    ) : (
                      <Globe size={16} />
                    )
                  }
                  label={itinerary.isPrivate ? "Privado" : "Público"}
                  size="small"
                  sx={{
                    backgroundColor: itinerary.isPrivate
                      ? `${theme.palette.warning.main}90`
                      : `${theme.palette.success.main}90`,
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />

                {/* Days until trip */}
                {daysUntilTrip !== null && daysUntilTrip > 0 && (
                  <Chip
                    icon={<Clock size={16} />}
                    label={`En ${daysUntilTrip} días`}
                    size="small"
                    sx={{
                      backgroundColor: `${theme.palette.info.main}90`,
                      color: "white",
                      backdropFilter: "blur(10px)",
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                )}
              </Stack>

              {/* Owner/Guest Badge */}
              <Chip
                icon={isOwned ? <Crown size={16} /> : <User size={16} />}
                label={isOwned ? "Creador" : "Invitado"}
                size="small"
                sx={{
                  backgroundColor: isOwned
                    ? `${theme.palette.primary.main}90`
                    : `${theme.palette.secondary.main}90`,
                  color: "white",
                  backdropFilter: "blur(10px)",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </Box>

            {/* Travelers Count */}
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Users size={16} color="white" />
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: 600 }}
              >
                {itinerary.travelers?.length || 1} viajero
                {(itinerary.travelers?.length || 1) !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>

          <CardContent
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 220px)",
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.6em",
              }}
            >
              {itinerary.name}
            </Typography>

            {/* Creator info for invited itineraries */}
            {!isOwned && (
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Avatar
                  src={
                    itinerary.user?.avatar
                      ? `${stables.UPLOAD_FOLDER_BASE_URL}${itinerary.user.avatar}`
                      : undefined
                  }
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: "0.75rem",
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  {itinerary.user?.name?.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Creado por {itinerary.user?.name}
                </Typography>
              </Box>
            )}

            {/* Details */}
            <Stack spacing={2} sx={{ mb: 3, flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Calendar size={18} color={theme.palette.primary.main} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: theme.palette.text.primary }}
                >
                  {itinerary.travelDays} día
                  {itinerary.travelDays !== 1 ? "s" : ""} de viaje
                </Typography>
              </Box>

              {itinerary.totalBudget && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <HandCoins size={18} color={theme.palette.primary.main} />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: theme.palette.text.primary }}
                  >
                    Presupuesto: ¥
                    {itinerary.totalBudget?.toLocaleString("es-ES")}
                  </Typography>
                </Box>
              )}

              {itinerary.destination && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <MapPin size={18} color={theme.palette.primary.main} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {itinerary.destination}
                  </Typography>
                </Box>
              )}

              {!isOwned &&
                (() => {
                  const myTraveler = itinerary.travelers?.find(
                    (traveler) =>
                      String(traveler.userId._id) === String(user._id)
                  );
                  const myRole = myTraveler?.role || "Invitado";

                  return (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <User size={18} color={theme.palette.secondary.main} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Tu rol: {myRole}
                      </Typography>
                    </Box>
                  );
                })()}
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={<Eye size={18} />}
                onClick={() =>
                  navigate(`/user/itineraries/manage/view/${itinerary._id}`)
                }
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  flex: 1,
                  py: 1,
                  boxShadow: "none",
                  border: `1px solid ${theme.palette.secondary.medium}`,
                  backgroundColor: "transparent",
                  color: theme.palette.secondary.medium,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Ver detalles
              </Button>

              <Tooltip title="Compartir">
                <IconButton
                  onClick={() => handleShare(itinerary)}
                  sx={{
                    backgroundColor: `${theme.palette.info.main}15`,
                    color: theme.palette.info.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.info.main}25`,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Share size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title={isOwned ? "Eliminar" : "Abandonar"}>
                <IconButton
                  onClick={() => {
                    if (isOwned) {
                      setDeleteDialog({
                        open: true,
                        id: itinerary._id,
                        name: itinerary.name,
                      });
                    } else {
                      setLeaveDialog({
                        open: true,
                        id: itinerary._id,
                        name: itinerary.name,
                      });
                    }
                  }}
                  sx={{
                    backgroundColor: `${theme.palette.error.main}15`,
                    color: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.error.main}25`,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isOwned ? <Trash2 size={18} /> : <LogOut size={18} />}
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const EmptyState = ({ isOwned = true }) => (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 8,
          px: 4,
          textAlign: "center",
          backgroundColor: `${theme.palette.primary.main}05`,
          borderRadius: "16px",
          border: `2px dashed ${theme.palette.primary.main}30`,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: `${theme.palette.primary.main}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          {isOwned ? (
            <CirclePlus size={48} color={theme.palette.primary.main} />
          ) : (
            <Users size={48} color={theme.palette.primary.main} />
          )}
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          {isOwned ? "¡Crea tu primer itinerario!" : "Sin invitaciones"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400, lineHeight: 1.6 }}
        >
          {isOwned
            ? "Planifica y organiza tus viajes a Japón. ¡Tu próxima aventura te está esperando!"
            : "Cuando otros usuarios te inviten a sus viajes, aparecerán aquí."}
        </Typography>

        {isOwned && (
          <Button
            variant="contained"
            startIcon={<CirclePlus size={20} />}
            onClick={() => navigate("/user/itineraries/manage/create")}
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,

                boxShadow: theme.shadows[8],
              },
              transition: "all 0.3s ease",
            }}
          >
            Crear Itinerario
          </Button>
        )}
      </Box>
    </Fade>
  );

  const filteredCreated = filterItineraries(createdItineraries, true);
  const filteredInvited = filterItineraries(invitedItineraries, false);

  const stats = {
    totalCreated: createdItineraries.length,
    totalInvited: invitedItineraries.length,
    privateCount: createdItineraries.filter((it) => it.isPrivate).length,
    publicCount: createdItineraries.filter((it) => !it.isPrivate).length,
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Mis Itinerarios
          </Typography>
        </Box>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mb: 3 }}
        >
          Gestiona todos tus viajes y aventuras por Japón en un solo lugar
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: `${theme.palette.primary.main}10`,
                borderRadius: "12px",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalCreated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mis Viajes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: `${theme.palette.primary.main}10`,
                borderRadius: "12px",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalInvited}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invitaciones
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: `${theme.palette.primary.main}10`,
                borderRadius: "12px",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.publicCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Públicos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: `${theme.palette.primary.main}10`,
                borderRadius: "12px",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.privateCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Privados
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar itinerarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: "30px" }}
              >
                <MenuItem value="newest">Más recientes</MenuItem>
                <MenuItem value="oldest">Más antiguos</MenuItem>
                <MenuItem value="name">Nombre A-Z</MenuItem>
                <MenuItem value="duration">Duración</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filtrar</InputLabel>
              <Select
                value={filterStatus}
                label="Filtrar"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ borderRadius: "30px" }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="public">Públicos</MenuItem>
                <MenuItem value="private">Privados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading && <LinearProgress sx={{ mb: 4, borderRadius: "4px" }} />}

      {/* Your Itineraries Section */}
      <Box sx={{ mb: 8 }}>
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
                borderRadius: "12px",
                backgroundColor: `${theme.palette.primary.main}15`,
              }}
            >
              <Crown size={24} color={theme.palette.primary.main} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                Mis Viajes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredCreated.length} de {createdItineraries.length}{" "}
                itinerarios
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<CirclePlus size={20} />}
            onClick={() => navigate("/user/itineraries/manage/create")}
            sx={{
              borderRadius: "30px",
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Nuevo Itinerario
          </Button>
        </Box>

        {filteredCreated.length === 0 ? (
          createdItineraries.length === 0 ? (
            <EmptyState isOwned={true} />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron itinerarios con los filtros aplicados
              </Typography>
            </Box>
          )
        ) : (
          <Grid container spacing={3}>
            {filteredCreated.map((itinerary, index) => (
              <Grid item xs={12} sm={6} lg={4} key={itinerary._id}>
                <Fade in timeout={300 + index * 50}>
                  <div>
                    <ItineraryCard
                      itinerary={itinerary}
                      isOwned={true}
                      onAction={() =>
                        setDeleteDialog({
                          open: true,
                          id: itinerary._id,
                          name: itinerary.name,
                        })
                      }
                    />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Invited Itineraries Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: `${theme.palette.secondary.main}15`,
            }}
          >
            <Users size={24} color={theme.palette.secondary.main} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.text.primary }}
            >
              Invitaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredInvited.length} de {invitedItineraries.length}{" "}
              invitaciones
            </Typography>
          </Box>
        </Box>

        {filteredInvited.length === 0 ? (
          invitedItineraries.length === 0 ? (
            <EmptyState isOwned={false} />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron invitaciones con los filtros aplicados
              </Typography>
            </Box>
          )
        ) : (
          <Grid container spacing={3}>
            {filteredInvited.map((itinerary, index) => (
              <Grid item xs={12} sm={6} lg={4} key={itinerary._id}>
                <Fade in timeout={300 + index * 50}>
                  <div>
                    <ItineraryCard
                      itinerary={itinerary}
                      isOwned={false}
                      onAction={() =>
                        setLeaveDialog({
                          open: true,
                          id: itinerary._id,
                          name: itinerary.name,
                        })
                      }
                    />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: "" })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el itinerario "
            <strong>{deleteDialog.name}</strong>"? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Confirmation Dialog */}
      <Dialog
        open={leaveDialog.open}
        onClose={() => setLeaveDialog({ open: false, id: null, name: "" })}
      >
        <DialogTitle>Abandonar Itinerario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres abandonar el itinerario "
            <strong>{leaveDialog.name}</strong>"? Ya no tendrás acceso a este
            viaje.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLeaveDialog({ open: false, id: null, name: "" })}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleLeave(leaveDialog.id)}
            color="warning"
            variant="contained"
          >
            Abandonar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageItineraries;

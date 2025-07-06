import React, { useState, useEffect } from "react";
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
  useMediaQuery,
  Paper,
  Collapse,
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
  Share,
  Globe,
  Lock,
  MapPin,
  Clock,
  MoreVertical,
  Filter,
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
  const [showFilters, setShowFilters] = useState(false);

  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Custom breakpoints for better card layout
  const isWideTablet = useMediaQuery(
    "(min-width: 900px) and (max-width: 1100px)"
  );
  const isUltraWide = useMediaQuery("(min-width: 1800px)");

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

  // Enhanced Responsive Itinerary Card
  const ItineraryCard = ({ itinerary, isOwned = true, onAction }) => {
    const [expanded, setExpanded] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const daysUntilTrip = itinerary.startDate
      ? Math.ceil(
          (new Date(itinerary.startDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null;

    const handleMenuOpen = (event) => {
      setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
      setMenuAnchor(null);
    };

    return (
      <Fade in timeout={600}>
        <Card
          sx={{
            height: "100%",
            borderRadius: { xs: "12px", sm: "16px" },
            overflow: "hidden",
            boxShadow: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="200px"
              image={itinerary.coverImage || getDefaultJapanImage(itinerary)}
              alt={itinerary.name}
              sx={{
                objectFit: "cover",
                width: "100%",
                minHeight: "200px", // Ensure minimum height
                maxHeight: "200px", // Ensure maximum height
                aspectRatio: "16/9", // Force consistent aspect ratio
                display: "block", // Prevent inline spacing issues
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: isDesktop ? "scale(1.02)" : "none",
                },
              }}
            />
            {/* Status overlays - Responsive */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 12 },
                left: { xs: 8, sm: 12 },
                right: { xs: 8, sm: 12 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Stack spacing={1} sx={{ flex: 1 }}>
                {/* Privacy Status */}
                <Chip
                  icon={
                    itinerary.isPrivate ? (
                      <Lock
                        size={isMobile ? 14 : 16}
                        color={theme.palette.primary.dark}
                      />
                    ) : (
                      <Globe
                        size={isMobile ? 14 : 16}
                        color={theme.palette.success.dark}
                      />
                    )
                  }
                  label={itinerary.isPrivate ? "Privado" : "Público"}
                  size="small"
                  sx={{
                    backgroundColor: itinerary.isPrivate
                      ? `${theme.palette.primary.light}`
                      : `${theme.palette.success.light}`,
                    color: itinerary.isPrivate
                      ? `${theme.palette.primary.dark}`
                      : `${theme.palette.success.dark}`,
                    width: "fit-content",
                    backdropFilter: "blur(10px)",
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                    height: { xs: 24, md: 28 },
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />

                {/* Days until trip - only show on larger screens or when expanded */}
                {daysUntilTrip !== null &&
                  daysUntilTrip > 0 &&
                  (isDesktop || expanded) && (
                    <Chip
                      icon={<Clock size={isMobile ? 14 : 16} />}
                      label={`En ${daysUntilTrip} día${daysUntilTrip !== 1 ? "s" : ""}`}
                      size="small"
                      sx={{
                        backgroundColor: `${theme.palette.info.main}90`,
                        color: "white",
                        backdropFilter: "blur(10px)",
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        height: { xs: 24, md: 28 },
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                  )}
              </Stack>

              {/* Owner/Guest Badge */}
              <Chip
                icon={
                  isOwned ? (
                    <Crown size={isMobile ? 14 : 16} />
                  ) : (
                    <User
                      size={isMobile ? 14 : 16}
                      color={theme.palette.secondary.light}
                    />
                  )
                }
                label={isOwned ? "Creador" : "Invitado"}
                size="small"
                sx={{
                  backgroundColor: isOwned
                    ? `${theme.palette.primary.main}90`
                    : `${theme.palette.secondary.medium}`,
                  color: isOwned ? `white` : `${theme.palette.primary.white}`,
                  backdropFilter: "blur(10px)",
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  height: { xs: 24, md: 28 },
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </Box>

            {/* Travelers Count */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: 8, sm: 12 },
                left: { xs: 8, sm: 12 },
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: { xs: "18px", md: "30px" },
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.5, md: 1 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, md: 1 },
              }}
            >
              <Users size={isMobile ? 14 : 16} color="white" />
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                }}
              >
                {itinerary.travelers?.length || 1} viajero
                {(itinerary.travelers?.length || 1) !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {/* Mobile menu button */}
            {isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ p: 0.5 }}
                >
                  <MoreVertical size={16} />
                </IconButton>
              </Box>
            )}
          </Box>

          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* Title */}
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: { xs: "2.4em", md: "2.6em" },
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              }}
            >
              {itinerary.name}
            </Typography>

            {/* Creator info for invited itineraries */}
            {!isOwned && (
              <Box
                sx={{
                  mb: { xs: 1.5, md: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  src={
                    itinerary.user?.avatar
                      ? `${stables.UPLOAD_FOLDER_BASE_URL}${itinerary.user.avatar}`
                      : undefined
                  }
                  sx={{
                    width: { xs: 20, md: 24 },
                    height: { xs: 20, md: 24 },
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  {itinerary.user?.name?.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  Creado por {itinerary.user?.name}
                </Typography>
              </Box>
            )}

            {/* Details - Responsive layout */}
            <Stack
              spacing={{ xs: 1.5, md: 2 }}
              sx={{ mb: { xs: 2, md: 3 }, flex: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Calendar
                  size={isMobile ? 16 : 18}
                  color={theme.palette.primary.main}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  {itinerary.travelDays} día
                  {itinerary.travelDays !== 1 ? "s" : ""} de viaje
                </Typography>
              </Box>

              {/* Collapsible details for mobile */}
              <Collapse in={expanded || isDesktop}>
                <Stack spacing={{ xs: 1.5, md: 2 }}>
                  {itinerary.totalBudget && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <HandCoins
                        size={isMobile ? 16 : 18}
                        color={theme.palette.primary.main}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: itinerary.totalBudget
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                          fontSize: { xs: "0.8rem", md: "0.875rem" },
                        }}
                      >
                        {itinerary.totalBudget
                          ? `Presupuesto: ¥${itinerary.totalBudget.toLocaleString("es-ES")}`
                          : "Presupuesto no definido"}
                      </Typography>
                    </Box>
                  )}

                  {itinerary.destination && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <MapPin
                        size={isMobile ? 16 : 18}
                        color={theme.palette.primary.main}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: { xs: "0.8rem", md: "0.875rem" },
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <User
                            size={isMobile ? 16 : 18}
                            color={theme.palette.secondary.medium}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                              fontSize: { xs: "0.8rem", md: "0.875rem" },
                            }}
                          >
                            Tu rol: {myRole}
                          </Typography>
                        </Box>
                      );
                    })()}
                </Stack>
              </Collapse>
            </Stack>

            {/* Actions - Responsive layout */}
            {isMobile ? (
              <Box>
                {/* Toggle details button */}
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    textTransform: "none",
                    mb: 2,
                    fontSize: "0.75rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {expanded ? "Menos detalles" : "Más detalles"}
                </Button>

                {/* Primary action button */}
                <Button
                  variant="contained"
                  startIcon={<Eye size={16} />}
                  onClick={() =>
                    navigate(`/user/itineraries/manage/view/${itinerary._id}`)
                  }
                  fullWidth
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: "0.875rem",
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Ver Detalles
                </Button>
              </Box>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<Eye size={18} />}
                  onClick={() =>
                    navigate(`/user/itineraries/manage/view/${itinerary._id}`)
                  }
                  sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    flex: 1,
                    py: { sm: 1, md: 1.2 },
                    fontSize: { sm: "0.8rem", md: "0.875rem" },
                    border: `1px solid ${theme.palette.primary.main}`,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      borderColor: theme.palette.primary.dark,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Ver detalles
                </Button>

                <Tooltip title="Compartir">
                  <IconButton
                    onClick={() => handleShare(itinerary)}
                    size={isTablet ? "small" : "medium"}
                    sx={{
                      backgroundColor: `${theme.palette.info.main}15`,
                      color: theme.palette.info.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.info.main}25`,
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Share size={isTablet ? 16 : 18} />
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
                    size={isTablet ? "small" : "medium"}
                    sx={{
                      backgroundColor: `${theme.palette.error.main}15`,
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.error.main}25`,
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isOwned ? (
                      <Trash2 size={isTablet ? 16 : 18} />
                    ) : (
                      <LogOut size={isTablet ? 16 : 18} />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </CardContent>

          {/* Mobile Action Menu */}
          {isMobile && (
            <Dialog
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { borderRadius: 2, minWidth: 200 },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  startIcon={<Share size={16} />}
                  onClick={() => {
                    handleShare(itinerary);
                    handleMenuClose();
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    mb: 1,
                    textTransform: "none",
                  }}
                >
                  Compartir
                </Button>
                <Button
                  fullWidth
                  startIcon={
                    isOwned ? <Trash2 size={16} /> : <LogOut size={16} />
                  }
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
                    handleMenuClose();
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.palette.error.main,
                    textTransform: "none",
                  }}
                >
                  {isOwned ? "Eliminar" : "Abandonar"}
                </Button>
              </Box>
            </Dialog>
          )}
        </Card>
      </Fade>
    );
  };

  const EmptyState = ({ isOwned = true }) => (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 4 },
          textAlign: "center",
          backgroundColor: `${theme.palette.primary.main}05`,
          borderRadius: { xs: "12px", md: "16px" },
          border: `2px dashed ${theme.palette.primary.main}30`,
        }}
      >
        <Box
          sx={{
            width: { xs: 80, md: 120 },
            height: { xs: 80, md: 120 },
            borderRadius: "50%",
            backgroundColor: `${theme.palette.primary.main}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: { xs: 2, md: 3 },
          }}
        >
          {isOwned ? (
            <CirclePlus
              size={isMobile ? 32 : 48}
              color={theme.palette.primary.main}
            />
          ) : (
            <Users
              size={isMobile ? 32 : 48}
              color={theme.palette.primary.main}
            />
          )}
        </Box>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 700,
            mb: { xs: 1.5, md: 2 },
            color: theme.palette.text.primary,
            fontSize: { xs: "1.1rem", md: "1.5rem" },
          }}
        >
          {isOwned ? "¡Crea tu primer itinerario!" : "Sin invitaciones"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: { xs: 3, md: 4 },
            maxWidth: { xs: 300, md: 400 },
            lineHeight: 1.6,
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          {isOwned
            ? "Planifica y organiza tus viajes a Japón. ¡Tu próxima aventura te está esperando!"
            : "Cuando otros usuarios te inviten a sus viajes, aparecerán aquí."}
        </Typography>

        {isOwned && (
          <Button
            variant="contained"
            startIcon={<CirclePlus size={isMobile ? 18 : 20} />}
            onClick={() => navigate("/user/itineraries/manage/create")}
            sx={{
              borderRadius: { xs: "25px", md: "12px" },
              px: { xs: 3, md: 4 },
              py: { xs: 1.25, md: 1.5 },
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", md: "1rem" },
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[8],
                transform: { xs: "none", md: "translateY(-2px)" },
              },
              transition: "all 0.3s ease",
            }}
          >
            Crear Itinerario
          </Button>
        )}
      </Paper>
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
      maxWidth="100%"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        backgroundColor: "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Header - Responsive */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: {
                xs: "1.75rem",
                sm: "2rem",
                md: "2.25rem",
                lg: "2.5rem",
              },
            }}
          >
            Mis Itinerarios
          </Typography>
        </Box>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: { xs: "100%", md: 600 },
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
          }}
        >
          Gestiona todos tus viajes y aventuras por Japón en un solo lugar
        </Typography>

        {/* Stats - Responsive Grid */}
        <Grid
          container
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: { xs: 1.5, sm: 2 },
                backgroundColor: `${theme.palette.background.grey}90`,
                borderRadius: { xs: "8px", md: "12px" },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {stats.totalCreated}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Mis Viajes
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: { xs: 1.5, sm: 2 },
                backgroundColor: `${theme.palette.background.grey}90`,
                borderRadius: { xs: "8px", md: "12px" },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {stats.totalInvited}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Invitaciones
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: { xs: 1.5, sm: 2 },
                backgroundColor: `${theme.palette.background.grey}90`,
                borderRadius: { xs: "8px", md: "12px" },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {stats.publicCount}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Públicos
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: { xs: 1.5, sm: 2 },
                backgroundColor: `${theme.palette.background.grey}90`,
                borderRadius: { xs: "8px", md: "12px" },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {stats.privateCount}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
              >
                Privados
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: { xs: "12px", md: "16px" },
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Grid container spacing={{ xs: 2, md: 2 }} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar itinerarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        size={isMobile ? 18 : 20}
                        color={theme.palette.text.secondary}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "25px", md: "30px" },
                    backgroundColor: theme.palette.background.default,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            {/* Filter controls - Responsive layout */}
            {isMobile ? (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Filter size={16} />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderRadius: "25px",
                    textTransform: "none",
                    py: 1.25,
                  }}
                >
                  Filtros {showFilters ? "▲" : "▼"}
                </Button>

                <Collapse in={showFilters}>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel>Ordenar por</InputLabel>
                      <Select
                        value={sortBy}
                        label="Ordenar por"
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{ borderRadius: "20px" }}
                      >
                        <MenuItem value="newest">Más recientes</MenuItem>
                        <MenuItem value="oldest">Más antiguos</MenuItem>
                        <MenuItem value="name">Nombre A-Z</MenuItem>
                        <MenuItem value="duration">Duración</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel>Filtrar</InputLabel>
                      <Select
                        value={filterStatus}
                        label="Filtrar"
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{ borderRadius: "20px" }}
                      >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="public">Públicos</MenuItem>
                        <MenuItem value="private">Privados</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Collapse>
              </Grid>
            ) : (
              <>
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
              </>
            )}
          </Grid>
        </Paper>
      </Box>

      {loading && <LinearProgress sx={{ mb: 4, borderRadius: "4px" }} />}

      {/* Your Itineraries Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 3, md: 4 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: { xs: "8px", md: "12px" },
                backgroundColor: `${theme.palette.primary.main}15`,
              }}
            >
              <Crown
                size={isMobile ? 20 : 24}
                color={theme.palette.primary.main}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                Mis Viajes
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                {filteredCreated.length} de {createdItineraries.length}{" "}
                itinerarios
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<CirclePlus size={isMobile ? 18 : 20} />}
            onClick={() => navigate("/user/itineraries/manage/create")}
            sx={{
              borderRadius: "30px",
              px: { xs: 2.5, md: 3 },
              py: { xs: 1.25, md: 1.5 },
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", md: "1rem" },
              backgroundColor: theme.palette.primary.main,
              alignSelf: { xs: "stretch", sm: "auto" },
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: { xs: "none", md: "translateY(-1px)" },
              },
              transition: "all 0.2s ease",
            }}
          >
            {isMobile ? "Nuevo Itinerario" : "Nuevo Itinerario"}
          </Button>
        </Box>

        {filteredCreated.length === 0 ? (
          createdItineraries.length === 0 ? (
            <EmptyState isOwned={true} />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                No se encontraron itinerarios con los filtros aplicados
              </Typography>
            </Box>
          )
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filteredCreated.map((itinerary, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={isWideTablet ? 6 : 4}
                lg={isUltraWide ? 3 : 4}
                key={itinerary._id}
              >
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: { xs: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: { xs: "8px", md: "12px" },
              backgroundColor: `${theme.palette.secondary.medium}15`,
            }}
          >
            <Users
              size={isMobile ? 20 : 24}
              color={theme.palette.secondary.medium}
            />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              Invitaciones
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
            >
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
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                No se encontraron invitaciones con los filtros aplicados
              </Typography>
            </Box>
          )
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filteredInvited.map((itinerary, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={isWideTablet ? 6 : 4}
                lg={isUltraWide ? 3 : 4}
                key={itinerary._id}
              >
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            ¿Estás seguro de que quieres eliminar el itinerario "
            <strong>{deleteDialog.name}</strong>"? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.id)}
            color="error"
            variant="contained"
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Confirmation Dialog */}
      <Dialog
        open={leaveDialog.open}
        onClose={() => setLeaveDialog({ open: false, id: null, name: "" })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}>
          Abandonar Itinerario
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
            ¿Estás seguro de que quieres abandonar el itinerario "
            <strong>{leaveDialog.name}</strong>"? Ya no tendrás acceso a este
            viaje.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setLeaveDialog({ open: false, id: null, name: "" })}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleLeave(leaveDialog.id)}
            color="warning"
            variant="contained"
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Abandonar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageItineraries;

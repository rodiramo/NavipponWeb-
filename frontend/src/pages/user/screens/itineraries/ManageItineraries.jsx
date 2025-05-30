import React, { useState, useEffect, useContext } from "react";
import {
  getUserItineraries,
  getInvitedItineraries,
  deleteItinerary,
  leaveItinerary,
} from "../../../../services/index/itinerary";
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
} from "lucide-react";

const ManageItineraries = () => {
  const [createdItineraries, setCreatedItineraries] = useState([]);
  const [invitedItineraries, setInvitedItineraries] = useState([]);
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { favorites } = useContext(FavoriteContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchCreated = async () => {
      try {
        const data = await getUserItineraries(user._id, jwt);
        setCreatedItineraries(data);
      } catch (error) {
        toast.error("Error al obtener tus itinerarios");
      }
    };

    const fetchInvited = async () => {
      try {
        const data = await getInvitedItineraries(jwt);
        setInvitedItineraries(data);
      } catch (error) {
        toast.error(
          "Error al obtener los itinerarios en los que estás invitado"
        );
      }
    };

    if (user && jwt) {
      fetchCreated();
      fetchInvited();
    }
  }, [user, jwt]);

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id, jwt);
      setCreatedItineraries(
        createdItineraries.filter((itinerary) => itinerary._id !== id)
      );
      toast.success("Itinerario eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el itinerario");
    }
  };

  const handleLeave = async (id) => {
    try {
      await leaveItinerary(id, jwt);
      setInvitedItineraries(
        invitedItineraries.filter((itinerary) => itinerary._id !== id)
      );
      toast.success("Has abandonado el itinerario");
    } catch (error) {
      toast.error("Error al abandonar el itinerario");
    }
  };

  // Function to get trip image based on itinerary name or default
  const getTripImage = (itinerary) => {
    const images = [
      // Tokyo & Modern Japan
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Tokyo skyline
      "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Shibuya crossing
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Tokyo tower

      // Traditional Japan
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Traditional temple
      "https://images.pexels.com/photos/161251/senso-ji-temple-asakusa-tokyo-japan-161251.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Senso-ji temple
      "https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Traditional architecture

      // Cherry Blossoms & Nature
      "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Cherry blossoms
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Mount Fuji
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Japanese garden

      // Culture & Food
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Japanese street
      "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Traditional food
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop", // Japanese lanterns
    ];

    const imageIndex = itinerary._id.length % images.length;
    return images[imageIndex];
  };

  const ItineraryCard = ({ itinerary, isOwned = true, onAction }) => (
    <Fade in timeout={600}>
      <Card
        sx={{
          height: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            boxShadow: `0 12px 40px ${theme.palette.primary.main}20`,
            borderColor: theme.palette.primary.main + "40",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={getTripImage(itinerary)}
            alt={itinerary.name}
            sx={{
              transition: "transform 0.3s ease",
            }}
          />

          {/* Owner Badge */}
          <Chip
            icon={isOwned ? <Crown size={16} /> : <User size={16} />}
            label={isOwned ? "Tuyo" : "Invitado"}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: isOwned
                ? theme.palette.warning.main
                : theme.palette.secondary.medium,
              color: "white",
              "& .MuiChip-icon": { color: "white" },
            }}
          />

          {/* Travelers Count */}
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Users size={16} color={"white"} />
            <Typography
              variant="caption"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {itinerary.travelers?.length || 1} viajeros
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {itinerary.name}
          </Typography>

          {!isOwned && (
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.8rem",
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {itinerary.user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Creado por {itinerary.user?.name}
              </Typography>
            </Box>
          )}

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={20} color={theme.palette.secondary.medium} />
              <Typography variant="body2" color="text.secondary">
                <strong>{itinerary.travelDays}</strong> días de viaje
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HandCoins size={20} color={theme.palette.secondary.medium} />
              <Typography variant="body2" color="text.secondary">
                Presupuesto: <strong>${itinerary.totalBudget}</strong>
              </Typography>
            </Box>

            {!isOwned &&
              (() => {
                const myTraveler = itinerary.travelers?.find(
                  (traveler) => String(traveler.userId._id) === String(user._id)
                );
                const myRole = myTraveler?.role || "Invitado";

                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <User size={20} color={theme.palette.secondary.medium} />
                    <Typography variant="body2" color="text.secondary">
                      Tu rol: <strong>{myRole}</strong>
                    </Typography>
                  </Box>
                );
              })()}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<Eye />}
              onClick={() =>
                navigate(`/user/itineraries/manage/view/${itinerary._id}`)
              }
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: "600",
                flex: 1,
                background: `linear-gradient(135deg, ${theme.palette.secondary.medium})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: "scale(1.02)",
                },
              }}
            >
              Ver Detalles
            </Button>

            <IconButton
              onClick={() => onAction(itinerary._id)}
              sx={{
                backgroundColor: isOwned
                  ? theme.palette.error.light
                  : theme.palette.warning.lightest,
                color: isOwned
                  ? theme.palette.error.dark
                  : theme.palette.warning.main,
                borderRadius: "30px",
                px: 2,
                "&:hover": {
                  backgroundColor: isOwned
                    ? theme.palette.error.dark
                    : theme.palette.warning.dark,
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              {isOwned ? <Trash2 /> : <LogOut />}
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );

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
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.light}08)`,
          borderRadius: "24px",
          border: `2px dashed ${theme.palette.primary.main}40`,
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
          }}
        >
          <img
            src="/assets/nothing-here.png"
            alt="No hay itinerarios"
            style={{ width: 64, height: 64, opacity: 0.7 }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {isOwned
            ? "Aún no tienes ningún itinerario"
            : "No tienes invitaciones"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400, lineHeight: 1.6 }}
        >
          {isOwned
            ? "Crea y organiza tus viajes ahora. ¡Tu próxima aventura te está esperando!"
            : "Cuando otros usuarios te inviten a sus viajes, aparecerán aquí."}
        </Typography>

        {isOwned && (
          <Button
            variant="contained"
            startIcon={<CirclePlus />}
            onClick={() => navigate("/user/itineraries/manage/create")}
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: "600",
              fontSize: "1rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: "scale(1.05)",
              },
            }}
          >
            Crear tu primer itinerario
          </Button>
        )}
      </Box>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Mis itinerarios
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Gestiona todos tus viajes y aventuras en un solo lugar
        </Typography>
      </Box>

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
                borderRadius: "16px",
                background: theme.palette.primary.light,
              }}
            >
              <Crown color={theme.palette.primary.main} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
                Mis viajes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {createdItineraries.length} itinerarios creados
              </Typography>
            </Box>
          </Box>

          {createdItineraries.length > 0 && (
            <Button
              variant="contained"
              startIcon={<CirclePlus />}
              onClick={() => navigate("/user/itineraries/manage/create")}
              sx={{
                borderRadius: "50px",
                px: 3,
                py: 1.5,
                textTransform: "none",
                fontWeight: "600",
                background: theme.palette.primary.main,
              }}
            >
              Crear nuevo
            </Button>
          )}
        </Box>

        {createdItineraries.length === 0 ? (
          <EmptyState isOwned={true} />
        ) : (
          <Grid container spacing={3}>
            {createdItineraries.map((itinerary, index) => (
              <Grid item xs={12} sm={6} lg={4} key={itinerary._id}>
                <Fade in timeout={600 + index * 100}>
                  <div>
                    <ItineraryCard
                      itinerary={itinerary}
                      isOwned={true}
                      onAction={handleDelete}
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
              borderRadius: "30px",
              background: `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.info.main}05)`,
            }}
          >
            <Users size={24} color={theme.palette.secondary.medium} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
            >
              Invitaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invitedItineraries.length} viajes donde estás invitado
            </Typography>
          </Box>
        </Box>

        {invitedItineraries.length === 0 ? (
          <EmptyState isOwned={false} />
        ) : (
          <Grid container spacing={3}>
            {invitedItineraries.map((itinerary, index) => (
              <Grid item xs={12} sm={6} lg={4} key={itinerary._id}>
                <Fade in timeout={600 + index * 100}>
                  <div>
                    <ItineraryCard
                      itinerary={itinerary}
                      isOwned={false}
                      onAction={handleLeave}
                    />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ManageItineraries;

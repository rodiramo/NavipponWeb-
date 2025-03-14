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
  Divider,
} from "@mui/material";

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
      await leaveItinerary(id, jwt); // Removes the current user from travelers.
      setInvitedItineraries(
        invitedItineraries.filter((itinerary) => itinerary._id !== id)
      );
      toast.success("Has abandonado el itinerario");
    } catch (error) {
      toast.error("Error al abandonar el itinerario");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        minHeight: "80vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
      >
        Administrar Itinerarios
      </Typography>

      {/* Section for itineraries created by user */}
      <Box sx={{ width: "100%", maxWidth: "700px", mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          Mis Itinerarios
        </Typography>
        {createdItineraries.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <img
              src="/assets/nothing-here.png"
              alt="No hay itinerarios"
              className="w-40 h-40 object-contain mb-4"
            />
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.secondary.medium,
                fontWeight: "bold",
              }}
            >
              Aún no tienes ningún itinerario
            </Typography>
            <Typography sx={{ color: theme.palette.secondary.dark, mb: 2 }}>
              Crea y organiza tus viajes ahora.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/user/itineraries/manage/create")}
              sx={{
                backgroundColor: theme.palette.primary.main,
                borderRadius: "30rem",
                padding: "10px 20px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Crear Itinerario
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={() => navigate("/user/itineraries/manage/create")}
              sx={{
                backgroundColor: theme.palette.primary.main,
                borderRadius: "30rem",
                padding: "10px 20px",
                textTransform: "none",
                mb: 3,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Crear Nuevo Itinerario
            </Button>

            {createdItineraries.map((itinerary) => (
              <Card
                key={itinerary._id}
                sx={{
                  mb: 3,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 2,
                  borderRadius: "10px",
                  padding: "1rem",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {itinerary.name}
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Días de viaje: <b>{itinerary.travelDays}</b>
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Presupuesto total: <b>${itinerary.totalBudget}</b>
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button
                      onClick={() =>
                        navigate(
                          `/user/itineraries/manage/view/${itinerary._id}`
                        )
                      }
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: "white",
                        borderRadius: "20rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      Ver
                    </Button>
                    <Button
                      onClick={() =>
                        navigate(
                          `/user/itineraries/manage/edit/${itinerary._id}`
                        )
                      }
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        borderRadius: "20rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        },
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(itinerary._id)}
                      sx={{
                        backgroundColor: theme.palette.error.main,
                        color: "white",
                        borderRadius: "20rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.error.dark,
                        },
                      }}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>

      {/* Section for itineraries where user is invited */}
      <Box sx={{ width: "100%", maxWidth: "700px" }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          Itinerarios a los que estoy invitado
        </Typography>
        {invitedItineraries.length === 0 ? (
          <Typography>
            No tienes itinerarios a los que estés invitado.
          </Typography>
        ) : (
          invitedItineraries.map((itinerary) => {
            // Extract the user's role in this itinerary:
            const myTraveler = itinerary.travelers.find(
              (traveler) => String(traveler.userId._id) === String(user._id)
            );
            const myRole =
              myTraveler && myTraveler.role ? myTraveler.role : "Invitado";

            return (
              <Card
                key={itinerary._id}
                sx={{
                  mb: 3,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 2,
                  borderRadius: "10px",
                  padding: "1rem",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {itinerary.name}
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Creado por: {itinerary.user.name}
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Tu rol: {myRole}
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Días de viaje: <b>{itinerary.travelDays}</b>
                  </Typography>
                  <Typography sx={{ color: theme.palette.secondary.dark }}>
                    Presupuesto total: <b>${itinerary.totalBudget}</b>
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button
                      onClick={() =>
                        navigate(
                          `/user/itineraries/manage/view/${itinerary._id}`
                        )
                      }
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: "white",
                        borderRadius: "20rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      Ver
                    </Button>
                    <Button
                      onClick={() => handleLeave(itinerary._id)}
                      sx={{
                        backgroundColor: theme.palette.warning.main,
                        color: "white",
                        borderRadius: "20rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: theme.palette.warning.dark,
                        },
                      }}
                    >
                      Abandonar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ManageItineraries;

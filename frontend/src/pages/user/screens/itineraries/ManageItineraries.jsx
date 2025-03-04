import React, { useState, useEffect, useContext } from "react";
import {
  getUserItineraries,
  deleteItinerary,
} from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FavoriteContext from "../../../../context/FavoriteContext";
import {
  useTheme,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";

const ManageItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { favorites } = useContext(FavoriteContext);
  const theme = useTheme();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const data = await getUserItineraries(user._id, jwt);
        setItineraries(data);
      } catch (error) {
        toast.error("Error al obtener los itinerarios");
      }
    };

    fetchItineraries();
  }, [user, jwt]);

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id, jwt);
      setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
      toast.success("Itinerario eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el itinerario");
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

      {/* If no itineraries */}
      {itineraries.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <img
            src="/assets/nothing-here.png" // Change this to your correct image path
            alt="No hay itinerarios"
            className="w-40 h-40 object-contain mb-4"
          />
          <Typography
            variant="h6"
            sx={{ color: theme.palette.secondary.medium, fontWeight: "bold" }}
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

          <Box sx={{ width: "100%", maxWidth: "700px" }}>
            {itineraries.map((itinerary) => (
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
          </Box>
        </>
      )}
    </Box>
  );
};

export default ManageItineraries;

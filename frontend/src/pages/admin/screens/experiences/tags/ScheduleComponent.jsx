import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  MapPin,
  Calendar,
  Home,
  Utensils,
  Camera,
} from "lucide-react";

const ScheduleComponent = ({
  categories,
  schedule,
  setSchedule,
  isMobile = false,
}) => {
  const theme = useTheme();
  const [scheduleType, setScheduleType] = useState("simple");
  const [structuredSchedule, setStructuredSchedule] = useState({
    type: "simple",
    simple: "",
    hotel: {
      checkIn: "15:00",
      checkOut: "11:00",
      receptionHours:
        "lunes: 24 horas martes: 24 horas miércoles: 24 horas jueves: 24 horas viernes: 24 horas sábado: 24 horas domingo: 24 horas",
      additionalServices: [],
    },
    restaurant: {
      regularHours: "",
      specialHours: [],
      deliveryHours: "",
      reservationPolicy: "",
    },
    attraction: {
      regularHours: "",
      seasonalHours: [],
      specialEvents: [],
    },
    multiLocation: {
      locations: [],
    },
  });

  // Initialize from existing schedule
  useEffect(() => {
    if (schedule && typeof schedule === "string") {
      setStructuredSchedule((prev) => ({
        ...prev,
        simple: schedule,
      }));
    }
  }, [schedule]);

  // Days of the week
  const daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  const seasons = [
    "Primavera (Marzo-Mayo)",
    "Verano (Junio-Agosto)",
    "Otoño (Septiembre-Noviembre)",
    "Invierno (Diciembre-Febrero)",
  ];

  // Update main schedule when structured schedule changes
  const updateMainSchedule = (newStructuredSchedule) => {
    setStructuredSchedule(newStructuredSchedule);

    let formattedSchedule = "";

    switch (newStructuredSchedule.type) {
      case "simple":
        formattedSchedule = newStructuredSchedule.simple;
        break;

      case "hotel":
        const hotel = newStructuredSchedule.hotel;
        formattedSchedule = `Check-in: ${hotel.checkIn} | Check-out: ${hotel.checkOut} | Recepción: ${hotel.receptionHours}`;
        if (hotel.additionalServices.length > 0) {
          formattedSchedule += ` | Servicios adicionales: ${hotel.additionalServices.join(", ")}`;
        }
        break;

      case "restaurant":
        const restaurant = newStructuredSchedule.restaurant;
        formattedSchedule = restaurant.regularHours;
        if (restaurant.deliveryHours) {
          formattedSchedule += ` | Delivery: ${restaurant.deliveryHours}`;
        }
        if (restaurant.reservationPolicy) {
          formattedSchedule += ` | Reservas: ${restaurant.reservationPolicy}`;
        }
        if (restaurant.specialHours.length > 0) {
          formattedSchedule += ` | Horarios especiales: ${restaurant.specialHours.map((sh) => `${sh.period}: ${sh.hours}`).join(", ")}`;
        }
        break;

      case "attraction":
        const attraction = newStructuredSchedule.attraction;
        formattedSchedule = attraction.regularHours;
        if (attraction.seasonalHours.length > 0) {
          formattedSchedule += ` | Horarios estacionales: ${attraction.seasonalHours.map((sh) => `${sh.season}: ${sh.hours}`).join(", ")}`;
        }
        if (attraction.specialEvents.length > 0) {
          formattedSchedule += ` | Eventos especiales: ${attraction.specialEvents.map((se) => `${se.name}: ${se.schedule}`).join(", ")}`;
        }
        break;

      case "multiLocation":
        formattedSchedule = newStructuredSchedule.multiLocation.locations
          .map((loc) => `${loc.name}: ${loc.schedule}`)
          .join(" | ");
        break;
    }

    setSchedule(formattedSchedule);
  };

  // Hotel Schedule Component
  const HotelSchedule = () => (
    <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Home size={20} color={theme.palette.primary.main} />
        <Typography variant="h6">Horarios de Hotel</Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Hora de Check-in"
            type="time"
            value={structuredSchedule.hotel.checkIn}
            onChange={(e) =>
              updateMainSchedule({
                ...structuredSchedule,
                hotel: { ...structuredSchedule.hotel, checkIn: e.target.value },
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Hora de Check-out"
            type="time"
            value={structuredSchedule.hotel.checkOut}
            onChange={(e) =>
              updateMainSchedule({
                ...structuredSchedule,
                hotel: {
                  ...structuredSchedule.hotel,
                  checkOut: e.target.value,
                },
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Horarios de Recepción"
            multiline
            rows={2}
            value={structuredSchedule.hotel.receptionHours}
            onChange={(e) =>
              updateMainSchedule({
                ...structuredSchedule,
                hotel: {
                  ...structuredSchedule.hotel,
                  receptionHours: e.target.value,
                },
              })
            }
            fullWidth
            placeholder="lunes: 24 horas martes: 24 horas..."
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Servicios Adicionales
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {[
              "Spa: 9:00-21:00",
              "Restaurante: 7:00-23:00",
              "Gimnasio: 24 horas",
              "Piscina: 6:00-22:00",
            ].map((service) => (
              <Chip
                key={service}
                label={service}
                onClick={() => {
                  const newServices =
                    structuredSchedule.hotel.additionalServices.includes(
                      service
                    )
                      ? structuredSchedule.hotel.additionalServices.filter(
                          (s) => s !== service
                        )
                      : [
                          ...structuredSchedule.hotel.additionalServices,
                          service,
                        ];
                  updateMainSchedule({
                    ...structuredSchedule,
                    hotel: {
                      ...structuredSchedule.hotel,
                      additionalServices: newServices,
                    },
                  });
                }}
                color={
                  structuredSchedule.hotel.additionalServices.includes(service)
                    ? "primary"
                    : "default"
                }
                variant={
                  structuredSchedule.hotel.additionalServices.includes(service)
                    ? "filled"
                    : "outlined"
                }
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );

  // Restaurant Schedule Component
  const RestaurantSchedule = () => {
    const addSpecialHours = () => {
      updateMainSchedule({
        ...structuredSchedule,
        restaurant: {
          ...structuredSchedule.restaurant,
          specialHours: [
            ...structuredSchedule.restaurant.specialHours,
            { period: "", hours: "" },
          ],
        },
      });
    };

    const removeSpecialHours = (index) => {
      const newSpecialHours = structuredSchedule.restaurant.specialHours.filter(
        (_, i) => i !== index
      );
      updateMainSchedule({
        ...structuredSchedule,
        restaurant: {
          ...structuredSchedule.restaurant,
          specialHours: newSpecialHours,
        },
      });
    };

    return (
      <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Utensils size={20} color={theme.palette.primary.main} />
          <Typography variant="h6">Horarios de Restaurante</Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Horarios Regulares"
              multiline
              rows={2}
              value={structuredSchedule.restaurant.regularHours}
              onChange={(e) =>
                updateMainSchedule({
                  ...structuredSchedule,
                  restaurant: {
                    ...structuredSchedule.restaurant,
                    regularHours: e.target.value,
                  },
                })
              }
              fullWidth
              placeholder="lunes: 11:00–22:00 martes: 11:00–22:00..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Horarios de Delivery"
              value={structuredSchedule.restaurant.deliveryHours}
              onChange={(e) =>
                updateMainSchedule({
                  ...structuredSchedule,
                  restaurant: {
                    ...structuredSchedule.restaurant,
                    deliveryHours: e.target.value,
                  },
                })
              }
              fullWidth
              placeholder="19:00–23:00 todos los días"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Política de Reservas"
              value={structuredSchedule.restaurant.reservationPolicy}
              onChange={(e) =>
                updateMainSchedule({
                  ...structuredSchedule,
                  restaurant: {
                    ...structuredSchedule.restaurant,
                    reservationPolicy: e.target.value,
                  },
                })
              }
              fullWidth
              placeholder="Reservas requeridas para grupos de 6+"
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">Horarios Especiales</Typography>
              <Button
                startIcon={<Plus size={16} />}
                onClick={addSpecialHours}
                size="small"
                variant="outlined"
              >
                Agregar
              </Button>
            </Box>

            {structuredSchedule.restaurant.specialHours.map(
              (special, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}
                >
                  <TextField
                    placeholder="Período (ej: Navidad, Año Nuevo)"
                    value={special.period}
                    onChange={(e) => {
                      const newSpecialHours = [
                        ...structuredSchedule.restaurant.specialHours,
                      ];
                      newSpecialHours[index].period = e.target.value;
                      updateMainSchedule({
                        ...structuredSchedule,
                        restaurant: {
                          ...structuredSchedule.restaurant,
                          specialHours: newSpecialHours,
                        },
                      });
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="Horarios especiales"
                    value={special.hours}
                    onChange={(e) => {
                      const newSpecialHours = [
                        ...structuredSchedule.restaurant.specialHours,
                      ];
                      newSpecialHours[index].hours = e.target.value;
                      updateMainSchedule({
                        ...structuredSchedule,
                        restaurant: {
                          ...structuredSchedule.restaurant,
                          specialHours: newSpecialHours,
                        },
                      });
                    }}
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <IconButton
                    onClick={() => removeSpecialHours(index)}
                    size="small"
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              )
            )}
          </Grid>
        </Grid>
      </Card>
    );
  };

  // Attraction Schedule Component
  const AttractionSchedule = () => {
    const addSeasonalHours = () => {
      updateMainSchedule({
        ...structuredSchedule,
        attraction: {
          ...structuredSchedule.attraction,
          seasonalHours: [
            ...structuredSchedule.attraction.seasonalHours,
            { season: "", hours: "" },
          ],
        },
      });
    };

    const addSpecialEvent = () => {
      updateMainSchedule({
        ...structuredSchedule,
        attraction: {
          ...structuredSchedule.attraction,
          specialEvents: [
            ...structuredSchedule.attraction.specialEvents,
            { name: "", schedule: "" },
          ],
        },
      });
    };

    return (
      <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Camera size={20} color={theme.palette.primary.main} />
          <Typography variant="h6">Horarios de Atractivo</Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Horarios Regulares"
              multiline
              rows={2}
              value={structuredSchedule.attraction.regularHours}
              onChange={(e) =>
                updateMainSchedule({
                  ...structuredSchedule,
                  attraction: {
                    ...structuredSchedule.attraction,
                    regularHours: e.target.value,
                  },
                })
              }
              fullWidth
              placeholder="lunes: 9:00–17:00 martes: 9:00–17:00..."
            />
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="subtitle2">
                  Horarios Estacionales
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={addSeasonalHours}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  Agregar Temporada
                </Button>

                {structuredSchedule.attraction.seasonalHours.map(
                  (seasonal, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                          value={seasonal.season}
                          onChange={(e) => {
                            const newSeasonalHours = [
                              ...structuredSchedule.attraction.seasonalHours,
                            ];
                            newSeasonalHours[index].season = e.target.value;
                            updateMainSchedule({
                              ...structuredSchedule,
                              attraction: {
                                ...structuredSchedule.attraction,
                                seasonalHours: newSeasonalHours,
                              },
                            });
                          }}
                          displayEmpty
                        >
                          <MenuItem value="">Seleccionar temporada</MenuItem>
                          {seasons.map((season) => (
                            <MenuItem key={season} value={season}>
                              {season}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        placeholder="Horarios para esta temporada"
                        value={seasonal.hours}
                        onChange={(e) => {
                          const newSeasonalHours = [
                            ...structuredSchedule.attraction.seasonalHours,
                          ];
                          newSeasonalHours[index].hours = e.target.value;
                          updateMainSchedule({
                            ...structuredSchedule,
                            attraction: {
                              ...structuredSchedule.attraction,
                              seasonalHours: newSeasonalHours,
                            },
                          });
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        onClick={() => {
                          const newSeasonalHours =
                            structuredSchedule.attraction.seasonalHours.filter(
                              (_, i) => i !== index
                            );
                          updateMainSchedule({
                            ...structuredSchedule,
                            attraction: {
                              ...structuredSchedule.attraction,
                              seasonalHours: newSeasonalHours,
                            },
                          });
                        }}
                        size="small"
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="subtitle2">Eventos Especiales</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={addSpecialEvent}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  Agregar Evento
                </Button>

                {structuredSchedule.attraction.specialEvents.map(
                  (event, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        placeholder="Nombre del evento"
                        value={event.name}
                        onChange={(e) => {
                          const newEvents = [
                            ...structuredSchedule.attraction.specialEvents,
                          ];
                          newEvents[index].name = e.target.value;
                          updateMainSchedule({
                            ...structuredSchedule,
                            attraction: {
                              ...structuredSchedule.attraction,
                              specialEvents: newEvents,
                            },
                          });
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        placeholder="Horario del evento"
                        value={event.schedule}
                        onChange={(e) => {
                          const newEvents = [
                            ...structuredSchedule.attraction.specialEvents,
                          ];
                          newEvents[index].schedule = e.target.value;
                          updateMainSchedule({
                            ...structuredSchedule,
                            attraction: {
                              ...structuredSchedule.attraction,
                              specialEvents: newEvents,
                            },
                          });
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        onClick={() => {
                          const newEvents =
                            structuredSchedule.attraction.specialEvents.filter(
                              (_, i) => i !== index
                            );
                          updateMainSchedule({
                            ...structuredSchedule,
                            attraction: {
                              ...structuredSchedule.attraction,
                              specialEvents: newEvents,
                            },
                          });
                        }}
                        size="small"
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Card>
    );
  };

  // Multi-location Schedule Component
  const MultiLocationSchedule = () => {
    const addLocation = () => {
      updateMainSchedule({
        ...structuredSchedule,
        multiLocation: {
          locations: [
            ...structuredSchedule.multiLocation.locations,
            { name: "", address: "", schedule: "" },
          ],
        },
      });
    };

    return (
      <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <MapPin size={20} color={theme.palette.primary.main} />
          <Typography variant="h6">Múltiples Ubicaciones</Typography>
        </Stack>

        <Button
          startIcon={<Plus size={16} />}
          onClick={addLocation}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Agregar Ubicación
        </Button>

        {structuredSchedule.multiLocation.locations.map((location, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Nombre de la ubicación"
                  value={location.name}
                  onChange={(e) => {
                    const newLocations = [
                      ...structuredSchedule.multiLocation.locations,
                    ];
                    newLocations[index].name = e.target.value;
                    updateMainSchedule({
                      ...structuredSchedule,
                      multiLocation: { locations: newLocations },
                    });
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Dirección"
                  value={location.address}
                  onChange={(e) => {
                    const newLocations = [
                      ...structuredSchedule.multiLocation.locations,
                    ];
                    newLocations[index].address = e.target.value;
                    updateMainSchedule({
                      ...structuredSchedule,
                      multiLocation: { locations: newLocations },
                    });
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Horarios"
                  value={location.schedule}
                  onChange={(e) => {
                    const newLocations = [
                      ...structuredSchedule.multiLocation.locations,
                    ];
                    newLocations[index].schedule = e.target.value;
                    updateMainSchedule({
                      ...structuredSchedule,
                      multiLocation: { locations: newLocations },
                    });
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  onClick={() => {
                    const newLocations =
                      structuredSchedule.multiLocation.locations.filter(
                        (_, i) => i !== index
                      );
                    updateMainSchedule({
                      ...structuredSchedule,
                      multiLocation: { locations: newLocations },
                    });
                  }}
                  color="error"
                  size="small"
                >
                  <Trash2 size={16} />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Card>
    );
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Clock size={20} color={theme.palette.primary.main} />
        <Typography variant="h6">Horarios y Disponibilidad</Typography>
      </Stack>

      {/* Schedule Type Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Tipo de Horario</InputLabel>
        <Select
          value={structuredSchedule.type}
          onChange={(e) => {
            const newType = e.target.value;
            updateMainSchedule({ ...structuredSchedule, type: newType });
          }}
        >
          <MenuItem value="simple">Horario Simple</MenuItem>
          {categories === "Hoteles" && (
            <MenuItem value="hotel">Horario de Hotel</MenuItem>
          )}
          {categories === "Restaurantes" && (
            <MenuItem value="restaurant">Horario de Restaurante</MenuItem>
          )}
          {categories === "Atractivos" && (
            <MenuItem value="attraction">Horario de Atractivo</MenuItem>
          )}
          <MenuItem value="multiLocation">Múltiples Ubicaciones</MenuItem>
        </Select>
      </FormControl>

      {/* Render appropriate schedule component */}
      {structuredSchedule.type === "simple" && (
        <TextField
          value={structuredSchedule.simple}
          onChange={(e) =>
            updateMainSchedule({
              ...structuredSchedule,
              simple: e.target.value,
            })
          }
          fullWidth
          multiline
          rows={3}
          placeholder="Describe los horarios de funcionamiento..."
          sx={{ mb: 2 }}
        />
      )}

      {structuredSchedule.type === "hotel" && <HotelSchedule />}
      {structuredSchedule.type === "restaurant" && <RestaurantSchedule />}
      {structuredSchedule.type === "attraction" && <AttractionSchedule />}
      {structuredSchedule.type === "multiLocation" && <MultiLocationSchedule />}

      {/* Preview */}
      {schedule && (
        <Paper
          elevation={1}
          sx={{ p: 2, mt: 3, backgroundColor: theme.palette.grey[50] }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Vista Previa:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {schedule}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ScheduleComponent;

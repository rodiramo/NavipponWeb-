import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { stables } from "../../../constants";
import useUser from "../../../hooks/useUser";
import FriendsWidget from "../widgets/FriendWidget";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Chip,
  useMediaQuery,
  Stack,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  EditOutlined,
  CameraAlt,
  Cancel,
  Check,
  PersonOutline,
  EmailOutlined,
  FmdGoodOutlined,
} from "@mui/icons-material";
import ProfilePicture from "../../../components/ProfilePicture";
import { toast } from "react-hot-toast";
import { setUserInfo } from "../../../store/reducers/authSlice";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user: reduxUser, jwt } = useUser();
  const [user, setUser] = useState(reduxUser || {});

  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
  });

  // Location-specific states
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // City-Country mapping (keeping your existing data)
  const cityCountryData = {
    España: [
      "Madrid",
      "Barcelona",
      "Valencia",
      "Sevilla",
      "Bilbao",
      "Málaga",
      "Murcia",
      "Palma",
      "Las Palmas",
      "Córdoba",
      "Alicante",
      "Valladolid",
      "Vigo",
      "Gijón",
      "Granada",
    ],
    Francia: [
      "París",
      "Marsella",
      "Lyon",
      "Toulouse",
      "Niza",
      "Nantes",
      "Montpellier",
      "Estrasburgo",
      "Burdeos",
      "Lille",
      "Rennes",
      "Reims",
      "Saint-Étienne",
      "Le Havre",
      "Toulon",
    ],
    Italia: [
      "Roma",
      "Milán",
      "Nápoles",
      "Turín",
      "Palermo",
      "Génova",
      "Bolonia",
      "Florencia",
      "Bari",
      "Catania",
      "Venecia",
      "Verona",
      "Mesina",
      "Padova",
      "Trieste",
    ],
    Alemania: [
      "Berlín",
      "Hamburgo",
      "Múnich",
      "Colonia",
      "Fráncfort",
      "Stuttgart",
      "Düsseldorf",
      "Leipzig",
      "Dortmund",
      "Essen",
      "Bremen",
      "Dresden",
      "Hannover",
      "Núremberg",
      "Duisburg",
    ],
    "Reino Unido": [
      "Londres",
      "Birmingham",
      "Glasgow",
      "Liverpool",
      "Bristol",
      "Manchester",
      "Sheffield",
      "Leeds",
      "Edimburgo",
      "Leicester",
      "Coventry",
      "Bradford",
      "Cardiff",
      "Belfast",
      "Nottingham",
    ],
    Portugal: [
      "Lisboa",
      "Oporto",
      "Vila Nova de Gaia",
      "Amadora",
      "Braga",
      "Almada",
      "Funchal",
      "Coimbra",
      "Setúbal",
      "Agualva-Cacém",
      "Queluz",
      "Sintra",
      "Évora",
      "Aveiro",
      "Faro",
    ],
    "Países Bajos": [
      "Ámsterdam",
      "Róterdam",
      "La Haya",
      "Utrecht",
      "Eindhoven",
      "Tilburg",
      "Groningen",
      "Almere",
      "Breda",
      "Nijmegen",
      "Enschede",
      "Haarlem",
      "Arnhem",
      "Zaanstad",
      "Haarlemmermeer",
    ],
    Bélgica: [
      "Bruselas",
      "Amberes",
      "Gante",
      "Charleroi",
      "Lieja",
      "Brujas",
      "Namur",
      "Lovaina",
      "Mons",
      "Aalst",
      "Mechelen",
      "La Louvière",
      "Kortrijk",
      "Hasselt",
      "Sint-Truiden",
    ],
    Suiza: [
      "Zúrich",
      "Ginebra",
      "Basilea",
      "Berna",
      "Lausana",
      "Winterthur",
      "Lucerna",
      "St. Gallen",
      "Lugano",
      "Biel/Bienne",
      "Thun",
      "Köniz",
      "La Chaux-de-Fonds",
      "Friburgo",
      "Schaffhausen",
    ],
    Austria: [
      "Viena",
      "Graz",
      "Linz",
      "Salzburgo",
      "Innsbruck",
      "Klagenfurt",
      "Villach",
      "Wels",
      "Sankt Pölten",
      "Dornbirn",
      "Steyr",
      "Wiener Neustadt",
      "Feldkirch",
      "Bregenz",
      "Leonding",
    ],
    Grecia: [
      "Atenas",
      "Tesalónica",
      "Patras",
      "Heraclión",
      "Larisa",
      "Volos",
      "Ioannina",
      "Trikala",
      "Chalkida",
      "Serres",
      "Alexandroupoli",
      "Xanthi",
      "Katerini",
      "Kalamata",
      "Kavala",
    ],
    Japón: [
      "Tokio",
      "Yokohama",
      "Osaka",
      "Nagoya",
      "Sapporo",
      "Fukuoka",
      "Kobe",
      "Kioto",
      "Kawasaki",
      "Saitama",
      "Hiroshima",
      "Sendai",
      "Kitakyushu",
      "Chiba",
      "Sakai",
    ],
    "Estados Unidos": [
      "Nueva York",
      "Los Ángeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Filadelfia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San José",
      "Austin",
      "Jacksonville",
      "San Francisco",
      "Columbus",
      "Charlotte",
    ],
    Canadá: [
      "Toronto",
      "Montreal",
      "Vancouver",
      "Calgary",
      "Edmonton",
      "Ottawa",
      "Winnipeg",
      "Quebec",
      "Hamilton",
      "Kitchener",
      "London",
      "Victoria",
      "Halifax",
      "Windsor",
      "Oshawa",
    ],
    México: [
      "Ciudad de México",
      "Guadalajara",
      "Monterrey",
      "Puebla",
      "Tijuana",
      "León",
      "Juárez",
      "Torreón",
      "Querétaro",
      "San Luis Potosí",
      "Mérida",
      "Mexicali",
      "Aguascalientes",
      "Cuernavaca",
      "Saltillo",
    ],
    Argentina: [
      "Buenos Aires",
      "Córdoba",
      "Rosario",
      "Mendoza",
      "Tucumán",
      "La Plata",
      "Mar del Plata",
      "Salta",
      "Santa Fe",
      "San Juan",
      "Resistencia",
      "Santiago del Estero",
      "Corrientes",
      "Posadas",
      "Neuquén",
    ],
    Brasil: [
      "São Paulo",
      "Río de Janeiro",
      "Brasilia",
      "Salvador",
      "Fortaleza",
      "Belo Horizonte",
      "Manaos",
      "Curitiba",
      "Recife",
      "Goiânia",
      "Belém",
      "Porto Alegre",
      "Guarulhos",
      "Campinas",
      "São Luís",
    ],
    Chile: [
      "Santiago",
      "Valparaíso",
      "Concepción",
      "La Serena",
      "Antofagasta",
      "Temuco",
      "Rancagua",
      "Talca",
      "Arica",
      "Chillán",
      "Iquique",
      "Los Ángeles",
      "Puerto Montt",
      "Valdivia",
      "Osorno",
    ],
    Australia: [
      "Sídney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaida",
      "Gold Coast",
      "Newcastle",
      "Canberra",
      "Sunshine Coast",
      "Wollongong",
      "Hobart",
      "Geelong",
      "Townsville",
      "Cairns",
      "Darwin",
    ],
    "Nueva Zelanda": [
      "Auckland",
      "Wellington",
      "Christchurch",
      "Hamilton",
      "Tauranga",
      "Napier-Hastings",
      "Dunedin",
      "Palmerston North",
      "Nelson",
      "Rotorua",
      "New Plymouth",
      "Whangarei",
      "Invercargill",
      "Whanganui",
      "Gisborne",
    ],
    Tailandia: [
      "Bangkok",
      "Samut Prakan",
      "Mueang Nonthaburi",
      "Udon Thani",
      "Chon Buri",
      "Nakhon Ratchasima",
      "Chiang Mai",
      "Hat Yai",
      "Ubon Ratchathani",
      "Khon Kaen",
      "Nakhon Si Thammarat",
      "Rayong",
      "Chiang Rai",
      "Kanchanaburi",
      "Trang",
    ],
  };

  // Get all cities for autocomplete
  const getAllCities = () => {
    const allCities = [];
    Object.entries(cityCountryData).forEach(([country, cities]) => {
      cities.forEach((city) => {
        allCities.push({ city, country });
      });
    });
    return allCities;
  };

  // Find country by city name
  const findCountryByCity = (cityName) => {
    for (const [country, cities] of Object.entries(cityCountryData)) {
      if (
        cities.some((city) => city.toLowerCase() === cityName.toLowerCase())
      ) {
        return country;
      }
    }
    return "";
  };

  const [coverImage, setCoverImage] = useState(() => {
    if (user?.coverImg) {
      return `${stables.UPLOAD_FOLDER_BASE_URL}/${user.coverImg}`;
    }
    return "/assets/bg-home1.jpg";
  });

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
      if (reduxUser.coverImg) {
        setCoverImage(
          `${stables.UPLOAD_FOLDER_BASE_URL}/${reduxUser.coverImg}`
        );
      }
      setTempValues({
        name: reduxUser.name || "",
        email: reduxUser.email || "",
        city: reduxUser.city || "",
        country: reduxUser.country || "",
      });
    }
  }, [reduxUser]);

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder al perfil");
    } else {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          navigate("/login");
          toast.error(
            "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
          );
        }
      } catch (error) {
        navigate("/login");
        toast.error("Token inválido. Por favor inicia sesión nuevamente.");
      }
    }
  }, [jwt, navigate]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `${API_URL}/api/users/updateProfile/${user._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setUserInfo(data));
      setUser(data);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Perfil actualizado exitosamente");
      setEditingField(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al actualizar el perfil"
      );
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("coverImg", file);

      const response = await axios.put(
        `${API_URL}/api/users/updateCoverImg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setUserInfo(data));
      setUser(data);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Imagen de portada actualizada");
      if (data.coverImg) {
        setCoverImage(`${stables.UPLOAD_FOLDER_BASE_URL}/${data.coverImg}`);
      }
    },
    onError: (error) => {
      toast.error("Error al actualizar la imagen de portada");
      if (user?.coverImg) {
        setCoverImage(`${stables.UPLOAD_FOLDER_BASE_URL}/${user.coverImg}`);
      } else {
        setCoverImage("/assets/bg-home1.jpg");
      }
    },
  });

  // Handlers
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);

    updateCoverMutation.mutate(file);
  };

  const startEditing = (field) => {
    setEditingField(field);
    if (field === "location") {
      setTempValues((prev) => ({
        ...prev,
        city: user.city || "",
        country: user.country || "",
      }));
      setCitySearchTerm(user.city || "");
      setFilteredCities([]);
    } else {
      setTempValues((prev) => ({
        ...prev,
        [field]: user[field] || "",
      }));
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
      country: user.country || "",
    });
    setCitySearchTerm("");
    setFilteredCities([]);
  };

  const handleLocationChange = (field, value) => {
    if (field === "country") {
      setTempValues((prev) => ({
        ...prev,
        country: value,
        city: "",
      }));
      setCitySearchTerm("");
      setFilteredCities([]);
    } else if (field === "city") {
      const detectedCountry = findCountryByCity(value);
      setTempValues((prev) => ({
        ...prev,
        city: value,
        country: detectedCountry || prev.country,
      }));
      setCitySearchTerm(value);

      if (value.length > 0) {
        const allCities = getAllCities();
        const filtered = allCities
          .filter((item) =>
            item.city.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 10);
        setFilteredCities(filtered);
      } else {
        setFilteredCities([]);
      }
    }
  };

  // Handle city selection from autocomplete
  const handleCitySelect = (selectedCity, selectedCountry) => {
    setTempValues((prev) => ({
      ...prev,
      city: selectedCity,
      country: selectedCountry,
    }));
    setCitySearchTerm(selectedCity);
    setFilteredCities([]);
  };

  const saveField = (field) => {
    if (field === "location") {
      const city = tempValues.city?.trim();
      const country = tempValues.country?.trim();

      if (!city || !country) {
        toast.error("Por favor completa la ciudad y el país");
        return;
      }

      updateProfileMutation.mutate({
        city: city,
        country: country,
      });
    } else {
      const value = tempValues[field]?.trim();
      if (!value) {
        toast.error("Este campo no puede estar vacío");
        return;
      }
      updateProfileMutation.mutate({
        [field]: value,
      });
    }
  };

  const EditableField = ({
    field,
    label,
    value,
    icon: Icon,
    placeholder,
    type = "text",
    isLocation = false,
  }) => {
    const isEditing = editingField === field;
    const isLoading = updateProfileMutation.isLoading && editingField === field;

    return (
      <Card
        sx={{
          mb: 2,
          border: "none",
          borderRadius: "16px",
          boxShadow: "none",
          background: theme.palette.background.blue,
          transition: "all 0.3s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box display="flex" alignItems="center" mb={2} gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Icon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight="600"
                color="text.secondary"
              >
                {label}
              </Typography>
            </Box>

            {!isEditing && (
              <IconButton
                size="small"
                onClick={() => startEditing(field)}
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                <EditOutlined fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Fade in={!isEditing} unmountOnExit>
            <Box>
              {isLocation ? (
                <Box>
                  {user.city && user.country ? (
                    <Typography variant="h6" sx={{ color: "text.primary" }}>
                      {user.city}, {user.country}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontStyle="italic"
                    >
                      Ubicación no configurada
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  {value || (
                    <span
                      style={{
                        fontStyle: "italic",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {placeholder}
                    </span>
                  )}
                </Typography>
              )}
            </Box>
          </Fade>

          <Fade in={isEditing} unmountOnExit>
            <Box>
              {isLocation ? (
                <Stack spacing={2}>
                  {/* Country Selection */}
                  <FormControl fullWidth size="small">
                    <InputLabel>País</InputLabel>
                    <Select
                      value={tempValues.country}
                      onChange={(e) =>
                        handleLocationChange("country", e.target.value)
                      }
                      label="País"
                    >
                      <MenuItem value="">
                        <em>Selecciona un país...</em>
                      </MenuItem>
                      {Object.keys(cityCountryData).map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* City Input with Autocomplete */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      fullWidth
                      size="small"
                      label={
                        tempValues.country
                          ? "Ciudad"
                          : "Ciudad (escribe para buscar)"
                      }
                      value={citySearchTerm}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                      placeholder={
                        tempValues.country
                          ? `Ej: ${cityCountryData[tempValues.country]?.slice(0, 3).join(", ")}`
                          : "Ej: Madrid, París, Tokio..."
                      }
                      helperText={
                        tempValues.country && !tempValues.city
                          ? `Ciudades disponibles en ${tempValues.country}`
                          : tempValues.city && tempValues.country
                            ? `✓ ${tempValues.city}, ${tempValues.country}`
                            : "Escribe una ciudad o selecciona un país primero"
                      }
                      FormHelperTextProps={{
                        sx: {
                          color:
                            tempValues.city && tempValues.country
                              ? theme.palette.success.main
                              : theme.palette.text.secondary,
                        },
                      }}
                    />

                    {/* Autocomplete Dropdown */}
                    {filteredCities.length > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: "white",
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          zIndex: 1000,
                          maxHeight: "200px",
                          overflow: "auto",
                          mt: 0.5,
                        }}
                      >
                        {filteredCities.map((item, index) => (
                          <Box
                            key={`${item.city}-${item.country}`}
                            onClick={() =>
                              handleCitySelect(item.city, item.country)
                            }
                            sx={{
                              p: 2,
                              cursor: "pointer",
                              borderBottom:
                                index < filteredCities.length - 1
                                  ? `1px solid ${theme.palette.divider}`
                                  : "none",
                              "&:hover": {
                                backgroundColor: theme.palette.grey[50],
                              },
                            }}
                          >
                            <Typography variant="body2" fontWeight="500">
                              {item.city}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.country}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Cities available in selected country */}
                  {tempValues.country &&
                    cityCountryData[tempValues.country] && (
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          sx={{ mb: 1 }}
                        >
                          Ciudades populares en {tempValues.country}:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {cityCountryData[tempValues.country]
                            .slice(0, 8)
                            .map((city) => (
                              <Button
                                key={city}
                                size="small"
                                variant={
                                  tempValues.city === city
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() =>
                                  handleCitySelect(city, tempValues.country)
                                }
                                sx={{
                                  borderRadius: "20px",
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {city}
                              </Button>
                            ))}
                        </Box>
                      </Box>
                    )}
                </Stack>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  type={type}
                  value={tempValues[field]}
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  placeholder={placeholder}
                  autoFocus
                />
              )}

              <Box display="flex" gap={1} mt={2} justifyContent="flex-end">
                <Button
                  size="small"
                  onClick={cancelEditing}
                  startIcon={<Cancel />}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => saveField(field)}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={16} /> : <Check />
                  }
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                  }}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              </Box>
            </Box>
          </Fade>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box width="100%" mx="auto">
      {/* Cover Image Section */}
      <Card
        sx={{
          mb: 3,
          overflow: "hidden",
          borderRadius: 4,
          background: theme.palette.background.blue,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: "200px", sm: "300px" },
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)",
            },
          }}
        >
          {/* Cover Edit Button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: theme.palette.primary.white,
              backdropFilter: "blur(10px)",
              color: theme.palette.text.primary,
              "&:hover": {
                background: "rgba(255,255,255,1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
            component="label"
            disabled={updateCoverMutation.isLoading}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleCoverImageChange}
            />
            {updateCoverMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CameraAlt fontSize="small" />
            )}
          </IconButton>

          {/* Profile Picture - Overlapping */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              transform: "translateY(50%)",
            }}
          >
            <ProfilePicture
              avatar={user?.avatar}
              size={isMobile ? "120px" : "150px"}
              sx={{
                border: `4px solid ${theme.palette.background.default}`,
                boxShadow: theme.shadows[8],
              }}
            />
          </Box>
        </Box>

        {/* User Info */}
        <CardContent sx={{ pt: { xs: 8, sm: 10 }, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="700" mb={1}>
            {user?.name || "Usuario"}
          </Typography>
          <Chip
            label={`@${user?.name || "usuario"}`}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              fontWeight: "500",
            }}
          />
        </CardContent>
      </Card>

      {/* Profile Information Section */}
      <Typography
        variant="h5"
        fontWeight="600"
        mb={3}
        sx={{ color: "text.primary" }}
      >
        Información del Perfil
      </Typography>

      <EditableField
        field="name"
        label="Nombre completo"
        value={user.name}
        icon={PersonOutline}
        placeholder="Ingresa tu nombre completo"
      />

      <EditableField
        field="email"
        label="Correo electrónico"
        value={user.email}
        icon={EmailOutlined}
        placeholder="Ingresa tu email"
        type="email"
      />

      <EditableField
        field="location"
        label="Ubicación"
        value={`${user.city || ""}, ${user.country || ""}`}
        icon={FmdGoodOutlined}
        placeholder="Configura tu ubicación"
        isLocation={true}
      />

      <Divider sx={{ my: 4 }} />

      {/* Friends Section */}
      <Typography
        variant="h5"
        fontWeight="600"
        mb={3}
        sx={{ color: "text.primary" }}
      >
        Mis conexiones
      </Typography>

      <FriendsWidget token={jwt} />
    </Box>
  );
};

export default User;

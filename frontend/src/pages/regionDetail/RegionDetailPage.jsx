import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout.jsx";
import BreadcrumbBack from "../../components/BreadcrumbBack.jsx";
import BgShape from "../../components/Shapes/BgShape.jsx";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  Grid3X3,
  List,
  Star,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Eye,
} from "lucide-react";
import ExperienceCard from "../../components/ExperienceCard"; // Adjust path as needed
import HorizontalExperienceCard from "../experience/container/HorizontalExperienceCard"; // Adjust path as needed

const regionData = {
  Hokkaido: {
    name: "Hokkaido",
    image: "/assets/Hokkaido.jpg",
    description:
      "La isla más septentrional de Japón, famosa por sus paisajes nevados, productos lácteos de alta calidad y los festivales de nieve de Sapporo.",

    highlights: ["Sapporo", "Hakodate", "Niseko", "Otaru"],
    climate: "Continental húmedo con inviernos fríos y nevados",
    bestTime: "Diciembre-Febrero (nieve), Junio-Agosto (verano)",
    specialties: ["Cangrejo real", "Productos lácteos", "Ramen de miso"],
    keyFeatures: [
      "Festival de Nieve de Sapporo",
      "Estaciones de esquí de clase mundial",
      "Aguas termales naturales",
      "Productos frescos del mar",
    ],
    coordinates: { lat: 43.2203, lng: 142.8635 },
    weatherCity: "Sapporo",
  },
  Tohoku: {
    name: "Tohoku",
    image: "/assets/Tohoku.jpg",
    description:
      "Una región montañosa rica en tradiciones, famosa por sus onsens, festivales únicos y la cultura samurái.",

    highlights: ["Sendai", "Aomori", "Yamagata", "Matsushima"],
    climate: "Templado continental con veranos cálidos e inviernos nevados",
    bestTime: "Abril-Mayo (sakura), Octubre-Noviembre (otoño)",
    specialties: [
      "Sake premium",
      "Gyutan (lengua de ternera)",
      "Manzanas de Aomori",
    ],
    keyFeatures: [
      "Matsushima Bay (una de las tres vistas más hermosas)",
      "Festivales tradicionales Nebuta",
      "Rutas de senderismo en montañas sagradas",
      "Aguas termales históricas",
    ],
    coordinates: { lat: 38.7167, lng: 140.4833 },
    weatherCity: "Sendai",
  },
  Kanto: {
    name: "Kanto",
    image: "/assets/Kanto.jpg",
    description:
      "El corazón económico y cultural de Japón, hogar de Tokio y una metrópolis vibrante que combina tradición milenaria con tecnología de vanguardia.",

    highlights: ["Tokyo", "Yokohama", "Kamakura", "Nikko"],
    climate: "Subtropical húmedo con veranos calurosos e inviernos templados",
    bestTime: "Marzo-Mayo (primavera), Septiembre-Noviembre (otoño)",
    specialties: ["Sushi de Tsukiji", "Ramen tonkotsu", "Wagyu"],
    keyFeatures: [
      "Santuarios históricos como Senso-ji",
      "Distritos modernos como Shibuya y Harajuku",
      "Museos de clase mundial",
      "Gastronomía diversa e innovadora",
    ],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    weatherCity: "Tokyo",
  },
  Chubu: {
    name: "Chubu",
    image: "/assets/Chubu.jpg",
    description:
      "Dominada por el majestuoso Monte Fuji y los Alpes Japoneses, esta región ofrece paisajes espectaculares y ciudades históricas tradicionales.",

    highlights: ["Monte Fuji", "Nagoya", "Takayama", "Kanazawa"],
    climate:
      "Varía desde continental en las montañas hasta templado en las costas",
    bestTime: "Julio-Septiembre (senderismo), Noviembre-Febrero (nieve)",
    specialties: ["Hida beef", "Sake local", "Miso katsu"],
    keyFeatures: [
      "Vistas icónicas del Monte Fuji",
      "Pueblos tradicionales Shirakawa-go",
      "Onsen de montaña",
      "Rutas de escalada y senderismo",
    ],
    coordinates: { lat: 36.2048, lng: 138.2529 },
    weatherCity: "Nagoya",
  },
  Kansai: {
    name: "Kansai",
    image: "/assets/Kansai.jpg",
    description:
      "El alma cultural e histórica de Japón, hogar de las antiguas capitales Kyoto y Nara, junto con la vibrante ciudad gastronómica de Osaka.",

    highlights: ["Kyoto", "Osaka", "Nara", "Kobe"],
    climate: "Subtropical húmedo con veranos calurosos y húmedos",
    bestTime: "Marzo-Mayo (sakura), Octubre-Noviembre (otoño)",
    specialties: ["Kaiseki", "Takoyaki", "Kobe beef", "Sake tradicional"],
    keyFeatures: [
      "Templos y santuarios históricos",
      "Geishas en Gion",
      "Parque de los ciervos en Nara",
      "Gastronomía tradicional",
    ],
    coordinates: { lat: 34.6937, lng: 135.5023 },
    weatherCity: "Osaka",
  },
  Chugoku: {
    name: "Chugoku",
    image: "/assets/Chugoku.jpg",
    description:
      "Una región de contrastes entre la costa del Mar de Japón y el Mar Interior de Seto, famosa por el icónico Santuario de Itsukushima.",

    highlights: ["Hiroshima", "Miyajima", "Okayama", "Matsue"],
    climate: "Templado con influencia marítima",
    bestTime: "Abril-Mayo, Septiembre-Noviembre",
    specialties: ["Ostras de Hiroshima", "Okonomiyaki", "Sake local"],
    keyFeatures: [
      "Torii flotante de Itsukushima",
      "Memorial de la Paz de Hiroshima",
      "Jardín Korakuen",
      "Islas del Mar Interior",
    ],
    coordinates: { lat: 34.3853, lng: 132.4553 },
    weatherCity: "Hiroshima",
  },
  Shikoku: {
    name: "Shikoku",
    image: "/assets/Shikoku.jpg",
    description:
      "La isla más pequeña de las cuatro principales, conocida por la peregrinación espiritual de 88 templos y paisajes naturales vírgenes.",

    highlights: ["Matsuyama", "Tokushima", "Kochi", "Takamatsu"],
    climate: "Subtropical con veranos calurosos e inviernos templados",
    bestTime: "Marzo-Mayo, Septiembre-Noviembre",
    specialties: ["Udon de Sanuki", "Bonito tataki", "Sake artesanal"],
    keyFeatures: [
      "Peregrinación de 88 templos",
      "Aguas termales de Dogo",
      "Paisajes costeros vírgenes",
      "Festivales tradicionales",
    ],
    coordinates: { lat: 33.7461, lng: 133.2061 },
    weatherCity: "Matsuyama",
  },
  Kyushu: {
    name: "Kyushu",
    image: "/assets/Kyushu.jpg",
    description:
      "La isla volcánica más meridional, famosa por sus aguas termales naturales, volcanes activos y cultura vibrante.",

    highlights: ["Fukuoka", "Kagoshima", "Beppu", "Kumamoto"],
    climate: "Subtropical con veranos calurosos y húmedos",
    bestTime: "Octubre-Abril (clima más fresco)",
    specialties: ["Ramen tonkotsu", "Mentaiko", "Shochu", "Wagyu de Miyazaki"],
    keyFeatures: [
      "Volcán activo Sakurajima",
      "Aguas termales de Beppu",
      "Castillo de Kumamoto",
      "Cultura ryukyu única",
    ],
    coordinates: { lat: 32.7503, lng: 129.8779 },
    weatherCity: "Fukuoka",
  },
};

const RegionDetail = () => {
  const { regionName } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const region = regionData[regionName];
  const fetchRegionExperiences = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch(
        `${API_URL}/api/experiences?region=${regionName}`
      );
      const data = await response.json();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (error) {
      console.error("Error fetching region experiences:", error);
      // Mock data for demonstration
      setExperiences([]);
      setFilteredExperiences([]);
    } finally {
      setLoading(false);
    }
  }, [regionName]);

  const fetchWeatherData = useCallback(async () => {
    try {
      setWeatherLoading(true);

      // Replace with your weather API key and endpoint
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${region.weatherCity},JP&appid=${API_KEY}&units=metric&lang=es`
      );

      if (response.ok) {
        const weatherData = await response.json();
        setWeather({
          temperature: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
          visibility: Math.round(weatherData.visibility / 1000), // Convert m to km
          icon: weatherData.weather[0].icon,
          feelsLike: Math.round(weatherData.main.feels_like),
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setWeatherLoading(false);
    }
  }, [region.weatherCity]);

  useEffect(() => {
    if (!region) {
      navigate("/404");
      return;
    }

    // Fetch experiences for this region
    fetchRegionExperiences();
    fetchWeatherData();
  }, [region, fetchRegionExperiences, fetchWeatherData, navigate]);
  useEffect(() => {
    // Filter experiences based on search and category
    let filtered = experiences;

    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((exp) => exp.categories === categoryFilter);
    }

    setFilteredExperiences(filtered);
  }, [experiences, searchTerm, categoryFilter]);

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": <Sun size={24} />,
      "01n": <Sun size={24} />,
      "02d": <Cloud size={24} />,
      "02n": <Cloud size={24} />,
      "03d": <Cloud size={24} />,
      "03n": <Cloud size={24} />,
      "04d": <Cloud size={24} />,
      "04n": <Cloud size={24} />,
      "09d": <CloudRain size={24} />,
      "09n": <CloudRain size={24} />,
      "10d": <CloudRain size={24} />,
      "10n": <CloudRain size={24} />,
      "11d": <CloudRain size={24} />,
      "11n": <CloudRain size={24} />,
      "13d": <Cloud size={24} />,
      "13n": <Cloud size={24} />,
      "50d": <Cloud size={24} />,
      "50n": <Cloud size={24} />,
    };
    return iconMap[iconCode] || <Cloud size={24} />;
  };
  if (!region) {
    return (
      <Container>
        <Typography variant="h4" color="error" align="center" sx={{ mt: 4 }}>
          Región no encontrada
        </Typography>
      </Container>
    );
  }
  const WeatherCard = () => (
    <Card
      elevation={0}
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${theme.palette.info.main}10 0%, ${theme.palette.info.main}05 100%)`,
        border: `1px solid ${theme.palette.info.main}20`,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Clima actual en {region.weatherCity}
      </Typography>

      {weatherLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : weather ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ color: theme.palette.info.main }}>
                {getWeatherIcon(weather.icon)}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {weather.temperature}°C
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {weather.description}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Thermometer size={16} color={theme.palette.info.main} />
                <Typography variant="body2">
                  Sensación: {weather.feelsLike}°C
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Droplets size={16} color={theme.palette.info.main} />
                <Typography variant="body2">
                  Humedad: {weather.humidity}%
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Wind size={16} color={theme.palette.info.main} />
                <Typography variant="body2">
                  Viento: {weather.windSpeed} km/h
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Eye size={16} color={theme.palette.info.main} />
                <Typography variant="body2">
                  Visibilidad: {weather.visibility} km
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="warning" sx={{ mt: 1 }}>
          No se pudo cargar la información del clima
        </Alert>
      )}
    </Card>
  );

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  return (
    <MainLayout>
      {" "}
      <BreadcrumbBack />
      <Box
        sx={{
          height: { xs: "60vh", md: "60vh" },

          backgroundImage: `linear-gradient(rgba(2, 4, 37, 0.47), rgba(14, 6, 47, 0.64)), url(${region.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          paddingTop: 10,
          alignItems: "center",
          position: "relative",
        }}
      >
        <Container>
          <Box sx={{ color: "white", maxWidth: "900px" }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              {region.name}
            </Typography>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                p: 1,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Typography
                variant="p"
                sx={{
                  mb: 10,
                  opacity: 0.9,
                }}
              >
                {region.description}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
              {region.highlights.map((highlight, index) => (
                <Chip
                  key={index}
                  label={highlight}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>{" "}
      <BgShape />
      <Container sx={{ mt: 8, mb: 4, position: "relative", zIndex: 1 }}>
        {/* Region Information */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card elevation={0}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Características destacadas
              </Typography>

              <Grid container spacing={2}>
                {region.keyFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Star size={16} color={theme.palette.secondary.medium} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>{" "}
            {/* Map Section */}
            <Typography variant="h5" fontWeight="bold" gutterBottom mt={6}>
              Ubicación de {region.name}
            </Typography>
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={region.coordinates}
                  zoom={7}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "geometry.fill",
                        stylers: [{ saturation: -20 }],
                      },
                    ],
                  }}
                >
                  <Marker position={region.coordinates} title={region.name} />
                </GoogleMap>
              </LoadScript>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Weather Card */}
            <WeatherCard />{" "}
            <Card
              elevation={0}
              sx={{ p: 3, border: `1px solid ${theme.palette.primary.main}15` }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información de viaje
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="bold"
                >
                  Mejor época para visitar
                </Typography>
                <Typography variant="body2">{region.bestTime}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="bold"
                >
                  Clima
                </Typography>
                <Typography variant="body2">{region.climate}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="bold"
                >
                  Especialidades locales
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {region.specialties.map((specialty, index) => (
                    <Chip
                      key={index}
                      label={specialty}
                      size="small"
                      sx={{
                        backgroundColor: `${theme.palette.secondary.main}10`,
                        color: theme.palette.secondary.medium,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Card>{" "}
          </Grid>
        </Grid>

        {/* Experiences Section */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Experiencias en {region.name}
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              border: `1px solid ${theme.palette.primary.main}15`,
              borderRadius: 4, // ✅ Rounded borders
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}02 100%)`,
            }}
          >
            <Grid
              container
              spacing={3}
              alignItems="center"
              sx={{ justifyContent: "space-around" }}
            >
              {/* Search Field */}
              <Grid item xs={12} lg={4}>
                <TextField
                  fullWidth
                  placeholder="Buscar experiencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 30, // ✅ Rounded input
                      backgroundColor: `${theme.palette.background.paper}`,
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color={theme.palette.primary.main} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} lg={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: theme.palette.primary.main }}>
                    Categoría
                  </InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Categoría"
                    sx={{
                      borderRadius: 30, // ✅ Rounded select
                      backgroundColor: `${theme.palette.background.paper}`,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="Atractivos">Atractivos</MenuItem>
                    <MenuItem value="Hoteles">Hoteles</MenuItem>
                    <MenuItem value="Restaurantes">Restaurantes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* View Mode Buttons */}
              <Grid item xs={12} lg={4}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: { xs: "center", lg: "flex-end" },
                  }}
                >
                  {/* Grid View Button */}
                  <Button
                    variant={viewMode === "grid" ? "contained" : "outlined"}
                    onClick={() => setViewMode("grid")}
                    startIcon={<Grid3X3 size={18} />}
                    sx={{
                      flex: { xs: 1, lg: "auto" },
                      minWidth: "120px",
                      borderRadius: 30, // ✅ Rounded buttons
                      textTransform: "none",
                      width: "fit-content",
                      border: `2px solid ${theme.palette.primary.main}`,
                      ...(viewMode === "grid"
                        ? {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }
                        : {
                            color: theme.palette.primary.main,
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: `${theme.palette.primary.main}08`,
                              borderColor: theme.palette.primary.main,
                            },
                          }),
                    }}
                  >
                    Grilla
                  </Button>

                  {/* List View Button */}
                  <Button
                    variant={viewMode === "list" ? "contained" : "outlined"}
                    onClick={() => setViewMode("list")}
                    startIcon={<List size={18} />}
                    sx={{
                      flex: { xs: 1, lg: "auto" },
                      minWidth: "120px",
                      borderRadius: 30, // ✅ Rounded buttons
                      textTransform: "none",
                      width: "fit-content",
                      border: `2px solid ${theme.palette.primary.main}`,
                      ...(viewMode === "list"
                        ? {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }
                        : {
                            color: theme.palette.primary.main,
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: `${theme.palette.primary.main}08`,
                              borderColor: theme.palette.primary.main,
                            },
                          }),
                    }}
                  >
                    Lista
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Results Summary */}
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            {filteredExperiences.length} experiencias encontradas
          </Typography>

          {/* Experiences Grid/List */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography>Cargando experiencias...</Typography>
            </Box>
          ) : filteredExperiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6">
                <img
                  src="/assets/no-results.png"
                  alt="No results"
                  className="w-64 h-auto mx-auto opacity-80"
                />
              </div>
              <Typography
                variant="h4"
                className="font-bold mb-4"
                sx={{ color: theme.palette.primary.main }}
              >
                No se encontraron resultados
              </Typography>
              <Typography variant="body1" className="text-gray-600 max-w-md">
                "Intenta ajustar los filtros o buscar otros términos."
              </Typography>
            </div>
          ) : (
            <Box>
              {viewMode === "grid" ? (
                <Grid container spacing={3}>
                  {filteredExperiences.map((experience) => (
                    <Grid item xs={12} sm={6} md={4} key={experience._id}>
                      <ExperienceCard experience={experience} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {filteredExperiences.map((experience) => (
                    <HorizontalExperienceCard
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default RegionDetail;

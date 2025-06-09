import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { stables } from "../../../constants"; // Import your stables

import { updateCoverImg } from "../../../services/index/users";
import useUser from "../../../hooks/useUser";
import FriendsWidget from "../widgets/FriendWidget";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  useTheme,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  CircularProgress,
  Autocomplete,
  Chip,
} from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import {
  EditOutlined,
  Close,
  CameraAlt,
  LocationOn,
  Save,
} from "@mui/icons-material";
import ProfilePicture from "../../../components/ProfilePicture";
import FlexBetween from "../../../components/FlexBetween";
import { toast } from "react-hot-toast";
import { setUserInfo } from "../../../store/reducers/authSlice";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { user: reduxUser, jwt } = useUser();
  const [user, setUser] = useState(reduxUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || "");
  const [budget, setBudget] = useState(user?.budget || "");

  // ✅ Fixed cover image handling using the same pattern as ProfilePicture
  const [coverImage, setCoverImage] = useState(() => {
    if (user?.coverImg) {
      // Use the same pattern as ProfilePicture component
      return `${stables.UPLOAD_FOLDER_BASE_URL}/${user.coverImg}`;
    }
    return "/assets/bg-home1.jpg";
  });

  // Location form states
  const [locationForm, setLocationForm] = useState({
    city: user?.city || "",
    country: user?.country || "",
  });
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

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
  useEffect(() => {
    console.log("🔄 Redux User Updated:", reduxUser);
    if (reduxUser) {
      setUser(reduxUser);

      // ✅ Update cover image when user data changes
      if (reduxUser.coverImg) {
        console.log(
          "🖼️ Setting cover image from user data:",
          reduxUser.coverImg
        );
        const imageUrl = `${stables.UPLOAD_FOLDER_BASE_URL}/${reduxUser.coverImg}`;
        console.log("🖼️ Converted image URL:", imageUrl);
        setCoverImage(imageUrl);
      }

      setLocationForm({
        city: reduxUser.city || "",
        country: reduxUser.country || "",
      });
      setProfileForm({
        name: reduxUser.name || "",
        email: reduxUser.email || "",
      });
    }
  }, [reduxUser]);
  useEffect(() => {
    console.log("🔍 Auth Debug:", {
      hasJWT: !!jwt,
      jwtLength: jwt?.length,
      jwtPrefix: jwt?.substring(0, 20) + "...",
      userId: user?._id,
      userEmail: user?.email,
    });

    if (!jwt) {
      navigate("/login");
      toast.error("Debes estar logueado para acceder al perfil");
    } else {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        console.log("🔍 Token Info:", {
          isExpired,
          expiresAt: new Date(payload.exp * 1000),
          tokenUserId: payload.id,
          currentTime: new Date(),
        });

        if (isExpired) {
          console.error("❌ Token is expired");
          navigate("/login");
          toast.error(
            "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
          );
        }
      } catch (error) {
        console.error("❌ Invalid token format:", error);
        navigate("/login");
        toast.error("Token inválido. Por favor inicia sesión nuevamente.");
      }
    }
  }, [jwt, navigate, user]);

  // Mutation for updating profile
  // Replace your updateProfileMutation with this fixed version:
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      console.log("🔄 Updating profile:", {
        userId: user._id,
        data,
        hasJWT: !!jwt,
      });

      if (!jwt) {
        throw new Error("No hay token de autenticación");
      }

      try {
        // ✅ FIXED: Use the correct profile update endpoint
        const response = await axios.put(
          `/api/users/updateProfile/${user._id}`, // ✅ This matches your backend route
          data,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (apiError) {
        console.error("❌ Profile update API error:", {
          status: apiError.response?.status,
          data: apiError.response?.data,
        });
        throw apiError;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Profile updated successfully:", data);
      dispatch(setUserInfo(data));
      setUser(data);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Perfil actualizado exitosamente");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("❌ Profile update mutation error:", error);

      let errorMessage = "Error al actualizar el perfil";

      if (error.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor inicia sesión nuevamente.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });

  // Mutation for updating location
  const updateLocationMutation = useMutation({
    mutationFn: async (data) => {
      console.log("🔄 Updating location:", {
        userId: user._id,
        data,
        hasJWT: !!jwt,
      });

      if (!jwt) {
        throw new Error("No hay token de autenticación");
      }

      try {
        const response = await axios.put(
          `/api/users/updateProfile/${user._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (apiError) {
        console.error("❌ Location update API error:", {
          status: apiError.response?.status,
          data: apiError.response?.data,
        });
        throw apiError;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Location updated successfully:", data);
      dispatch(setUserInfo(data));
      setUser(data);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Ubicación actualizada exitosamente");
      setOpenLocation(false);
    },
    onError: (error) => {
      console.error("❌ Location update mutation error:", error);

      let errorMessage = "Error al actualizar la ubicación";

      if (error.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor inicia sesión nuevamente.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: async (file) => {
      console.log("🔄 Starting cover image upload:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasJWT: !!jwt,
      });

      if (!jwt) {
        throw new Error("No hay token de autenticación");
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          throw new Error(
            "Token expirado. Por favor inicia sesión nuevamente."
          );
        }
      } catch (error) {
        if (error.message.includes("Token expirado")) {
          throw error;
        }
        throw new Error("Token inválido");
      }

      const formData = new FormData();
      // ✅ Use 'coverImg' to match your multer field name in backend
      formData.append("coverImg", file);

      console.log("🔄 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // ✅ Use the correct endpoint that matches your controller
      console.log("🔄 Making API request to /api/users/updateCoverImg");

      try {
        const response = await axios.put(
          "/api/users/updateCoverImg", // ✅ This should match your route
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              // Don't set Content-Type manually, let browser set it with boundary
            },
          }
        );

        console.log("✅ Cover image API response:", response.data);
        return response.data;
      } catch (apiError) {
        console.error("❌ API Error Details:", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
        });
        throw apiError;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Cover image updated successfully:", data);
      dispatch(setUserInfo(data));
      setUser(data);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Imagen de portada actualizada");

      // ✅ Update the cover image using the same pattern as ProfilePicture
      if (data.coverImg) {
        // Since your controller returns the public_id, construct the Cloudinary URL
        const imageUrl = `${stables.UPLOAD_FOLDER_BASE_URL}/${data.coverImg}`;
        console.log("🖼️ Setting new cover image URL:", imageUrl);
        setCoverImage(imageUrl);
      }
    },
    onError: (error) => {
      console.error("❌ Cover image mutation error:", error);

      let errorMessage = "Error al actualizar la imagen de portada";

      if (error.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor inicia sesión nuevamente.";
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // ✅ Reset to previous image on error
      if (user?.coverImg) {
        setCoverImage(`${stables.UPLOAD_FOLDER_BASE_URL}/${user.coverImg}`);
      } else {
        setCoverImage("/assets/bg-home1.jpg");
      }
    },
  });

  // Handle Profile Edit
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle location form changes
  const handleLocationChange = (field, value) => {
    if (field === "country") {
      setLocationForm({
        country: value,
        city: "",
      });
      setCitySearchTerm("");
    } else if (field === "city") {
      const detectedCountry = findCountryByCity(value);
      setLocationForm({
        city: value,
        country: detectedCountry,
      });
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
    setLocationForm({
      city: selectedCity,
      country: selectedCountry,
    });
    setCitySearchTerm(selectedCity);
    setFilteredCities([]);
  };

  // Handle profile form changes
  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit location form
  const handleLocationSubmit = () => {
    if (!locationForm.city.trim() || !locationForm.country.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    console.log("Updating location:", {
      userId: user._id,
      city: locationForm.city.trim(),
      country: locationForm.country.trim(),
      jwt: jwt ? "Present" : "Missing",
    });

    updateLocationMutation.mutate({
      city: locationForm.city.trim(),
      country: locationForm.country.trim(),
    });
  };

  // Submit profile form
  const handleProfileSubmit = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    console.log("Updating profile:", {
      userId: user._id,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      jwt: jwt ? "Present" : "Missing",
    });

    updateProfileMutation.mutate({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });
  };

  // ✅ Fixed cover image upload handler
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // ✅ Preview image immediately for better UX
    const reader = new FileReader();
    reader.onloadend = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to server
    updateCoverMutation.mutate(file);
  };

  // List of countries for dropdown
  const countries = Object.keys(cityCountryData);

  return (
    <Box width="100%">
      <Box
        sx={{
          width: "100%",
          height: "40vh",
          borderRadius: "10px",
          backgroundImage: `url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Cover Edit Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { background: "rgba(0,0,0,0.7)" },
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
      </Box>

      {/* Profile Info Section - Overlapping Cover */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
          marginTop: "-75px",
          paddingBottom: "1rem",
        }}
      >
        <ProfilePicture avatar={user?.avatar} size="150px" />
        <Typography variant="h6" color={theme.palette.secondary.medium}>
          @{user?.name}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ marginBottom: "10px" }}
        >
          <Typography variant="h4" fontWeight="500">
            {user?.name}
          </Typography>
          <IconButton
            size="small"
            onClick={handleEditProfile}
            sx={{
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              "&:hover": {
                background: theme.palette.primary.dark,
                color: theme.palette.primary.light,
              },
            }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Box>

        {user.city && user.country ? (
          <Box display="flex" alignItems="center" gap={1}>
            <FmdGoodOutlinedIcon sx={{ color: theme.palette.primary.main }} />
            <Typography>
              {user.city}, {user.country}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpenLocation(true)}
              sx={{ ml: 1 }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<LocationOn />}
            onClick={() => setOpenLocation(true)}
            sx={{
              borderRadius: "50px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: "600",
            }}
          >
            Agrega tu Ubicación
          </Button>
        )}
      </Box>

      {/* Friends Widget */}
      <FriendsWidget token={jwt} />

      {/* Location Dialog */}
      <Dialog
        open={openLocation}
        onClose={() => setOpenLocation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn color="primary" />
            Actualizar Ubicación
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setOpenLocation(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Country Selection First */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>País (opcional)</InputLabel>
              <Select
                value={locationForm.country}
                onChange={(e) =>
                  handleLocationChange("country", e.target.value)
                }
                label="País (opcional)"
              >
                <MenuItem value="">
                  <em>Selecciona un país primero...</em>
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* City Input with Autocomplete */}
            <Box sx={{ position: "relative" }}>
              <TextField
                margin="normal"
                label={
                  locationForm.country
                    ? "Ciudad"
                    : "Ciudad (escribe para buscar)"
                }
                fullWidth
                variant="outlined"
                value={citySearchTerm}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                placeholder={
                  locationForm.country
                    ? `Ej: ${cityCountryData[locationForm.country]
                        ?.slice(0, 3)
                        .join(", ")}`
                    : "Ej: Madrid, París, Tokio..."
                }
                sx={{ mb: 1 }}
                helperText={
                  locationForm.country && !locationForm.city
                    ? `Ciudades disponibles en ${locationForm.country}`
                    : locationForm.city && locationForm.country
                    ? `✓ ${locationForm.city}, ${locationForm.country}`
                    : "Escribe una ciudad o selecciona un país primero"
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      locationForm.city && locationForm.country
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
                  }}
                >
                  {filteredCities.map((item, index) => (
                    <Box
                      key={`${item.city}-${item.country}`}
                      onClick={() => handleCitySelect(item.city, item.country)}
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
                      <Typography variant="caption" color="text.secondary">
                        {item.country}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Cities available in selected country */}
            {locationForm.country && cityCountryData[locationForm.country] && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: "8px",
                }}
              >
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                  Ciudades populares en {locationForm.country}:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {cityCountryData[locationForm.country]
                    .slice(0, 8)
                    .map((city) => (
                      <Button
                        key={city}
                        size="small"
                        variant={
                          locationForm.city === city ? "contained" : "outlined"
                        }
                        onClick={() =>
                          handleCitySelect(city, locationForm.country)
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenLocation(false)}
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: "50px" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLocationSubmit}
            color="primary"
            variant="contained"
            disabled={updateLocationMutation.isLoading}
            startIcon={
              updateLocationMutation.isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <Save />
              )
            }
            sx={{ borderRadius: "50px" }}
          >
            {updateLocationMutation.isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EditOutlined color="primary" />
            Editar Perfil
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setIsEditing(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              margin="normal"
              label="Nombre"
              fullWidth
              variant="outlined"
              value={profileForm.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={profileForm.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsEditing(false)}
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: "50px" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleProfileSubmit}
            color="primary"
            variant="contained"
            disabled={updateProfileMutation.isLoading}
            startIcon={
              updateProfileMutation.isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <Save />
              )
            }
            sx={{ borderRadius: "50px" }}
          >
            {updateProfileMutation.isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;

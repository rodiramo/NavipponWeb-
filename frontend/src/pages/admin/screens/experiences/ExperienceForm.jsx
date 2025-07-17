import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getSingleExperience,
  updateExperience,
  createExperience,
} from "../../../../services/index/experiences";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import Editor from "../../../../components/editor/Editor";
import ExperienceTypeSelect from "./tags/ExperienceTypeSelect";
import PriceInput from "./tags/PriceInput";
import RegionPrefectureSelect from "./tags/RegionPrefectureSelect";
import ExperienceDetailSkeleton from "../../../experienceDetail/components/ExperienceDetailSkeleton";
import {
  ImageUp,
  Trash2,
  Earth,
  ArrowLeft,
  ArrowRight,
  Search,
  MapPin,
  Image,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  useTheme,
  Grid,
  Paper,
  Chip,
  useMediaQuery,
  Container,
  Stack,
  MobileStepper,
  Divider,
} from "@mui/material";
import useUser from "../../../../hooks/useUser";
import { stables } from "../../../../constants";
import ErrorMessage from "../../../../components/ErrorMessage";
import HotelTags from "./tags/HotelTags";
import RestaurantTags from "./tags/RestaurantTags";
import AtractionTags from "./tags/AtractionTags";
import GeneralTags from "./tags/GeneralTags";

const DEFAULT_IMAGES = {
  Hoteles:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format&q=80",
  Restaurantes:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format&q=80",
  Atractivos:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop&auto=format&q=80",
  general:
    "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop&auto=format&q=80",
};

// Default schedule templates for different categories
const DEFAULT_SCHEDULES = {
  Hoteles:
    "lunes: 24 horas martes: 24 horas miércoles: 24 horas jueves: 24 horas viernes: 24 horas sábado: 24 horas domingo: 24 horas",
  Restaurantes:
    "lunes: 11:00–22:00 martes: 11:00–22:00 miércoles: 11:00–22:00 jueves: 11:00–22:00 viernes: 11:00–23:00 sábado: 11:00–23:00 domingo: 11:00–21:00",
  Atractivos:
    "lunes: 9:00–17:00 martes: 9:00–17:00 miércoles: 9:00–17:00 jueves: 9:00–17:00 viernes: 9:00–17:00 sábado: 9:00–18:00 domingo: 9:00–18:00",
};

const ExperienceForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXS = useMediaQuery("(max-width:480px)");

  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [autocomplete, setAutocomplete] = useState(null);
  const { jwt } = useUser();
  const isEditing = Boolean(slug);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState({
    type: "Point",
    coordinates: [],
  });
  const [manualCoords, setManualCoords] = useState({
    lat: "",
    lng: "",
  });
  // All your existing state variables...
  const [experienceSlug, setExperienceSlug] = useState("");
  const [caption, setCaption] = useState("");
  const [region, setRegion] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [price, setPrice] = useState(0);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [schedule, setSchedule] = useState("");
  const [map, setMap] = useState("");
  const [address, setAddress] = useState("");

  // Multi-step form state
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Detalles Básicos",
    "Contenido",
    "Ubicación",
    "Categorías",
    "Contacto",
    "Imagen",
    "Revisión",
  ];

  // Responsive step labels for mobile
  const mobileSteps = [
    "Básicos",
    "Contenido",
    "Ubicación",
    "Categorías",
    "Contacto",
    "Imagen",
    "Revisión",
  ];

  // Tag states
  const [selectedGeneralTags, setSelectedGeneralTags] = useState({
    season: [],
    budget: [],
    rating: [],
    location: [],
  });
  const [selectedAttractionTags, setSelectedAttractionTags] = useState([]);
  const [selectedRestaurantTags, setSelectedRestaurantTags] = useState({
    restaurantTypes: [],
    cuisines: [],
    restaurantServices: [],
  });
  const [selectedHotelTags, setSelectedHotelTags] = useState({
    accommodation: [],
    hotelServices: [],
    typeTrip: [],
  });

  // Show more/less state for attraction tags
  const [showAllAttractionTags, setShowAllAttractionTags] = useState(false);

  // Get default image based on category
  const getDefaultImage = () => {
    return DEFAULT_IMAGES[categories] || DEFAULT_IMAGES.general;
  };

  // Get default schedule based on category
  const getDefaultSchedule = () => {
    return DEFAULT_SCHEDULES[categories] || DEFAULT_SCHEDULES.Atractivos;
  };

  // Get current image to display
  const getCurrentImageSrc = () => {
    if (photo) {
      return URL.createObjectURL(photo);
    }
    if (initialPhoto) {
      return stables.UPLOAD_FOLDER_BASE_URL + data?.photo;
    }
    if (useDefaultImage) {
      return getDefaultImage();
    }
    return null;
  };

  // Auto-update default image when category changes (but not when useDefaultImage changes)
  useEffect(() => {
    if (useDefaultImage && categories) {
      // Just trigger a re-render without the flicker
      const timeoutId = setTimeout(() => {
        // Force component to acknowledge the new default image
        setUseDefaultImage(true);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [categories, useDefaultImage]); // Remove useDefaultImage from dependencies to prevent loop

  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    let generatedSlug = titleValue.trim().replace(/\s+/g, "-").toLowerCase();
    let uniqueSlug = `${generatedSlug}-${Date.now()}`;
    setTitle(titleValue);
    setExperienceSlug(uniqueSlug);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setUseDefaultImage(false); // Disable default image when user uploads
  };

  const handleDeleteImage = () => {
    if (window.confirm("¿Quieres eliminar la foto de tu publicación?")) {
      setInitialPhoto(null);
      setPhoto(null);
      setUseDefaultImage(false);
    }
  };

  const handleUseDefaultImage = () => {
    // Batch state updates to prevent multiple re-renders
    React.startTransition(() => {
      setPhoto(null);
      setInitialPhoto(null);
      setUseDefaultImage(true);
    });
  };

  // Handle using default schedule template
  const handleUseDefaultSchedule = () => {
    if (categories) {
      setSchedule(getDefaultSchedule());
      toast.success(`Horario por defecto aplicado para ${categories}`);
    } else {
      toast.error("Primero selecciona una categoría");
    }
  };

  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    enabled: isEditing,
    retry: false,
    onSuccess: (data) => {
      if (!data) return;
      setInitialPhoto(data.photo || null);
      setCategories(data.categories || "");
      setTitle(data.title || "");
      setBody(data.body || "");
      setCaption(data.caption || "");
      setRegion(data.region || "");
      setPrefecture(data.prefecture || "");
      setPrice(data.price || 0);
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setWebsite(data.website || "");
      setSchedule(data.schedule || "");
      setMap(data.map || "");
      setAddress(data.address || "");
      setSelectedGeneralTags(
        data.generalTags || { season: [], budget: [], rating: [], location: [] }
      );
      setSelectedAttractionTags(data.attractionTags || []);
      setSelectedRestaurantTags(
        data.restaurantTags || {
          restaurantTypes: [],
          cuisines: [],
          restaurantServices: [],
        }
      );
      setSelectedHotelTags(
        data.hotelTags || { accommodation: [], hotelServices: [], typeTrip: [] }
      );
    },
  });

  const isLoading = isEditing ? queryLoading : false;

  // Your existing mutation and handlers...
  const mutation = useMutation({
    mutationFn: ({ updatedData, experienceData, slug, token }) =>
      isEditing
        ? updateExperience({ updatedData, slug, token })
        : createExperience({ experienceData, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["experience", slug]);
      toast.success(`Experiencia ${isEditing ? "actualizada" : "creada"}`);
      navigate(`/admin/experiences/manage`, {
        replace: true,
      });
    },
    onError: (error) => toast.error(error.message),
  });

  // Step navigation
  const handleNext = () => {
    // Validation for each step
    if (activeStep === 0) {
      if (!title || !caption) {
        return toast.error("Por favor completa el título y descripción");
      }
    }
    if (activeStep === 2) {
      if (!region) {
        return toast.error("Por favor selecciona una región");
      }
    }
    if (activeStep === 4) {
      if (!categories) {
        return toast.error("Por favor selecciona una categoría");
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Google Places handlers
  const handleOnLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);

      if (place.formatted_address) setAddress(place.formatted_address);
      if (place.name) setTitle(place.name);
      if (place.formatted_phone_number) setPhone(place.formatted_phone_number);
      if (place.website) setWebsite(place.website);
      if (typeof place.price_level !== "undefined") setPrice(place.price_level);

      let extractedPrefecture = "";
      if (place.address_components) {
        place.address_components.forEach((component) => {
          if (component.types.includes("administrative_area_level_1")) {
            extractedPrefecture = component.long_name;
          }
        });
      }
      setPrefecture(extractedPrefecture);

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({
          type: "Point",
          coordinates: [lng, lat],
        });
      }
    }
  };

  // Submit handlers
  const handleCreateExperience = async () => {
    if (!title || !caption || !categories || !region) {
      return toast.error("Todos los campos obligatorios deben estar completos");
    }

    const formData = new FormData();

    // Handle image: either uploaded photo or default image URL
    if (photo) {
      formData.append("experiencePicture", photo);
    } else if (useDefaultImage) {
      formData.append("defaultImageUrl", getDefaultImage());
      formData.append("useDefaultImage", "true");
    }

    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("slug", experienceSlug);
    formData.append("body", JSON.stringify(body));
    formData.append("categories", JSON.stringify(categories));
    formData.append("generalTags", JSON.stringify(selectedGeneralTags));
    formData.append("hotelTags", JSON.stringify(selectedHotelTags));
    formData.append("attractionTags", JSON.stringify(selectedAttractionTags));
    formData.append("restaurantTags", JSON.stringify(selectedRestaurantTags));
    formData.append("region", region);
    formData.append("prefecture", prefecture);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("website", website);
    formData.append("schedule", schedule);
    formData.append("address", address);

    if (location && location.coordinates && location.coordinates.length === 2) {
      formData.append("location", JSON.stringify(location));
    }

    mutation.mutate({
      experienceData: formData,
      token: jwt,
    });
  };

  const handleUpdateExperience = async () => {
    if (!title || !caption || !categories || !region) {
      return toast.error("Todos los campos obligatorios deben estar completos");
    }

    const formData = new FormData();
    if (photo) formData.append("experiencePicture", photo);

    const experienceData = {
      title,
      caption,
      slug: experienceSlug,
      body,
      categories,
      generalTags: selectedGeneralTags,
      hotelTags: selectedHotelTags,
      attractionTags: selectedAttractionTags,
      restaurantTags: selectedRestaurantTags,
      region,
      prefecture,
      price,
      phone,
      email,
      website,
      schedule,
      map,
      address,
    };

    // Add default image handling for updates too
    if (useDefaultImage) {
      experienceData.defaultImageUrl = getDefaultImage();
      experienceData.useDefaultImage = true;
    }

    formData.append("document", JSON.stringify(experienceData));

    mutation.mutate({
      updatedData: formData,
      slug,
      token: jwt,
    });
  };

  const geocodeAddress = async () => {
    if (!address.trim()) {
      toast.error("Por favor ingresa una dirección");
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK" && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error("No se pudo encontrar la ubicación"));
          }
        });
      });

      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();

      setLocation({
        type: "Point",
        coordinates: [lng, lat],
      });
      setManualCoords({ lat: lat.toString(), lng: lng.toString() });

      if (result.formatted_address) {
        setAddress(result.formatted_address);
      }

      toast.success("Coordenadas obtenidas exitosamente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add this function to apply manual coordinates:
  const applyManualCoordinates = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Por favor ingresa coordenadas válidas");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Coordenadas fuera de rango válido");
      return;
    }

    setLocation({
      type: "Point",
      coordinates: [lng, lat],
    });

    toast.success("Coordenadas aplicadas exitosamente");
  };

  // Step content renderer
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Detalles Básicos
        return (
          <Stack spacing={isXS ? 2 : 3}>
            {/* Google Places Search */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Earth
                  size={isXS ? 18 : 20}
                  color={theme.palette.primary.main}
                />
                <Typography
                  variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
                  fontWeight="medium"
                  sx={{ fontSize: isXS ? "1rem" : undefined }}
                >
                  Buscar lugar
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: isXS ? "0.75rem" : "0.875rem",
                }}
              >
                Ingresa el nombre o dirección para cargar información
                automáticamente
              </Typography>
              <Autocomplete
                onLoad={handleOnLoad}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  fields: [
                    "place_id",
                    "formatted_address",
                    "name",
                    "formatted_phone_number",
                    "website",
                    "price_level",
                    "address_components",
                    "geometry",
                  ],
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Busca la experiencia con Google..."
                  size={isXS ? "small" : "medium"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: isXS ? "8px" : "12px",
                      fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Autocomplete>
            </Box>

            {/* Title */}
            <Box>
              <Typography
                variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
                fontWeight="medium"
                gutterBottom
                sx={{ fontSize: isXS ? "1rem" : undefined }}
              >
                Título*
              </Typography>
              <TextField
                value={title}
                onChange={handleTitleChange}
                fullWidth
                required
                placeholder="Título de la experiencia..."
                size={isXS ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isXS ? "8px" : "12px",
                    fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                  },
                }}
              />
            </Box>

            {/* Caption */}
            <Box>
              <Typography
                variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
                fontWeight="medium"
                gutterBottom
                sx={{ fontSize: isXS ? "1rem" : undefined }}
              >
                Descripción breve*
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: isXS ? "0.75rem" : "0.875rem",
                }}
              >
                Una descripción concisa que destaque lo más importante
              </Typography>
              <TextField
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                fullWidth
                required
                multiline
                rows={isXS ? 2 : isMobile ? 3 : 4}
                placeholder="Escribe la descripción aquí..."
                size={isXS ? "small" : "medium"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isXS ? "8px" : "12px",
                    fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                  },
                }}
              />
            </Box>
          </Stack>
        );

      case 1: // Contenido
        return (
          <Stack spacing={isXS ? 2 : 3}>
            <Typography
              variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
              sx={{ fontSize: isXS ? "1rem" : undefined }}
            >
              Contenido detallado*
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                fontSize: isXS ? "0.75rem" : "0.875rem",
              }}
            >
              Describe completamente la experiencia, qué incluye, horarios, etc.
            </Typography>
            <Box
              sx={{
                "& .ql-editor": {
                  minHeight: isXS ? "150px" : isMobile ? "200px" : "300px",
                  fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                },
                "& .ql-toolbar": {
                  borderRadius: isXS ? "8px 8px 0 0" : "12px 12px 0 0",
                },
                "& .ql-container": {
                  borderRadius: isXS ? "0 0 8px 8px" : "0 0 12px 12px",
                },
              }}
            >
              <Editor
                content={body}
                editable={true}
                onDataChange={(data) => setBody(data)}
              />
            </Box>
            <Box>
              <PriceInput price={price} setPrice={setPrice} />
            </Box>
          </Stack>
        );

      case 2: // Ubicación
        return (
          <Stack spacing={isXS ? 2 : 3}>
            <Typography
              variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
              sx={{ fontSize: isXS ? "1rem" : undefined }}
            >
              Ubicación*
            </Typography>

            {/* Address Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontSize: isXS ? "0.9rem" : "1rem",
                }}
              >
                Dirección
              </Typography>
              <Stack direction="column" spacing={1}>
                <TextField
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  placeholder="Ingresa la dirección completa"
                  size={isXS ? "small" : "medium"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: isXS ? "8px" : "12px",
                      fontSize: isXS ? "13px" : "14px",
                    },
                  }}
                />
                <Button
                  onClick={geocodeAddress}
                  variant="outlined"
                  startIcon={<Search size={16} />}
                  disabled={!address.trim()}
                  fullWidth={isXS}
                  size={isXS ? "small" : "medium"}
                  sx={{
                    borderRadius: isXS ? "8px" : "12px",
                    textTransform: "none",
                    fontSize: isXS ? "0.75rem" : "0.875rem",
                    alignSelf: isXS ? "stretch" : "flex-start",
                  }}
                >
                  Obtener coordenadas
                </Button>
              </Stack>
            </Box>

            {/* Manual Coordinates */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontSize: isXS ? "0.9rem" : "1rem",
                }}
              >
                Coordenadas (Opcional)
              </Typography>
              <Grid container spacing={isXS ? 1 : 2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Latitud"
                    value={manualCoords.lat}
                    onChange={(e) =>
                      setManualCoords((prev) => ({
                        ...prev,
                        lat: e.target.value,
                      }))
                    }
                    fullWidth
                    placeholder="35.6762"
                    type="number"
                    inputProps={{ step: "any" }}
                    size={isXS ? "small" : "medium"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: isXS ? "8px" : "12px",
                        fontSize: isXS ? "13px" : "14px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Longitud"
                    value={manualCoords.lng}
                    onChange={(e) =>
                      setManualCoords((prev) => ({
                        ...prev,
                        lng: e.target.value,
                      }))
                    }
                    fullWidth
                    placeholder="139.6503"
                    type="number"
                    inputProps={{ step: "any" }}
                    size={isXS ? "small" : "medium"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: isXS ? "8px" : "12px",
                        fontSize: isXS ? "13px" : "14px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={applyManualCoordinates}
                    variant="contained"
                    startIcon={<MapPin size={16} />}
                    disabled={!manualCoords.lat || !manualCoords.lng}
                    fullWidth={isXS}
                    size={isXS ? "small" : "medium"}
                    sx={{
                      borderRadius: isXS ? "16px" : "20px",
                      textTransform: "none",
                      fontSize: isXS ? "0.75rem" : "0.875rem",
                    }}
                  >
                    Aplicar coordenadas
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Current Coordinates Display */}
            {location &&
              location.coordinates &&
              location.coordinates.length === 2 && (
                <Box
                  sx={{
                    p: isXS ? 1.5 : 2,
                    backgroundColor: `${theme.palette.success.main}10`,
                    borderRadius: isXS ? "8px" : "12px",
                    border: `1px solid ${theme.palette.success.main}30`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="success.main"
                    gutterBottom
                    sx={{ fontSize: isXS ? "0.8rem" : "0.875rem" }}
                  >
                    ✅ Coordenadas establecidas
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isXS ? "0.75rem" : "0.875rem" }}
                  >
                    Latitud: {location.coordinates[1].toFixed(6)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isXS ? "0.75rem" : "0.875rem" }}
                  >
                    Longitud: {location.coordinates[0].toFixed(6)}
                  </Typography>
                </Box>
              )}

            <RegionPrefectureSelect
              region={region}
              setRegion={setRegion}
              prefecture={prefecture}
              setPrefecture={setPrefecture}
            />
          </Stack>
        );

      case 3: // Categorías
        return (
          <Stack spacing={isXS ? 2 : 3}>
            <ExperienceTypeSelect
              categories={categories}
              setCategories={setCategories}
              isExperienceDataLoaded={!isLoading}
            />

            <Box>
              <Typography
                variant="h6"
                fontWeight="medium"
                gutterBottom
                sx={{ fontSize: isXS ? "1rem" : "1.25rem" }}
              >
                Tags Generales
              </Typography>
              <GeneralTags
                selectedGeneralTags={selectedGeneralTags}
                setSelectedGeneralTags={setSelectedGeneralTags}
              />
            </Box>

            {categories === "Atractivos" && (
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ fontSize: isXS ? "1rem" : "1.25rem" }}
                >
                  Tags de Atractivos
                </Typography>
                <Box
                  sx={{
                    maxHeight: showAllAttractionTags
                      ? "none"
                      : isXS
                        ? "120px"
                        : isMobile
                          ? "150px"
                          : "200px",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    position: "relative",
                  }}
                >
                  <AtractionTags
                    selectedAttractionTags={selectedAttractionTags}
                    setSelectedAttractionTags={setSelectedAttractionTags}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: isXS ? 1.5 : 2,
                    position: "relative",
                  }}
                >
                  {!showAllAttractionTags && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: isXS ? "-60px" : isMobile ? "-80px" : "-100px",
                        left: 0,
                        right: 0,
                        height: isXS ? "60px" : isMobile ? "80px" : "100px",
                        background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.paper} 70%)`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <Button
                    onClick={() =>
                      setShowAllAttractionTags(!showAllAttractionTags)
                    }
                    variant="outlined"
                    size={isXS ? "small" : "medium"}
                    endIcon={
                      showAllAttractionTags ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    }
                    sx={{
                      borderRadius: isXS ? "16px" : "20px",
                      textTransform: "none",
                      fontSize: isXS ? "0.75rem" : "0.875rem",
                      px: isXS ? 2 : 3,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: showAllAttractionTags
                        ? "none"
                        : `0 2px 8px ${theme.palette.action.hover}`,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        boxShadow: `0 4px 12px ${theme.palette.action.hover}`,
                      },
                    }}
                  >
                    {showAllAttractionTags
                      ? "Mostrar menos"
                      : "Mostrar más tags"}
                  </Button>
                </Box>
              </Box>
            )}
            {categories === "Restaurantes" && (
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ fontSize: isXS ? "1rem" : "1.25rem" }}
                >
                  Tags de Restaurantes
                </Typography>
                <RestaurantTags
                  selectedRestaurantTags={selectedRestaurantTags}
                  setSelectedRestaurantTags={setSelectedRestaurantTags}
                />
              </Box>
            )}
            {categories === "Hoteles" && (
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ fontSize: isXS ? "1rem" : "1.25rem" }}
                >
                  Tags de Hoteles
                </Typography>
                <HotelTags
                  selectedHotelTags={selectedHotelTags}
                  setSelectedHotelTags={setSelectedHotelTags}
                />
              </Box>
            )}
          </Stack>
        );

      case 4: // Contacto
        return (
          <Card
            elevation={isXS ? 0 : isMobile ? 1 : 2}
            sx={{
              p: isXS ? 1.5 : isMobile ? 2 : 3,
              borderRadius: isXS ? "12px" : "16px",
              border: isXS ? `1px solid ${theme.palette.divider}` : "none",
            }}
          >
            <Typography
              variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
              sx={{ fontSize: isXS ? "1rem" : undefined }}
            >
              Información de contacto
            </Typography>
            <Grid container spacing={isXS ? 1.5 : isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: isXS ? "0.9rem" : "1rem",
                  }}
                >
                  Teléfono
                </Typography>
                <PhoneInput
                  country={"jp"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{
                    width: "100%",
                    height: isXS ? "40px" : isMobile ? "48px" : "56px",
                    borderRadius: isXS ? "8px" : "12px",
                    border: `1.5px solid ${theme.palette.divider}`,
                    fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                    paddingLeft: isXS ? "44px" : "48px",
                  }}
                  buttonStyle={{
                    borderRadius: isXS ? "8px 0 0 8px" : "12px 0 0 12px",
                    height: isXS ? "40px" : isMobile ? "48px" : "56px",
                  }}
                  placeholder="Teléfono"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: isXS ? "0.9rem" : "1rem",
                  }}
                >
                  Correo electrónico
                </Typography>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="correo@ejemplo.com"
                  size={isXS ? "small" : "medium"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: isXS ? "8px" : "12px",
                      fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontSize: isXS ? "0.9rem" : "1rem",
                  }}
                >
                  Sitio Web
                </Typography>
                <TextField
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  fullWidth
                  placeholder="https://ejemplo.com"
                  size={isXS ? "small" : "medium"}
                  onBlur={(e) => {
                    let value = e.target.value.trim();
                    if (
                      value &&
                      !value.startsWith("http://") &&
                      !value.startsWith("https://")
                    ) {
                      value = `http://${value}`;
                      setWebsite(value);
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: isXS ? "8px" : "12px",
                      fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Grid>

              {/* Schedule Field */}
              <Grid item xs={12}>
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Clock
                      size={isXS ? 18 : 20}
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: isXS ? "0.9rem" : "1rem" }}
                    >
                      Horarios de atención
                    </Typography>
                  </Stack>

                  <TextField
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    fullWidth
                    multiline
                    rows={isXS ? 2 : isMobile ? 2 : 3}
                    placeholder="Ejemplo: lunes: 9:00–17:00 martes: 9:00–17:00 miércoles: Cerrado..."
                    size={isXS ? "small" : "medium"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: isXS ? "8px" : "12px",
                        fontSize: isXS ? "13px" : isMobile ? "14px" : "16px",
                      },
                    }}
                  />

                  {/* Schedule Helper Buttons */}
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ mt: isXS ? 1.5 : 2 }}
                  >
                    {categories && (
                      <Button
                        onClick={handleUseDefaultSchedule}
                        variant="outlined"
                        size="small"
                        startIcon={<Clock size={14} />}
                        fullWidth={isXS}
                        sx={{
                          borderRadius: isXS ? "16px" : "20px",
                          textTransform: "none",
                          fontSize: isXS ? "0.7rem" : "0.75rem",
                          py: isXS ? 0.5 : 1,
                        }}
                      >
                        Usar horario típico de {categories}
                      </Button>
                    )}

                    <Button
                      onClick={() => setSchedule("")}
                      variant="text"
                      size="small"
                      fullWidth={isXS}
                      sx={{
                        borderRadius: isXS ? "16px" : "20px",
                        textTransform: "none",
                        fontSize: isXS ? "0.7rem" : "0.75rem",
                        py: isXS ? 0.5 : 1,
                      }}
                    >
                      Limpiar
                    </Button>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      fontSize: isXS
                        ? "0.7rem"
                        : isMobile
                          ? "0.75rem"
                          : "0.875rem",
                    }}
                  >
                    Describe los horarios de funcionamiento. Ejemplo: "lunes:
                    9:00–17:00 martes: Cerrado"
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        );

      case 5: // Imagen
        return (
          <Stack spacing={isXS ? 2 : 3}>
            <Typography
              variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
              sx={{ fontSize: isXS ? "1rem" : undefined }}
            >
              Imagen de la experiencia
            </Typography>

            {/* Image Display */}
            <Box>
              <label
                htmlFor="experiencePicture"
                style={{ cursor: "pointer", width: "100%" }}
              >
                {getCurrentImageSrc() ? (
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={getCurrentImageSrc()}
                      alt={title || "Experiencia"}
                      style={{
                        width: "100%",
                        height: isXS ? "180px" : isMobile ? "200px" : "300px",
                        objectFit: "cover",
                        borderRadius: isXS ? "12px" : "16px",
                        border: useDefaultImage
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                      }}
                    />
                    {useDefaultImage && (
                      <Chip
                        label={`${categories || "Imagen"} por defecto`}
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: isXS ? 6 : 8,
                          left: isXS ? 6 : 8,
                          fontSize: isXS ? "0.6rem" : "0.7rem",
                          height: isXS ? "20px" : "24px",
                        }}
                      />
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: isXS ? "180px" : isMobile ? "200px" : "300px",
                      border: `2px dashed ${theme.palette.primary.main}`,
                      borderRadius: isXS ? "12px" : "16px",
                      backgroundColor: theme.palette.background.paper,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ImageUp
                      size={isXS ? 28 : isMobile ? 32 : 40}
                      color={theme.palette.primary.main}
                    />
                    <Typography
                      variant={isXS ? "body2" : "body1"}
                      sx={{
                        fontSize: isXS ? "0.8rem" : undefined,
                        mt: 1,
                      }}
                    >
                      Subir imagen
                    </Typography>
                  </Box>
                )}
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="experiencePicture"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Box>

            {/* Image Action Buttons */}
            <Stack direction="column" spacing={1}>
              {(photo || initialPhoto || useDefaultImage) && (
                <Button
                  onClick={handleDeleteImage}
                  variant="outlined"
                  color="error"
                  size={isXS ? "small" : "medium"}
                  fullWidth
                  sx={{
                    borderRadius: isXS ? "16px" : "20px",
                    textTransform: "none",
                    fontSize: isXS
                      ? "0.75rem"
                      : isMobile
                        ? "0.8rem"
                        : "0.875rem",
                    py: isXS ? 0.75 : 1,
                  }}
                  startIcon={<Trash2 size={14} />}
                >
                  Eliminar imagen
                </Button>
              )}

              {!useDefaultImage && categories && (
                <Button
                  onClick={handleUseDefaultImage}
                  variant="outlined"
                  color="primary"
                  size={isXS ? "small" : "medium"}
                  fullWidth
                  sx={{
                    borderRadius: isXS ? "16px" : "20px",
                    textTransform: "none",
                    fontSize: isXS
                      ? "0.75rem"
                      : isMobile
                        ? "0.8rem"
                        : "0.875rem",
                    py: isXS ? 0.75 : 1,
                  }}
                  startIcon={<Image size={14} />}
                >
                  Usar imagen por defecto ({categories})
                </Button>
              )}

              <Button
                component="label"
                htmlFor="experiencePicture"
                variant="contained"
                size={isXS ? "small" : "medium"}
                fullWidth
                sx={{
                  borderRadius: isXS ? "16px" : "20px",
                  textTransform: "none",
                  fontSize: isXS ? "0.75rem" : isMobile ? "0.8rem" : "0.875rem",
                  py: isXS ? 0.75 : 1,
                }}
                startIcon={<ImageUp size={14} />}
              >
                {photo || initialPhoto ? "Cambiar imagen" : "Subir imagen"}
              </Button>
            </Stack>

            {/* Help Text */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isXS ? "0.7rem" : isMobile ? "0.75rem" : "0.875rem",
                textAlign: "center",
              }}
            >
              {useDefaultImage
                ? `Usando imagen por defecto para ${categories}`
                : "Sube una imagen personalizada o usa una imagen por defecto"}
            </Typography>
          </Stack>
        );

      case 6: // Revisión
        return (
          <Stack spacing={isXS ? 2 : 3}>
            <Typography
              variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
              sx={{ fontSize: isXS ? "1rem" : undefined }}
            >
              Revisar Experiencia
            </Typography>
            <Paper
              elevation={isXS ? 0 : isMobile ? 1 : 2}
              sx={{
                p: isXS ? 1.5 : isMobile ? 2 : 3,
                borderRadius: isXS ? "12px" : "16px",
                border: isXS ? `1px solid ${theme.palette.divider}` : "none",
              }}
            >
              {/* Image Preview in Review */}
              {getCurrentImageSrc() && (
                <Box sx={{ mb: isXS ? 2 : 3, textAlign: "center" }}>
                  <img
                    src={getCurrentImageSrc()}
                    alt={title || "Experiencia"}
                    style={{
                      width: "100%",
                      maxWidth: isXS ? "100%" : isMobile ? "300px" : "400px",
                      height: isXS ? "150px" : isMobile ? "200px" : "250px",
                      objectFit: "cover",
                      borderRadius: isXS ? "8px" : "12px",
                    }}
                  />
                  {useDefaultImage && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                        fontSize: isXS
                          ? "0.65rem"
                          : isMobile
                            ? "0.7rem"
                            : "0.75rem",
                      }}
                    >
                      Imagen por defecto para {categories}
                    </Typography>
                  )}
                </Box>
              )}

              <Typography
                variant={isXS ? "subtitle1" : isMobile ? "h6" : "h5"}
                color="primary"
                gutterBottom
                sx={{
                  fontSize: isXS ? "1rem" : isMobile ? "1.1rem" : "1.25rem",
                }}
              >
                {title || "Sin título"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                paragraph
                sx={{
                  fontSize: isXS ? "0.8rem" : isMobile ? "0.85rem" : "0.875rem",
                }}
              >
                {caption || "Sin descripción"}
              </Typography>

              <Divider sx={{ my: isXS ? 1.5 : 2 }} />

              <Grid container spacing={isXS ? 1 : isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isXS
                        ? "0.75rem"
                        : isMobile
                          ? "0.8rem"
                          : "0.875rem",
                      mb: isXS ? 0.5 : 1,
                    }}
                  >
                    <strong>Categoría:</strong>{" "}
                    {categories || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isXS
                        ? "0.75rem"
                        : isMobile
                          ? "0.8rem"
                          : "0.875rem",
                      mb: isXS ? 0.5 : 1,
                    }}
                  >
                    <strong>Región:</strong> {region || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isXS
                        ? "0.75rem"
                        : isMobile
                          ? "0.8rem"
                          : "0.875rem",
                      mb: isXS ? 0.5 : 1,
                    }}
                  >
                    <strong>Prefectura:</strong>{" "}
                    {prefecture || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isXS
                        ? "0.75rem"
                        : isMobile
                          ? "0.8rem"
                          : "0.875rem",
                      mb: isXS ? 0.5 : 1,
                    }}
                  >
                    <strong>Precio:</strong> ¥{price || 0}
                  </Typography>
                </Grid>
                {phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isXS
                          ? "0.75rem"
                          : isMobile
                            ? "0.8rem"
                            : "0.875rem",
                        mb: isXS ? 0.5 : 1,
                      }}
                    >
                      <strong>Teléfono:</strong> {phone}
                    </Typography>
                  </Grid>
                )}
                {email && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isXS
                          ? "0.75rem"
                          : isMobile
                            ? "0.8rem"
                            : "0.875rem",
                        mb: isXS ? 0.5 : 1,
                      }}
                    >
                      <strong>Email:</strong> {email}
                    </Typography>
                  </Grid>
                )}
                {schedule && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isXS
                          ? "0.75rem"
                          : isMobile
                            ? "0.8rem"
                            : "0.875rem",
                        mb: isXS ? 0.5 : 1,
                      }}
                    >
                      <strong>Horarios:</strong> {schedule}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <ExperienceDetailSkeleton />;
  if (isError) return <ErrorMessage message="Error cargando los datos." />;

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={["places"]}
      language="es"
    >
      {/* Header */}
      <Box
        sx={{
          background: theme.palette.secondary.light,
          padding: isXS ? "16px 12px" : isMobile ? "20px 16px" : "40px 24px",
          width: "100%",
          borderRadius: isXS
            ? "0rem 0rem 1.5rem 1.5rem"
            : isMobile
              ? "0rem 0rem 2rem 2rem"
              : "0rem 0rem 5rem 5rem",
          marginTop: "-25px",
        }}
      >
        <Typography
          variant={isXS ? "h5" : isMobile ? "h4" : "h2"}
          textAlign="center"
          sx={{
            fontSize: isXS ? "1.5rem" : isMobile ? "1.75rem" : "3rem",
            fontWeight: "bold",
          }}
        >
          {isEditing ? "Editar" : "Crear"} experiencia
        </Typography>
      </Box>

      {/* Main Container */}
      <Container
        maxWidth="lg"
        sx={{
          px: isXS ? 1 : isMobile ? 2 : 3,
          py: isXS ? 1 : isMobile ? 2 : 4,
        }}
      >
        {/* Stepper Container */}
        <Paper
          elevation={isXS ? 0 : isMobile ? 1 : 3}
          sx={{
            p: isXS ? 1.5 : isMobile ? 2 : 4,
            borderRadius: isXS ? "16px" : "20px",
            mb: 2,
            border: isXS ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          {/* Mobile Stepper for very small screens */}
          {isXS ? (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                  {mobileSteps[activeStep]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {activeStep + 1} de {steps.length}
                </Typography>
              </Box>
              <MobileStepper
                variant="progress"
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                sx={{
                  backgroundColor: "transparent",
                  p: 0,
                  "& .MuiMobileStepper-progress": {
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                  },
                }}
                nextButton={<div />}
                backButton={<div />}
              />
            </Box>
          ) : (
            /* Regular Stepper for larger screens */
            <Stepper
              activeStep={activeStep}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{
                mb: isMobile ? 2 : 4,
                "& .MuiStepLabel-label": {
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 500,
                },
                "& .MuiStepContent-root": {
                  borderLeft: isMobile
                    ? `2px solid ${theme.palette.primary.light}`
                    : "none",
                  ml: isMobile ? 1 : 0,
                  pl: isMobile ? 2 : 0,
                },
                "& .MuiStepIcon-root": {
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{isMobile ? mobileSteps[index] : label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Step Content */}
          <Box
            sx={{
              mt: isXS ? 2 : isMobile ? 2 : 4,
              minHeight: isXS ? "250px" : isMobile ? "300px" : "400px",
            }}
          >
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isXS || isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isXS || isMobile ? "stretch" : "center",
              mt: isXS ? 2 : isMobile ? 3 : 4,
              gap: isXS ? 1 : isMobile ? 2 : 0,
            }}
          >
            {/* Back Button - Left */}
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={
                isXS ? (
                  <ChevronLeft size={18} />
                ) : isMobile ? (
                  <ArrowLeft size={20} />
                ) : (
                  <ArrowLeft size={20} />
                )
              }
              variant="outlined"
              size={isXS ? "medium" : isMobile ? "large" : "medium"}
              fullWidth={isXS || isMobile}
              sx={{
                borderRadius: isXS ? "24px" : "30px",
                textTransform: "none",
                px: isXS ? 2 : isMobile ? 3 : 4,
                py: isXS ? 1 : isMobile ? 1.5 : 1,
                fontSize: isXS ? "0.85rem" : isMobile ? "1rem" : "0.875rem",
              }}
            >
              Anterior
            </Button>

            {/* Next/Submit Button - Right */}
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={
                  isEditing ? handleUpdateExperience : handleCreateExperience
                }
                variant="contained"
                disabled={mutation.isLoading}
                size={isXS ? "medium" : isMobile ? "large" : "medium"}
                fullWidth={isXS || isMobile}
                sx={{
                  px: isXS ? 2 : isMobile ? 3 : 6,
                  py: isXS ? 1 : isMobile ? 1.5 : 1,
                  borderRadius: isXS ? "24px" : "30px",
                  textTransform: "none",
                  fontSize: isXS ? "0.85rem" : isMobile ? "1rem" : "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {mutation.isLoading
                  ? "Procesando..."
                  : isEditing
                    ? "Actualizar experiencia"
                    : "Crear experiencia"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                size={isXS ? "medium" : isMobile ? "large" : "medium"}
                fullWidth={isXS || isMobile}
                sx={{
                  borderRadius: isXS ? "24px" : "30px",
                  textTransform: "none",
                  px: isXS ? 2 : isMobile ? 3 : 4,
                  py: isXS ? 1 : isMobile ? 1.5 : 1,
                  fontSize: isXS ? "0.85rem" : isMobile ? "1rem" : "0.875rem",
                  fontWeight: "bold",
                }}
                endIcon={
                  isXS ? (
                    <ChevronRight size={18} />
                  ) : isMobile ? (
                    <ArrowRight size={20} />
                  ) : (
                    <ArrowRight size={20} />
                  )
                }
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </LoadScript>
  );
};

export default ExperienceForm;

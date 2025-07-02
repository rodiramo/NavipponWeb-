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
  Image,
  Clock,
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

  // Auto-update default image when category changes
  useEffect(() => {
    if (useDefaultImage && categories) {
      // Force re-render to show new default image
      setUseDefaultImage(false);
      setTimeout(() => setUseDefaultImage(true), 10);
    }
  }, [categories, useDefaultImage]);

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
    setPhoto(null);
    setInitialPhoto(null);
    setUseDefaultImage(true);
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

  // Step content renderer
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Detalles Básicos
        return (
          <Stack spacing={3}>
            {/* Google Places Search */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Earth size={20} color={theme.palette.primary.main} />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight="medium"
                >
                  Buscar lugar
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Autocomplete>
            </Box>

            {/* Title */}
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="medium"
                gutterBottom
              >
                Título*
              </Typography>
              <TextField
                value={title}
                onChange={handleTitleChange}
                fullWidth
                required
                placeholder="Título de la experiencia..."
                size={isMobile ? "medium" : "large"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: isMobile ? "14px" : "16px",
                  },
                }}
              />
            </Box>

            {/* Caption */}
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="medium"
                gutterBottom
              >
                Descripción breve*
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Una descripción concisa que destaque lo más importante
              </Typography>
              <TextField
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                fullWidth
                required
                multiline
                rows={isMobile ? 3 : 4}
                placeholder="Escribe la descripción aquí..."
                size={isMobile ? "medium" : "large"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: isMobile ? "14px" : "16px",
                  },
                }}
              />
            </Box>
          </Stack>
        );

      case 1: // Contenido
        return (
          <Stack spacing={3}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
            >
              Contenido detallado*
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Describe completamente la experiencia, qué incluye, horarios, etc.
            </Typography>
            <Box
              sx={{
                "& .ql-editor": {
                  minHeight: isMobile ? "200px" : "300px",
                  fontSize: isMobile ? "14px" : "16px",
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
          <Stack spacing={3}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
            >
              Ubicación*
            </Typography>
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
          <Stack spacing={3}>
            <ExperienceTypeSelect
              categories={categories}
              setCategories={setCategories}
              isExperienceDataLoaded={!isLoading}
            />

            <GeneralTags
              selectedGeneralTags={selectedGeneralTags}
              setSelectedGeneralTags={setSelectedGeneralTags}
            />

            {categories === "Atractivos" && (
              <AtractionTags
                selectedAttractionTags={selectedAttractionTags}
                setSelectedAttractionTags={setSelectedAttractionTags}
              />
            )}
            {categories === "Restaurantes" && (
              <RestaurantTags
                selectedRestaurantTags={selectedRestaurantTags}
                setSelectedRestaurantTags={setSelectedRestaurantTags}
              />
            )}
            {categories === "Hoteles" && (
              <HotelTags
                selectedHotelTags={selectedHotelTags}
                setSelectedHotelTags={setSelectedHotelTags}
              />
            )}
          </Stack>
        );

      case 4: // Contacto
        return (
          <Card
            elevation={isMobile ? 1 : 2}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: "16px",
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
            >
              Información de contacto
            </Typography>
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Teléfono
                </Typography>
                <PhoneInput
                  country={"jp"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{
                    width: "100%",
                    height: isMobile ? "48px" : "56px",
                    borderRadius: "12px",
                    border: `1.5px solid ${theme.palette.divider}`,
                    fontSize: isMobile ? "14px" : "16px",
                    paddingLeft: "48px",
                  }}
                  placeholder="Teléfono"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Correo electrónico
                </Typography>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="correo@ejemplo.com"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Dirección
                </Typography>
                <TextField
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  placeholder="Dirección completa"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Sitio Web
                </Typography>
                <TextField
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  fullWidth
                  placeholder="https://ejemplo.com"
                  size={isMobile ? "medium" : "large"}
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
                      borderRadius: "12px",
                      fontSize: isMobile ? "14px" : "16px",
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
                    <Clock size={20} color={theme.palette.primary.main} />
                    <Typography variant="subtitle1">
                      Horarios de atención
                    </Typography>
                  </Stack>

                  <TextField
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    fullWidth
                    multiline
                    rows={isMobile ? 2 : 3}
                    placeholder="Ejemplo: lunes: 9:00–17:00 martes: 9:00–17:00 miércoles: Cerrado..."
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: isMobile ? "14px" : "16px",
                      },
                    }}
                  />

                  {/* Schedule Helper Buttons */}
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    {categories && (
                      <Button
                        onClick={handleUseDefaultSchedule}
                        variant="outlined"
                        size="small"
                        startIcon={<Clock size={16} />}
                        sx={{
                          borderRadius: "20px",
                          textTransform: "none",
                          fontSize: isMobile ? "0.75rem" : "0.8rem",
                          flexShrink: 0,
                        }}
                      >
                        Usar horario típico de {categories}
                      </Button>
                    )}

                    <Button
                      onClick={() => setSchedule("")}
                      variant="text"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: isMobile ? "0.75rem" : "0.8rem",
                        flexShrink: 0,
                      }}
                    >
                      Limpiar
                    </Button>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: isMobile ? "0.75rem" : "0.875rem" }}
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
          <Stack spacing={3}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
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
                        height: isMobile ? "200px" : "300px",
                        objectFit: "cover",
                        borderRadius: "16px",
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
                          top: 8,
                          left: 8,
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
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
                      height: isMobile ? "200px" : "300px",
                      border: `2px dashed ${theme.palette.primary.main}`,
                      borderRadius: "16px",
                      backgroundColor: theme.palette.background.paper,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ImageUp
                      size={isMobile ? 32 : 40}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant={isMobile ? "body2" : "body1"}>
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
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={1}
              sx={{ flexWrap: "wrap" }}
            >
              {(photo || initialPhoto || useDefaultImage) && (
                <Button
                  onClick={handleDeleteImage}
                  variant="outlined"
                  color="error"
                  size={isMobile ? "medium" : "small"}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: isMobile ? "0.8rem" : "0.875rem",
                  }}
                  startIcon={<Trash2 size={16} />}
                >
                  Eliminar imagen
                </Button>
              )}

              {!useDefaultImage && categories && (
                <Button
                  onClick={handleUseDefaultImage}
                  variant="outlined"
                  color="primary"
                  size={isMobile ? "medium" : "small"}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: isMobile ? "0.8rem" : "0.875rem",
                  }}
                  startIcon={<Image size={16} />}
                >
                  Usar imagen por defecto ({categories})
                </Button>
              )}

              <Button
                component="label"
                htmlFor="experiencePicture"
                variant="contained"
                size={isMobile ? "medium" : "small"}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: isMobile ? "0.8rem" : "0.875rem",
                }}
                startIcon={<ImageUp size={16} />}
              >
                {photo || initialPhoto ? "Cambiar imagen" : "Subir imagen"}
              </Button>
            </Stack>

            {/* Help Text */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
            >
              {useDefaultImage
                ? `Usando imagen por defecto para ${categories}`
                : "Sube una imagen personalizada o usa una imagen por defecto"}
            </Typography>
          </Stack>
        );

      case 6: // Revisión
        return (
          <Stack spacing={3}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="medium"
              gutterBottom
            >
              Revisar Experiencia
            </Typography>
            <Paper
              elevation={isMobile ? 1 : 2}
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: "16px",
              }}
            >
              {/* Image Preview in Review */}
              {getCurrentImageSrc() && (
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <img
                    src={getCurrentImageSrc()}
                    alt={title || "Experiencia"}
                    style={{
                      width: "100%",
                      maxWidth: isMobile ? "100%" : "400px",
                      height: isMobile ? "200px" : "250px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  {useDefaultImage && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                      }}
                    >
                      Imagen por defecto para {categories}
                    </Typography>
                  )}
                </Box>
              )}

              <Typography
                variant={isMobile ? "h6" : "h5"}
                color="primary"
                gutterBottom
                sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
              >
                {title || "Sin título"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                paragraph
                sx={{ fontSize: isMobile ? "0.85rem" : "0.875rem" }}
              >
                {caption || "Sin descripción"}
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                  >
                    <strong>Categoría:</strong>{" "}
                    {categories || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                  >
                    <strong>Región:</strong> {region || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                  >
                    <strong>Prefectura:</strong>{" "}
                    {prefecture || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                  >
                    <strong>Precio:</strong> ¥{price || 0}
                  </Typography>
                </Grid>
                {phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                    >
                      <strong>Teléfono:</strong> {phone}
                    </Typography>
                  </Grid>
                )}
                {email && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
                    >
                      <strong>Email:</strong> {email}
                    </Typography>
                  </Grid>
                )}
                {schedule && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
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
          padding: isMobile ? "20px 16px" : "40px 24px",
          width: "100%",
          borderRadius: isMobile
            ? "0rem 0rem 2rem 2rem"
            : "0rem 0rem 5rem 5rem",
          marginTop: "-25px",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          textAlign="center"
          sx={{
            fontSize: isMobile ? "1.75rem" : "3rem",
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
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 4,
        }}
      >
        {/* Stepper Container */}
        <Paper
          elevation={isMobile ? 1 : 3}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: "20px",
            mb: 2,
          }}
        >
          {/* Responsive Stepper */}
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
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepIcon-root": {
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                    },
                  }}
                >
                  {isMobile ? label.split(" ")[0] : label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box
            sx={{
              mt: isMobile ? 2 : 4,
              minHeight: isMobile ? "300px" : "400px",
            }}
          >
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              mt: isMobile ? 3 : 4,
              gap: isMobile ? 2 : 0,
            }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={!isMobile && <ArrowLeft size={20} />}
              variant="outlined"
              size={isMobile ? "large" : "medium"}
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                px: isMobile ? 3 : 4,
                py: isMobile ? 1.5 : 1,
                fontSize: isMobile ? "1rem" : "0.875rem",
                minWidth: isMobile ? "100%" : "auto",
                order: isMobile ? 2 : 1,
              }}
            >
              {isMobile && <ArrowLeft size={20} style={{ marginRight: 8 }} />}
              Anterior
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={
                  isEditing ? handleUpdateExperience : handleCreateExperience
                }
                variant="contained"
                disabled={mutation.isLoading}
                size={isMobile ? "large" : "medium"}
                sx={{
                  px: isMobile ? 3 : 6,
                  py: isMobile ? 1.5 : 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontSize: isMobile ? "1rem" : "0.875rem",
                  fontWeight: "bold",
                  minWidth: isMobile ? "100%" : "auto",
                  order: isMobile ? 1 : 2,
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
                size={isMobile ? "large" : "medium"}
                sx={{
                  borderRadius: "30px",
                  textTransform: "none",
                  px: isMobile ? 3 : 4,
                  py: isMobile ? 1.5 : 1,
                  fontSize: isMobile ? "1rem" : "0.875rem",
                  fontWeight: "bold",
                  minWidth: isMobile ? "100%" : "auto",
                  order: isMobile ? 1 : 2,
                }}
                endIcon={!isMobile && <ArrowRight size={20} />}
              >
                Siguiente
                {isMobile && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </LoadScript>
  );
};

export default ExperienceForm;

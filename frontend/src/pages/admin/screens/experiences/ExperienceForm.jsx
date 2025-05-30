import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { ImageUp, Trash2, Earth, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useTheme,
  Grid,
  Paper,
} from "@mui/material";
import useUser from "../../../../hooks/useUser";
import { stables } from "../../../../constants";
import ErrorMessage from "../../../../components/ErrorMessage";
import HotelTags from "./tags/HotelTags";
import RestaurantTags from "./tags/RestaurantTags";
import AtractionTags from "./tags/AtractionTags";
import GeneralTags from "./tags/GeneralTags";
import {
  extractPlaceId,
  getGooglePlaceDetails,
  fetchPlaceDetails,
} from "../../../../services/index/map";

const ExperienceForm = () => {
  const theme = useTheme();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [autocomplete, setAutocomplete] = useState(null);
  const [placeId, setPlaceId] = useState("");
  const { jwt } = useUser();
  const isEditing = Boolean(slug);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState({
    type: "Point",
    coordinates: [],
  });

  // All your existing state variables...
  const [experienceSlug, setExperienceSlug] = useState("");
  const [caption, setCaption] = useState("");
  const [approved, setApproved] = useState(false);
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
    "Contacto",
    "Categorías",
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

  // All your existing functions (handleTitleChange, handleFileChange, etc.)
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
  };

  const handleDeleteImage = () => {
    if (window.confirm("¿Quieres eliminar la foto de tu publicación?")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  // Your existing query and mutation logic...
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
      setTags(data.tags || []);
      setBody(data.body || "");
      setCaption(data.caption || "");
      setApproved(data.approved || false);
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

      if (place.place_id) setPlaceId(place.place_id);
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
    if (photo) formData.append("experiencePicture", photo);

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
          <Box sx={{ space: 3 }}>
            {/* Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Imagen de la Experiencia
              </Typography>
              <Box display="flex" alignItems="center" gap="2rem">
                <label
                  htmlFor="experiencePicture"
                  style={{ cursor: "pointer" }}
                >
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={title}
                      style={{ width: "200px", borderRadius: "12px" }}
                    />
                  ) : initialPhoto ? (
                    <img
                      src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                      alt={title}
                      style={{ width: "200px", borderRadius: "12px" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "200px",
                        height: "150px",
                        border: `2px dashed ${theme.palette.primary.main}`,
                        borderRadius: "12px",
                        backgroundColor: theme.palette.background.paper,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ImageUp size={40} color={theme.palette.primary.main} />
                      <Typography>Subir Imagen</Typography>
                    </Box>
                  )}
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="experiencePicture"
                  onChange={handleFileChange}
                />
                {(photo || initialPhoto) && (
                  <Button
                    onClick={handleDeleteImage}
                    variant="outlined"
                    color="error"
                    sx={{ borderRadius: "30rem", textTransform: "none" }}
                    startIcon={<Trash2 size={16} />}
                  >
                    Borrar imagen
                  </Button>
                )}
              </Box>
            </Box>

            {/* Google Places Search */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Earth style={{ verticalAlign: "middle", marginRight: 8 }} />
                Buscar Lugar
              </Typography>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
              </Autocomplete>
            </Box>

            {/* Title */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Título*
              </Typography>
              <TextField
                value={title}
                onChange={handleTitleChange}
                fullWidth
                required
                placeholder="Título de la experiencia..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Box>

            {/* Caption */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Descripción Breve*
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
                rows={4}
                placeholder="Escribe la descripción aquí..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Box>
          </Box>
        );

      case 1: // Contenido
        return (
          <Box sx={{ space: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contenido Detallado*
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Describe completamente la experiencia, qué incluye, horarios, etc.
            </Typography>
            <Editor
              content={body}
              editable={true}
              onDataChange={(data) => setBody(data)}
            />
            <Box sx={{ mt: 3 }}>
              <PriceInput price={price} setPrice={setPrice} />
            </Box>
          </Box>
        );

      case 2: // Ubicación
        return (
          <Box sx={{ space: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ubicación*
            </Typography>
            <RegionPrefectureSelect
              region={region}
              setRegion={setRegion}
              prefecture={prefecture}
              setPrefecture={setPrefecture}
            />
          </Box>
        );

      case 3: // Contacto
        return (
          <Card elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Contacto
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Teléfono
                </Typography>
                <PhoneInput
                  country={"jp"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{
                    width: "100%",
                    height: "56px",
                    borderRadius: "10px",
                    border: `1.5px solid ${theme.palette.divider}`,
                    fontSize: "16px",
                    paddingLeft: "48px",
                  }}
                  placeholder="Teléfono"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Correo Electrónico
                </Typography>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="correo@ejemplo.com"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
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
                      borderRadius: "10px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        );

      case 4: // Categorías
        return (
          <Box sx={{ space: 3 }}>
            <ExperienceTypeSelect
              categories={categories}
              setCategories={setCategories}
              isExperienceDataLoaded={!isLoading}
            />

            <Box sx={{ mt: 3 }}>
              <GeneralTags
                selectedGeneralTags={selectedGeneralTags}
                setSelectedGeneralTags={setSelectedGeneralTags}
              />
            </Box>

            {categories === "Atractivos" && (
              <Box sx={{ mt: 3 }}>
                <AtractionTags
                  selectedAttractionTags={selectedAttractionTags}
                  setSelectedAttractionTags={setSelectedAttractionTags}
                />
              </Box>
            )}
            {categories === "Restaurantes" && (
              <Box sx={{ mt: 3 }}>
                <RestaurantTags
                  selectedRestaurantTags={selectedRestaurantTags}
                  setSelectedRestaurantTags={setSelectedRestaurantTags}
                />
              </Box>
            )}
            {categories === "Hoteles" && (
              <Box sx={{ mt: 3 }}>
                <HotelTags
                  selectedHotelTags={selectedHotelTags}
                  setSelectedHotelTags={setSelectedHotelTags}
                />
              </Box>
            )}
          </Box>
        );

      case 5: // Revisión
        return (
          <Box sx={{ space: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revisar Experiencia
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {title || "Sin título"}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {caption || "Sin descripción"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Categoría:</strong>{" "}
                    {categories || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Región:</strong> {region || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Prefectura:</strong>{" "}
                    {prefecture || "No seleccionada"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Precio:</strong> ¥{price || 0}
                  </Typography>
                </Grid>
                {phone && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Teléfono:</strong> {phone}
                    </Typography>
                  </Grid>
                )}
                {email && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {email}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
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
      <Box
        sx={{
          background: theme.palette.secondary.light,
          padding: "30px",
          width: "100%",
          borderRadius: "0rem 0rem 5rem 5rem",
          marginTop: "-25px",
        }}
      >
        <Typography variant="h2" textAlign="center">
          {isEditing ? "Editar" : "Crear"} Experiencia
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "900px", margin: "0 auto", p: 3 }}>
        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowLeft />}
              variant="outlined"
              sx={{ borderRadius: "30rem", textTransform: "none" }}
            >
              Anterior
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={
                  isEditing ? handleUpdateExperience : handleCreateExperience
                }
                variant="contained"
                disabled={mutation.isLoading}
                sx={{ px: 4 }}
              >
                {mutation.isLoading
                  ? "Procesando..."
                  : isEditing
                  ? "Actualizar Experiencia"
                  : "Crear Experiencia"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{ borderRadius: "30rem", textTransform: "none" }}
                endIcon={<ArrowRight />}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </LoadScript>
  );
};

export default ExperienceForm;

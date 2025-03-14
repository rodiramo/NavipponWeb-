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
import { ImageUp, Trash2 } from "lucide-react";
import {
  Button,
  Field,
  TextField,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";

import useUser from "../../../../hooks/useUser";
import { stables } from "../../../../constants";
import ErrorMessage from "../../../../components/ErrorMessage";
import HotelTags from "./tags/HotelTags";
import RestaurantTags from "./tags/RestaurantTags";
import AtractionTags from "./tags/AtractionTags";
import GeneralTags from "./tags/GeneralTags";
// Import the service function
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
  const googleToCustomMapping = {
    Tokyo: { region: "Kanto", prefecture: "Tokyo" },
    Yokohama: { region: "Kanto", prefecture: "Kanagawa" },
    Osaka: { region: "Kansai", prefecture: "Osaka" },
    Kyoto: { region: "Kansai", prefecture: "Kyoto" },
    Kobe: { region: "Kansai", prefecture: "Hyogo" },
    Nagoya: { region: "Chubu", prefecture: "Aichi" },
    Sapporo: { region: "Hokkaido", prefecture: "Hokkaido" },
    Sendai: { region: "Tohoku", prefecture: "Miyagi" },
    Hiroshima: { region: "Chugoku", prefecture: "Hiroshima" },
    Fukuoka: { region: "Kyushu", prefecture: "Fukuoka" },
    Kumamoto: { region: "Kyushu", prefecture: "Kumamoto" },
    Kitakyushu: { region: "Kyushu", prefecture: "Fukuoka" },
    Chiba: { region: "Kanto", prefecture: "Chiba" },
    Saitama: { region: "Kanto", prefecture: "Saitama" },
    Ibaraki: { region: "Kanto", prefecture: "Ibaraki" },
    Tochigi: { region: "Kanto", prefecture: "Tochigi" },
    Gunma: { region: "Kanto", prefecture: "Gunma" },
    Niigata: { region: "Chubu", prefecture: "Niigata" },
    Shizuoka: { region: "Chubu", prefecture: "Shizuoka" },
    Gifu: { region: "Chubu", prefecture: "Gifu" },
    Mie: { region: "Chubu", prefecture: "Mie" },
    Nara: { region: "Kansai", prefecture: "Nara" },
    Wakayama: { region: "Kansai", prefecture: "Wakayama" },
    Okayama: { region: "Chugoku", prefecture: "Okayama" },
    Yamaguchi: { region: "Chugoku", prefecture: "Yamaguchi" },
    Oita: { region: "Kyushu", prefecture: "Oita" },
    Miyazaki: { region: "Kyushu", prefecture: "Miyazaki" },
    Kagoshima: { region: "Kyushu", prefecture: "Kagoshima" },
    // Add any additional mappings as needed...
  };

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

  // Extract coordinates from the map URL
  const extractCoordinates = (mapUrl) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapUrl.match(regex);
    if (match) {
      // GeoJSON expects [longitude, latitude]
      return [parseFloat(match[2]), parseFloat(match[1])];
    }
    return null;
  };

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

  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    let generatedSlug = titleValue.trim().replace(/\s+/g, "-").toLowerCase();

    // Ensure uniqueness by appending a timestamp
    let uniqueSlug = `${generatedSlug}-${Date.now()}`;

    setTitle(titleValue);
    setExperienceSlug(uniqueSlug);
  };

  const [formData, setFormData] = useState(() => ({
    title: isEditing ? "" : "Nueva Experiencia",
    categories: isEditing ? "" : "Atractivos",
    caption: "",
    region: "",
    price: 0,
    tags: [],
    body: "",
    photo: isEditing ? initialPhoto || null : null,
  }));

  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    enabled: isEditing, // ✅ Only runs when editing
    retry: false, // ✅ Prevent infinite retry loops
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

  const mutation = useMutation({
    mutationFn: ({ updatedData, experienceData, slug, token }) =>
      isEditing
        ? updateExperience({ updatedData, slug, token })
        : createExperience({ experienceData, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["experience", slug]);
      toast.success(`Experiencia ${isEditing ? "actualizada" : "creada"}`);
      navigate(`/admin/experiences/manage/edit/${data.slug}`, {
        replace: true,
      });
    },
    onError: (error) => toast.error(error.message),
  });

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

  let isExperienceDataLoaded = !isLoading && !isError;

  const handleMapBlur = async (e) => {
    const url = e.target.value;
    setMap(url);

    // Attempt to extract a Place ID from the URL
    const placeId = extractPlaceId(url);
    if (placeId) {
      const placeDetails = await getGooglePlaceDetails(placeId);
      if (placeDetails) {
        setTitle(placeDetails.name);
        setAddress(placeDetails.formatted_address);
        setPhone(placeDetails.formatted_phone_number || "");
        setWebsite(placeDetails.website || "");
        setPrice(placeDetails.price !== null ? placeDetails.price : 0);

        const mapping = googleToCustomMapping[placeDetails.region];
        if (mapping) {
          setRegion(mapping.region);
          setPrefecture(mapping.prefecture);
        } else {
          setRegion(placeDetails.region);
          setPrefecture(placeDetails.prefecture);
        }
      } else {
        console.error("No place details found for the provided Place ID.");
      }
    } else {
      // Inform the user that a valid Place ID could not be extracted
      console.error("The URL does not contain a valid Place ID.");
    }
  };

  const handleCreateExperience = async () => {
    if (!title || !caption || !categories || !region) {
      return toast.error("Todos los campos son obligatorios");
    }

    const formData = new FormData();

    if (photo) {
      formData.append("experiencePicture", photo);
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
    // If you're not using a separate map field, you can omit it
    formData.append("address", address);

    // Append the location directly from state (if available)
    if (location && location.coordinates && location.coordinates.length === 2) {
      formData.append("location", JSON.stringify(location));
    }

    // (Optional) Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`✅ FormData Key: ${key}, Value:`, value);
    }

    mutation.mutate({
      experienceData: formData,
      token: jwt,
    });
  };

  const handleUpdateExperience = async () => {
    if (!title || !caption || !categories || !region) {
      return toast.error("Todos los campos son obligatorios");
    }

    const formData = new FormData();

    if (photo) {
      formData.append("experiencePicture", photo);
    }

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

    console.log("📤 Updating Experience Data:", experienceData);

    formData.append("document", JSON.stringify(experienceData));

    mutation.mutate({
      updatedData: formData,
      slug,
      token: jwt,
    });
  };
  const handleOnLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);

      if (place.place_id) {
        setPlaceId(place.place_id);
      }
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
      if (place.name) {
        setTitle(place.name);
      }
      if (place.formatted_phone_number) {
        setPhone(place.formatted_phone_number);
      }
      if (place.website) {
        setWebsite(place.website);
      }
      if (typeof place.price_level !== "undefined") {
        setPrice(place.price_level);
      }
      // Extract prefecture from address components
      let extractedPrefecture = "";
      if (place.address_components) {
        place.address_components.forEach((component) => {
          if (component.types.includes("administrative_area_level_1")) {
            extractedPrefecture = component.long_name;
          }
        });
      }
      setPrefecture(extractedPrefecture);
      if (extractedPrefecture && googleToCustomMapping[extractedPrefecture]) {
        setRegion(googleToCustomMapping[extractedPrefecture].region);
      } else {
        setRegion("");
      }

      // Extract latitude and longitude and update location state
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log("Latitude:", lat, "Longitude:", lng);
        setLocation({
          type: "Point",
          coordinates: [lng, lat], // GeoJSON expects [longitude, latitude]
        });
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  if (isLoading) return <ExperienceDetailSkeleton />;
  if (isError) return <ErrorMessage message="Error cargando los datos." />;

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={["places"]}
      width="100%"
      language="es"
    >
      <Box
        sx={{
          background: theme.palette.secondary.light,
          padding: "30px",
          width: "100%",
          borderRadius: "0rem 0rem 5rem  5rem",
          overflowX: "hidden !important",
          marginTop: "-25px",
        }}
      >
        <Typography variant="h2" style={{ textAlign: "center" }}>
          {isEditing ? "Editar" : "Crear"} Experiencia
        </Typography>
      </Box>
      <article>
        <Box
          display="flex"
          alignItems="center"
          gap="2rem"
          marginTop={5}
          width="100%"
          marginBottom={5}
        >
          <label htmlFor="experiencePicture" className="w-50 cursor-pointer">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                alt={data?.title}
                style={{ width: "300px" }}
                className="rounded-xl"
              />
            ) : initialPhoto ? (
              <img
                src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                alt={data?.title}
                style={{ width: "300px" }}
                className="rounded-xl"
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  border: `2px dashed ${theme.palette.primary.main}`,
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
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
          </label>{" "}
          <input
            type="file"
            className="sr-only"
            id="experiencePicture"
            onChange={handleFileChange}
          />
          {/* 🛑 Only show delete button if there's an image */}
          {(photo || initialPhoto) && (
            <button
              type="button"
              onClick={handleDeleteImage}
              style={{
                border: `1px solid ${theme.palette.error.main}`,
                color: theme.palette.error.main,
              }}
              className="flex items-center gap-2 text-sm rounded-full px-4 py-2 shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <Trash2 size={16} /> {/* Lucide React Trash Icon */}
              Borrar imagen
            </button>
          )}
        </Box>{" "}
        {/* Autocomplete Input */}
        <div>
          <Typography variant="subtitle1">Lugar</Typography>
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
            <input
              id="autocomplete-input"
              type="text"
              placeholder="Ingresa el lugar..."
              style={{
                bgcolor: "white",
                width: "100%",
                padding: "1rem",
                borderRadius: "10px",
                border: `2px solid ${theme.palette.secondary.light}`,
                transition: "none",
                "&:hover": {
                  backgroundColor: "white",
                  border: `2px solid ${theme.palette.secondary.light}`,
                },
              }}
            />
          </Autocomplete>
        </div>
        <div className="d-form-control w-full" style={{ marginTop: "0.5rem" }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Título*
          </Typography>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            placeholder="Título..."
            sx={{
              bgcolor: "white",
              borderRadius: "10px", // ✅ Ensures rounded corners
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                border: `2px solid ${theme.palette.secondary.light}`, // ✅ Custom border
                transition: "border-color 0.3s ease-in-out",
                "&:hover": {
                  borderColor: theme.palette.primary.main, // ✅ Hover effect
                },
                "&.Mui-focused": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // ✅ Removes default extra border
              },
            }}
          />
        </div>
        <div className="d-form-control w-full" style={{ marginTop: "0.5rem" }}>
          <Typography variant="subtitle1">Descripción breve*</Typography>
          <TextField
            placeholder="Escribe la descripción aquí..."
            variant="filled"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            sx={{
              bgcolor: "white",
              borderRadius: "10px",
              "& .MuiInputBase-root": {
                backgroundColor: "white",
                borderRadius: "10px",
                border: `2px solid ${theme.palette.secondary.light}`,
                transition: "none", // Remove hover transition
                "&:hover": {
                  backgroundColor: "white", // Prevents hover effect
                  border: `2px solid ${theme.palette.secondary.light}`, // Keeps border same
                },
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                "&:before, &:after": {
                  display: "none",
                },
                "&:hover": {
                  backgroundColor: "white", // Prevents background change on hover
                },
              },
            }}
          />
        </div>
        {/* Description */}
        <Typography variant="subtitle1" marginTop={3} marginBottom={1}>
          Contenido de la experiencia*
        </Typography>
        <Editor
          content={body}
          editable={true}
          onDataChange={(data) => setBody(data)}
        />{" "}
        <PriceInput price={price} setPrice={setPrice} />
        <Box
          sx={{
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: theme.palette.secondary.light,
            marginTop: "1rem",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              color: theme.palette.text.primary,
            }}
          >
            Información de Contacto
          </Typography>

          <Box>
            {/* Teléfono */}
            <div
              className="d-form-control w-full"
              style={{ marginBottom: "1rem" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
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
                  border: `1.5px solid ${theme.palette.secondary.light}`,
                  fontSize: "16px",
                  paddingLeft: "48px",
                  backgroundColor: "white",
                }}
                placeholder="Teléfono"
              />
            </div>

            {/* Correo Electrónico */}
            <div
              className="d-form-control w-full"
              style={{ marginBottom: "1rem" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
                Correo Electrónico
              </Typography>
              <TextField
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="Correo Electrónico"
                sx={{
                  bgcolor: "white",

                  borderRadius: "10px",
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                    border: `1.5px solid ${theme.palette.secondary.light}`,
                  },
                }}
              />
            </div>

            {/* Dirección */}
            <div
              className="d-form-control w-full"
              style={{ marginBottom: "1rem" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
                Dirección
              </Typography>
              <TextField
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                placeholder="Dirección"
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                    border: `1.5px solid ${theme.palette.secondary.light}`,
                  },
                }}
              />
            </div>

            {/* Sitio Web */}
            <div
              className="d-form-control w-full"
              style={{ marginBottom: "1rem" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
                Sitio Web
              </Typography>
              <TextField
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                fullWidth
                required
                placeholder="Ingrese el sitio web"
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
                  bgcolor: "white",
                  borderRadius: "10px",
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                    border: `1.5px solid ${theme.palette.secondary.light}`,
                  },
                }}
              />
            </div>
          </Box>
        </Box>
        <div className="d-form-control w-full" style={{ marginTop: "1rem" }}>
          <RegionPrefectureSelect
            region={region}
            setRegion={setRegion}
            prefecture={prefecture}
            setPrefecture={setPrefecture}
          />
        </div>
        <div className="mb-5 mt-2" style={{ marginTop: "1rem" }}>
          <ExperienceTypeSelect
            categories={categories}
            setCategories={setCategories}
            isExperienceDataLoaded={isExperienceDataLoaded}
          />
        </div>
        <div className="mb-5 mt-2">
          {isExperienceDataLoaded && (
            <GeneralTags
              selectedGeneralTags={selectedGeneralTags}
              setSelectedGeneralTags={setSelectedGeneralTags}
            />
          )}
        </div>
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
      </article>

      <div className="flex justify-end mt-6">
        <button
          onClick={isEditing ? handleUpdateExperience : handleCreateExperience}
          className="flex items-center justify-center gap-2 px-6 py-3 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light"
          style={{
            marginBottom: "4rem",
            backgroundColor: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.dark}`,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = theme.palette.primary.dark)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = theme.palette.primary.main)
          }
        >
          {isEditing ? "Actualizar Experiencia" : "Crear Experiencia"}
        </button>
      </div>
    </LoadScript>
  );
};

export default ExperienceForm;

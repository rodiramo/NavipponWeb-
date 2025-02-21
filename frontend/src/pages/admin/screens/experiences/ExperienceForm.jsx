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

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];

const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
    "Tokio",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Ibaraki",
    "Tochigi",
    "Gunma",
  ],
  Chubu: [
    "Aichi",
    "Shizuoka",
    "Gifu",
    "Nagano",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
  ],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: [
    "Fukuoka",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Saga",
  ],
};

const ExperienceForm = () => {
  const theme = useTheme();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
  const extractCoordinates = (mapUrl) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapUrl.match(regex);

    if (match) {
      return [parseFloat(match[2]), parseFloat(match[1])]; // GeoJSON format [longitude, latitude]
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

  const handleCreateExperience = async () => {
    if (!title || !caption || !categories || !region) {
      return toast.error("Todos los campos son obligatorios");
    }

    const coordinates = extractCoordinates(map);
    const locationData = coordinates ? { type: "Point", coordinates } : null;

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
    formData.append("map", map);
    formData.append("address", address);

    if (locationData) {
      formData.append("location", JSON.stringify(locationData));
    }

    console.log("📤 Creating Experience Data:");
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

  if (isLoading) return <ExperienceDetailSkeleton />;
  if (isError) return <ErrorMessage message="Error cargando los datos." />;

  console.log("Slug:", slug);
  console.log("Is Editing:", isEditing);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);
  console.log("Experience Data:", data);
  return (
    <div>
      <Box
        sx={{
          background: theme.palette.secondary.light,
          padding: "30px",
          borderRadius: "0rem 0rem 5rem  5rem",
          overflowX: "hidden !important",
          marginTop: "-25px",
        }}
      >
        <Typography variant="h2" style={{ textAlign: "center" }}>
          {isEditing ? "Editar" : "Crear"} Experiencia
        </Typography>
      </Box>
      <article className="flex-1">
        <Box
          display="flex"
          alignItems="center"
          gap="2rem"
          marginTop={5}
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
                  maxWidth: "100%",
                  border: `2px solid ${theme.palette.primary.main}`,
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
          </label>
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
        </Box>
        <div className="d-form-control w-full" style={{ marginTop: "0.5rem" }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Título
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
          <Typography variant="subtitle1">Descripción breve</Typography>
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
        <Typography variant="subtitle1">Contenido de la experiencia</Typography>
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
                country={"es"}
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

            {/* Google Maps URL */}
            <div className="d-form-control w-full">
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
              >
                Link de Google Maps
              </Typography>
              <TextField
                value={map}
                placeholder="Ingrese el URL de Google Maps"
                onChange={(e) => setMap(e.target.value)}
                onBlur={(e) => {
                  const url = e.target.value;
                  const coordinates = extractCoordinates(url);
                  if (coordinates) {
                    setLocation({
                      type: "Point",
                      coordinates: coordinates,
                    });
                    console.log("📍 Coordenadas extraídas:", coordinates);
                  }
                }}
                fullWidth
                required
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
    </div>
  );
};

export default ExperienceForm;

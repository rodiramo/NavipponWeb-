import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getSingleExperience,
  updateExperience,
  createExperience,
} from "../../../../services/index/experiences";
import ExperienceDetailSkeleton from "../../../experienceDetail/components/ExperienceDetailSkeleton";

import { Button, TextField, Box, Typography, Chip } from "@mui/material";

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
  const [experienceSlug, setExperienceSlug] = useState(slug);
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
  const handleSubmit = async () => {
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
    formData.append("map", map);
    formData.append("address", address);

    console.log("📤 Final Data Sent to Backend:");
    for (let [key, value] of formData.entries()) {
      console.log(`✅ FormData Key: ${key}, Value:`, value);
    }

    mutation.mutate({
      ...(slug
        ? { updatedData: formData, slug, token: jwt }
        : { experienceData: formData, token: jwt }),
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
      <h2>{isEditing ? "Editar" : "Crear"} Experiencia</h2>
      <article className="flex-1">
        <div className="flex items-center justify-center w-full mb-4">
          <label className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Aprobado</span>
            <input
              type="checkbox"
              id="approved"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="form-checkbox h-6 w-6 text-green-500"
            />
          </label>
        </div>
        <label htmlFor="experiencePicture" className="w-full cursor-pointer">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt={data?.title}
              className="rounded-xl w-full"
            />
          ) : initialPhoto ? (
            <img
              src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
              alt={data?.title}
              className="rounded-xl w-full"
            />
          ) : (
            <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
              picture
            </div>
          )}
        </label>
        <input
          type="file"
          className="sr-only"
          id="experiencePicture"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleDeleteImage}
          className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
        >
          Borrar imagen
        </button>
        <div className="mt-4 flex gap-2">
          <Link
            to={`/experience?category=${categories}`}
            className="text-primary text-sm font-roboto inline-block md:text-base"
          >
            {categories}
          </Link>
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="title">
            <span className="d-label-text">Título</span>
          </label>
          <input
            id="title"
            value={title}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="caption">
            <span className="d-label-text">Extracto</span>
          </label>
          <input
            id="caption"
            value={caption}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setCaption(e.target.value)}
            placeholder="extracto"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="slug">
            <span className="d-label-text">
              Título de navegación único (slug){" "}
            </span>
          </label>
          <input
            id="slug"
            value={experienceSlug}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) =>
              setExperienceSlug(
                e.target.value.replace(/\s+/g, "-").toLowerCase()
              )
            }
            placeholder="experience slug"
          />
        </div>
        {/* Description */}
        <Typography variant="subtitle1">Descripción</Typography>
        <TextField
          placeholder="Escribe la descripción aquí..."
          variant="filled"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
          sx={{
            bgcolor: "white",
            borderRadius: "2rem",
            "& .MuiInputBase-root": {
              borderRadius: "2rem",
            },
            "& .MuiFilledInput-root": {
              backgroundColor: "white",
              "&:before, &:after": {
                display: "none", // Removes the default underline
              },
            },
          }}
        />
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="phone">
            <span className="d-label-text">Teléfono</span>
          </label>
          <input
            id="phone"
            value={phone}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="email">
            <span className="d-label-text">Correo Electrónico</span>
          </label>
          <input
            id="email"
            value={email}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="website">
            <span className="d-label-text">Sitio Web</span>
          </label>
          <input
            id="website"
            value={website}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Sitio Web"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="schedule">
            <span className="d-label-text">Horario</span>
          </label>
          <input
            id="schedule"
            value={schedule}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Horario"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="map">
            <span className="d-label-text">Mapa</span>
          </label>
          <input
            id="map"
            value={map}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setMap(e.target.value)}
            placeholder="Goolge Maps URL"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="address">
            <span className="d-label-text">Dirección</span>
          </label>
          <input
            id="address"
            value={address}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dirección"
          />
        </div>

        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="region">
            <span className="d-label-text">Región</span>
          </label>
          <select
            id="region"
            value={region}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Selecciona una región</option>
            {Object.keys(regions).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="prefecture">
            <span className="d-label-text">Prefectura</span>
          </label>
          <select
            id="prefecture"
            value={prefecture}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setPrefecture(e.target.value)}
            disabled={!region}
          >
            <option value="">Selecciona una prefectura</option>
            {region &&
              regions[region].map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
          </select>
        </div>

        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="price">
            <span className="d-label-text">Precio</span>
          </label>
          <input
            id="price"
            type="number"
            value={price}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="Precio"
          />
        </div>

        <div className="mb-5 mt-2">
          <label className="d-label">
            <span className="d-label-text">Categorías</span>
          </label>
          {isExperienceDataLoaded && (
            <select
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            >
              {categoriesEnum.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-5 mt-2">
          <label className="d-label">
            <span className="d-label-text">Filtros Generales</span>
          </label>
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
      <button onClick={handleSubmit}>
        {isEditing ? "Actualizar" : "Crear"}
      </button>
    </div>
  );
};

export default ExperienceForm;

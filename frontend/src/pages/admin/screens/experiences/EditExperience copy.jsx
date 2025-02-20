import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getSingleExperience,
  updateExperience,
} from "../../../../services/index/experiences";
import { Link, useParams, useNavigate } from "react-router-dom";
import ExperienceDetailSkeleton from "../../../experienceDetail/components/ExperienceDetailSkeleton";
import ErrorMessage from "../../../../components/ErrorMessage";
import { stables } from "../../../../constants";
import { HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import {
  MdOutlineForest,
  MdOutlineBeachAccess,
  MdOutlineRamenDining,
  MdOutlineCoffee,
  MdOutlineShoppingBag,
  MdOutlineTempleBuddhist,
  MdOutlineTempleHindu,
  MdOutlineHotTub,
  MdOutlineCastle,
  MdOutlineSpa,
  MdFreeBreakfast,
  MdAirportShuttle,
} from "react-icons/md";
import { TbBuildingMonument, TbTorii } from "react-icons/tb";
import { LiaCocktailSolid, LiaGamepadSolid } from "react-icons/lia";
import {
  GiGreekTemple,
  GiPartyPopper,
  GiSamuraiHelmet,
  GiGrapes,
  GiBed,
} from "react-icons/gi";
import {
  FaRegStar,
  FaWifi,
  FaUtensils,
  FaDog,
  FaLeaf,
  FaFish,
  FaChild,
  FaHotel,
  FaCapsules,
  FaBuilding,
  FaHome,
  FaSwimmer,
  FaParking,
  FaDumbbell,
  FaWheelchair,
  FaHeart,
  FaBriefcase,
  FaHiking,
  FaMountain,
} from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { VscOctoface } from "react-icons/vsc";
import { LuFerrisWheel } from "react-icons/lu";
import { PiBirdBold, PiCross } from "react-icons/pi";

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

const generalTags = {
  season: ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"],
  budget: ["Gratis", "Económico", "Moderado", "Lujo"],
  rating: [1, 2, 3, 4, 5],
  location: [
    "Cerca de estaciones de tren o metro",
    "Cerca de aeropuertos",
    "Cerca de áreas de puntos de interés",
  ],
};

const attractionTags = [
  { icon: <MdOutlineForest />, title: "Naturaleza" },
  { icon: <MdOutlineBeachAccess />, title: "Playa" },
  { icon: <TbBuildingMonument />, title: "Monumento" },
  { icon: <MdOutlineRamenDining />, title: "Gastronomía" },
  { icon: <LiaCocktailSolid />, title: "Noche" },
  { icon: <GiGreekTemple />, title: "Museo" },
  { icon: <MdOutlineCoffee />, title: "Cafés" },
  { icon: <MdOutlineShoppingBag />, title: "Shopping" },
  { icon: <FaRegStar />, title: "Ocio" },
  { icon: <GiPartyPopper />, title: "Festival" },
  { icon: <BsRobot />, title: "Tecnología" },
  { icon: <LiaGamepadSolid />, title: "Juegos" },
  { icon: <VscOctoface />, title: "Anime" },
  { icon: <LuFerrisWheel />, title: "Parques temáticos" },
  { icon: <GiSamuraiHelmet />, title: "Samurai" },
  { icon: <MdOutlineTempleBuddhist />, title: "Templo Budista" },
  { icon: <PiBirdBold />, title: "Reserva de Aves" },
  { icon: <MdOutlineCastle />, title: "Castillos" },
  { icon: <PiCross />, title: "Templo Cristiano" },
  { icon: <TbTorii />, title: "Templo Sintoísta" },
  { icon: <MdOutlineTempleHindu />, title: "Templo Hindú" },
  { icon: <MdOutlineHotTub />, title: "Aguas Termales" },
  { icon: <GiGrapes />, title: "Viñedos" },
];

const restaurantTypes = [
  "Restaurantes tradicionales",
  "Cadenas de comida rápida",
  "Cafeterías y cafés",
  "Restaurantes de alta cocina",
  "Food trucks",
  "Ramen",
  "Sushi",
];
const cuisines = [
  "Cocina japonesa tradicional",
  "Internacional",
  "Fusión",
  "Cocina vegetariana/vegana",
  "Cocina sin gluten",
  "Cocina halal",
  "Cocina kosher",
  "Rápida",
  "Cocina de autor",
  "Con espectáculo",
  "Familiar",
  "Romántica",
  "Negocios",
  "Ocasiones especiales",
];
const restaurantServices = [
  { icon: <FaWifi />, label: "Wi-Fi gratis" },
  { icon: <FaUtensils />, label: "Menú en inglés" },
  { icon: <FaUtensils />, label: "Reservas en línea" },
  { icon: <FaUtensils />, label: "Entregas a domicilio" },
  { icon: <FaUtensils />, label: "Terraza o comedor al aire libre" },
  { icon: <FaUtensils />, label: "Opciones de comida para llevar" },
  { icon: <FaDog />, label: "Admite mascotas" },
  { icon: <FaLeaf />, label: "Ingredientes orgánicos" },
  { icon: <FaFish />, label: "Mariscos frescos" },
  { icon: <FaChild />, label: "Menús infantiles" },
];

const accommodation = [
  { icon: <FaHotel />, label: "Hoteles de lujo" },
  { icon: <MdOutlineSpa />, label: "Ryokan (tradicional)" },
  { icon: <FaCapsules />, label: "Hoteles cápsula" },
  { icon: <FaBuilding />, label: "Hoteles de negocios" },
  { icon: <FaHome />, label: "Apartamentos" },
  { icon: <GiBed />, label: "Hostales" },
];

const hotelServices = [
  { icon: <FaWifi />, label: "Wi-Fi gratis" },
  { icon: <MdFreeBreakfast />, label: "Desayuno incluido" },
  { icon: <FaParking />, label: "Aparcamiento gratuito" },
  { icon: <MdAirportShuttle />, label: "Transporte al aeropuerto" },
  { icon: <FaSwimmer />, label: "Piscina" },
  { icon: <FaDumbbell />, label: "Gimnasio" },
  { icon: <FaUtensils />, label: "Restaurante en el hotel" },
  { icon: <FaWheelchair />, label: "Accesible" },
  { icon: <FaDog />, label: "Admite mascotas" },
];

const typeTrip = [
  { icon: <FaChild />, label: "Familiar" },
  { icon: <FaHeart />, label: "Luna de miel" },
  { icon: <FaBriefcase />, label: "De negocios" },
  { icon: <FaHiking />, label: "Amigable para mochileros" },
  { icon: <FaMountain />, label: "Para aventureros" },
];

const EditExperience = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, jwt } = useUser();
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

  const tagLabels = {
    season: "Temporada",
    budget: "Presupuesto",
    rating: "Calificación",
    location: "Ubicación",
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleExperience({ slug }),
    queryKey: ["experience", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories);
      setTitle(data.title);
      setTags(data.tags);
      setBody(data.body);
      setCaption(data.caption);
      setApproved(data.approved);
      setRegion(data.region);
      setPrefecture(data.prefecture);
      setPrice(data.price);
      setPhone(data.phone);
      setEmail(data.email);
      setWebsite(data.website);
      setSchedule(data.schedule);
      setMap(data.map);
      setAddress(data.address);
      setSelectedGeneralTags(
        data.generalTags || {
          season: [],
          budget: [],
          rating: [],
          location: [],
        }
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
        data.hotelTags || {
          accommodation: [],
          hotelServices: [],
          typeTrip: [],
        }
      );
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: mutateUpdateExperienceDetail,
    isLoading: isLoadingUpdateExperienceDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updateExperience({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["experience", slug]);
      toast.success("Experiencia actualizada");
      navigate(`/admin/experiences/manage/edit/${data.slug}`, {
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdateExperience = async () => {
    let updatedData = new FormData();

    if (!initialPhoto && photo) {
      updatedData.append("experiencePicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );

      updatedData.append("experiencePicture", picture);
    }

    updatedData.append(
      "document",
      JSON.stringify({
        body,
        categories,
        title,
        tags,
        slug: experienceSlug,
        caption,
        approved,
        region,
        prefecture,
        price,
        phone,
        email,
        website,
        schedule,
        map,
        address,
        generalTags: selectedGeneralTags,
        attractionTags: selectedAttractionTags,
        hotelTags: selectedHotelTags,
        restaurantTags: selectedRestaurantTags,
      })
    );

    mutateUpdateExperienceDetail({
      updatedData,
      slug,
      token: jwt,
    });
  };

  const handleDeleteImage = () => {
    if (window.confirm("¿Quieres eliminar la foto de tu publicación?")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  const handleSelectChange = (tagType, tagValue) => {
    setSelectedGeneralTags((prevTags) => {
      const newTags = { ...prevTags };
      newTags[tagType] = tagValue ? [tagValue] : [];
      return newTags;
    });
  };

  const handleAttractionTagChange = (tagTitle) => {
    setSelectedAttractionTags((prevTags) => {
      if (prevTags.includes(tagTitle)) {
        return prevTags.filter((tag) => tag !== tagTitle);
      } else {
        return [...prevTags, tagTitle];
      }
    });
  };

  const handleRestaurantTagChange = (tagType, tagLabel) => {
    setSelectedRestaurantTags((prevTags) => {
      const newTags = { ...prevTags };
      if (!newTags[tagType]) {
        newTags[tagType] = [];
      }
      if (newTags[tagType].includes(tagLabel)) {
        newTags[tagType] = newTags[tagType].filter((tag) => tag !== tagLabel);
      } else {
        newTags[tagType].push(tagLabel);
      }
      return newTags;
    });
  };

  const handleHotelTagChange = (tagType, tagLabel) => {
    setSelectedHotelTags((prevTags) => {
      const newTags = { ...prevTags };
      if (!newTags[tagType]) {
        newTags[tagType] = [];
      }
      if (newTags[tagType].includes(tagLabel)) {
        newTags[tagType] = newTags[tagType].filter((tag) => tag !== tagLabel);
      } else {
        newTags[tagType].push(tagLabel);
      }
      return newTags;
    });
  };

  let isExperienceDataLoaded = !isLoading && !isError;

  return (
    <div>
      {isLoading ? (
        <ExperienceDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
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
            <label
              htmlFor="experiencePicture"
              className="w-full cursor-pointer"
            >
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
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
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
                <div className="flex flex-wrap gap-4">
                  {Object.keys(generalTags).map((tagType) => (
                    <div key={tagType} className="flex flex-col w-auto">
                      <label className="font-bold">{tagLabels[tagType]}</label>
                      <select
                        value={selectedGeneralTags[tagType][0] || ""}
                        onChange={(e) =>
                          handleSelectChange(tagType, e.target.value)
                        }
                        className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-sm font-medium font-roboto text-dark-hard w-auto"
                      >
                        <option value="">Selecciona una opción</option>
                        {generalTags[tagType].map((tagValue) => (
                          <option key={tagValue} value={tagValue}>
                            {tagValue}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {categories === "Atractivos" && (
              <div className="mb-5 mt-2">
                <label className="d-label">
                  <span className="d-label-text">Etiquetas de Atractivos</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {attractionTags.map((tag) => (
                    <label
                      key={tag.title}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAttractionTags.includes(tag.title)}
                        onChange={() => handleAttractionTagChange(tag.title)}
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                      <span className="flex items-center">
                        {tag.icon}
                        <span className="ml-2">{tag.title}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {categories === "Restaurantes" && (
              <div className="mb-5 mt-2">
                <label className="d-label">
                  <span className="d-label-text">Tipos de Restaurantes</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {restaurantTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRestaurantTags.restaurantTypes.includes(
                          type
                        )}
                        onChange={() =>
                          handleRestaurantTagChange("restaurantTypes", type)
                        }
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                      <span className="ml-2">{type}</span>
                    </label>
                  ))}
                </div>

                <label className="d-label mt-4">
                  <span className="d-label-text">Cocinas</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedRestaurantTags.cuisines &&
                    cuisines.map((cuisine) => (
                      <label
                        key={cuisine}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRestaurantTags.cuisines.includes(
                            cuisine
                          )}
                          onChange={() =>
                            handleRestaurantTagChange("cuisines", cuisine)
                          }
                          className="form-checkbox h-4 w-4 text-primary"
                        />
                        <span className="ml-2">{cuisine}</span>
                      </label>
                    ))}
                </div>

                <label className="d-label mt-4">
                  <span className="d-label-text">
                    Servicios de Restaurantes
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {restaurantServices.map((service) => (
                    <label
                      key={service.label}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRestaurantTags.restaurantServices.includes(
                          service.label
                        )}
                        onChange={() =>
                          handleRestaurantTagChange(
                            "restaurantServices",
                            service.label
                          )
                        }
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                      <span className="flex items-center">
                        {service.icon}
                        <span className="ml-2">{service.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {categories === "Hoteles" && (
              <div className="mb-5 mt-2">
                <label className="d-label">
                  <span className="d-label-text">Alojamientos</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <select
                    value={selectedHotelTags.accommodation?.[0] || ""}
                    onChange={(e) =>
                      handleHotelTagChange("accommodation", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="" disabled>
                      Selecciona un alojamiento
                    </option>
                    {accommodation.map((accommodation) => (
                      <option
                        key={accommodation.label}
                        value={accommodation.label}
                      >
                        {accommodation.label}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="d-label mt-4">
                  <span className="d-label-text">Servicios de Hoteles</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {hotelServices.map((hotelServices) => (
                    <label
                      key={hotelServices.label}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHotelTags.hotelServices?.includes(
                          hotelServices.label
                        )}
                        onChange={() =>
                          handleHotelTagChange(
                            "hotelServices",
                            hotelServices.label
                          )
                        }
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                      <span className="flex items-center">
                        {hotelServices.icon}
                        <span className="ml-2">{hotelServices.label}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <label className="d-label mt-4">
                  <span className="d-label-text">Tipo de Viaje</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {typeTrip.map((trip) => (
                    <label
                      key={trip.label}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHotelTags.typeTrip?.includes(
                          trip.label
                        )}
                        onChange={() =>
                          handleHotelTagChange("typeTrip", trip.label)
                        }
                        className="form-checkbox h-4 w-4 text-primary"
                      />
                      <span className="flex items-center">
                        {trip.icon}
                        <span className="ml-2">{trip.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full">
              {isExperienceDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdateExperienceDetail}
              type="button"
              onClick={handleUpdateExperience}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Actualizar
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditExperience;

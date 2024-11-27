import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useContext } from "react";
import {
  getSingleItinerary,
  updateItinerary,
  deleteItinerary,
  getFavoriteHotels,
  getFavoriteAttractions,
  getFavoriteRestaurants,
} from "../../../../services/index/itinerary";
import { Link, useParams, useNavigate } from "react-router-dom";
import ExperienceDetailSkeleton from "../../../experienceDetail/components/ExperienceDetailSkeleton";
import ErrorMessage from "../../../../components/ErrorMessage";
import { stables, images } from "../../../../constants";
import { HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-hot-toast";
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";

const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: ["Tokio", "Kanagawa", "Chiba", "Saitama", "Ibaraki", "Tochigi", "Gunma"],
  Chubu: ["Aichi", "Shizuoka", "Gifu", "Nagano", "Niigata", "Toyama", "Ishikawa", "Fukui"],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: ["Fukuoka", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Saga"],
};

const EditItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, jwt } = useUser();
  const queryClient = useQueryClient();
  const { favorites, setFavorites, addFavorite, removeFavorite } = useContext(FavoriteContext);

  const [itinerary, setItinerary] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, isLoading: isLoadingQuery, isError } = useQuery(
    ["itinerary", id],
    () => getSingleItinerary({ id, token: jwt }),
    {
      onSuccess: async (data) => {
        setItinerary(data);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setDays(data.days || []);
        await fetchAllFavorites(data.days);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const fetchFavoritesForDay = async (day) => {
    if (!day.region || !day.prefecture) {
      console.warn(`Día con datos incompletos: ${JSON.stringify(day)}`);
      return { hotels: [], attractions: [], restaurants: [] };
    }
    try {
      const hotelsData = await getFavoriteHotels({ userId: user._id, token: jwt, region: day.region, prefecture: day.prefecture });
      const attractionsData = await getFavoriteAttractions({ userId: user._id, token: jwt, region: day.region, prefecture: day.prefecture });
      const restaurantsData = await getFavoriteRestaurants({ userId: user._id, token: jwt, region: day.region, prefecture: day.prefecture });

      return {
        hotels: hotelsData,
        attractions: attractionsData,
        restaurants: restaurantsData,
      };
    } catch (error) {
      console.error("Error al cargar favoritos para un día:", error);
      return { hotels: [], attractions: [], restaurants: [] };
    }
  };

  const fetchAllFavorites = async (days) => {
    const favoritesByDay = await Promise.all(days.map(fetchFavoritesForDay));
    setDays((prevDays) =>
      prevDays.map((day, index) => ({
        ...day,
        favorites: favoritesByDay[index],
      }))
    );
  };

  const handleDayChange = async (index, field, value) => {
    const updatedDay = { ...days[index], [field]: value };
    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[index] = updatedDay;
      return updatedDays;
    });

    if (field === "region" || field === "prefecture") {
      const updatedFavorites = await fetchFavoritesForDay(updatedDay);
      setDays((prevDays) =>
        prevDays.map((day, i) =>
          i === index
            ? { ...day, [field]: value, favorites: updatedFavorites }
            : day
        )
      );
    }
  };

  const handleCheckboxChange = (index, field, id) => {
    setDays((prevDays) =>
      prevDays.map((day, i) => {
        if (i === index) {
          const selectedItems = day[field] || [];
          const isSelected = selectedItems.includes(id);
          return {
            ...day,
            [field]: isSelected
              ? selectedItems.filter((item) => item !== id)
              : [...selectedItems, id],
          };
        }
        return day;
      })
    );
  };

  const calculateDayBudget = (day) => {
    let budget = 0;
    if (day.hotel && day.hotel.experienceId) {
      budget += day.hotel.experienceId.price;
    }
    if (day.activities.length > 0) {
      day.activities.forEach((activityId) => {
        const activity = day.favorites.attractions.find((a) => a._id === activityId);
        if (activity && activity.experienceId) {
          budget += activity.experienceId.price;
        }
      });
    }
    if (day.restaurants.length > 0) {
      day.restaurants.forEach((restaurantId) => {
        const restaurant = day.favorites.restaurants.find((r) => r._id === restaurantId);
        if (restaurant && restaurant.experienceId) {
          budget += restaurant.experienceId.price;
        }
      });
    }
    return budget;
  };

  const calculateTotalBudget = () => {
    return days.reduce((sum, day) => sum + calculateDayBudget(day), 0);
  };

  const { mutate: mutateUpdateItinerary, isLoading: isLoadingUpdateItinerary } = useMutation(
    ({ id, itineraryData, token }) => updateItinerary({ id, itineraryData, token }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["itinerary", id]);
        toast.success("¡Itinerario actualizado!");
        navigate(`/user/itineraries/manage`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const deleteMutation = useMutation(
    ({ id, token }) => deleteItinerary({ id, token }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userItineraries");
        toast.success("Itinerario eliminado correctamente");
        navigate("/user/itineraries/manage");
      },
      onError: (error) => {
        toast.error(`Error al eliminar el itinerario: ${error.message}`);
      },
    }
  );

  const handleUpdateItinerary = () => {
    if (jwt) {
      mutateUpdateItinerary({
        id,
        itineraryData: { title: itinerary.title, startDate, endDate, days, totalBudget: calculateTotalBudget() },
        token: jwt,
      });
    } else {
      toast.error("Debes estar logueado para actualizar el itinerario");
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este itinerario?")) {
      deleteMutation.mutate({ id, token: jwt });
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    updateDays(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    updateDays(startDate, date);
  };

  const updateDays = (start, end) => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    setDays((prevDays) => {
      const newDays = [];
      for (let i = 0; i < daysDiff; i++) {
        if (prevDays[i]) {
          newDays.push(prevDays[i]);  
        } else {
          newDays.push({
            dayNumber: i + 1,
            region: "",
            prefecture: "",
            hotel: null,
            activities: [],
            restaurants: [],
            budget: 0,
            notes: "",
            favorites: { hotels: [], attractions: [], restaurants: [] },
          });
        }
      }
      return newDays;
    });
  };

  if (isLoadingQuery) return <ExperienceDetailSkeleton />;
  if (isError) return <ErrorMessage message="Error al cargar el itinerario" />;
  if (!itinerary) return <ErrorMessage message="Itinerario no encontrado" />;

  return (
    <div>
      <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
        <article className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Editar Itinerario</h1>
          <div className="d-form-control w-full">
            <label className="d-label" htmlFor="title">
              <span className="d-label-text">Título</span>
            </label>
            <input
              id="title"
              value={itinerary.title}
              className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
              onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
              placeholder="Título"
            />
          </div>
          <div className="d-form-control w-full">
            <label className="d-label" htmlFor="startDate">
              <span className="d-label-text">Fecha de inicio</span>
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ""}
              className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
              onChange={(e) => handleStartDateChange(new Date(e.target.value))}
            />
          </div>
          <div className="d-form-control w-full">
            <label className="d-label" htmlFor="endDate">
              <span className="d-label-text">Fecha de fin</span>
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ""}
              className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
              onChange={(e) => handleEndDateChange(new Date(e.target.value))}
            />
          </div>
          {days.map((day, index) => (
            <div key={index} className="mt-6">
              <h3 className="text-xl font-semibold">Día {day.dayNumber}</h3>
              <div className="d-form-control w-full">
                <label className="d-label" htmlFor={`region-${index}`}>
                  <span className="d-label-text">Región</span>
                </label>
                <select
                  id={`region-${index}`}
                  value={day.region || ""}
                  className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                  onChange={(e) => handleDayChange(index, 'region', e.target.value)}
                >
                  <option value="">Seleccionar Región</option>
                  {Object.keys(regions).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="d-form-control w-full">
                <label className="d-label" htmlFor={`prefecture-${index}`}>
                  <span className="d-label-text">Prefectura</span>
                </label>
                <select
                  id={`prefecture-${index}`}
                  value={day.prefecture || ""}
                  className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                  onChange={(e) => handleDayChange(index, 'prefecture', e.target.value)}
                >
                  <option value="">Seleccionar Prefectura</option>
                  {regions[day.region] && regions[day.region].map((prefecture) => (
                    <option key={prefecture} value={prefecture}>{prefecture}</option>
                  ))}
                </select>
              </div>
              <div className="d-form-control w-full">
                <label className="d-label" htmlFor={`hotel-${index}`}>
                  <span className="d-label-text">Hotel</span>
                </label>
                <select
                  id={`hotel-${index}`}
                  value={day.hotel ? day.hotel._id : "sin-hotel"}
                  className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                  onChange={(e) => handleDayChange(index, 'hotel', e.target.value === "sin-hotel" ? null : e.target.value)}
                >
                  <option value="sin-hotel">Sin hotel</option>
                  {day.favorites?.hotels?.map((fav, favIndex) => (
                    <option key={`${fav._id}-${index}-${favIndex}`} value={fav._id}>{fav.experienceId.title}</option>
                  ))}
                </select>
              </div>
              <h4 className="mt-4">Atractivos</h4>
              {day.favorites?.attractions?.map((fav, favIndex) => (
                <div key={`${fav._id}-${index}-${favIndex}`} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`activity-${fav._id}-${index}`}
                    checked={day.activities.includes(fav._id)}
                    onChange={() => handleCheckboxChange(index, 'activities', fav._id)}
                    disabled={days.some((d, i) => i !== index && d.activities.includes(fav._id))}
                  />
                  <label htmlFor={`activity-${fav._id}-${index}`} className="ml-2">{fav.experienceId.title}</label>
                </div>
              ))}
              <h4 className="mt-6">Restaurantes</h4>
              {day.favorites?.restaurants?.map((fav, favIndex) => (
                <div key={`${fav._id}-${index}-${favIndex}`} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`restaurant-${fav._id}-${index}`}
                    checked={day.restaurants.includes(fav._id)}
                    onChange={() => handleCheckboxChange(index, 'restaurants', fav._id)}
                    disabled={days.some((d, i) => i !== index && d.restaurants.includes(fav._id))}
                  />
                  <label htmlFor={`restaurant-${fav._id}-${index}`} className="ml-2">{fav.experienceId.title}</label>
                </div>
              ))}
              <p className="mt-4">Presupuesto del día: {calculateDayBudget(day).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>

              <div className="d-form-control w-full">
                <label className="d-label" htmlFor={`notes-${index}`}>
                  <span className="d-label-text">Notas</span>
                </label>
                <textarea
                  id={`notes-${index}`}
                  value={day.notes}
                  className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                  onChange={(e) => handleDayChange(index, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}
          <p className="mt-4">Presupuesto Total: {calculateTotalBudget().toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
          <button
            disabled={isLoadingUpdateItinerary}
            type="button"
            onClick={handleUpdateItinerary}
            className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70 mt-6"
          >
            Actualizar Itinerario
          </button>
          <button
            disabled={deleteMutation.isLoading}
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70 mt-6"
          >
            Borrar Itinerario
          </button>
        </article>
      </section>
    </div>
  );
};

export default EditItinerary;
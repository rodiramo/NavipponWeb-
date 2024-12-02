import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';  
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createItinerary, getDaysWithExperiences } from "../../../../services/index/itinerary";
import { createDay, getFavoriteHotels, getFavoriteAttractions, getFavoriteRestaurants, deleteDay } from "../../../../services/index/day";
import { AiOutlineClose } from 'react-icons/ai';
import { stables, images } from "../../../../constants"; 
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 3,
    slidesToSlide: 1
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 1,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

Modal.setAppElement('#root');

const CreateItinerary = () => {
  const { user, jwt } = useUser();
  const { favorites } = useContext(FavoriteContext);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [region, setRegion] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [hotel, setHotel] = useState('');
  const [activities, setActivities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [days, setDays] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (region && prefecture) {
      fetchFavorites();
    }
  }, [region, prefecture]);

  useEffect(() => {
    calculateDailyBudget();
  }, [activities, restaurants, hotel]);

  useEffect(() => {
    const fetchDaysWithExperiences = async () => {
      try {
        const data = await getDaysWithExperiences({ userId: user._id, token: jwt });
        console.log('Fetched days with experiences:', data);
        setDays(data);
      } catch (error) {
        console.error('Error fetching days with experiences:', error);
      }
    };

    fetchDaysWithExperiences();
  }, [user, jwt]);

  const fetchFavorites = async () => {
    try {
      const [hotelsRes, activitiesRes, restaurantsRes] = await Promise.all([
        getFavoriteHotels({ userId: user._id, region, prefecture, token: jwt }),
        getFavoriteAttractions({ userId: user._id, region, prefecture, token: jwt }),
        getFavoriteRestaurants({ userId: user._id, region, prefecture, token: jwt }),
      ]);
      console.log('Fetched favorites:', { hotelsRes, activitiesRes, restaurantsRes });
      setHotels(hotelsRes);
      setActivitiesList(activitiesRes);
      setRestaurantsList(restaurantsRes);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const calculateDailyBudget = () => {
    const selectedHotel = hotels.find(h => h._id === hotel);
    const selectedActivities = activitiesList.filter(a => activities.includes(a._id));
    const selectedRestaurants = restaurantsList.filter(r => restaurants.includes(r._id));

    const hotelPrice = selectedHotel?.experienceId?.price || 0;
    const activitiesPrice = selectedActivities.reduce((sum, activity) => sum + (activity.experienceId?.price || 0), 0);
    const restaurantsPrice = selectedRestaurants.reduce((sum, restaurant) => sum + (restaurant.experienceId?.price || 0), 0);

    const budget = hotelPrice + activitiesPrice + restaurantsPrice;

    setDailyBudget(budget);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setEndDate(date);
    setRegion('');
    setPrefecture('');
    setHotel('');
    setActivities([]);
    setRestaurants([]);
    setDailyBudget(0);
    setModalIsOpen(true);
  };

  const handleSaveDay = async () => {
    const newDay = {
      date: startDate,
      region,
      prefecture,
      hotel: hotel || null,
      activities,
      restaurants,
      budget: dailyBudget,
    };

    console.log('Saving day with data:', newDay);

    try {
      const savedDay = await createDay({ token: jwt, dayData: newDay });
      console.log('Saved day:', savedDay);
      setDays([...days, savedDay]);
      setTotalBudget(totalBudget + dailyBudget);
      setModalIsOpen(false);
      toast.success("Día guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el día");
      console.error('Error saving day:', error);
    }
  };

  const handleCreateItinerary = async () => {
    try {
      const itineraryData = {
        title,
        startDate,
        endDate,
        userId: user._id,
        totalBudget,
        days: days.map(day => day._id),
      };
      console.log('Creating itinerary with data:', itineraryData);
      await createItinerary({ token: jwt, itineraryData });
      toast.success("Itinerario creado exitosamente");
      navigate('/user/itineraries/manage');
    } catch (error) {
      toast.error("Error al crear el itinerario");
      console.error('Error creating itinerary:', error);
    }
  };

  const handleActivityChange = (e) => {
    const value = e.target.value;
    setActivities(prevActivities =>
      prevActivities.includes(value)
        ? prevActivities.filter(activity => activity !== value)
        : [...prevActivities, value]
    );
  };

  const handleRestaurantChange = (e) => {
    const value = e.target.value;
    setRestaurants(prevRestaurants =>
      prevRestaurants.includes(value)
        ? prevRestaurants.filter(restaurant => restaurant !== value)
        : [...prevRestaurants, value]
    );
  };

  const handleHotelChange = (e) => {
    const value = e.target.value;
    setHotel(prevHotel => (prevHotel === value ? '' : value));
  };

  const handleDeleteDay = async (dayId) => {
    try {
      await deleteDay({ id: dayId, token: jwt });
      setDays(days.filter(day => day._id !== dayId));
      toast.success("Día eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el día");
      console.error('Error deleting day:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
      <article className="flex-1">
        <h1 className="text-2xl font-semibold mb-5">Crear Itinerario</h1>
        <div className="d-form-control w-full mb-4">
          <label className="d-label" htmlFor="title">
            <span className="d-label-text">Título del itinerario</span>
          </label>
          <input
            id="title"
            value={title}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el título del itinerario"
          />
        </div>
        <div className="d-form-control w-full mb-4">
          <label className="d-label" htmlFor="startDate">
            <span className="d-label-text">Fecha de Inicio</span>
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate.toISOString().split('T')[0]}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="d-form-control w-full mb-4">
          <label className="d-label" htmlFor="endDate">
            <span className="d-label-text">Fecha de Fin</span>
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate.toISOString().split('T')[0]}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        <Calendar onChange={handleDateChange} value={startDate} className="mb-5" />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Detalles del día seleccionado"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto mt-20 mb-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Detalles del día seleccionado</h2>
            <button onClick={() => setModalIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
          <form>
            <div className="d-form-control w-full mb-4">
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
            <div className="d-form-control w-full mb-4">
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
            <div className="d-form-control w-full mb-4">
              <label className="d-label" htmlFor="hotel">
                <span className="d-label-text">Hotel (Se recomienda seleccionar 1 hotel por destino)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {hotels.filter(hotel => hotel.experienceId && hotel.experienceId.region === region && hotel.experienceId.prefecture === prefecture && hotel.experienceId.categories === 'Hoteles').map((hotelItem) => (
                  <label key={hotelItem._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={hotelItem._id}
                      checked={hotelItem._id === hotel}
                      onChange={handleHotelChange}
                    />
                    <img className="rounded-xl w-16 h-16 object-cover" src={hotelItem.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + hotelItem.experienceId.photo : images.sampleExperienceImage} alt={hotelItem.experienceId?.title} />
                    <span>{hotelItem.experienceId?.title} - {hotelItem.experienceId?.price || 'Sin precio'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="d-form-control w-full mb-4">
              <label className="d-label" htmlFor="activities">
                <span className="d-label-text">Actividades</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {activitiesList.filter(activity => activity.experienceId && activity.experienceId.region === region && activity.experienceId.prefecture === prefecture && activity.experienceId.categories === 'Atractivos').map((activity) => (
                  <label key={activity._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={activity._id}
                      checked={activities.includes(activity._id)}
                      onChange={handleActivityChange}
                    />
                    <img className="rounded-xl w-16 h-16 object-cover" src={activity.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + activity.experienceId.photo : images.sampleExperienceImage} alt={activity.experienceId?.title} />
                    <span>{activity.experienceId?.title} - {activity.experienceId?.price || 'Sin precio'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="d-form-control w-full mb-4">
              <label className="d-label" htmlFor="restaurants">
                <span className="d-label-text">Restaurantes</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {restaurantsList.filter(restaurant => restaurant.experienceId && restaurant.experienceId.region === region && restaurant.experienceId.prefecture === prefecture && restaurant.experienceId.categories === 'Restaurantes').map((restaurant) => (
                  <label key={restaurant._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={restaurant._id}
                      checked={restaurants.includes(restaurant._id)}
                      onChange={handleRestaurantChange}
                    />
                    <img className="rounded-xl w-16 h-16 object-cover" src={restaurant.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + restaurant.experienceId.photo : images.sampleExperienceImage} alt={restaurant.experienceId?.title} />
                    <span>{restaurant.experienceId?.title} - {restaurant.experienceId?.price || 'Sin precio'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="d-form-control w-full mb-4">
              <label className="d-label" htmlFor="dailyBudget">
                <span className="d-label-text">Presupuesto del día</span>
              </label>
              <input
                id="dailyBudget"
                type="number"
                value={dailyBudget}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                placeholder="Presupuesto del día"
                readOnly
              />
            </div>
            <button
              type="button"
              onClick={handleSaveDay}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
            >
              Guardar día
            </button>
          </form>
        </Modal>
        <div className="d-form-control w-full mb-4">
          <h2 className="text-xl font-semibold">Días Guardados</h2>


          <div className="w-full" style={{ maxWidth: '950px', margin: '0 auto' }}>
          <Carousel responsive={responsive} itemClass="px-2">
        {days.sort((a, b) => new Date(a.date) - new Date(b.date)).map((day, index) => {
          console.log('Day data:', day);
          return (
            <div key={day._id} className="px-2">
              <div className="card mb-4 border p-4 rounded-lg" style={{ height: '400px', width: '100%' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Fecha</h3>
                    <p>{new Date(day.date).toLocaleDateString()}</p>
                    <h3 className="text-lg font-semibold">Prefectura</h3>
                    <p>{day.prefecture}</p>
                    <h3 className="text-lg font-semibold">Hotel</h3>
                    {day.hotel && day.hotel.experienceId && (
                      <div className="flex items-center gap-2">
                        <img className="rounded-xl w-16 h-16 object-cover" src={day.hotel.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + day.hotel.experienceId.photo : images.sampleExperienceImage} alt={day.hotel.experienceId?.title} />
                        <span>{day.hotel.experienceId?.title}</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">Actividades</h3>
                    {day.activities.map(activity => (
                      <div key={activity._id} className="flex items-center gap-2">
                        <img className="rounded-xl w-16 h-16 object-cover" src={activity.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + activity.experienceId.photo : images.sampleExperienceImage} alt={activity.experienceId?.title} />
                        <span>{activity.experienceId?.title}</span>
                      </div>
                    ))}
                    <h3 className="text-lg font-semibold">Restaurantes</h3>
                    {day.restaurants.map(restaurant => (
                      <div key={restaurant._id} className="flex items-center gap-2">
                        <img className="rounded-xl w-16 h-16 object-cover" src={restaurant.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + restaurant.experienceId.photo : images.sampleExperienceImage} alt={restaurant.experienceId?.title} />
                        <span>{restaurant.experienceId?.title}</span>
                      </div>
                    ))}
                    <h3 className="text-lg font-semibold">Presupuesto del día</h3>
                    <p>{day.budget}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDay(day._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiOutlineClose className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
  </div>



        </div>
        <div className="d-form-control w-full mb-4">
          <h2 className="text-xl font-semibold">Presupuesto total: {totalBudget}</h2>
        </div>
        <button
          type="button"
          onClick={handleCreateItinerary}
          className="w-full bg-blue-500 text-white font-semibold rounded-lg px-4 py-2"
        >
          Crear Itinerario
        </button>
      </article>
    </div>
  );
};

export default CreateItinerary;
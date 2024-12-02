import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";
import { getSingleItineraryWithDetails } from "../../../../services/index/itinerary";
import { stables, images } from "../../../../constants";
import { toast } from "react-hot-toast";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
        slidesToSlide: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};

const ItineraryDetailPage = () => {
    const { id } = useParams();
    const { user, jwt } = useUser();
    const { favorites } = useContext(FavoriteContext);
    const [itinerary, setItinerary] = useState(null);
    const [days, setDays] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [restaurantsList, setRestaurantsList] = useState([]);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const data = await getSingleItineraryWithDetails(id, jwt);
                console.log('Fetched itinerary with details:', data);
                // Filtrar días vacíos o no deseados
                const validDays = data.days.filter(day => day.date || day.activities.length || day.restaurants.length || day.hotel);
                setItinerary(data);
                setDays(validDays);
                // Aquí puedes cargar los hoteles, actividades y restaurantes si es necesario
            } catch (error) {
                toast.error('Error fetching itinerary');
                console.error('Error fetching itinerary:', error);
            }
        };

        fetchItinerary();
    }, [id, jwt]);

    if (!itinerary) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto max-w-5xl flex flex-col px-5 py-5">
            <h2 className="text-2xl font-semibold mb-5">{itinerary.title}</h2>
            <p>Fecha de inicio: {new Date(itinerary.startDate).toLocaleDateString()}</p>
            <p>Fecha de fin: {new Date(itinerary.endDate).toLocaleDateString()}</p>
            <p>Presupuesto total: {itinerary.totalBudget}</p>
            <Carousel responsive={responsive} itemClass="px-2">
                {days.sort((a, b) => new Date(a.date) - new Date(b.date)).map((day, index) => {
                    console.log('Day data:', day);
                    const hotelData = hotels.find(h => h._id === day.hotel);
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
                                        {hotelData && hotelData.experienceId ? (
                                            <div className="flex items-center gap-2">
                                                <img className="rounded-xl w-16 h-16 object-cover" src={hotelData.experienceId.photo ? stables.UPLOAD_FOLDER_BASE_URL + hotelData.experienceId.photo : images.sampleExperienceImage} alt={hotelData.experienceId.title} />
                                                <span>{hotelData.experienceId.title}</span>
                                            </div>
                                        ) : (
                                            <p>No hay hotel seleccionado</p>
                                        )}
                                        <h3 className="text-lg font-semibold">Actividades</h3>
                                        {day.activities.map(activity => {
                                            const activityData = activitiesList.find(a => a._id === activity);
                                            return (
                                                <div key={activity} className="flex items-center gap-2">
                                                    <img className="rounded-xl w-16 h-16 object-cover" src={activityData?.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + activityData.experienceId.photo : images.sampleExperienceImage} alt={activityData?.experienceId?.title} />
                                                    <span>{activityData?.experienceId?.title}</span>
                                                </div>
                                            );
                                        })}
                                        <h3 className="text-lg font-semibold">Restaurantes</h3>
                                        {day.restaurants.map(restaurant => {
                                            const restaurantData = restaurantsList.find(r => r._id === restaurant);
                                            return (
                                                <div key={restaurant} className="flex items-center gap-2">
                                                    <img className="rounded-xl w-16 h-16 object-cover" src={restaurantData?.experienceId?.photo ? stables.UPLOAD_FOLDER_BASE_URL + restaurantData.experienceId.photo : images.sampleExperienceImage} alt={restaurantData?.experienceId?.title} />
                                                    <span>{restaurantData?.experienceId?.title}</span>
                                                </div>
                                            );
                                        })}
                                        <h3 className="text-lg font-semibold">Presupuesto del día</h3>
                                        <p>{day.budget}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default ItineraryDetailPage;
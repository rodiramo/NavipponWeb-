import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { stables, images } from "../../../../constants";
import useUser from "../../../../hooks/useUser";

const ItineraryDetailPage = () => {
  const [itinerary, setItinerary] = useState(null);
  const { id } = useParams();
  const { user, jwt } = useUser(); // Asegurarse de que estamos obteniendo el usuario y el token

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
        const { data } = await axios.get(`/api/itineraries/${id}`, config);
        setItinerary(data);
      } catch (error) {
        toast.error("Error fetching itinerary");
        console.error("Error fetching itinerary:", error);
      }
    };

    if (jwt) {
      fetchItinerary();
    }
  }, [id, jwt]);

  if (!itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="itinerary-detail container mx-auto max-w-5xl px-5 py-5">
      <h1 className="text-2xl font-bold mb-4">{itinerary.name}</h1>
      <p><strong>Travel Days:</strong> {itinerary.travelDays}</p>
      <p><strong>Total Budget:</strong> {itinerary.totalBudget}</p>
      <p><strong>Notes:</strong> {itinerary.notes}</p>
      <div className="boards mt-4">
        {itinerary.boards.map((board, index) => (
          <div key={index} className="board mb-4 p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-medium mb-2">Day {index + 1} - {board.date}</h3>
            <p><strong>Daily Budget:</strong> {board.dailyBudget}</p>
            <div>
              <h4 className="text-md font-medium mb-2">Favorites</h4>
              <ul>
                {board.favorites.length > 0 ? (
                  board.favorites.map((favorite, favIndex) => (
                    <li key={`${index}-${favorite.favoriteId || favIndex}`} className="flex items-center mb-2">
                      <img
                        src={favorite.experience?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + favorite.experience.photo
                          : images.sampleFavoriteImage}
                        alt={favorite.experience?.title || "Default Image"}
                        className="w-10 h-10 object-cover rounded-lg mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{favorite.experience?.title || "No Title"}</p>
                        <p className="text-sm text-gray-500">{favorite.experience?.prefecture || "No Prefecture"}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No favorites available for this day.</p>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDetailPage;
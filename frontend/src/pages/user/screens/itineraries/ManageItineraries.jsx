import React, { useState, useEffect, useContext } from 'react';
import { getUserItineraries, deleteItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FavoriteContext from "../../../../context/FavoriteContext";

const ManageItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { favorites } = useContext(FavoriteContext);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const data = await getUserItineraries(user._id, jwt);
        setItineraries(data);
      } catch (error) {
        toast.error('Error fetching itineraries');
      }
    };

    fetchItineraries();
  }, [user, jwt]);

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id, jwt);
      setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
      toast.success('Itinerary deleted successfully');
    } catch (error) {
      toast.error('Error deleting itinerary');
    }
  };

  return (
    <div>
      <h1>Manage Itineraries</h1>
      <button onClick={() => navigate('/user/itineraries/manage/create')}>Create New Itinerary</button>
      <ul>
        {itineraries.map(itinerary => (
          <li key={itinerary._id}>
            <h2>{itinerary.name}</h2>
            <p>Days: {itinerary.travelDays}</p>
            <p>Total Budget: {itinerary.totalBudget}</p>
            <button onClick={() => navigate(`/user/itineraries/manage/view/${itinerary._id}`)}>View</button>
            <button onClick={() => navigate(`/user/itineraries/manage/edit/${itinerary._id}`)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageItineraries;
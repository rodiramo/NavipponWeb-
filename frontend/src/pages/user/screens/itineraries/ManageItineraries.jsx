import React, { useState, useEffect } from 'react';
import { getUserItineraries, deleteItinerary } from "../../../../services/index/itinerary";
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ManageItineraries = () => {
  const { user, jwt } = useUser();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data } = await getUserItineraries("", 1, 10, jwt);
        setItineraries(data.data || []); // Asegurarse de que data.data sea un array
      } catch (error) {
        setError(error.message);
        toast.error("Error al cargar los itinerarios");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [jwt]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este itinerario?")) {
      try {
        await deleteItinerary({ id, token: jwt });
        setItineraries(itineraries.filter(itinerary => itinerary._id !== id));
        toast.success("Itinerario eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el itinerario");
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl px-5 py-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Mis Itinerarios</h1>
      </div>
      {itineraries.length === 0 ? (
        <p>No tienes itinerarios guardados.</p>
      ) : (
        <ul>
          {itineraries.map(itinerary => (
            <li key={itinerary._id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <Link to={`/user/itineraries/${itinerary._id}`} className="text-blue-500">
                    {itinerary.title}
                  </Link>
                  <p>Presupuesto Total: {itinerary.totalBudget}</p>
                  <p>Fecha de Inicio: {new Date(itinerary.startDate).toLocaleDateString()}</p>
                  <p>Fecha de Fin: {new Date(itinerary.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/user/itineraries/manage/edit/${itinerary._id}`)}
                    className="bg-yellow-500 text-white font-semibold rounded-lg px-4 py-2"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => navigate(`/user/itineraries/manage/view/${itinerary._id}`)}
                    className="bg-green-500 text-white font-semibold rounded-lg px-4 py-2"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleDelete(itinerary._id)}
                    className="bg-red-500 text-white font-semibold rounded-lg px-4 py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageItineraries;
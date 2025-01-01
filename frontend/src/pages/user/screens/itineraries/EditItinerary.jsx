import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUser from "../../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { stables, images } from "../../../../constants";  
import { FaTrash, FaTimes } from 'react-icons/fa';  
import axios from 'axios';

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
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
  const [name, setName] = useState('');
  const [travelDays, setTravelDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedPrefecture, setSelectedPrefecture] = useState('All');
  const { user, jwt } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const getSingleItineraryForEdit = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/itineraries/${id}/edit`, config);
      return data;
    } catch (error) {
      console.error("Error fetching itinerary for edit:", error);
      throw error;
    }
  };

  const getUserFavorites = async ({ userId, token }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/favorites/user/${userId}`, config);
      return data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  };

  const updateItinerary = async (id, itinerary, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(`/api/itineraries/${id}`, itinerary, config);
      return data;
    } catch (error) {
      console.error("Error updating itinerary:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites({ userId: user._id, token: jwt });
        setFavorites(data.filter(favorite => favorite.experienceId !== null));
        setFilteredFavorites(data.filter(favorite => favorite.experienceId !== null));
      } catch (error) {
        toast.error('Error fetching favorites');
      }
    };

    fetchFavorites();
  }, [user, jwt]);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const data = await getSingleItineraryForEdit(id, jwt);
        setName(data.name);
        setTravelDays(data.travelDays);
        setTotalBudget(data.totalBudget);
        setBoards(data.boards);
        setNotes(data.notes);
      } catch (error) {
        toast.error('Error fetching itinerary');
      }
    };

    fetchItinerary();
  }, [id, jwt]);

  useEffect(() => {
    filterFavorites();
  }, [selectedCategory, selectedRegion, selectedPrefecture]);

  const filterFavorites = () => {
    let filtered = favorites;
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(favorite => favorite.experienceId.categories === selectedCategory);
    }
    if (selectedRegion && selectedRegion !== "All") {
      filtered = filtered.filter(favorite => favorite.experienceId.region === selectedRegion);
    }
    if (selectedPrefecture && selectedPrefecture !== "All") {
      filtered = filtered.filter(favorite => favorite.experienceId.prefecture === selectedPrefecture);
    }
    setFilteredFavorites(filtered);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSelectedPrefecture('All');
    setFilteredFavorites(favorites);
  };

  const handleAddBoard = () => {
    setBoards([...boards, { date: '', favorites: [], dailyBudget: 0 }]);
    setTravelDays(boards.length + 1);
  };

  const handleRemoveBoard = (index) => {
    const newBoards = boards.filter((_, i) => i !== index);
    setBoards(newBoards);
    setTravelDays(newBoards.length);
    updateTotalBudget(newBoards);
  };

  const handleDragStart = (e, favorite) => {
    e.dataTransfer.setData('favorite', JSON.stringify(favorite));
  };

  const handleDrop = (e, boardIndex) => {
    const favorite = JSON.parse(e.dataTransfer.getData('favorite'));
    const newBoards = [...boards];
    newBoards[boardIndex].favorites.push(favorite);
    newBoards[boardIndex].dailyBudget = newBoards[boardIndex].favorites.reduce((sum, fav) => sum + fav.experienceId.price, 0);
    setBoards(newBoards);
    updateTotalBudget(newBoards);
  };

  const handleRemoveFavorite = (boardIndex, favoriteIndex) => {
    const newBoards = [...boards];
    newBoards[boardIndex].favorites.splice(favoriteIndex, 1);
    newBoards[boardIndex].dailyBudget = newBoards[boardIndex].favorites.reduce((sum, fav) => sum + fav.experienceId.price, 0);
    setBoards(newBoards);
    updateTotalBudget(newBoards);
  };

  const updateTotalBudget = (boards) => {
    const total = boards.reduce((sum, board) => sum + board.dailyBudget, 0);
    setTotalBudget(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itinerary = { name, travelDays, totalBudget, boards, notes };
    try {
      const response = await updateItinerary(id, itinerary, jwt);
      toast.success('Itinerary updated successfully');
      navigate(`/user/itineraries/manage/view/${response._id}`);
    } catch (error) {
      toast.error('Error updating itinerary');
    }
  };

  return (
    <div className="edit-itinerary container mx-auto max-w-5xl px-5 py-5 flex flex-col lg:flex-row lg:gap-x-5 lg:items-start">
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Edit Itinerary</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Travel Days:</label>
            <input type="number" value={travelDays} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Budget:</label>
            <input type="number" value={totalBudget} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Notes:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <button type="button" onClick={handleAddBoard} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md">Add Day</button>
          <div className="boards overflow-y-auto max-h-[60vh]">
            {boards.map((board, index) => (
              <div key={index} className="board mb-4 p-4 border border-gray-300 rounded-md relative" onDrop={(e) => handleDrop(e, index)} onDragOver={(e) => e.preventDefault()}>
                <h3 className="text-lg font-medium mb-2">Day {index + 1}</h3>
                <button type="button" onClick={() => handleRemoveBoard(index)} className="absolute top-2 right-2 text-red-500">
                  <FaTrash />
                </button>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Date:</label>
                  <input type="text" value={board.date} onChange={(e) => {
                    const newBoards = [...boards];
                    newBoards[index].date = e.target.value;
                    setBoards(newBoards);
                  }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Daily Budget:</label>
                  <input type="number" value={board.dailyBudget} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">Favorites</h4>
                  <ul>
                    {board.favorites.map((favorite, favIndex) => (
                      <li key={`${index}-${favorite._id || favIndex}`} className="flex items-center mb-2">
                        {favorite.experienceId && (
                          <>
                            <img
                              src={
                                favorite.experienceId.photo
                                  ? stables.UPLOAD_FOLDER_BASE_URL + favorite.experienceId.photo
                                  : images.sampleFavoriteImage
                              }
                              alt={favorite.experienceId.title}
                              className="w-10 h-10 object-cover rounded-lg mr-2"
                            />
                            <div>
                              <p className="text-sm font-medium">{favorite.experienceId.title}</p>
                              <p className="text-sm text-gray-500">{favorite.experienceId.prefecture}</p>
                            </div>
                            <button type="button" onClick={() => handleRemoveFavorite(index, favIndex)} className="ml-2 text-red-500">
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Update Itinerary</button>
        </form>
      </main>
      <aside className="w-full lg:w-1/3 lg:ml-5 lg:sticky lg:top-5 lg:h-screen lg:overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Favorites</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="All">All</option>
            {categoriesEnum.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Region:</label>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="All">All</option>
            {Object.keys(regions).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prefecture:</label>
          <select value={selectedPrefecture} onChange={(e) => setSelectedPrefecture(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="All">All</option>
            {selectedRegion !== "All" && regions[selectedRegion].map(prefecture => (
              <option key={prefecture} value={prefecture}>{prefecture}</option>
            ))}
          </select>
        </div>
        <button onClick={handleClearFilters} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md">Clear Filters</button>
        <ul>
          {filteredFavorites.map(favorite => (
            <li key={favorite._id} draggable onDragStart={(e) => handleDragStart(e, favorite)} className="flex items-center mb-4 p-2 border border-gray-300 rounded-md">
              {favorite.experienceId && (
                <>
                  <img
                    src={
                      favorite.experienceId.photo
                        ? stables.UPLOAD_FOLDER_BASE_URL + favorite.experienceId.photo
                        : images.sampleFavoriteImage
                    }
                    alt={favorite.experienceId.title}
                    className="w-10 h-10 object-cover rounded-lg mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium">{favorite.experienceId.title}</p>
                    <p className="text-sm text-gray-500">{favorite.experienceId.prefecture}</p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default EditItinerary;
import { useEffect, useState, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";  
import { images, stables } from "../../../../constants";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService } from "../../../../services/index/favorites";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable";
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";
import { toast } from "react-hot-toast";  

const ManageFavorites = () => {
  const { user, jwt } = useUser();
  const { favorites, setFavorites, addFavorite, removeFavorite } = useContext(FavoriteContext);  
  const [filteredFavorites, setFilteredFavorites] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingDeleteData, setIsLoadingDeleteData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (favorites) {
      const updatedFavorites = favorites.map(fav => ({ ...fav, isFavorite: true }));
      setFilteredFavorites(updatedFavorites);
      setIsLoading(false);
    }
  }, [favorites]); 

  const searchKeywordHandler = (e) => {
    setSearchKeyword(e.target.value);
  };

  const submitSearchKeywordHandler = (e) => {
    e.preventDefault();
    if (favorites) {
      const filtered = favorites.filter((favorite) =>
        favorite.experienceId.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  };

  const handleFavoriteClick = async (favorite) => {
    if (!user || !jwt) {
      toast.error("Debes iniciar sesión para agregar a favoritos");
      console.log("User or token is not defined");
      return;
    }

    try {
      if (favorite.isFavorite) {
        console.log("Removing favorite for user:", user);
        await removeFavoriteService({ userId: user._id, experienceId: favorite.experienceId._id, token: jwt });
        removeFavorite(favorite.experienceId._id);
        toast.success("Se eliminó de favoritos");
      } else {
        console.log("Adding favorite for user:", user);
        await addFavoriteService({ userId: user._id, experienceId: favorite.experienceId._id, token: jwt });
        addFavorite({ userId: user._id, experienceId: favorite.experienceId._id });
        toast.success("Se agregó a favoritos");
      }
      
      setFilteredFavorites((prevData) =>
        prevData.filter((fav) => fav._id !== favorite._id)
      );
      setFavorites((prevData) =>
        prevData.filter((fav) => fav._id !== favorite._id)
      );
    } catch (error) {
      toast.error("Error al actualizar favoritos");
      console.error("Error updating favorites:", error);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <DataTable
      pageTitle="Administrar tus Favoritos"
      dataListName="Favoritos"
      searchInputPlaceHolder="Título Favorito..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Título", "Categoría", "Creado", "Etiquetas", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={filteredFavorites}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={filteredFavorites?.headers}
    >
      {filteredFavorites && filteredFavorites.length > 0 ? (
        filteredFavorites.map((favorite) => (
          <tr key={favorite._id}>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="relative block">
                    <img
                      src={
                        favorite?.experienceId?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + favorite?.experienceId?.photo
                          : images.sampleFavoriteImage
                      }
                      alt={favorite.experienceId.title}
                      className="mx-auto object-cover rounded-lg w-10 aspect-square"
                    />
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">{favorite.experienceId.title}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {favorite.experienceId.categories || "Sin categorizar"}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {new Date(favorite.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex gap-x-2">
                {favorite.experienceId.tags && favorite.experienceId.tags.length > 0
                  ? favorite.experienceId.tags.map((tag, index) => (
                      <p key={index}>
                        {tag}
                        {favorite.experienceId.tags.length - 1 !== index && ","}
                      </p>
                    ))
                  : "Sin etiquetas"}
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
              <button
                onClick={() => handleFavoriteClick(favorite)}
                className="bg-[#FF4A5A] p-2 rounded-full focus:outline-none"
              >
                {favorite.isFavorite ? (
                  <AiFillHeart className="text-white text-2xl" />
                ) : (
                  <AiOutlineHeart className="text-white text-2xl" />
                )}
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            No se encontraron favoritos.
          </td>
        </tr>
      )}
    </DataTable>
  );
};

export default ManageFavorites;
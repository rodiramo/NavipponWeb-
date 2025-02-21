import { useEffect, useState, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { images, stables } from "../../../../constants";
import {
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
} from "../../../../services/index/favorites";
import DataTable from "../../components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import FavoriteContext from "../../../../context/FavoriteContext";
import { toast } from "react-hot-toast";
import { useTheme, Box, Typography, Button } from "@mui/material";

const ManageFavorites = () => {
  const { user, jwt } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const { favorites, setFavorites, addFavorite, removeFavorite } =
    useContext(FavoriteContext);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (favorites) {
      const updatedFavorites = favorites
        .filter((fav) => fav !== null && fav.experienceId !== null)
        .map((fav) => ({ ...fav, isFavorite: true }));
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
      const filtered = favorites
        .filter(
          (favorite) => favorite !== null && favorite.experienceId !== null
        )
        .filter((favorite) =>
          favorite.experienceId.title
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
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
        await removeFavoriteService({
          userId: user._id,
          experienceId: favorite.experienceId._id,
          token: jwt,
        });
        removeFavorite(favorite.experienceId._id);
        toast.success("Se eliminó de favoritos");
      } else {
        console.log("Adding favorite for user:", user);
        await addFavoriteService({
          userId: user._id,
          experienceId: favorite.experienceId._id,
          token: jwt,
        });
        addFavorite({
          userId: user._id,
          experienceId: favorite.experienceId._id,
        });
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

  // 🚨 Hide table completely when no favorites exist
  if (filteredFavorites.length === 0 && !isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
        >
          Administrar Favoritos
        </Typography>{" "}
        {/* Empty State Image */}
        <img
          src="/assets/nothing-here.png" // Replace with correct image path
          alt="No tienes favoritos"
          className="w-40 h-40 object-contain mb-4"
        />
        {/* Message */}
        <Typography
          variant="h6"
          sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}
        >
          Aún no has agregado ningún favorito
        </Typography>
        <Typography sx={{ color: theme.palette.secondary.dark, mb: 2 }}>
          Explora experiencias y guarda las que más te gusten.
        </Typography>
        {/* Explore Experiences Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/experience")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: "30rem",
            padding: "10px 20px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Explorar Experiencias
        </Button>
      </Box>
    );
  }

  // ✅ Only show table when there are favorites
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
        }}
      >
        Administrar Favoritos
      </Typography>
      <DataTable
        dataListName="Favoritos"
        searchInputPlaceHolder="Título Favorito..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={[
          "Título",
          "Categoría",
          "Creado",
          "Etiquetas",
          "",
        ]}
        isLoading={isLoading}
        data={filteredFavorites}
      >
        {filteredFavorites.map((favorite) => (
          <tr key={favorite._id}>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="relative block">
                    <img
                      src={
                        favorite?.experienceId?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL +
                            favorite?.experienceId?.photo
                          : images.sampleFavoriteImage
                      }
                      alt={favorite.experienceId.title}
                      className="mx-auto object-cover rounded-lg w-10 aspect-square"
                    />
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {favorite.experienceId.title}
                  </p>
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
                {favorite.experienceId.tags &&
                favorite.experienceId.tags.length > 0
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
        ))}
      </DataTable>
    </>
  );
};

export default ManageFavorites;

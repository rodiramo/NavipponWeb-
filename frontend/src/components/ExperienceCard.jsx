import React, { useState, useEffect, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService } from "../services/index/favorites";
import { images, stables } from "../constants";
import FavoriteContext from "../context/FavoriteContext"; 

const ExperienceCard = ({ experience, className, user, token }) => {
    const { favorites, addFavorite, removeFavorite } = useContext(FavoriteContext);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const isFav = favorites.some(fav => fav.experienceId === experience._id);
        setIsFavorite(isFav);
    }, [favorites, experience._id]);

    const handleFavoriteClick = async () => {
        if (!user || !token) {
            toast.error("Debes iniciar sesión para agregar a favoritos");
            console.log("User or token is not defined");
            return;
        }

        try {
            if (isFavorite) {
                console.log("Removing favorite for user:", user);
                await removeFavoriteService({ userId: user._id, experienceId: experience._id, token });
                removeFavorite(experience._id);
                toast.success("Se eliminó de favoritos");
            } else {
                console.log("Adding favorite for user:", user);
                await addFavoriteService({ userId: user._id, experienceId: experience._id, token });
                addFavorite({ userId: user._id, experienceId: experience._id });
                toast.success("Se agregó a favoritos");
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast.error("Error al actualizar favoritos");
            console.error("Error updating favorites:", error);
        }
    };

    return (
        <div className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}>
            <div className="relative">
                <Link to={`/experience/${experience.slug}`}>
                    <img
                        src={
                            experience.photo
                                ? stables.UPLOAD_FOLDER_BASE_URL + experience.photo
                                : images.sampleExperienceImage
                        }
                        alt="title"
                        className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
                    />
                </Link>
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-2 right-2 bg-[#FF4A5A] p-2 rounded-full focus:outline-none"
                >
                    {isFavorite ? (
                        <AiFillHeart className="text-white text-2xl" />
                    ) : (
                        <AiOutlineHeart className="text-white text-2xl" />
                    )}
                </button>
            </div>
            <div className="p-5">
                <Link to={`/experience/${experience.slug}`}>
                    <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">
                        {experience.title}
                    </h2>
                    <p className="text-dark-light mt-3 text-sm md:text-lg">
                        {experience.caption}
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default ExperienceCard;
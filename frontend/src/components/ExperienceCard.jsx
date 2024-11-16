import React, { useState, useEffect, useContext } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService, getFavoritesCount as getFavoritesCountService } from "../services/index/favorites";
import FavoriteContext from "../context/FavoriteContext"; 
import { images, stables } from "../constants";

const ExperienceCard = ({ experience, user, token, className }) => {
    const { favorites, addFavorite, removeFavorite } = useContext(FavoriteContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

    console.log("Favorites in ExperienceCard:", favorites);  

    useEffect(() => {
        const isFav = favorites.some(fav => fav.experienceId._id === experience._id);
        setIsFavorite(isFav);
        console.log("Is experience favorite?", experience._id, isFav); 

        
        const fetchFavoritesCount = async () => {
            try {
                const response = await getFavoritesCountService(experience._id);
                setFavoritesCount(response.favoritesCount);
            } catch (error) {
                console.error("Error fetching favorites count:", error);
            }
        };

        fetchFavoritesCount();
    }, [favorites, experience._id]);

    const handleFavoriteClick = async () => {
        if (!user || !token) {
            toast.error("Debes iniciar sesión para agregar a favoritos");
            return;
        }

        try {
            if (isFavorite) {
                const response = await removeFavoriteService({ userId: user._id, experienceId: experience._id, token });
                removeFavorite(experience._id);   
                setIsFavorite(false);  
                setFavoritesCount(response.favoritesCount);   
                toast.success("Se eliminó de favoritos");
            } else {
                const response = await addFavoriteService({ userId: user._id, experienceId: experience._id, token });
                addFavorite({ userId: user._id, experienceId: experience._id });   
                setIsFavorite(true); 
                setFavoritesCount(response.favoritesCount);  
                toast.success("Se agregó a favoritos");
            }
            window.location.reload();  
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("La experiencia ya está en tus favoritos");
            } else {
                toast.error("Error al actualizar favoritos");
            }
            console.error("Error updating favorites:", error);
        }
    };

    return (
        <div className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}>
            <div className="relative">
                <Link to={`/experience/${experience.slug}`}>
                    <img
                        src={experience.photo ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}` : images.sampleExperienceImage}
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
                    <p className="text-gray-500 text-sm mt-1">
                        {favoritesCount} Favoritos
                    </p>
                    <p className="text-dark-light mt-3 text-sm md:text-lg">
                        {experience.caption}
                    </p>
                </Link>
                <div className="flex justify-between flex-nowrap items-center mt-6">
                    <div className="flex items-center gap-x-2 md:gap-x-2.5">
                        <img
                            src={
                                experience.user.avatar
                                    ? stables.UPLOAD_FOLDER_BASE_URL + experience.user.avatar
                                    : images.userImage
                            }
                            alt="experience profile"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <h4 className="font-bold italic text-dark-soft text-sm md:text-base">
                                {experience.user.name}
                            </h4>
                            <div className="flex items-center gap-x-2">
                                <span
                                    className={`${experience.approved ? "bg-[#36B37E]" : "bg-[#FF4A5A]"
                                        } w-fit bg-opacity-20 p-1.5 rounded-full`}
                                >
                                    {experience.approved ? (
                                        <BsCheckLg className="w-1.5 h-1.5 text-[#36B37E]" />
                                    ) : (
                                        <AiOutlineClose className="w-1.5 h-1.5 text-[#FF4A5A]" />
                                    )}
                                </span>
                                <span className="italic text-dark-light text-xs md:text-sm">
                                    Experiencia {experience.approved ? "verificada" : "sin verificar"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="font-bold text-dark-light italic text-sm md:text-base">
                        {new Date(experience.createdAt).getDate()}{" "}
                        {new Date(experience.createdAt).toLocaleString("default", {
                            month: "long",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;
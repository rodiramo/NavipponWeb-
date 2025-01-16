import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addFavorite as addFavoriteService, removeFavorite as removeFavoriteService, getFavoritesCount as getFavoritesCountService, getUserFavorites } from "../../../services/index/favorites";
import { images, stables } from "../../../constants";

const HorizontalExperienceCard = ({ experience, user, token, className, onFavoriteToggle }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

    useEffect(() => {
        const fetchFavoritesCount = async () => {
            try {
                const response = await getFavoritesCountService(experience._id);
                setFavoritesCount(response.favoritesCount);
            } catch (error) {
                console.error("Error fetching favorites count:", error);
            }
        };

        fetchFavoritesCount();
    }, [experience._id]);

    useEffect(() => {
        if (user && token) {
            const fetchFavorites = async () => {
                try {
                    const favorites = await getUserFavorites({ userId: user._id, token });
                    const isFav = favorites.some(fav => fav.experienceId && fav.experienceId._id === experience._id);
                    setIsFavorite(isFav);
                } catch (error) {
                    console.error("Error fetching user favorites:", error);
                }
            };

            fetchFavorites();
        }
    }, [user, token, experience._id]);

    const handleFavoriteClick = async () => {
        if (!user || !token) {
            toast.error("Debes iniciar sesión para agregar a favoritos");
            return;
        }

        try {
            if (isFavorite) {
                const response = await removeFavoriteService({ userId: user._id, experienceId: experience._id, token });
                setIsFavorite(false);
                setFavoritesCount(response.favoritesCount);
                toast.success("Se eliminó de favoritos");
            } else {
                const response = await addFavoriteService({ userId: user._id, experienceId: experience._id, token });
                setIsFavorite(true);
                setFavoritesCount(response.favoritesCount);
                toast.success("Se agregó a favoritos");
            }
            onFavoriteToggle();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("La experiencia ya está en tus favoritos");
            } else {
                toast.error("Error al actualizar favoritos");
            }
            console.error("Error updating favorites:", error);
        }
    };

    const borderColor = '#96C6D9';
    const titleColor = '#FF4A5A';
    const buttonColor = '#96C6D9';
    const likeColor = '#FF4A5A';

    return (
        <div className={`flex flex-col mb-3 md:flex-row bg-white rounded-lg overflow-hidden ${className}`} style={{ border: `2px solid ${borderColor}` }}>
            <div className="w-full md:w-1/2 flex items-center justify-center p-2">
                <img src={experience.photo ? `${stables.UPLOAD_FOLDER_BASE_URL}${experience.photo}` : images.sampleExperienceImage} alt={experience.title} className="object-contain rounded-lg" />
            </div>
            <div className="w-full md:w-1/10 p-4 flex flex-col justify-between">
                <div>
                    <h4 className="text-xl" style={{ color: titleColor }}>{experience.title} <span className="text-gray-500">({experience.prefecture})</span></h4>
                    <p className="text-gray-700 my-2">{experience.caption}</p>
                </div>
                <div className="flex justify-center items-center">
                    <Link to={`/experience/${experience.slug}`} className="w-full py-2 rounded-full mt-4 text-center" style={{ backgroundColor: buttonColor, color: 'white' }}>
                        Ver más
                    </Link>
                </div>
            </div>
            <div className="hidden md:flex w-full md:w-1/5 p-4 flex-col justify-between">
                <div className="flex justify-center">
                    <div
                        className="p-4 rounded-full cursor-pointer"
                        style={{
                            backgroundColor: likeColor,
                            border: `2px solid ${likeColor}`
                        }}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? <AiFillHeart color="white" size={24} /> : <AiOutlineHeart color="white" size={24} />}
                    </div>
                </div>
                <div className="flex justify-center">
                    <p className="text-xl font-bold" style={{ color: likeColor }}>{experience.price ? `${experience.price} €` : "No disponible"}</p>
                </div>
            </div>
        </div>
    );
};

export default HorizontalExperienceCard;
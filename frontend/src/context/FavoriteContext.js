import React, { createContext, useState, useEffect } from 'react';
import { getUserFavorites } from '../services/index/favorites';
import useUser from '../hooks/useUser';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const { user, jwt: token } = useUser();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user || !token) return;

            try {
                const favorites = await getUserFavorites({ userId: user._id, token });
                setFavorites(favorites);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchFavorites();
    }, [user, token]);

    const addFavorite = (favorite) => {
        setFavorites([...favorites, favorite]);
    };

    const removeFavorite = (experienceId) => {
        setFavorites(favorites.filter(fav => fav.experienceId !== experienceId));
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export default FavoriteContext;
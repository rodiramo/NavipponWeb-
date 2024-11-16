import axios from "axios";

export const addFavorite = async ({ userId, experienceId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.post('/api/favorites', { userId, experienceId }, config);
        return data;
    } catch (error) {
        console.error("Error in addFavorite:", error);
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const removeFavorite = async ({ userId, experienceId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.delete('/api/favorites', {
            data: { userId, experienceId },
            ...config
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getUserFavorites = async ({ userId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`/api/favorites/${userId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const isFavorite = async ({ userId, experienceId, token }) => {
    try {
        const response = await axios.get(`/api/favorites/check`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId, experienceId }
        });
        return response.data.isFavorite;  
    } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;  
    }
};

export const getFavoritesCount = async (experienceId) => {
    try {
        const response = await axios.get(`/api/favorites/count/${experienceId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching favorites count:", error);
        throw new Error(error.message);
    }
};
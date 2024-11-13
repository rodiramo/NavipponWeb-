import axios from "axios";

 
export const addFavorite = async ({ userId, experienceId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        console.log("Sending request to add favorite:", { userId, experienceId, token });
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
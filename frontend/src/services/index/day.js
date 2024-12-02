import axios from "axios";

export const getDaysByItineraryId = async (itineraryId) => {
    try {
        const { data } = await axios.get(`/api/days/itinerary/${itineraryId}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getSingleDay = async (id) => {
    try {
        const { data } = await axios.get(`/api/days/${id}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const createDay = async ({ token, dayData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.post('/api/days', dayData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const updateDay = async ({ id, token, updatedData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.put(`/api/days/${id}`, updatedData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const deleteDay = async ({ id, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.delete(`/api/days/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener los favoritos de un usuario
export const getFavorites = async ({ userId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/favorites?userId=${userId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener los favoritos de hoteles de un usuario
export const getFavoriteHotels = async ({ userId, token, region, prefecture }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/favorites/hotels?userId=${userId}&region=${region}&prefecture=${prefecture}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener los días con experiencias de un usuario
export const getDaysWithExperiences = async ({ userId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/days/with-experiences?userId=${userId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener los favoritos de atractivos de un usuario
export const getFavoriteAttractions = async ({ userId, token, region, prefecture }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/favorites/attractions?userId=${userId}&region=${region}&prefecture=${prefecture}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener los favoritos de restaurantes de un usuario
export const getFavoriteRestaurants = async ({ userId, token, region, prefecture }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/favorites/restaurants?userId=${userId}&region=${region}&prefecture=${prefecture}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};
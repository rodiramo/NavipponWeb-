import axios from 'axios';

export const createItinerary = async ({ itineraryData, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/itineraries', itineraryData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getItineraries = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get('/api/itineraries', config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getItineraryById = async ({ id, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/itineraries/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const updateItinerary = async ({ id, itineraryData, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.put(`/api/itineraries/${id}`, itineraryData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const deleteItinerary = async ({ id, token }) => {
    try {
        console.log("Deleting itinerary with id:", id); // Verificar el id
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.delete(`/api/itineraries/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Función para obtener un itinerario por su ID
export const getSingleItinerary = async ({ id, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/itineraries/${id}`, config);
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

// Función para obtener los itinerarios de un usuario
export const getUserItineraries = async ({ searchKeyword, page, limit, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/itineraries?search=${searchKeyword}&page=${page}&limit=${limit}`, config);
        console.log("Itineraries data:", data);  
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};
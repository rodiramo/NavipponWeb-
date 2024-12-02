import axios from "axios";

export const getAllItineraries = async () => {
    try {
        const { data } = await axios.get('/api/itineraries');
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getUserItineraries = async (searchKeyword = "", page = 1, limit = 10, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data, headers } = await axios.get(
            `/api/itineraries?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
            config
        );
        return { data, headers };
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getSingleItinerary = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`/api/itineraries/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const createItinerary = async ({ token, itineraryData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.post('/api/itineraries', itineraryData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const updateItinerary = async ({ id, token, updatedData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.put(`/api/itineraries/${id}`, updatedData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const deleteItinerary = async ({ id, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.delete(`/api/itineraries/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Nuevo método para obtener días con experiencias
export const getDaysWithExperiences = async ({ userId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`/api/itineraries/days/experiences?userId=${userId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

// Nuevo método para obtener los detalles completos del itinerario
export const getSingleItineraryWithDetails = async (id, token) => {
    const response = await axios.get(`/api/itineraries/${id}/details`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
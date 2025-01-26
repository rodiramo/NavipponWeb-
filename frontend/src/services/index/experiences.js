import axios from "axios";

export const getAllExperiences = async (searchKeyword = "", page = 1, limit = 10, filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            searchKeyword: searchKeyword || "",
            page,
            limit,
            category: filters.category || "",
            region: filters.region || "",
            tags: filters.tags && filters.tags.length > 0 ? filters.tags.join(",") : ""
        });

        console.log("Sending params:", queryParams.toString()); // Agrega este log

        const { data, headers } = await axios.get(`/api/experiences?${queryParams.toString()}`);
        return { data, headers };
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getSingleExperience = async ({ slug }) => {
    try {
        const { data } = await axios.get(`/api/experiences/${slug}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const deleteExperience = async ({ slug, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.delete(`/api/experiences/${slug}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const updateExperience = async ({ updatedData, slug, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.put(`/api/experiences/${slug}`, updatedData, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const createExperience = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.post(`/api/experiences`, {}, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

export const getExperienceById = async (id, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`/api/experiences/${id}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
};

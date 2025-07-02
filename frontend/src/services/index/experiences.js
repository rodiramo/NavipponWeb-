import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getAllExperiences = async (
  searchKeyword = "",
  page = 1,
  limit = 10,
  filters = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      searchKeyword: searchKeyword || "",
      page,
      limit,
      category: filters.category || "",
      region: filters.region || "",
      tags:
        filters.tags && filters.tags.length > 0 ? filters.tags.join(",") : "",
      sortBy: filters.sortBy || "",
    });

    console.log("Sending params:", queryParams.toString());

    const { data, headers } = await axios.get(
      `${API_URL}/api/experiences?${queryParams.toString()}`
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSingleExperience = async ({ slug }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/experiences/${slug}`);
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

    const { data } = await axios.delete(
      `${API_URL}/api/experiences/${slug}`,
      config
    );
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

    const { data } = await axios.put(
      `${API_URL}/api/experiences/${slug}`,
      updatedData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createExperience = async ({ experienceData, token }) => {
  try {
    if (!(experienceData instanceof FormData)) {
      throw new Error("Invalid experienceData: Expected FormData object.");
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("📤 Sending Data to Backend:");
    for (let [key, value] of experienceData.entries()) {
      console.log(`✅ ${key}:`, value);
    }

    const { data } = await axios.post(
      `${API_URL}/api/experiences`,
      experienceData,
      config
    );
    return data;
  } catch (error) {
    console.error("❌ Error sending experience:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getExperienceById = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/experiences/${id}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getExperienceCount = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/experiences/count`,
      config
    );
    console.log("Experience count data:", data);
    return data.count;
  } catch (error) {
    console.error("Error fetching experience count:", error);
    throw new Error(error.message);
  }
};

export const getTopExperiences = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/experiences/top`);
    console.log("Top experiences data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching top experiences:", error);
    throw new Error(error.message);
  }
};

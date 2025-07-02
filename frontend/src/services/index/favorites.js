import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const addFavorite = async ({ userId, experienceId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/favorites`,
      { userId, experienceId },
      config
    );
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
    const { data } = await axios.delete(`${API_URL}/api/favorites`, {
      data: { userId, experienceId },
      ...config,
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
    const { data } = await axios.get(
      `${API_URL}/api/favorites/${userId}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const isFavorite = async ({ userId, experienceId, token }) => {
  try {
    const response = await axios.get(`${API_URL}/api/favorites/check`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId, experienceId },
    });
    return response.data.isFavorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export const getFavoritesCount = async (experienceId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/favorites/count/${experienceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites count:", error);
    throw new Error(error.message);
  }
};

// services/index/checklist.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// services/index/checklist.js
export const getUserChecklist = async (userId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/checklist/${userId}`,
      config
    );

    return data.checklistItems || [];
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const createChecklistItem = async (itemData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${API_URL}/api/checklist`,
      itemData,
      config
    );
    return data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const updateChecklistItem = async (itemId, itemData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `${API_URL}/api/checklist/${itemId}`,
      itemData,
      config
    );
    return data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const deleteChecklistItem = async (itemId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/checklist/${itemId}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

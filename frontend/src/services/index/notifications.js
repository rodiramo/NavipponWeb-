// src/services/notifications.js
import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/notifications`, config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching notifications"
    );
  }
};

export const markNotificationAsRead = async ({ token, notificationId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${API_URL}/api/notifications/${notificationId}/read`,
      {},
      config
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error marking notification as read"
    );
  }
};

export const deleteNotification = async ({ token, notificationId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/notifications/${notificationId}`,
      config
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error deleting notification"
    );
  }
};

export const clearAllNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${API_URL}/api/notifications`, config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error clearing all notifications"
    );
  }
};

// src/services/notifications.js
import axios from "axios";

export const getNotifications = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get("/api/notifications", config);
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
      `/api/notifications/${notificationId}/read`,
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
      `/api/notifications/${notificationId}`,
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

    const { data } = await axios.delete("/api/notifications", config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error clearing all notifications"
    );
  }
};

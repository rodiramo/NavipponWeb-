import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error sending reset email"
    );
  }
};

export const resetPassword = async ({ token, newPassword }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/reset-password`, {
      token,
      newPassword,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error resetting password"
    );
  }
};

export const verifyResetToken = async (token) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/auth/verify-reset-token/${token}`
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Invalid or expired token"
    );
  }
};

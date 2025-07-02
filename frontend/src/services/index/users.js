import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const signup = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/users/register`, {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const login = async ({ email, password, rememberMe }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password,
    });
    const token = data.token;

    if (rememberMe) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const getUserProfile = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateProfile = async (userId, userData, token) => {
  try {
    console.log("updateProfile called with:", {
      userId,
      userData,
      token: token ? "Present" : "Missing",
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/users/updateProfile/${userId}`,
      userData,
      config
    );

    console.log("updateProfile response:", data);
    return data;
  } catch (error) {
    console.error(
      "updateProfile error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || error.message || "Error updating profile"
    );
  }
};

export const updateProfileAlt = async (userId, userData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/users/updateProfile/${userId}`,
      userData,
      config
    );
    return data;
  } catch (error) {
    console.error("Update profile error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error updating profile");
  }
};

export const debugToken = (token) => {
  if (!token) {
    console.error("❌ No token provided");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    console.log("🔍 Token debug:", {
      hasToken: !!token,
      tokenLength: token.length,
      isExpired,
      expiresAt: new Date(payload.exp * 1000),
      userId: payload.id,
    });

    return !isExpired;
  } catch (error) {
    console.error("❌ Invalid token format:", error);
    return false;
  }
};

export const updateProfilePicture = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/users/updateProfilePicture`,
      formData,
      config
    );

    return data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateCoverImg = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/users/updateCoverImg`,
      formData,
      config
    );

    return data;
  } catch (error) {
    console.error("Error updating cover img:", error);
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getAllUsers = async (
  token,
  searchKeyword = "",
  page = 1,
  limit = 10
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log(
      "URL:",
      `${API_URL}/api/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );
    console.log("Token:", token);

    const { data, headers } = await axios.get(
      `${API_URL}/api/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteUser = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${API_URL}/api/users/${slug}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getUserFriends = async ({ userId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/users/${userId}/friends`,
      config
    );

    return data;
  } catch (error) {
    console.error("getUserFriends error:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const toggleFriend = async ({ userId, token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.post(
      `${API_URL}/api/users/toggleFriend/${userId}`,
      {},
      config
    );

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar amigos"
    );
  }
};

export const getFriendProfile = async ({ friendId, token }) => {
  try {
    console.log(`🔍 Fetching friend profile for: ${friendId}`);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/users/profile/${friendId}`,
      config
    );
    console.log("✅ Friend Profile Data:", data);

    return data;
  } catch (error) {
    console.error(
      "❌ API Error fetching friend profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching friend profile."
    );
  }
};

export const getUserCount = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/users/count`, config);
    return data.count;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw new Error(error.message);
  }
};

export const getUserProfileById = async ({ userId, token }) => {
  try {
    console.log(`🔍 Fetching user profile for: ${userId}`);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/users/profile/${userId}`,
      config
    );
    console.log("✅ User Profile Data:", data);

    return data;
  } catch (error) {
    console.error(
      "❌ API Error fetching user profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user profile."
    );
  }
};

export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/users/forgot-password`, {
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
    const { data } = await axios.post(`${API_URL}/api/users/reset-password`, {
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
      `${API_URL}/api/users/verify-reset-token/${token}`
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Invalid or expired token"
    );
  }
};

export const addItemToList = async (token) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/users/checklist`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Invalid or expired token"
    );
  }
};

export const getUserPosts = async ({ userId, token, page = 1, limit = 12 }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/users/${userId}/posts?page=${page}&limit=${limit}`,
      config
    );

    return data;
  } catch (error) {
    console.error(
      "❌ API Error fetching user posts:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user posts."
    );
  }
};

export const getUserTrips = async ({
  userId,
  token,
  includePrivate = false,
  page = 1,
  limit = 12,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/users/${userId}/trips?includePrivate=${includePrivate}&page=${page}&limit=${limit}`,
      config
    );

    return data;
  } catch (error) {
    console.error(
      "❌ API Error fetching user trips:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user trips."
    );
  }
};

export const getUserFavorites = async ({
  userId,
  token,
  page = 1,
  limit = 12,
}) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/users/${userId}/favorites?page=${page}&limit=${limit}`,
      config
    );

    return data;
  } catch (error) {
    console.error(
      "❌ API Error fetching user favorites:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user favorites."
    );
  }
};

import axios from "axios";
export const signup = async ({ name, email, password }) => {
  try {
    const { data } = await axios.post("/api/users/register", {
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
    const { data } = await axios.post("/api/users/login", { email, password });
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

    const { data } = await axios.get("/api/users/profile", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateProfile = async ({ token, userData, userId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `/api/users/updateProfile/${userId}`,
      userData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
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
      "http://localhost:5001/api/users/updateProfilePicture", // Ensure this is correct
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
      `/api/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
    );
    console.log("Token:", token);

    const { data, headers } = await axios.get(
      `/api/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
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

    const { data } = await axios.delete(`/api/users/${slug}`, config);
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
    const { data } = await axios.get(`/api/users/${userId}/friends`, config);

    return data;
  } catch (error) {
    console.error("getUserFriends error:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
export const toggleFriend = async ({ userId, token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ✅ Corrected: Include an empty object as the request body
    const { data } = await axios.post(
      `/api/users/toggleFriend/${userId}`,
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
    console.log(`🔍 Fetching friend profile for: ${friendId}`); // ✅ Debug
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`/api/users/profile/${friendId}`, config);
    console.log("✅ Friend Profile Data:", data); // ✅ Log successful response

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
    const { data } = await axios.get('/api/users/count', config);
    return data.count;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw new Error(error.message);
  }
};
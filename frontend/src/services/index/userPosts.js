import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getUserPosts = async (
  searchKeyword = "",
  page = 1,
  limit = 10,
  token
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${API_URL}/api/user-posts/user?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`;

    const response = await axios.get(url, config);

    const headerKeys = Object.keys(response.headers);

    headerKeys.forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("total") ||
        lowerKey.includes("page") ||
        lowerKey.includes("count")
      ) {
        console.log(
          `Found potential pagination header: ${key} = ${response.headers[key]}`
        );
      }
    });

    // Check if it's an AxiosHeaders object and try to normalize
    let normalizedHeaders = {};
    if (response.headers && typeof response.headers === "object") {
      // Convert AxiosHeaders to plain object
      for (const key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
          normalizedHeaders[key] = response.headers[key];
        }
      }

      // Also try using Object.assign
      try {
        normalizedHeaders = {
          ...normalizedHeaders,
          ...Object.assign({}, response.headers),
        };
      } catch (e) {
        console.log("Object.assign failed:", e.message);
      }
    }

    const result = {
      data: response.data,
      headers: normalizedHeaders,
    };

    return result;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSingleUserPost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/user-posts/${slug}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteUserPost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/user-posts/${slug}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const updateUserPost = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/user-posts/${slug}`,
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

export const createUserPost = async ({ postData, token }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("📤 Sending Data to Backend:");
    for (let [key, value] of postData.entries()) {
      console.log(`✅ FormData Key: ${key}, Value:`, value);
    }

    const { data } = await axios.post(`${API_URL}/api/posts`, postData, config);
    return data;
  } catch (error) {
    console.error(
      "❌ Error creating post:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

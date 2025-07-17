import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getAllPosts = async (
  searchKeyword = "",
  page = 1,
  limit = 10,
  sortBy = ""
) => {
  try {
    const params = new URLSearchParams({
      searchKeyword,
      page,
      limit,
      sortBy,
    });

    const { data, headers } = await axios.get(
      `${API_URL}/api/posts?${params.toString()}`
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async ({ slug }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/posts/${slug}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deletePost = async ({ slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${API_URL}/api/posts/${slug}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updatePost = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/posts/${slug}`,
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

export const createPost = async ({ postData, token }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json", // ✅ Ensures JSON data
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Sending Data to Backend:", postData); // 🔍 Debugging line

    const { data } = await axios.post(`${API_URL}/api/posts`, postData, config);
    return data;
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const getPostCount = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/posts/count`, config);
    console.log("Post count data:", data);
    return data.count;
  } catch (error) {
    console.error("Error fetching post count:", error);
    throw new Error(error.message);
  }
};

/**
 * Toggle save/unsave a post for the current user
 * @param {Object} params - The parameters
 * @param {string} params.postId - The ID of the post to save/unsave
 * @param {string} params.token - The user's authentication token
 * @returns {Promise<Object>} Updated user object with savedPosts array
 */
export const toggleSavePost = async ({ postId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/posts/${postId}/save`,
      {},
      config
    );

    return data.user; // Should return updated user with savedPosts array
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

/**
 * Get all saved posts for the current user
 * @param {Object} params - The parameters
 * @param {string} params.token - The user's authentication token
 * @param {number} params.page - Page number for pagination (optional)
 * @param {number} params.limit - Number of posts per page (optional)
 * @returns {Promise<Object>} Object containing saved posts and pagination info
 */
export const getSavedPosts = async ({ token, page = 1, limit = 10 }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // ✅ FIXED: Updated to correct endpoint path
    const { data } = await axios.get(
      `${API_URL}/api/posts/users/saved-posts?${params.toString()}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

/**
 * Remove multiple saved posts
 * @param {Object} params - The parameters
 * @param {string[]} params.postIds - Array of post IDs to remove
 * @param {string} params.token - The user's authentication token
 * @returns {Promise<Object>} Updated user object
 */
export const removeSavedPosts = async ({ postIds, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.delete(`${API_URL}/api/users/saved-posts`, {
      ...config,
      data: { postIds },
    });

    return data.user;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

/**
 * Check if a post is saved by the current user
 * @param {Object} params - The parameters
 * @param {string} params.postId - The ID of the post to check
 * @param {string} params.token - The user's authentication token
 * @returns {Promise<boolean>} True if the post is saved
 */
export const checkIfPostSaved = async ({ postId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${API_URL}/api/posts/${postId}/saved`,
      config
    );

    return data.isSaved;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

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

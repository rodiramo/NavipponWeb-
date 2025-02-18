import axios from "axios";

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

    const { data, headers } = await axios.get(
      `/api/user-posts/user?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
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

    const { data } = await axios.get(`/api/user-posts/${slug}`, config);
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

    const { data } = await axios.delete(`/api/user-posts/${slug}`, config);
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
      `/api/user-posts/${slug}`,
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

    const { data } = await axios.post(`/api/posts`, postData, config);
    return data;
  } catch (error) {
    console.error(
      "❌ Error creating post:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

import axios from "axios";

// 🔥 CRITICAL: Add this line at the top
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const createNewReview = async ({ token, desc, rating, title, slug }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/reviews`,
      {
        rating: rating,
        title: title,
        desc: desc,
        slug,
      },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateReview = async ({
  token,
  rating,
  check,
  title,
  desc,
  reviewId,
}) => {
  try {
    if (!reviewId) {
      throw new Error("Invalid review ID - reviewId is missing");
    }

    console.log("Sending update request for review ID:", reviewId); // ✅ Debugging

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await axios.put(
      `${API_URL}/api/reviews/${reviewId}`,
      { rating, title, desc, check },
      config
    );

    return data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteReview = async ({ token, reviewId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${API_URL}/api/reviews/${reviewId}`,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getAllReviews = async (
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

    const { data, headers } = await axios.get(
      `${API_URL}/api/reviews?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getReviewCount = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/reviews/count`, config);
    console.log("Review count data:", data);
    return data.count;
  } catch (error) {
    console.error("Error fetching review count:", error);
    throw new Error(error.message);
  }
};
